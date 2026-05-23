import type { Match } from '../types';

export function getMatchStatusLabel(status: Match['matchStatus']) {
  return {
    scheduled: '未开始',
    live: '进行中',
    finished: '已结束',
  }[status];
}

export function getResultLabel(match: Match) {
  if (match.resultStatus === 'official' && match.homeScore != null && match.awayScore != null) {
    return `${match.homeScore} : ${match.awayScore}`;
  }

  return getMatchStatusLabel(match.matchStatus);
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
