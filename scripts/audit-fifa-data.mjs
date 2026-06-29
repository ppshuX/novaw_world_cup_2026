import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const FIFA_COMPETITION_ID = '17';
const FIFA_SEASON_ID = '285023';
const FIFA_API = 'https://api.fifa.com/api/v3/calendar/matches';

const TEAM_NAME_TO_ID = {
  'bosnia and herzegovina': 'bosnia',
  'cabo verde': 'cape-verde',
  'congo dr': 'dr-congo',
  'cote d ivoire': 'ivory-coast',
  'czech republic': 'czechia',
  'czechia': 'czechia',
  'ir iran': 'iran',
  'korea republic': 'korea-republic',
  'south africa': 'south-africa',
  'south korea': 'korea-republic',
  'turkiye': 'turkey',
  'usa': 'usa',
};

function normalizeName(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toTeamId(name) {
  const normalized = normalizeName(name);
  return TEAM_NAME_TO_ID[normalized] ?? normalized.replace(/\s+/g, '-');
}

function localizedName(value) {
  if (!Array.isArray(value)) return value ?? '';
  return value.find((item) => item.Locale === 'en-GB')?.Description ?? value[0]?.Description ?? '';
}

function officialTeamId(side) {
  if (!side) return null;
  const id = toTeamId(localizedName(side.TeamName));
  return id || null;
}

async function fetchOfficialMatches() {
  const ranges = [
    ['2026-06-10T00:00:00Z', '2026-06-18T23:59:59Z'],
    ['2026-06-19T00:00:00Z', '2026-06-26T23:59:59Z'],
    ['2026-06-27T00:00:00Z', '2026-07-05T23:59:59Z'],
    ['2026-07-06T00:00:00Z', '2026-07-21T23:59:59Z'],
  ];
  const matches = new Map();

  for (const [from, to] of ranges) {
    const url = new URL(FIFA_API);
    url.searchParams.set('language', 'en');
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);
    url.searchParams.set('count', '500');

    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) throw new Error(`FIFA API request failed: HTTP ${response.status}`);
    const data = await response.json();

    for (const match of data.Results ?? []) {
      if (String(match.IdCompetition) !== FIFA_COMPETITION_ID || String(match.IdSeason) !== FIFA_SEASON_ID) continue;
      matches.set(Number(match.MatchNumber), match);
    }
  }

  return matches;
}

