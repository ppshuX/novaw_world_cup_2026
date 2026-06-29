/**
 * Synchronize World Cup scores and confirmed knockout fixtures from FIFA.
 * Usage: node scripts/update-scores.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RESULTS_PATH = resolve(ROOT, 'src/data/matchResults.json');
const BRACKET_PATH = resolve(ROOT, 'src/data/bracketFixture.json');
const FIFA_API = 'https://api.fifa.com/api/v3/calendar/matches';
const FIFA_COMPETITION_ID = '17';
const FIFA_SEASON_ID = '285023';

const DATE_RANGES = [
  ['2026-06-10T00:00:00Z', '2026-06-18T23:59:59Z'],
  ['2026-06-19T00:00:00Z', '2026-06-26T23:59:59Z'],
  ['2026-06-27T00:00:00Z', '2026-07-05T23:59:59Z'],
  ['2026-07-06T00:00:00Z', '2026-07-21T23:59:59Z'],
];

const FIFA_CODE_TO_TEAM_ID = {
  MEX: 'mexico', RSA: 'south-africa', KOR: 'korea-republic', CZE: 'czechia',
  CAN: 'canada', QAT: 'qatar', SUI: 'switzerland', BIH: 'bosnia',
  BRA: 'brazil', MAR: 'morocco', HAI: 'haiti', SCO: 'scotland',
  USA: 'usa', PAR: 'paraguay', AUS: 'australia', TUR: 'turkey',
  GER: 'germany', CUW: 'curacao', CIV: 'ivory-coast', ECU: 'ecuador',
  NED: 'netherlands', JPN: 'japan', SWE: 'sweden', TUN: 'tunisia',
  BEL: 'belgium', EGY: 'egypt', IRN: 'iran', NZL: 'new-zealand',
  ESP: 'spain', CPV: 'cape-verde', KSA: 'saudi-arabia', URU: 'uruguay',
  FRA: 'france', SEN: 'senegal', IRQ: 'iraq', NOR: 'norway',
  ARG: 'argentina', ALG: 'algeria', AUT: 'austria', JOR: 'jordan',
  POR: 'portugal', COD: 'dr-congo', UZB: 'uzbekistan', COL: 'colombia',
  ENG: 'england', CRO: 'croatia', GHA: 'ghana', PAN: 'panama',
};

function localizedName(value) {
  if (!Array.isArray(value)) return value ?? '';
  return value.find((item) => item.Locale === 'en-GB')?.Description ?? value[0]?.Description ?? '';
}

function teamIdFromSide(side) {
  const code = side?.Abbreviation ?? side?.IdCountry;
  return FIFA_CODE_TO_TEAM_ID[code] ?? null;
}

function matchStatusFromFifa(match) {
  if (Number(match.MatchStatus) === 0) return 'finished';
  if (Number(match.MatchStatus) === 1) return 'scheduled';
  return match.Home?.Score != null || match.Away?.Score != null ? 'live' : 'scheduled';
}

async function fetchOfficialMatches() {
  const matches = new Map();

  for (const [from, to] of DATE_RANGES) {
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

function updateResults(officialMatches) {
  const existing = JSON.parse(readFileSync(RESULTS_PATH, 'utf8'));
  let updates = 0;

  for (const [matchNo, match] of officialMatches) {
    const matchStatus = matchStatusFromFifa(match);
    if (matchStatus === 'scheduled') continue;

    const homeScore = match.Home?.Score == null ? null : Number(match.Home.Score);
    const awayScore = match.Away?.Score == null ? null : Number(match.Away.Score);
    const resultStatus = matchStatus === 'finished' && homeScore != null && awayScore != null
      ? 'official'
      : 'pending';
    const next = { homeScore, awayScore, matchStatus, resultStatus };

    if (JSON.stringify(existing[String(matchNo)]) !== JSON.stringify(next)) {
      existing[String(matchNo)] = next;
      updates += 1;
    }
  }

  if (updates > 0) writeFileSync(RESULTS_PATH, `${JSON.stringify(existing, null, 2)}\n`, 'utf8');
  return updates;
}

function updateBracketFixtures(officialMatches) {
  const existing = JSON.parse(readFileSync(BRACKET_PATH, 'utf8'));
  const next = {
    ...existing,
    _api: FIFA_API,
    lastUpdated: new Date().toISOString().slice(0, 10),
    r32: { ...(existing.r32 ?? {}) },
    knockoutWinners: { ...(existing.knockoutWinners ?? {}) },
    knockoutFixtures: { ...(existing.knockoutFixtures ?? {}) },
  };

  for (const [matchNo, match] of officialMatches) {
    if (matchNo < 73 || matchNo > 104) continue;
    const homeTeamId = teamIdFromSide(match.Home);
    const awayTeamId = teamIdFromSide(match.Away);

    const fixture = {
      homeTeamId,
      awayTeamId,
      homePlaceholder: match.PlaceHolderA ?? null,
      awayPlaceholder: match.PlaceHolderB ?? null,
      kickoffUtc: match.Date,
      city: localizedName(match.Stadium?.CityName),
      stadium: localizedName(match.Stadium?.Name),
    };

    if (matchNo <= 88) {
      if (homeTeamId && awayTeamId) next.r32[String(matchNo)] = fixture;
      continue;
    }

    next.knockoutFixtures[String(matchNo)] = fixture;
    if (homeTeamId && awayTeamId) next.knockoutWinners[String(matchNo)] = fixture;
  }

  const changed = JSON.stringify(existing) !== JSON.stringify(next);
  if (changed) writeFileSync(BRACKET_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return changed;
}

async function main() {
  console.log('=== FIFA World Cup official data sync ===');
  const officialMatches = await fetchOfficialMatches();
  console.log(`Fetched ${officialMatches.size} official World Cup fixtures.`);

  const resultUpdates = updateResults(officialMatches);
  const bracketChanged = updateBracketFixtures(officialMatches);
  console.log(`Score updates: ${resultUpdates}`);
  console.log(`Bracket fixtures changed: ${bracketChanged ? 'yes' : 'no'}`);
}

main().catch((error) => {
  console.error(`FIFA sync failed: ${error.message}`);
  process.exit(1);
});
