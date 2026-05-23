import type { Team } from '../types';

export const teams: Team[] = [
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

export const teamById = Object.fromEntries(teams.map((team) => [team.id, team])) as Record<string, Team>;
