import { bracketRounds } from '../data/bracket';
import bracketFixture from '../data/bracketFixture.json';
import { matches as baseMatches } from '../data/matches';
import matchResults from '../data/matchResults.json';
import { officialSources } from '../data/sources';
import { teamById, teams } from '../data/teams';
import type { BracketRound, BracketSlot, Match } from '../types';

type OfficialKnockoutFixture = {
  homeTeamId?: string | null;
  awayTeamId?: string | null;
  homePlaceholder?: string | null;
  awayPlaceholder?: string | null;
};

type OfficialBracketData = {
  r32: Record<string, OfficialKnockoutFixture>;
  knockoutFixtures?: Record<string, OfficialKnockoutFixture>;
  knockoutWinners: Record<string, OfficialKnockoutFixture>;
};

type ResultsMap = Record<string, {
  homeScore?: number | null;
  awayScore?: number | null;
  matchStatus?: Match['matchStatus'];
  resultStatus?: 'pending' | 'official';
}>;

function mergeResults(matches: Match[], results: ResultsMap): Match[] {
  return matches.map((match) => {
    const result = results[String(match.matchNo)];
    if (!result) return match;
    return {
      ...match,
      homeScore: result.homeScore ?? match.homeScore,
      awayScore: result.awayScore ?? match.awayScore,
      matchStatus: result.matchStatus ?? match.matchStatus,
      resultStatus: result.resultStatus ?? match.resultStatus,
    };
  });
}

let cachedMatches: Match[] | null = null;

export function getMatches() {
  if (!cachedMatches) {
    cachedMatches = mergeResults(baseMatches, matchResults as ResultsMap);
  }
  return cachedMatches;
}

/**
 * 解析比赛的真实球队：从 bracket 数据中查找
 * 用于淘汰赛阶段（homeTeamId/awayTeamId 为 tbd-* 时）
 */
export function resolveMatchTeams(matchId: string): { homeTeamId: string; awayTeamId: string } | null {
  const bracket = getBracketRounds();
  for (const round of bracket) {
    for (const bmatch of round.matches) {
      if (bmatch.matchId === matchId && bmatch.homeSlot.teamId && bmatch.awaySlot.teamId) {
        return { homeTeamId: bmatch.homeSlot.teamId, awayTeamId: bmatch.awaySlot.teamId };
      }
    }
  }
  return null;
}

export function getTeams() {
  return teams;
}

export function getTeamById(teamId: string) {
  return teamById[teamId];
}

/** 晋级树只展示 FIFA 已确认的球队和官方占位路径。 */
let cachedBracket: BracketRound[] | null = null;

export function getBracketRounds(): BracketRound[] {
  if (cachedBracket) return cachedBracket;

  const matches = getMatches();
  const results = matchResults as ResultsMap;

  // 标准化结果格式
  const normalizedResults: Record<string, { homeScore: number | null; awayScore: number | null; matchStatus: string }> = {};
  for (const [key, val] of Object.entries(results)) {
    normalizedResults[key] = {
      homeScore: val.homeScore ?? null,
      awayScore: val.awayScore ?? null,
      matchStatus: val.matchStatus ?? 'scheduled',
    };
  }

  const officialBracket = bracketFixture as OfficialBracketData;
  const fixtureByMatchNo: Record<string, OfficialKnockoutFixture> = {
    ...officialBracket.r32,
    ...(officialBracket.knockoutFixtures ?? {}),
    ...officialBracket.knockoutWinners,
  };

  // 5. 用填充数据更新 bracket
  const resolved = bracketRounds.map((round) => ({
    ...round,
    matches: round.matches.map((match) => {
      const matchNo = match.matchId ? parseInt(match.matchId.replace('m', ''), 10) : 0;
      const fixture = fixtureByMatchNo[String(matchNo)];
      const matchData = matches.find((item) => item.matchNo === matchNo);
      const result = normalizedResults[String(matchNo)];
      const winnerTeamId = resolveWinnerTeamId(matchData, result);

      if (fixture) {
        const homeSlot = updateSlot(match.homeSlot, fixture.homeTeamId, fixture.homePlaceholder);
        const awaySlot = updateSlot(match.awaySlot, fixture.awayTeamId, fixture.awayPlaceholder);
        const isConfirmed = homeSlot.status === 'confirmed' && awaySlot.status === 'confirmed';

        return {
          ...match,
          date: matchData?.date ?? match.date,
          homeSlot,
          awaySlot,
          winnerTeamId: winnerTeamId ?? match.winnerTeamId,
          status: isConfirmed ? 'confirmed' as const : 'pending' as const,
          dataStatus: 'official' as const,
        };
      }

      if (winnerTeamId) return { ...match, winnerTeamId };

      return match;
    }),
  }));

  cachedBracket = resolved;
  return resolved;
}

function resolveWinnerTeamId(
  match: Match | undefined,
  result: { homeScore: number | null; awayScore: number | null; matchStatus: string } | undefined,
) {
  if (!match || result?.matchStatus !== 'finished' || result.homeScore == null || result.awayScore == null) return null;
  if (result.homeScore > result.awayScore) return match.homeTeamId;
  if (result.awayScore > result.homeScore) return match.awayTeamId;
  return null;
}

function updateSlot(base: BracketSlot, teamId?: string | null, placeholder?: string | null): BracketSlot {
  if (teamId && !teamId.startsWith('tbd') && !teamId.startsWith('slot-')) {
    const team = teamById[teamId];
    return {
      ...base,
      teamId,
      label: team?.name ?? teamId,
      status: 'confirmed',
      dataStatus: 'official',
    };
  }

  if (!placeholder) return base;
  return {
    ...base,
    teamId: null,
    label: formatPlaceholder(placeholder),
    status: 'pending',
    dataStatus: 'official',
  };
}

function formatPlaceholder(placeholder: string) {
  const winner = placeholder.match(/^W(\d+)$/);
  if (winner) return `第${winner[1]}场胜者`;
  const runnerUp = placeholder.match(/^RU(\d+)$/);
  if (runnerUp) return `第${runnerUp[1]}场负者`;

  const groupSlot = placeholder.match(/^([123])([A-L])$/);
  if (groupSlot) {
    const rank = { '1': '第一', '2': '第二', '3': '第三' }[groupSlot[1]];
    return `${groupSlot[2]}组${rank}`;
  }

  return placeholder;
}

export function getOfficialSources() {
  return officialSources;
}
