import { bracketRounds } from '../data/bracket';
import bracketFixture from '../data/bracketFixture.json';
import { matches as baseMatches } from '../data/matches';
import matchResults from '../data/matchResults.json';
import { officialSources } from '../data/sources';
import { teamById, teams } from '../data/teams';
import type { BracketRound, BracketSlot, Match } from '../types';
import {
  buildR32Fill,
  advanceKnockoutWinners,
} from '../utils/bracketUpdate';
import type { BracketFixture } from '../utils/bracketUpdate';

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

/**
 * 动态计算晋级树：
 * - 有 fixture 数据 → 直接用
 * - 没有 → 从小组赛排名推算（仅小组赛全部结束后）
 * - 淘汰赛胜者 → 从比分自动推进
 */
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

  // 晋级树只使用 FIFA 已确认的对阵，不从积分榜猜测配对。
  const r32Fill = buildR32Fill(bracketFixture as BracketFixture);

  const advancements = advanceKnockoutWinners(bracketFixture as BracketFixture);

  // 4. 合并填充表
  const slotFill = new Map<number, { homeTeamId: string; awayTeamId: string }>();
  for (const [k, v] of r32Fill) slotFill.set(k, v);
  for (const [k, v] of advancements) slotFill.set(k, v);

  // 5. 用填充数据更新 bracket
  const resolved = bracketRounds.map((round) => ({
    ...round,
    matches: round.matches.map((match) => {
      const matchNo = match.matchId ? parseInt(match.matchId.replace('m', ''), 10) : 0;
      const fill = slotFill.get(matchNo);
      const matchData = matches.find((item) => item.matchNo === matchNo);

      if (fill) {
        const homeTeam = teamById[fill.homeTeamId];
        const awayTeam = teamById[fill.awayTeamId];

        return {
          ...match,
          date: matchData?.date ?? match.date,
          homeSlot: updateSlot(match.homeSlot, fill.homeTeamId, homeTeam?.name ?? fill.homeTeamId),
          awaySlot: updateSlot(match.awaySlot, fill.awayTeamId, awayTeam?.name ?? fill.awayTeamId),
          status: 'confirmed' as const,
          dataStatus: 'official' as const,
        };
      }

      // 检查这场比赛本身是否已有结果
      const result = normalizedResults[String(matchNo)];
      if (result?.matchStatus === 'finished' && result.homeScore != null && result.awayScore != null) {
        if (matchData) {
          const winnerId = result.homeScore > result.awayScore
            ? matchData.homeTeamId
            : result.awayScore > result.homeScore
              ? matchData.awayTeamId
              : null;
          if (winnerId) return { ...match, winnerTeamId: winnerId };
        }
      }

      return match;
    }),
  }));

  cachedBracket = resolved;
  return resolved;
}

function updateSlot(base: BracketSlot, teamId: string, label: string): BracketSlot {
  if (teamId.startsWith('tbd') || teamId.startsWith('slot-')) {
    return base;
  }
  return {
    ...base,
    teamId,
    label,
    status: 'confirmed',
    dataStatus: 'official',
  };
}

export function getOfficialSources() {
  return officialSources;
}
