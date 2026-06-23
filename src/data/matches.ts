import type { Match, MatchTag } from '../types';

const fifaScheduleSource =
  'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures';

const commonOfficial = {
  matchInfoStatus: 'official' as const,
  resultStatus: 'pending' as const,
  advancementStatus: 'not_applicable' as const,
  source: fifaScheduleSource,
  lastUpdated: '2026-06-22',
};

const teamIdByScheduleName: Record<string, string> = {
  'south korea': 'korea-republic',
  'czech republic': 'czechia',
  'bosnia & herzegovina': 'bosnia',
  'ivory coast': 'ivory-coast',
  'curaçao': 'curacao',
  'cape verde': 'cape-verde',
  'saudi arabia': 'saudi-arabia',
  'new zealand': 'new-zealand',
  'dr congo': 'dr-congo',
};

const marqueeTeams = new Set([
  'mexico',
  'canada',
  'usa',
  'brazil',
  'germany',
  'netherlands',
  'spain',
  'france',
  'argentina',
  'portugal',
  'england',
]);

const recommendedTeams = new Set([
  'south korea',
  'czech republic',
  'qatar',
  'switzerland',
  'morocco',
  'australia',
  'turkey',
  'belgium',
  'uruguay',
  'japan',
  'senegal',
  'croatia',
  'colombia',
]);

type GroupStageRow = readonly [
  matchNo: number,
  group: string,
  home: string,
  away: string,
  kickoffUtc: string,
  venue: string,
];

