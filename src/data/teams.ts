import type { Team } from '../types';

const teamEnglishNames: Record<string, string> = {
  mexico: 'Mexico',
  'south-africa': 'South Africa',
  'korea-republic': 'Korea Republic',
  czechia: 'Czechia',
  canada: 'Canada',
  qatar: 'Qatar',
  switzerland: 'Switzerland',
  bosnia: 'Bosnia and Herzegovina',
  brazil: 'Brazil',
  morocco: 'Morocco',
  haiti: 'Haiti',
  scotland: 'Scotland',
  usa: 'USA',
  paraguay: 'Paraguay',
  australia: 'Australia',
  turkey: 'Türkiye',
  germany: 'Germany',
  curacao: 'Curaçao',
  'ivory-coast': 'Côte d’Ivoire',
  ecuador: 'Ecuador',
  netherlands: 'Netherlands',
  japan: 'Japan',
  sweden: 'Sweden',
  tunisia: 'Tunisia',
  belgium: 'Belgium',
  egypt: 'Egypt',
  iran: 'Iran',
  'new-zealand': 'New Zealand',
  spain: 'Spain',
  'cape-verde': 'Cabo Verde',
  'saudi-arabia': 'Saudi Arabia',
  uruguay: 'Uruguay',
  france: 'France',
  senegal: 'Senegal',
  iraq: 'Iraq',
  norway: 'Norway',
  argentina: 'Argentina',
  algeria: 'Algeria',
  austria: 'Austria',
  jordan: 'Jordan',
  portugal: 'Portugal',
  'dr-congo': 'DR Congo',
  uzbekistan: 'Uzbekistan',
  colombia: 'Colombia',
  england: 'England',
  croatia: 'Croatia',
  ghana: 'Ghana',
  panama: 'Panama',
};

const teamDescriptions: Record<string, string> = {
  mexico: '东道主之一，将参加揭幕战，主场氛围会是本届赛事的重要看点。',
  canada: '东道主之一，适合关注北美赛区比赛节奏和主场氛围。',
  usa: '东道主之一，小组赛关注度高，比赛城市分布也很有代表性。',
  brazil: '传统世界杯强队，小组赛关注度很高。',
  argentina: '上届世界杯冠军，本届小组赛自然会受到大量关注。',
  germany: '欧洲传统强队，赛程关注度稳定。',
  france: '近年国际大赛表现突出的欧洲强队。',
  spain: '欧洲传统强队，小组赛会是很多用户关注的重点。',
  england: '欧洲传统强队，关注度高。',
  portugal: '欧洲传统强队，具备很高的话题度。',
  netherlands: '欧洲传统强队，小组赛对阵值得关注。',
  japan: '亚洲代表球队之一，适合中文用户重点关注。',
  'korea-republic': '亚洲代表球队之一，小组赛首轮就有较高关注度。',
  morocco: '近年国际大赛表现亮眼的非洲球队。',
  senegal: '非洲劲旅，小组赛对阵值得留意。',
};

const teamProfileFacts: Record<string, { appearances: number; fixtures: number }> = {
  mexico: { appearances: 17, fixtures: 3 },
  'south-africa': { appearances: 3, fixtures: 3 },
  'korea-republic': { appearances: 11, fixtures: 3 },
  czechia: { appearances: 1, fixtures: 3 },
  canada: { appearances: 2, fixtures: 3 },
  qatar: { appearances: 1, fixtures: 3 },
  switzerland: { appearances: 12, fixtures: 3 },
  bosnia: { appearances: 0, fixtures: 3 },
  brazil: { appearances: 22, fixtures: 3 },
  morocco: { appearances: 6, fixtures: 3 },
  haiti: { appearances: 1, fixtures: 3 },
  scotland: { appearances: 8, fixtures: 3 },
  usa: { appearances: 11, fixtures: 3 },
  paraguay: { appearances: 8, fixtures: 3 },
  australia: { appearances: 6, fixtures: 3 },
  turkey: { appearances: 2, fixtures: 3 },
  germany: { appearances: 20, fixtures: 3 },
  curacao: { appearances: 0, fixtures: 3 },
  'ivory-coast': { appearances: 3, fixtures: 3 },
  ecuador: { appearances: 4, fixtures: 3 },
  netherlands: { appearances: 11, fixtures: 3 },
  japan: { appearances: 7, fixtures: 3 },
  sweden: { appearances: 12, fixtures: 3 },
  tunisia: { appearances: 6, fixtures: 3 },
  belgium: { appearances: 14, fixtures: 3 },
  egypt: { appearances: 3, fixtures: 3 },
  iran: { appearances: 6, fixtures: 3 },
  'new-zealand': { appearances: 2, fixtures: 3 },
  spain: { appearances: 16, fixtures: 3 },
  'cape-verde': { appearances: 0, fixtures: 3 },
  'saudi-arabia': { appearances: 6, fixtures: 3 },
  uruguay: { appearances: 14, fixtures: 3 },
  france: { appearances: 16, fixtures: 3 },
  senegal: { appearances: 3, fixtures: 3 },
  iraq: { appearances: 1, fixtures: 3 },
  norway: { appearances: 3, fixtures: 3 },
  argentina: { appearances: 18, fixtures: 3 },
  algeria: { appearances: 4, fixtures: 3 },
  austria: { appearances: 8, fixtures: 3 },
  jordan: { appearances: 0, fixtures: 3 },
  portugal: { appearances: 8, fixtures: 3 },
  'dr-congo': { appearances: 0, fixtures: 3 },
  uzbekistan: { appearances: 0, fixtures: 3 },
  colombia: { appearances: 6, fixtures: 3 },
  england: { appearances: 16, fixtures: 3 },
  croatia: { appearances: 6, fixtures: 3 },
  ghana: { appearances: 4, fixtures: 3 },
  panama: { appearances: 1, fixtures: 3 },
};

