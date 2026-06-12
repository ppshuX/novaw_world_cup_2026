import type { Match } from '../types';
import { toMatchDate } from './date';

const LIVE_WINDOW_MS = 135 * 60 * 1000;

export function getMatchStatusLabel(status: Match['matchStatus']) {
  return {
    scheduled: '未开始',
    live: '进行中',
    finished: '已结束',
  }[status];
}

export function getResolvedMatchStatus(match: Match, now = Date.now()): Match['matchStatus'] {
  if (match.resultStatus === 'official' && match.homeScore != null && match.awayScore != null) return 'finished';
  if (match.matchStatus === 'finished') return 'finished';

  const startsAt = toMatchDate(match).getTime();
  if (!Number.isFinite(startsAt)) return match.matchStatus;
  if (now < startsAt) return match.matchStatus === 'live' ? 'live' : 'scheduled';

  return now < startsAt + LIVE_WINDOW_MS ? 'live' : 'finished';
}

export function getResolvedMatchStatusLabel(match: Match) {
  return getMatchStatusLabel(getResolvedMatchStatus(match));
}

export function getStatusColorClasses(match: Match): { bg: string; text: string } {
  const status = getResolvedMatchStatus(match);

  if (match.resultStatus === 'official' && match.homeScore != null && match.awayScore != null) {
    return { bg: 'bg-summer-blue', text: 'text-white' };
  }

  switch (status) {
    case 'live':
      return { bg: 'bg-red-500', text: 'text-white' };
    case 'finished':
      return { bg: 'bg-slate-400', text: 'text-white' };
    default:
      return { bg: 'bg-[#172033]', text: 'text-white' };
  }
}

export function getResultLabel(match: Match) {
  if (match.resultStatus === 'official' && match.homeScore != null && match.awayScore != null) {
    return `${match.homeScore} : ${match.awayScore}`;
  }

  return getResolvedMatchStatusLabel(match);
}

export function getMatchInfoStatusLabel(status: Match['matchInfoStatus']) {
  return {
    official: '官方确认',
    pending: '待确认',
    mock: '示例数据',
  }[status];
}

export function getResultStatusLabel(status: Match['resultStatus']) {
  return status === 'official' ? '比分结果已确认' : '待比赛结束后更新';
}

export function getAdvancementStatusLabel(status: Match['advancementStatus']) {
  return {
    not_applicable: '小组赛暂无晋级结果',
    pending: '晋级结果待确认',
    confirmed: '晋级结果已确认',
  }[status];
}
