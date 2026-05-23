export type TournamentStage =
  | '小组赛'
  | '32强'
  | '16强'
  | '8强'
  | '半决赛'
  | '三四名决赛'
  | '决赛';

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type MatchTag = '重点' | '推荐' | '普通';

export type DataStatus = 'official' | 'pending' | 'mock';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  group?: string;
  flagKey?: string;
  fifaCode?: string;
  countryCode?: string;
  color: string;
}

export interface Match {
  id: string;
  matchNo: number;
  date: string;
  time: string;
  stage: TournamentStage;
  group?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchStatus: MatchStatus;
  city: string;
  stadium: string;
  note: string;
  tag: MatchTag;
  matchInfoStatus: DataStatus;
  resultStatus: 'pending' | 'official';
  advancementStatus: 'pending' | 'confirmed' | 'not_applicable';
  source: string;
  lastUpdated: string;
}

export interface BracketSlot {
  id: string;
  teamId?: string | null;
  label: string;
  status: 'pending' | 'confirmed';
  dataStatus: 'pending' | 'official';
}

export interface BracketMatch {
  id: string;
  title: string;
  round: TournamentStage | '冠军';
  date?: string;
  homeSlot: BracketSlot;
  awaySlot: BracketSlot;
  matchId?: string;
  winnerTeamId: string | null;
  status: 'pending' | 'confirmed';
  dataStatus: 'pending' | 'official';
  note: string;
}

export type BracketNode = BracketMatch;

export interface BracketRound {
  stage: TournamentStage | '冠军';
  matches: BracketMatch[];
}