function getProfileDescription(team: Team) {
  const facts = teamProfileFacts[team.id];
  const baseDescription = teamDescriptions[team.id];
  if (!facts) return baseDescription ?? `${team.name} 将参加 2026 世界杯${team.group ? ` ${team.group}` : ''} 小组赛，更多球队资料后续可人工补充。`;

  const history =
    facts.appearances > 0
      ? `历史世界杯参赛 ${facts.appearances} 次。`
      : '此前暂无世界杯正赛参赛记录。';
  const groupInfo = team.group ? `${team.group} 球队` : '参赛球队';
  const scheduleInfo = `2026 年小组赛共有 ${facts.fixtures} 场。`;

  return baseDescription ? `${baseDescription} ${scheduleInfo} ${history}` : `${groupInfo}，${scheduleInfo}${history}`;
}

function withProfile(team: Team): Team {
  if (team.id.startsWith('tbd') || team.id.startsWith('slot-')) return team;

  return {
    ...team,
    nameEn: teamEnglishNames[team.id] ?? team.shortName,
    description: getProfileDescription(team),
    coach: '待补充',
    keyPlayers: [],
    officialUrl: null,
    posterUrl: null,
    profileStatus: 'manual',
    profileLastUpdated: '2026-05-23',
  };
}

const baseTeams: Team[] = [
  { id: 'tbd-home', name: '待确认球队', shortName: 'TBD', color: '#64748b' },
  { id: 'tbd-away', name: '待确认球队', shortName: 'TBD', color: '#64748b' },

  { id: 'mexico', name: '墨西哥', shortName: 'MEX', fifaCode: 'MEX', countryCode: 'MX', flagKey: 'mexico', group: 'A组', color: '#17a56b' },
  { id: 'south-africa', name: '南非', shortName: 'RSA', fifaCode: 'RSA', countryCode: 'ZA', flagKey: 'south-africa', group: 'A组', color: '#16a34a' },
  { id: 'korea-republic', name: '韩国', shortName: 'KOR', fifaCode: 'KOR', countryCode: 'KR', flagKey: 'korea-republic', group: 'A组', color: '#2563eb' },
  { id: 'czechia', name: '捷克', shortName: 'CZE', fifaCode: 'CZE', countryCode: 'CZ', flagKey: 'czechia', group: 'A组', color: '#dc2626' },

  { id: 'canada', name: '加拿大', shortName: 'CAN', fifaCode: 'CAN', countryCode: 'CA', flagKey: 'canada', group: 'B组', color: '#e53935' },
  { id: 'qatar', name: '卡塔尔', shortName: 'QAT', fifaCode: 'QAT', countryCode: 'QA', flagKey: 'qatar', group: 'B组', color: '#7f1d1d' },
  { id: 'switzerland', name: '瑞士', shortName: 'SUI', fifaCode: 'SUI', countryCode: 'CH', flagKey: 'switzerland', group: 'B组', color: '#dc2626' },
  { id: 'bosnia', name: '波黑', shortName: 'BIH', fifaCode: 'BIH', countryCode: 'BA', flagKey: 'bosnia', group: 'B组', color: '#1d4ed8' },

  { id: 'brazil', name: '巴西', shortName: 'BRA', fifaCode: 'BRA', countryCode: 'BR', flagKey: 'brazil', group: 'C组', color: '#22c55e' },
  { id: 'morocco', name: '摩洛哥', shortName: 'MAR', fifaCode: 'MAR', countryCode: 'MA', flagKey: 'morocco', group: 'C组', color: '#b91c1c' },
  { id: 'haiti', name: '海地', shortName: 'HAI', fifaCode: 'HAI', countryCode: 'HT', flagKey: 'haiti', group: 'C组', color: '#1d4ed8' },
  { id: 'scotland', name: '苏格兰', shortName: 'SCO', fifaCode: 'SCO', flagKey: 'scotland', group: 'C组', color: '#2563eb' },

  { id: 'usa', name: '美国', shortName: 'USA', fifaCode: 'USA', countryCode: 'US', flagKey: 'usa', group: 'D组', color: '#2563eb' },
  { id: 'paraguay', name: '巴拉圭', shortName: 'PAR', fifaCode: 'PAR', countryCode: 'PY', flagKey: 'paraguay', group: 'D组', color: '#dc2626' },
  { id: 'australia', name: '澳大利亚', shortName: 'AUS', fifaCode: 'AUS', countryCode: 'AU', flagKey: 'australia', group: 'D组', color: '#facc15' },
  { id: 'turkey', name: '土耳其', shortName: 'TUR', fifaCode: 'TUR', countryCode: 'TR', flagKey: 'turkey', group: 'D组', color: '#dc2626' },

  { id: 'germany', name: '德国', shortName: 'GER', fifaCode: 'GER', countryCode: 'DE', flagKey: 'germany', group: 'E组', color: '#111827' },
  { id: 'curacao', name: '库拉索', shortName: 'CUW', fifaCode: 'CUW', countryCode: 'CW', flagKey: 'curacao', group: 'E组', color: '#0284c7' },
  { id: 'ivory-coast', name: '科特迪瓦', shortName: 'CIV', fifaCode: 'CIV', countryCode: 'CI', flagKey: 'ivory-coast', group: 'E组', color: '#f97316' },
  { id: 'ecuador', name: '厄瓜多尔', shortName: 'ECU', fifaCode: 'ECU', countryCode: 'EC', flagKey: 'ecuador', group: 'E组', color: '#eab308' },

  { id: 'netherlands', name: '荷兰', shortName: 'NED', fifaCode: 'NED', countryCode: 'NL', flagKey: 'netherlands', group: 'F组', color: '#fb923c' },
  { id: 'japan', name: '日本', shortName: 'JPN', fifaCode: 'JPN', countryCode: 'JP', flagKey: 'japan', group: 'F组', color: '#dc2626' },
  { id: 'sweden', name: '瑞典', shortName: 'SWE', fifaCode: 'SWE', countryCode: 'SE', flagKey: 'sweden', group: 'F组', color: '#2563eb' },
  { id: 'tunisia', name: '突尼斯', shortName: 'TUN', fifaCode: 'TUN', countryCode: 'TN', flagKey: 'tunisia', group: 'F组', color: '#dc2626' },

  { id: 'belgium', name: '比利时', shortName: 'BEL', fifaCode: 'BEL', countryCode: 'BE', flagKey: 'belgium', group: 'G组', color: '#facc15' },
  { id: 'egypt', name: '埃及', shortName: 'EGY', fifaCode: 'EGY', countryCode: 'EG', flagKey: 'egypt', group: 'G组', color: '#dc2626' },
  { id: 'iran', name: '伊朗', shortName: 'IRN', fifaCode: 'IRN', countryCode: 'IR', flagKey: 'iran', group: 'G组', color: '#16a34a' },
  { id: 'new-zealand', name: '新西兰', shortName: 'NZL', fifaCode: 'NZL', countryCode: 'NZ', flagKey: 'new-zealand', group: 'G组', color: '#111827' },

  { id: 'spain', name: '西班牙', shortName: 'ESP', fifaCode: 'ESP', countryCode: 'ES', flagKey: 'spain', group: 'H组', color: '#dc2626' },
  { id: 'cape-verde', name: '佛得角', shortName: 'CPV', fifaCode: 'CPV', countryCode: 'CV', flagKey: 'cape-verde', group: 'H组', color: '#2563eb' },
  { id: 'saudi-arabia', name: '沙特阿拉伯', shortName: 'KSA', fifaCode: 'KSA', countryCode: 'SA', flagKey: 'saudi-arabia', group: 'H组', color: '#16a34a' },
  { id: 'uruguay', name: '乌拉圭', shortName: 'URU', fifaCode: 'URU', countryCode: 'UY', flagKey: 'uruguay', group: 'H组', color: '#38bdf8' },

  { id: 'france', name: '法国', shortName: 'FRA', fifaCode: 'FRA', countryCode: 'FR', flagKey: 'france', group: 'I组', color: '#1d4ed8' },
  { id: 'senegal', name: '塞内加尔', shortName: 'SEN', fifaCode: 'SEN', countryCode: 'SN', flagKey: 'senegal', group: 'I组', color: '#16a34a' },
  { id: 'iraq', name: '伊拉克', shortName: 'IRQ', fifaCode: 'IRQ', countryCode: 'IQ', flagKey: 'iraq', group: 'I组', color: '#dc2626' },
  { id: 'norway', name: '挪威', shortName: 'NOR', fifaCode: 'NOR', countryCode: 'NO', flagKey: 'norway', group: 'I组', color: '#2563eb' },

  { id: 'argentina', name: '阿根廷', shortName: 'ARG', fifaCode: 'ARG', countryCode: 'AR', flagKey: 'argentina', group: 'J组', color: '#38bdf8' },
  { id: 'algeria', name: '阿尔及利亚', shortName: 'ALG', fifaCode: 'ALG', countryCode: 'DZ', flagKey: 'algeria', group: 'J组', color: '#16a34a' },
  { id: 'austria', name: '奥地利', shortName: 'AUT', fifaCode: 'AUT', countryCode: 'AT', flagKey: 'austria', group: 'J组', color: '#dc2626' },
  { id: 'jordan', name: '约旦', shortName: 'JOR', fifaCode: 'JOR', countryCode: 'JO', flagKey: 'jordan', group: 'J组', color: '#16a34a' },

  { id: 'portugal', name: '葡萄牙', shortName: 'POR', fifaCode: 'POR', countryCode: 'PT', flagKey: 'portugal', group: 'K组', color: '#dc2626' },
  { id: 'dr-congo', name: '民主刚果', shortName: 'COD', fifaCode: 'COD', countryCode: 'CD', flagKey: 'dr-congo', group: 'K组', color: '#2563eb' },
  { id: 'uzbekistan', name: '乌兹别克斯坦', shortName: 'UZB', fifaCode: 'UZB', countryCode: 'UZ', flagKey: 'uzbekistan', group: 'K组', color: '#0284c7' },
  { id: 'colombia', name: '哥伦比亚', shortName: 'COL', fifaCode: 'COL', countryCode: 'CO', flagKey: 'colombia', group: 'K组', color: '#facc15' },

  { id: 'england', name: '英格兰', shortName: 'ENG', fifaCode: 'ENG', flagKey: 'england', group: 'L组', color: '#dc2626' },
  { id: 'croatia', name: '克罗地亚', shortName: 'CRO', fifaCode: 'CRO', countryCode: 'HR', flagKey: 'croatia', group: 'L组', color: '#dc2626' },
  { id: 'ghana', name: '加纳', shortName: 'GHA', fifaCode: 'GHA', countryCode: 'GH', flagKey: 'ghana', group: 'L组', color: '#facc15' },
  { id: 'panama', name: '巴拿马', shortName: 'PAN', fifaCode: 'PAN', countryCode: 'PA', flagKey: 'panama', group: 'L组', color: '#2563eb' },

  { id: 'slot-a1', name: 'A组第一', shortName: 'A1', group: 'A组', color: '#1177d6' },
  { id: 'slot-a2', name: 'A组第二', shortName: 'A2', group: 'A组', color: '#25b96f' },
  { id: 'slot-b1', name: 'B组第一', shortName: 'B1', group: 'B组', color: '#ff9f43' },
  { id: 'slot-b2', name: 'B组第二', shortName: 'B2', group: 'B组', color: '#32245f' },
  { id: 'slot-w73', name: '第73场胜者', shortName: 'W73', color: '#1177d6' },
  { id: 'slot-w74', name: '第74场胜者', shortName: 'W74', color: '#25b96f' },
];

export const teams: Team[] = baseTeams.map(withProfile);

export const teamById = Object.fromEntries(teams.map((team) => [team.id, team])) as Record<string, Team>;
