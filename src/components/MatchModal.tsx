import { ExternalLink, Star, X } from 'lucide-react';
import type { Match, Team } from '../types';
import { getTeamById } from '../services/worldCupData';
import { formatChineseDate } from '../utils/date';
import {
  getAdvancementStatusLabel,
  getMatchInfoStatusLabel,
  getMatchStatusLabel,
  getResultLabel,
  getResultStatusLabel,
} from '../utils/matchStatus';
import { DataStatusBadge } from './MatchCard';
import { TeamMark } from './TeamIdentity';

interface MatchModalProps {
  match: Match | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (matchId: string) => void;
  onOpenTeam?: (team: Team) => void;
}

export function MatchModal({ match, onClose, isFavorite = false, onToggleFavorite, onOpenTeam }: MatchModalProps) {
  if (!match) return null;

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const score = getResultLabel(match);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#07111f]/[0.72] p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[8px] bg-white shadow-card sm:rounded-[8px]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase text-summer-blue">Match {match.matchNo}</p>
            <h2 className="text-xl font-black">比赛详情</h2>
          </div>
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                type="button"
                aria-label={isFavorite ? '取消收藏比赛' : '收藏比赛'}
                aria-pressed={isFavorite}
                onClick={() => onToggleFavorite(match.id)}
                className={[
                  'flex h-11 w-11 items-center justify-center rounded-[8px] border transition',
                  isFavorite
                    ? 'border-summer-orange/40 bg-summer-orange text-[#271527]'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-summer-orange hover:text-summer-orange',
                ].join(' ')}
              >
                <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
            <button
              type="button"
              aria-label="关闭弹窗"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-[8px] bg-[#172033] p-5 text-white">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <ModalTeam team={homeTeam} name={homeTeam?.name ?? '待确认'} shortName={homeTeam?.shortName ?? 'TBD'} onOpenTeam={onOpenTeam} />
              <div className="rounded-[8px] bg-white px-4 py-3 text-center text-lg font-black text-[#172033]">{score}</div>
              <ModalTeam team={awayTeam} name={awayTeam?.name ?? '待确认'} shortName={awayTeam?.shortName ?? 'TBD'} alignRight onOpenTeam={onOpenTeam} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info label="比赛时间" value={`${formatChineseDate(match.date)} ${match.time} 北京时间`} />
            <Info label="比赛阶段" value={`${match.stage}${match.group ? ` · ${match.group}` : ''}`} />
            <Info label="比赛地点" value={`${match.city} · ${match.stadium}`} />
            <Info label="比赛状态" value={getMatchStatusLabel(match.matchStatus)} />
            <Info label="重点标签" value={match.tag} />
            <Info label="更新时间" value={match.lastUpdated} />
          </div>

          <div className="mt-5 rounded-[8px] border border-slate-100 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-black">数据状态</h3>
              <DataStatusBadge status={match.matchInfoStatus} />
            </div>
            <div className="mb-3 grid gap-2 text-xs font-bold text-slate-500 sm:grid-cols-3">
              <span>赛程信息：{getMatchInfoStatusLabel(match.matchInfoStatus)}</span>
              <span>比分结果：{getResultStatusLabel(match.resultStatus)}</span>
              <span>晋级状态：{getAdvancementStatusLabel(match.advancementStatus)}</span>
            </div>
            <p className="text-sm leading-6 text-slate-600">{match.note}</p>
            <a
              href={match.source}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-[8px] bg-[#172033] px-3 py-2 text-sm font-black text-white transition hover:bg-summer-blue"
            >
              前往官方赛程核对
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalTeam({
  team,
  name,
  shortName,
  alignRight = false,
  onOpenTeam,
}: {
  team?: ReturnType<typeof getTeamById>;
  name: string;
  shortName: string;
  alignRight?: boolean;
  onOpenTeam?: (team: Team) => void;
}) {
  const canOpen = Boolean(team && onOpenTeam && !team.id.startsWith('tbd') && !team.id.startsWith('slot-'));

  return (
    <button
      type="button"
      disabled={!canOpen}
      onClick={() => {
        if (team && canOpen) onOpenTeam?.(team);
      }}
      className={[
        alignRight ? 'flex min-w-0 flex-col items-end text-right' : 'flex min-w-0 flex-col items-start',
        canOpen ? 'rounded-[8px] outline-none transition hover:text-summer-lime focus-visible:ring-2 focus-visible:ring-summer-lime' : 'cursor-default',
      ].join(' ')}
    >
      <TeamMark team={team} size="lg" />
      <span className="mt-2 block max-w-full truncate text-xl font-black sm:text-2xl">{name}</span>
      <span className="mt-1 block text-xs font-bold text-white/[0.62]">{shortName}</span>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