function readGroupRows() {
  const source = readFileSync(resolve(ROOT, 'src/data/matches.ts'), 'utf8');
  const rowRegex = /\[(\d+),\s*'([A-L])',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(?:'[^']+'|"[^"]+")\]/g;
  const rows = new Map();
  let match;

  while ((match = rowRegex.exec(source)) !== null) {
    rows.set(Number(match[1]), {
      group: match[2],
      homeTeamId: toTeamId(match[3]),
      awayTeamId: toTeamId(match[4]),
      kickoffUtc: match[5],
    });
  }

  return rows;
}

function readTeams() {
  const source = readFileSync(resolve(ROOT, 'src/data/teams.ts'), 'utf8');
  const teamRegex = /\{ id: '([^']+)', name: '([^']+)', shortName: '([^']+)'[^}]*?flagKey: '([^']+)'/g;
  const teams = new Map();
  let match;

  while ((match = teamRegex.exec(source)) !== null) {
    teams.set(match[1], { name: match[2], shortName: match[3], flagKey: match[4] });
  }

  return teams;
}

function pushMismatch(errors, label, local, official) {
  errors.push(`${label}: local=${local}; official=${official}`);
}

const officialMatches = await fetchOfficialMatches();
const groupRows = readGroupRows();
const teams = readTeams();
const results = JSON.parse(readFileSync(resolve(ROOT, 'src/data/matchResults.json'), 'utf8'));
const bracketFixture = JSON.parse(readFileSync(resolve(ROOT, 'src/data/bracketFixture.json'), 'utf8'));
const updateScript = readFileSync(resolve(ROOT, 'scripts/update-scores.mjs'), 'utf8');
const bracketLogic = readFileSync(resolve(ROOT, 'src/utils/bracketUpdate.ts'), 'utf8');
const workflow = readFileSync(resolve(ROOT, '.github/workflows/daily-sync.yml'), 'utf8');
const errors = [];

if (!updateScript.includes('api.fifa.com') || updateScript.includes('site.api.espn.com')) {
  errors.push('Update source: score sync must use FIFA official API only');
}
if (bracketLogic.includes('const pairings:')) {
  errors.push('Bracket logic: guessed R32 pairings must not be used');
}
if (!workflow.includes('src/data/bracketFixture.json')) {
  errors.push('Workflow: bracketFixture.json is not included in change detection/commit');
}

for (let matchNo = 1; matchNo <= 72; matchNo += 1) {
  const official = officialMatches.get(matchNo);
  const local = groupRows.get(matchNo);
  if (!official || !local) {
    errors.push(`Match ${matchNo}: missing ${official ? 'local row' : 'FIFA fixture'}`);
    continue;
  }

  const officialHomeId = toTeamId(localizedName(official.Home?.TeamName));
  const officialAwayId = toTeamId(localizedName(official.Away?.TeamName));
  if (local.homeTeamId !== officialHomeId || local.awayTeamId !== officialAwayId) {
    pushMismatch(errors, `Match ${matchNo} teams`, `${local.homeTeamId} vs ${local.awayTeamId}`, `${officialHomeId} vs ${officialAwayId}`);
  }
  if (local.kickoffUtc !== official.Date) {
    pushMismatch(errors, `Match ${matchNo} kickoff`, local.kickoffUtc, official.Date);
  }

  if (Number(official.MatchStatus) === 0) {
    const localResult = results[String(matchNo)];
    if (!localResult) {
      errors.push(`Match ${matchNo}: missing result`);
    } else if (
      Number(localResult.homeScore) !== Number(official.Home?.Score)
      || Number(localResult.awayScore) !== Number(official.Away?.Score)
      || localResult.matchStatus !== 'finished'
      || localResult.resultStatus !== 'official'
    ) {
      pushMismatch(
        errors,
        `Match ${matchNo} result`,
        `${localResult.homeScore}-${localResult.awayScore} ${localResult.matchStatus}/${localResult.resultStatus}`,
        `${official.Home?.Score}-${official.Away?.Score} finished/official`,
      );
    }
  }
}

for (let matchNo = 73; matchNo <= 88; matchNo += 1) {
  const official = officialMatches.get(matchNo);
  const local = bracketFixture.r32?.[String(matchNo)];
  if (!official || !local) {
    errors.push(`Match ${matchNo}: missing ${official ? 'local R32 fixture' : 'FIFA fixture'}`);
    continue;
  }

  const officialHomeId = toTeamId(localizedName(official.Home?.TeamName));
  const officialAwayId = toTeamId(localizedName(official.Away?.TeamName));
  if (local.homeTeamId !== officialHomeId || local.awayTeamId !== officialAwayId) {
    pushMismatch(errors, `Match ${matchNo} R32 teams`, `${local.homeTeamId} vs ${local.awayTeamId}`, `${officialHomeId} vs ${officialAwayId}`);
  }
  if (local.kickoffUtc !== official.Date) {
    pushMismatch(errors, `Match ${matchNo} R32 kickoff`, local.kickoffUtc, official.Date);
  }

  for (const teamId of [officialHomeId, officialAwayId]) {
    const team = teams.get(teamId);
    if (!team?.name) errors.push(`Team ${teamId}: missing Chinese name`);
    if (!team?.flagKey || !existsSync(resolve(ROOT, `public/flags/${team.flagKey}.svg`))) {
      errors.push(`Team ${teamId}: missing local flag`);
    }
  }
}

for (let matchNo = 89; matchNo <= 104; matchNo += 1) {
  const official = officialMatches.get(matchNo);
  const local = bracketFixture.knockoutFixtures?.[String(matchNo)];
  if (!official || !local) {
    errors.push(`Match ${matchNo}: missing ${official ? 'local knockout fixture' : 'FIFA fixture'}`);
    continue;
  }

  if (local.homePlaceholder !== official.PlaceHolderA || local.awayPlaceholder !== official.PlaceHolderB) {
    pushMismatch(
      errors,
      `Match ${matchNo} bracket path`,
      `${local.homePlaceholder} vs ${local.awayPlaceholder}`,
      `${official.PlaceHolderA} vs ${official.PlaceHolderB}`,
    );
  }
  if (local.kickoffUtc !== official.Date) {
    pushMismatch(errors, `Match ${matchNo} knockout kickoff`, local.kickoffUtc, official.Date);
  }

  const officialHomeId = officialTeamId(official.Home);
  const officialAwayId = officialTeamId(official.Away);
  if ((local.homeTeamId ?? null) !== officialHomeId || (local.awayTeamId ?? null) !== officialAwayId) {
    pushMismatch(
      errors,
      `Match ${matchNo} confirmed teams`,
      `${local.homeTeamId ?? '-'} vs ${local.awayTeamId ?? '-'}`,
      `${officialHomeId ?? '-'} vs ${officialAwayId ?? '-'}`,
    );
  }
}

if (errors.length > 0) {
  console.error(`FIFA data audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`FIFA data audit passed: ${groupRows.size} group fixtures, 16 R32 fixtures, 16 knockout paths, scores and flag assets verified.`);
