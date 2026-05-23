import type { Team } from '../types';

export const teams: Team[] = [
  { id: 'tbd-home', name: '待确认球队', shortName: 'TBD', flagEmoji: 'TBD', color: '#64748b' },
  { id: 'tbd-away', name: '待确认球队', shortName: 'TBD', flagEmoji: 'TBD', color: '#64748b' },
  { id: 'slot-a1', name: 'A组第一', shortName: 'A1', group: 'A组', flagEmoji: 'A1', color: '#1177d6' },
  { id: 'slot-a2', name: 'A组第二', shortName: 'A2', group: 'A组', flagEmoji: 'A2', color: '#25b96f' },
  { id: 'slot-b1', name: 'B组第一', shortName: 'B1', group: 'B组', flagEmoji: 'B1', color: '#ff9f43' },
  { id: 'slot-b2', name: 'B组第二', shortName: 'B2', group: 'B组', flagEmoji: 'B2', color: '#32245f' },
  { id: 'slot-c1', name: 'C组第一', shortName: 'C1', group: 'C组', flagEmoji: 'C1', color: '#1177d6' },
  { id: 'slot-d2', name: 'D组第二', shortName: 'D2', group: 'D组', flagEmoji: 'D2', color: '#25b96f' },
  { id: 'slot-e1', name: 'E组第一', shortName: 'E1', group: 'E组', flagEmoji: 'E1', color: '#ff9f43' },
  { id: 'slot-f2', name: 'F组第二', shortName: 'F2', group: 'F组', flagEmoji: 'F2', color: '#32245f' },
  { id: 'slot-w49', name: '第49场胜者', shortName: 'W49', flagEmoji: 'W49', color: '#1177d6' },
  { id: 'slot-w50', name: '第50场胜者', shortName: 'W50', flagEmoji: 'W50', color: '#25b96f' },
  { id: 'slot-w73', name: '第73场胜者', shortName: 'W73', flagEmoji: 'W73', color: '#ff9f43' },
  { id: 'slot-w74', name: '第74场胜者', shortName: 'W74', flagEmoji: 'W74', color: '#32245f' },
  { id: 'slot-champion', name: '冠军待诞生', shortName: 'TBD', flagEmoji: 'TBD', color: '#172033' },
];

export const teamById = Object.fromEntries(teams.map((team) => [team.id, team])) as Record<string, Team>;
