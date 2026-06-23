import type { BracketRound } from '../types';

const pendingSlot = (id: string, label: string) => ({
  id,
  label,
  teamId: null,
  status: 'pending' as const,
  dataStatus: 'pending' as const,
});

export const bracketRounds: BracketRound[] = [
  // ─── 32 强 (16 场) ────────────────────────────────────
  {
    stage: '32强',
    matches: [
      { id: 'r32-1', title: '第73场', round: '32强', date: '2026-06-29', matchId: 'm073', homeSlot: pendingSlot('r32-1-home', 'A组第一'), awaySlot: pendingSlot('r32-1-away', 'D组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-2', title: '第74场', round: '32强', date: '2026-06-29', matchId: 'm074', homeSlot: pendingSlot('r32-2-home', 'B组第一'), awaySlot: pendingSlot('r32-2-away', 'E组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-3', title: '第75场', round: '32强', date: '2026-06-29', matchId: 'm075', homeSlot: pendingSlot('r32-3-home', 'C组第一'), awaySlot: pendingSlot('r32-3-away', 'F组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-4', title: '第76场', round: '32强', date: '2026-06-30', matchId: 'm076', homeSlot: pendingSlot('r32-4-home', 'D组第一'), awaySlot: pendingSlot('r32-4-away', 'G组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-5', title: '第77场', round: '32强', date: '2026-06-30', matchId: 'm077', homeSlot: pendingSlot('r32-5-home', 'E组第一'), awaySlot: pendingSlot('r32-5-away', 'H组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-6', title: '第78场', round: '32强', date: '2026-06-30', matchId: 'm078', homeSlot: pendingSlot('r32-6-home', 'F组第一'), awaySlot: pendingSlot('r32-6-away', 'I组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-7', title: '第79场', round: '32强', date: '2026-07-01', matchId: 'm079', homeSlot: pendingSlot('r32-7-home', 'G组第一'), awaySlot: pendingSlot('r32-7-away', 'J组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-8', title: '第80场', round: '32强', date: '2026-07-01', matchId: 'm080', homeSlot: pendingSlot('r32-8-home', 'H组第一'), awaySlot: pendingSlot('r32-8-away', 'K组第三'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-9', title: '第81场', round: '32强', date: '2026-07-01', matchId: 'm081', homeSlot: pendingSlot('r32-9-home', 'A组第二'), awaySlot: pendingSlot('r32-9-away', 'B组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-10', title: '第82场', round: '32强', date: '2026-07-02', matchId: 'm082', homeSlot: pendingSlot('r32-10-home', 'C组第二'), awaySlot: pendingSlot('r32-10-away', 'D组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-11', title: '第83场', round: '32强', date: '2026-07-02', matchId: 'm083', homeSlot: pendingSlot('r32-11-home', 'E组第二'), awaySlot: pendingSlot('r32-11-away', 'F组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-12', title: '第84场', round: '32强', date: '2026-07-02', matchId: 'm084', homeSlot: pendingSlot('r32-12-home', 'G组第二'), awaySlot: pendingSlot('r32-12-away', 'H组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-13', title: '第85场', round: '32强', date: '2026-07-03', matchId: 'm085', homeSlot: pendingSlot('r32-13-home', 'I组第二'), awaySlot: pendingSlot('r32-13-away', 'J组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-14', title: '第86场', round: '32强', date: '2026-07-03', matchId: 'm086', homeSlot: pendingSlot('r32-14-home', 'K组第二'), awaySlot: pendingSlot('r32-14-away', 'L组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-15', title: '第87场', round: '32强', date: '2026-07-03', matchId: 'm087', homeSlot: pendingSlot('r32-15-home', 'A组第一'), awaySlot: pendingSlot('r32-15-away', 'C组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r32-16', title: '第88场', round: '32强', date: '2026-07-04', matchId: 'm088', homeSlot: pendingSlot('r32-16-home', 'B组第一'), awaySlot: pendingSlot('r32-16-away', 'D组第二'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
    ],
  },
  // ─── 16 强 (8 场) ─────────────────────────────────────
  {
    stage: '16强',
    matches: [
      { id: 'r16-1', title: '第89场', round: '16强', date: '2026-07-05', matchId: 'm089', homeSlot: pendingSlot('r16-1-home', '第73场胜者'), awaySlot: pendingSlot('r16-1-away', '第74场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r16-2', title: '第90场', round: '16强', date: '2026-07-05', matchId: 'm090', homeSlot: pendingSlot('r16-2-home', '第75场胜者'), awaySlot: pendingSlot('r16-2-away', '第76场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r16-3', title: '第91场', round: '16强', date: '2026-07-06', matchId: 'm091', homeSlot: pendingSlot('r16-3-home', '第77场胜者'), awaySlot: pendingSlot('r16-3-away', '第78场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r16-4', title: '第92场', round: '16强', date: '2026-07-06', matchId: 'm092', homeSlot: pendingSlot('r16-4-home', '第79场胜者'), awaySlot: pendingSlot('r16-4-away', '第80场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r16-5', title: '第93场', round: '16强', date: '2026-07-07', matchId: 'm093', homeSlot: pendingSlot('r16-5-home', '第81场胜者'), awaySlot: pendingSlot('r16-5-away', '第82场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r16-6', title: '第94场', round: '16强', date: '2026-07-07', matchId: 'm094', homeSlot: pendingSlot('r16-6-home', '第83场胜者'), awaySlot: pendingSlot('r16-6-away', '第84场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r16-7', title: '第95场', round: '16强', date: '2026-07-08', matchId: 'm095', homeSlot: pendingSlot('r16-7-home', '第85场胜者'), awaySlot: pendingSlot('r16-7-away', '第86场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'r16-8', title: '第96场', round: '16强', date: '2026-07-08', matchId: 'm096', homeSlot: pendingSlot('r16-8-home', '第87场胜者'), awaySlot: pendingSlot('r16-8-away', '第88场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
    ],
  },
  // ─── 8 强 (4 场) ──────────────────────────────────────
  {
    stage: '8强',
    matches: [
      { id: 'qf-1', title: '第97场', round: '8强', date: '2026-07-11', matchId: 'm097', homeSlot: pendingSlot('qf-1-home', '第89场胜者'), awaySlot: pendingSlot('qf-1-away', '第90场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'qf-2', title: '第98场', round: '8强', date: '2026-07-11', matchId: 'm098', homeSlot: pendingSlot('qf-2-home', '第91场胜者'), awaySlot: pendingSlot('qf-2-away', '第92场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'qf-3', title: '第99场', round: '8强', date: '2026-07-12', matchId: 'm099', homeSlot: pendingSlot('qf-3-home', '第93场胜者'), awaySlot: pendingSlot('qf-3-away', '第94场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'qf-4', title: '第100场', round: '8强', date: '2026-07-12', matchId: 'm100', homeSlot: pendingSlot('qf-4-home', '第95场胜者'), awaySlot: pendingSlot('qf-4-away', '第96场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
    ],
  },
  // ─── 半决赛 (2 场) ────────────────────────────────────
  {
    stage: '半决赛',
    matches: [
      { id: 'sf-1', title: '第101场', round: '半决赛', date: '2026-07-15', matchId: 'm101', homeSlot: pendingSlot('sf-1-home', '第97场胜者'), awaySlot: pendingSlot('sf-1-away', '第98场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
      { id: 'sf-2', title: '第102场', round: '半决赛', date: '2026-07-16', matchId: 'm102', homeSlot: pendingSlot('sf-2-home', '第99场胜者'), awaySlot: pendingSlot('sf-2-away', '第100场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
    ],
  },
  // ─── 三四名决赛 ────────────────────────────────────────
  {
    stage: '三四名决赛',
    matches: [
      { id: 'tp-1', title: '第103场', round: '三四名决赛', date: '2026-07-19', matchId: 'm103', homeSlot: pendingSlot('tp-1-home', '第101场负者'), awaySlot: pendingSlot('tp-1-away', '第102场负者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
    ],
  },
  // ─── 决赛 ──────────────────────────────────────────────
  {
    stage: '决赛',
    matches: [
      { id: 'final', title: '第104场', round: '决赛', date: '2026-07-20', matchId: 'm104', homeSlot: pendingSlot('final-home', '第101场胜者'), awaySlot: pendingSlot('final-away', '第102场胜者'), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
    ],
  },
  // ─── 冠军 ──────────────────────────────────────────────
  {
    stage: '冠军',
    matches: [
      { id: 'champion', title: '冠军待诞生', round: '冠军', homeSlot: pendingSlot('champion-home', '决赛胜者'), awaySlot: pendingSlot('champion-away', ''), winnerTeamId: null, status: 'pending', dataStatus: 'pending', note: '' },
    ],
  },
];