const groupStageRows: GroupStageRow[] = [
  [1, 'A', 'mexico', 'south africa', '2026-06-11T19:00:00Z', 'Estadio Azteca, Mexico City'],
  [2, 'A', 'south korea', 'czech republic', '2026-06-12T02:00:00Z', 'Estadio Akron, Guadalajara'],
  [3, 'B', 'canada', 'bosnia & herzegovina', '2026-06-12T19:00:00Z', 'BMO Field, Toronto'],
  [4, 'D', 'usa', 'paraguay', '2026-06-13T01:00:00Z', 'SoFi Stadium, Los Angeles'],
  [8, 'B', 'qatar', 'switzerland', '2026-06-13T19:00:00Z', "Levi's Stadium, San Francisco Bay Area"],
  [6, 'C', 'brazil', 'morocco', '2026-06-13T22:00:00Z', 'MetLife Stadium, New York/New Jersey'],
  [7, 'C', 'haiti', 'scotland', '2026-06-14T01:00:00Z', 'Gillette Stadium, Boston'],
  [5, 'D', 'australia', 'turkey', '2026-06-14T04:00:00Z', 'BC Place, Vancouver'],
  [9, 'E', 'germany', 'curaçao', '2026-06-14T17:00:00Z', 'NRG Stadium, Houston'],
  [11, 'F', 'netherlands', 'japan', '2026-06-14T20:00:00Z', 'AT&T Stadium, Dallas'],
  [10, 'E', 'ivory coast', 'ecuador', '2026-06-14T23:00:00Z', 'Lincoln Financial Field, Philadelphia'],
  [12, 'F', 'sweden', 'tunisia', '2026-06-15T02:00:00Z', 'Estadio BBVA, Monterrey'],
  [13, 'H', 'spain', 'cape verde', '2026-06-15T16:00:00Z', 'Mercedes-Benz Stadium, Atlanta'],
  [15, 'G', 'belgium', 'egypt', '2026-06-15T19:00:00Z', 'Lumen Field, Seattle'],
  [14, 'H', 'saudi arabia', 'uruguay', '2026-06-15T22:00:00Z', 'Hard Rock Stadium, Miami'],
  [16, 'G', 'iran', 'new zealand', '2026-06-16T01:00:00Z', 'SoFi Stadium, Los Angeles'],
  [17, 'I', 'france', 'senegal', '2026-06-16T19:00:00Z', 'MetLife Stadium, New York/New Jersey'],
  [18, 'I', 'iraq', 'norway', '2026-06-16T22:00:00Z', 'Gillette Stadium, Boston'],
  [19, 'J', 'argentina', 'algeria', '2026-06-17T01:00:00Z', 'GEHA Field at Arrowhead Stadium, Kansas City'],
  [20, 'J', 'austria', 'jordan', '2026-06-17T04:00:00Z', "Levi's Stadium, San Francisco Bay Area"],
  [23, 'K', 'portugal', 'dr congo', '2026-06-17T17:00:00Z', 'NRG Stadium, Houston'],
  [21, 'L', 'england', 'croatia', '2026-06-17T20:00:00Z', 'AT&T Stadium, Dallas'],
  [22, 'L', 'ghana', 'panama', '2026-06-17T23:00:00Z', 'BMO Field, Toronto'],
  [24, 'K', 'uzbekistan', 'colombia', '2026-06-18T02:00:00Z', 'Estadio Azteca, Mexico City'],
  [25, 'A', 'czech republic', 'south africa', '2026-06-18T16:00:00Z', 'Mercedes-Benz Stadium, Atlanta'],
  [26, 'B', 'switzerland', 'bosnia & herzegovina', '2026-06-18T19:00:00Z', 'SoFi Stadium, Los Angeles'],
  [27, 'B', 'canada', 'qatar', '2026-06-18T22:00:00Z', 'BC Place, Vancouver'],
  [28, 'A', 'mexico', 'south korea', '2026-06-19T01:00:00Z', 'Estadio Akron, Guadalajara'],
  [32, 'D', 'usa', 'australia', '2026-06-19T19:00:00Z', 'Lumen Field, Seattle'],
  [30, 'C', 'scotland', 'morocco', '2026-06-19T22:00:00Z', 'Gillette Stadium, Boston'],
  [29, 'C', 'brazil', 'haiti', '2026-06-20T00:30:00Z', 'Lincoln Financial Field, Philadelphia'],
  [31, 'D', 'turkey', 'paraguay', '2026-06-20T03:00:00Z', "Levi's Stadium, San Francisco Bay Area"],
  [33, 'F', 'netherlands', 'sweden', '2026-06-20T17:00:00Z', 'NRG Stadium, Houston'],
  [34, 'E', 'germany', 'ivory coast', '2026-06-20T20:00:00Z', 'BMO Field, Toronto'],
  [35, 'E', 'ecuador', 'curaçao', '2026-06-21T00:00:00Z', 'GEHA Field at Arrowhead Stadium, Kansas City'],
  [36, 'F', 'tunisia', 'japan', '2026-06-21T04:00:00Z', 'Estadio BBVA, Monterrey'],
  [37, 'H', 'spain', 'saudi arabia', '2026-06-21T16:00:00Z', 'Mercedes-Benz Stadium, Atlanta'],
  [39, 'G', 'belgium', 'iran', '2026-06-21T19:00:00Z', 'SoFi Stadium, Los Angeles'],
  [38, 'H', 'uruguay', 'cape verde', '2026-06-21T22:00:00Z', 'Hard Rock Stadium, Miami'],
  [40, 'G', 'new zealand', 'egypt', '2026-06-22T01:00:00Z', 'BC Place, Vancouver'],
  [43, 'J', 'argentina', 'austria', '2026-06-22T17:00:00Z', 'AT&T Stadium, Dallas'],
  [41, 'I', 'france', 'iraq', '2026-06-22T21:00:00Z', 'Lincoln Financial Field, Philadelphia'],
  [42, 'I', 'norway', 'senegal', '2026-06-23T00:00:00Z', 'MetLife Stadium, New York/New Jersey'],
  [44, 'J', 'jordan', 'algeria', '2026-06-23T03:00:00Z', "Levi's Stadium, San Francisco Bay Area"],
  [47, 'K', 'portugal', 'uzbekistan', '2026-06-23T17:00:00Z', 'NRG Stadium, Houston'],
  [45, 'L', 'england', 'ghana', '2026-06-23T20:00:00Z', 'Gillette Stadium, Boston'],
  [46, 'L', 'panama', 'croatia', '2026-06-23T23:00:00Z', 'BMO Field, Toronto'],
  [48, 'K', 'colombia', 'dr congo', '2026-06-24T02:00:00Z', 'Estadio Akron, Guadalajara'],
  [51, 'B', 'switzerland', 'canada', '2026-06-24T19:00:00Z', 'BC Place, Vancouver'],
  [52, 'B', 'bosnia & herzegovina', 'qatar', '2026-06-24T19:00:00Z', 'Lumen Field, Seattle'],
  [49, 'C', 'scotland', 'brazil', '2026-06-24T22:00:00Z', 'Hard Rock Stadium, Miami'],
  [50, 'C', 'morocco', 'haiti', '2026-06-24T22:00:00Z', 'Mercedes-Benz Stadium, Atlanta'],
  [53, 'A', 'czech republic', 'mexico', '2026-06-25T01:00:00Z', 'Estadio Azteca, Mexico City'],
  [54, 'A', 'south africa', 'south korea', '2026-06-25T01:00:00Z', 'Estadio BBVA, Monterrey'],
  [55, 'E', 'curaçao', 'ivory coast', '2026-06-25T20:00:00Z', 'Lincoln Financial Field, Philadelphia'],
  [56, 'E', 'ecuador', 'germany', '2026-06-25T20:00:00Z', 'MetLife Stadium, New York/New Jersey'],
  [57, 'F', 'japan', 'sweden', '2026-06-25T23:00:00Z', 'AT&T Stadium, Dallas'],
  [58, 'F', 'tunisia', 'netherlands', '2026-06-25T23:00:00Z', 'GEHA Field at Arrowhead Stadium, Kansas City'],
  [59, 'D', 'turkey', 'usa', '2026-06-26T02:00:00Z', 'SoFi Stadium, Los Angeles'],
  [60, 'D', 'paraguay', 'australia', '2026-06-26T02:00:00Z', "Levi's Stadium, San Francisco Bay Area"],
  [62, 'I', 'norway', 'france', '2026-06-26T19:00:00Z', 'Gillette Stadium, Boston'],
  [61, 'I', 'senegal', 'iraq', '2026-06-26T19:00:00Z', 'BMO Field, Toronto'],
  [65, 'H', 'cape verde', 'saudi arabia', '2026-06-27T00:00:00Z', 'NRG Stadium, Houston'],
  [66, 'H', 'uruguay', 'spain', '2026-06-27T00:00:00Z', 'Estadio Akron, Guadalajara'],
  [63, 'G', 'egypt', 'iran', '2026-06-27T03:00:00Z', 'Lumen Field, Seattle'],
  [64, 'G', 'new zealand', 'belgium', '2026-06-27T03:00:00Z', 'BC Place, Vancouver'],
  [68, 'L', 'panama', 'england', '2026-06-27T21:00:00Z', 'MetLife Stadium, New York/New Jersey'],
  [67, 'L', 'croatia', 'ghana', '2026-06-27T21:00:00Z', 'Lincoln Financial Field, Philadelphia'],
  [72, 'K', 'colombia', 'portugal', '2026-06-27T23:30:00Z', 'Hard Rock Stadium, Miami'],
  [71, 'K', 'dr congo', 'uzbekistan', '2026-06-27T23:30:00Z', 'Mercedes-Benz Stadium, Atlanta'],
  [69, 'J', 'algeria', 'austria', '2026-06-28T02:00:00Z', 'GEHA Field at Arrowhead Stadium, Kansas City'],
  [70, 'J', 'jordan', 'argentina', '2026-06-28T02:00:00Z', 'AT&T Stadium, Dallas'],
];

