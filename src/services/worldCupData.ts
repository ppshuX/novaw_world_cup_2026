import { bracketRounds } from '../data/bracket';
import bracketFixture from '../data/bracketFixture.json';
import { matches as baseMatches } from '../data/matches';
import matchResults from '../data/matchResults.json';
import { officialSources } from '../data/sources';
import { teamById, teams } from '../data/teams';
import type { BracketRound, BracketSlot, Match } from '../types';
import {
  calculateGroupStandings,
  buildR32Fill,
  advanceKnockoutWinners,
  isGroupStageComplete,
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
  const allGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  // 标准化结果格式
  const normalizedResults: Record<string, { homeScore: number | null; awayScore: number | null; matchStatus: string }> = {};
  for (const [key, val] of Object.entries(results)) {
    normalizedResults[key] = {
      homeScore: val.homeScore ?? null,
      awayScore: val.awayScore ?? null,
      matchStatus: val.matchStatus ?? 'scheduled',
    };
  }

  // 1. 计算每组排名
  const allStandings = new Map<string, ReturnType<typeof calculateGroupStandings>>();
  let groupStageDone = true;

  for (const group of allGroups) {
    const groupMatches = matches.filter((m) => m.group === `${group}组`);
    allStandings.set(group, calculateGroupStandings(group, groupMatches, normalizedResults));
    if (!isGroupStageComplete(groupMatches, normalizedResults)) {
      groupStageDone = false;
    }
  }

  // 2. 构建 R32 填充: fixture 优先，没有则用排名推算
  const r32Fill = buildR32Fill(bracketFixture as BracketFixture, allStandings, groupStageDone);

  // 3. 推进淘汰赛胜者: fixture 优先，没有则从比分推算
  const advancements = advanceKnockoutWinners(bracketFixture as BracketFixture, matches, normalizedResults);

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

      if (fill) {
        const homeTeam = teamById[fill.homeTeamId];
        const awayTeam = teamById[fill.awayTeamId];

        return {
          ...match,
          homeSlot: updateSlot(match.homeSlot, fill.homeTeamId, homeTeam?.name ?? fill.homeTeamId),
          awaySlot: updateSlot(match.awaySlot, fill.awayTeamId, awayTeam?.name ?? fill.awayTeamId),
          status: 'confirmed' as const,
          dataStatus: 'official' as const,
        };
      }

      // 检查这场比赛本身是否已有结果
      const result = normalizedResults[String(matchNo)];
      if (result?.matchStatus === 'finished' && result.homeScore != null && result.awayScore != null) {
        const matchData = matches.find((m) => m.matchNo === matchNo);
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
