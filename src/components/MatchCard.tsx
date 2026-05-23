import { Clock, Database, MapPin, Trophy } from 'lucide-react';
import type { DataStatus, Match } from '../types';
import { getTeamById } from '../services/worldCupData';
import { formatChineseDate } from '../utils/date';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  onOpen: (match: Match) => void;
}

export function MatchCard({ match, compact = false, onOpen }: MatchCardProps) {
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const score =
    match.status === '未开始' || match.homeScore == null || match.awayScore == null
      ? '待确认'
      : `${match.homeScore} : ${match.awayScore}`;

  return (
    <button
      type="button"
      onClick={() => onOpen(match)}
      className="group flex h-full min-h-[190px] flex-col rounded-[8px] border border-white bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-summer-sky hover:shadow-card"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-black uppercase text-summer-blue">Match {match.matchNo}</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black">{match.stage}</h3>
            {match.group && <span className="rounded-[6px] bg-slate-100 px-2 py-1 text-xs font-black">{match.group}</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-[6px] bg-summer-lime px-2 py-1 text-xs font-black text-[#17331d]">{match.tag}</span>
          <DataStatusBadge status={match.dataStatus} />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock name={homeTeam?.name ?? 'TBD'} shortName={homeTeam?.shortName ?? 'TBD'} align="left" />
        <div className="rounded-[8px] bg-[#172033] px-3 py-2 text-center text-sm font-black text-white">{score}</div>
        <TeamBlock name={awayTeam?.name ?? 'TBD'} shortName={awayTeam?.shortName ?? 'TBD'} align="right" />
      </div>

      <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600">
        <p className="flex items-center gap-2">
          <Clock size={16} className="shrink-0 text-summer-orange" />
          <span>北京时间 {formatChineseDate(match.date)} {match.time}</span>
        </p>
        {!compact && (
          <p className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-summer-grass" />
            <span className="truncate">{match.city} · {match.stadium}</span>
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="inline-flex items-center gap-1 text-xs font-black text-slate-500">
          <Trophy size={14} /> {match.status}
        </span>
        <span className="text-sm font-black text-summer-blue transition group-hover:translate-x-0.5">详情</span>
      </div>
    </button>
  );
}

export function DataStatusBadge({ status }: { status: DataStatus }) {
  const label = {
    official: '官方',
    pending: '待确认',
    mock: '示例',
  }[status];

  const className = {
    official: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    mock: 'bg-slate-100 text-slate-600',
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-xs font-black ${className}`}>
      <Database size={12} />
      {label}
    </span>
  );
}

function TeamBlock({ name, shortName, align }: { name: string; shortName: string; align: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'min-w-0 text-right' : 'min-w-0 text-left'}>
      <span className="block truncate text-base font-black sm:text-lg">{name}</span>
      <span className="mt-1 block text-xs font-bold text-slate-400">{shortName}</span>
    </div>
  );
}
