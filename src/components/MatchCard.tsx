import { Clock, Database, MapPin, Star, Trophy } from 'lucide-react';
import type { DataStatus, Match, Team } from '../types';
import { getTeamById } from '../services/worldCupData';
import { formatChineseDate } from '../utils/date';
import { getMatchStatusLabel, getResultLabel } from '../utils/matchStatus';
import { TeamMark } from './TeamIdentity';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  onOpen: (match: Match) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (matchId: string) => void;
  onOpenTeam?: (team: Team) => void;
}

export function MatchCard({ match, compact = false, onOpen, isFavorite = false, onToggleFavorite, onOpenTeam }: MatchCardProps) {
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const score = getResultLabel(match);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(match)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(match);
        }
      }}
      className="match-card group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[8px] border border-summer-sky/25 bg-[#fbfdff]/[0.96] p-4 text-left shadow-[0_10px_28px_rgba(23,32,51,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:border-summer-sky hover:bg-white hover:shadow-card"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-black uppercase text-summer-blue">Match {match.matchNo}</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black">{match.stage}</h3>
            {match.group && <span className="rounded-[6px] bg-slate-100 px-2 py-1 text-xs font-black">{match.group}</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-start">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(match.id);
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
              aria-label={isFavorite ? '取消收藏比赛' : '收藏比赛'}
              aria-pressed={isFavorite}
              className={[
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border transition',
                isFavorite
                  ? 'border-summer-orange/40 bg-summer-orange text-[#271527]'
                  : 'border-slate-200 bg-white text-slate-400 hover:border-summer-orange hover:text-summer-orange',
              ].join(' ')}
            >
              <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <TeamBlock team={homeTeam} name={homeTeam?.name ?? '待确认'} shortName={homeTeam?.shortName ?? 'TBD'} align="left" onOpenTeam={onOpenTeam} />
        <div className="rounded-[8px] bg-[#172033] px-3 py-2 text-center text-sm font-black text-white">{score}</div>
        <TeamBlock team={awayTeam} name={awayTeam?.name ?? '待确认'} shortName={awayTeam?.shortName ?? 'TBD'} align="right" onOpenTeam={onOpenTeam} />
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
          <Trophy size={14} /> {getMatchStatusLabel(match.matchStatus)}
        </span>
        <span className="text-sm font-black text-summer-blue transition group-hover:translate-x-0.5">详情</span>
      </div>
    </article>
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

function TeamBlock({
  team,
  name,
  shortName,
  align,
  onOpenTeam,
}: {
  team?: ReturnType<typeof getTeamById>;
  name: string;
  shortName: string;
  align: 'left' | 'right';
  onOpenTeam?: (team: Team) => void;
}) {
  const canOpen = Boolean(team && onOpenTeam && !team.id.startsWith('tbd') && !team.id.startsWith('slot-'));

  return (
    <button
      type="button"
      disabled={!canOpen}
      onClick={(event) => {
        event.stopPropagation();
        if (team && canOpen) onOpenTeam?.(team);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
      className={[
        align === 'right' ? 'flex min-w-0 items-center justify-end gap-2 text-right' : 'flex min-w-0 items-center gap-2 text-left',
        canOpen ? 'rounded-[8px] outline-none transition hover:text-summer-blue focus-visible:ring-2 focus-visible:ring-summer-sky' : 'cursor-default',
      ].join(' ')}
    >
      {align === 'left' && <TeamMark team={team} size="sm" />}
      <span className="min-w-0">
        <span className="block truncate text-sm font-black sm:text-base">{name}</span>
        <span className="mt-1 block text-xs font-bold text-slate-400">{shortName}</span>
      </span>
      {align === 'right' && <TeamMark team={team} size="sm" />}
    </button>
  );
}