function toTeamId(scheduleName: string) {
  return teamIdByScheduleName[scheduleName] ?? scheduleName.replace(/\s+/g, '-');
}

function toBeijingDateTime(kickoffUtc: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(kickoffUtc));
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

  return {
    date: `${value('year')}-${value('month')}-${value('day')}`,
    time: `${value('hour')}:${value('minute')}`,
  };
}

function splitVenue(venue: string) {
  const parts = venue.split(', ');
  const city = parts.pop() ?? venue;

  return {
    city,
    stadium: parts.join(', ') || venue,
  };
}

function getTag(home: string, away: string): MatchTag {
  if (marqueeTeams.has(home) || marqueeTeams.has(away)) return '重点';
  if (recommendedTeams.has(home) || recommendedTeams.has(away)) return '推荐';
  return '普通';
}

const groupStageMatches: Match[] = groupStageRows.map(([matchNo, group, home, away, kickoffUtc, venue]) => {
  const { date, time } = toBeijingDateTime(kickoffUtc);
  const { city, stadium } = splitVenue(venue);

  return {
    id: `m${String(matchNo).padStart(3, '0')}`,
    matchNo,
    date,
    time,
    stage: '小组赛',
    group: `${group}组`,
    homeTeamId: toTeamId(home),
    awayTeamId: toTeamId(away),
    homeScore: null,
    awayScore: null,
    matchStatus: 'scheduled',
    city,
    stadium,
    note: '赛程对阵、场馆和开球时间已按公开赛程人工维护；比分和赛果将在比赛后更新。',
    tag: getTag(home, away),
    ...commonOfficial,
  };
});

