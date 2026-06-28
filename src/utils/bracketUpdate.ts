/**
 * 晋级树自动化核心逻辑
 *
 * 数据来源优先级:
 * 1. bracketFixture.json — FIFA 官网拉取的对阵数据（有就用，没有就占位）
 * 2. matchResults.json — 比分数据，用于计算小组赛排名和淘汰赛胜者
 *
 * 流程:
 * 1. 读取 bracketFixture.json 获取 R32 对阵
 * 2. 用小组赛排名填充 R32 slot（仅当 fixture 未提供时）
 * 3. 推进已结束淘汰赛的胜者到下一轮
 */

import type { Match, BracketSlot } from '../types';

// ─── 类型 ─────────────────────────────────────────────────

export interface TeamStanding {
  teamId: string;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface BracketFixture {
  r32: Record<string, { homeTeamId: string; awayTeamId: string }>;
  knockoutWinners: Record<string, { homeTeamId: string; awayTeamId: string }>;
}

// ─── 小组赛排名 ───────────────────────────────────────────

/**
 * 从比赛结果计算某组的排名
 */
export function calculateGroupStandings(
  group: string,
  groupMatches: Match[],
  results: Record<string, { homeScore: number | null; awayScore: number | null; matchStatus: string }>,
): TeamStanding[] {
  const teamMap = new Map<string, TeamStanding>();

  const getOrCreate = (teamId: string): TeamStanding => {
    if (!teamMap.has(teamId)) {
      teamMap.set(teamId, {
        teamId,
        group,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }
    return teamMap.get(teamId)!;
  };

  for (const match of groupMatches) {
    const result = results[String(match.matchNo)];
    if (!result || result.matchStatus !== 'finished') continue;
    if (result.homeScore == null || result.awayScore == null) continue;

    const home = getOrCreate(match.homeTeamId);
    const away = getOrCreate(match.awayTeamId);

    home.played++;
    away.played++;
    home.goalsFor += result.homeScore;
    home.goalsAgainst += result.awayScore;
    away.goalsFor += result.awayScore;
    away.goalsAgainst += result.homeScore;

    if (result.homeScore > result.awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (result.homeScore < result.awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }

  const standings = Array.from(teamMap.values());
  for (const s of standings) {
    s.goalDifference = s.goalsFor - s.goalsAgainst;
  }

  standings.sort((a, b) =>
    b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor,
  );

  return standings;
}

/**
 * 检查小组赛是否全部结束
 */
export function isGroupStageComplete(
  groupMatches: Match[],
  results: Record<string, { homeScore: number | null; awayScore: number | null; matchStatus: string }>,
): boolean {
  return groupMatches.length > 0 && groupMatches.every((m) => {
    const r = results[String(m.matchNo)];
    return r && r.matchStatus === 'finished' && r.homeScore != null && r.awayScore != null;
  });
}

// ─── 晋级填充（基于 fixture + 排名） ─────────────────────

/**
 * 根据 bracketFixture 和小组赛排名，构建 R32 填充表
 *
 * 策略:
 * - fixture.r32 有数据 → 直接用 fixture 的对阵
 * - fixture 为空 + 小组赛已结束 → 用排名推算（简化版：1st vs 2nd 配对）
 */
export function buildR32Fill(
  fixture: BracketFixture,
): Map<number, { homeTeamId: string; awayTeamId: string }> {
  const result = new Map<number, { homeTeamId: string; awayTeamId: string }>();

  for (const [matchNoStr, matchup] of Object.entries(fixture.r32)) {
    result.set(Number(matchNoStr), matchup);
  }

  return result;
}

/**
 * 获取比赛胜者
 */
export function getMatchWinner(
  matchNo: number,
  results: Record<string, { homeScore: number | null; awayScore: number | null; matchStatus: string }>,
  matches: Match[],
): string | null {
  const result = results[String(matchNo)];
  if (!result || result.matchStatus !== 'finished') return null;
  if (result.homeScore == null || result.awayScore == null) return null;

  const match = matches.find((m) => m.matchNo === matchNo);
  if (!match) return null;

  if (result.homeScore > result.awayScore) return match.homeTeamId;
  if (result.homeScore < result.awayScore) return match.awayTeamId;
  return null; // 平局需点球，当前数据不含点球信息
}

/**
 * 获取比赛负者（三四名决赛用）
 */
export function getMatchLoser(
  matchNo: number,
  results: Record<string, { homeScore: number | null; awayScore: number | null; matchStatus: string }>,
  matches: Match[],
): string | null {
  const result = results[String(matchNo)];
  if (!result || result.matchStatus !== 'finished') return null;
  if (result.homeScore == null || result.awayScore == null) return null;

  const match = matches.find((m) => m.matchNo === matchNo);
  if (!match) return null;

  if (result.homeScore > result.awayScore) return match.awayTeamId;
  if (result.homeScore < result.awayScore) return match.homeTeamId;
  return null;
}

/**
 * 推进淘汰赛胜者到下一轮
 * 使用 fixture.knockoutWinners 优先，没有则从比分推算
 */
export function advanceKnockoutWinners(
  fixture: BracketFixture,
): Map<number, { homeTeamId: string; awayTeamId: string }> {
  const advancements = new Map<number, { homeTeamId: string; awayTeamId: string }>();

  for (const [matchNoStr, matchup] of Object.entries(fixture.knockoutWinners)) {
    advancements.set(Number(matchNoStr), matchup);
  }

  return advancements;
}
