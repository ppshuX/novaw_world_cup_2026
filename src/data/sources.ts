export interface OfficialSource {
  id: string;
  title: string;
  description: string;
  url: string;
  tag: string;
}

export const officialSources: OfficialSource[] = [
  {
    id: 'fifa-home',
    title: 'FIFA 2026 世界杯主页',
    description: '总入口，可以查看新闻、球队、票务、赛程入口和赛事信息。',
    url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
    tag: '总入口',
  },
  {
    id: 'fifa-fixtures',
    title: '官方赛程 / 比分 / Fixtures',
    description: '最适合人工核对每场比赛、日期、比分、结果和即将进行的赛程。',
    url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures',
    tag: '每日更新',
  },
  {
    id: 'fifa-full-schedule',
    title: '官方完整赛程说明',
    description: '用于核对完整 schedule、fixtures、dates、venues 等基础信息。',
    url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums',
    tag: '完整说明',
  },
];