// ─── 淘汰赛占位（球队在小组赛结束后自动填入） ──────────

type KnockoutRow = readonly [
  matchNo: number,
  stage: '32强' | '16强' | '8强' | '半决赛' | '三四名决赛' | '决赛',
  date: string,
];

const knockoutRows: KnockoutRow[] = [
  // 32 强
  [73, '32强', '2026-06-29'],
  [74, '32强', '2026-06-29'],
  [75, '32强', '2026-06-29'],
  [76, '32强', '2026-06-30'],
  [77, '32强', '2026-06-30'],
  [78, '32强', '2026-06-30'],
  [79, '32强', '2026-07-01'],
  [80, '32强', '2026-07-01'],
  [81, '32强', '2026-07-01'],
  [82, '32强', '2026-07-02'],
  [83, '32强', '2026-07-02'],
  [84, '32强', '2026-07-02'],
  [85, '32强', '2026-07-03'],
  [86, '32强', '2026-07-03'],
  [87, '32强', '2026-07-03'],
  [88, '32强', '2026-07-04'],
  // 16 强
  [89, '16强', '2026-07-05'],
  [90, '16强', '2026-07-05'],
  [91, '16强', '2026-07-06'],
  [92, '16强', '2026-07-06'],
  [93, '16强', '2026-07-07'],
  [94, '16强', '2026-07-07'],
  [95, '16强', '2026-07-08'],
  [96, '16强', '2026-07-08'],
  // 8 强
  [97, '8强', '2026-07-11'],
  [98, '8强', '2026-07-11'],
  [99, '8强', '2026-07-12'],
  [100, '8强', '2026-07-12'],
  // 半决赛
  [101, '半决赛', '2026-07-15'],
  [102, '半决赛', '2026-07-16'],
  // 三四名决赛
  [103, '三四名决赛', '2026-07-19'],
  // 决赛
  [104, '决赛', '2026-07-20'],
];

const knockoutMatches: Match[] = knockoutRows.map(([matchNo, stage, date]) => ({
  id: `m${String(matchNo).padStart(3, '0')}`,
  matchNo,
  date,
  time: '待确认',
  stage,
  homeTeamId: 'tbd-home',
  awayTeamId: 'tbd-away',
  homeScore: null,
  awayScore: null,
  matchStatus: 'scheduled' as const,
  city: '待确认',
  stadium: '待确认',
  note: '淘汰赛对阵占位，真实球队将在小组赛结束后自动更新。',
  tag: '重点' as const,
  matchInfoStatus: 'pending' as const,
  resultStatus: 'pending' as const,
  advancementStatus: 'pending' as const,
  source: fifaScheduleSource,
  lastUpdated: '2026-05-23',
}));

// 决赛特殊处理
const finalMatch = knockoutMatches.find((m) => m.matchNo === 104)!;
finalMatch.time = '03:00';
finalMatch.city = 'New York / New Jersey';
finalMatch.stadium = 'MetLife Stadium';
finalMatch.note = '决赛时间和场馆已确认；参赛球队和冠军待比赛产生。';
finalMatch.matchInfoStatus = 'official';

export const matches: Match[] = [...groupStageMatches, ...knockoutMatches];
