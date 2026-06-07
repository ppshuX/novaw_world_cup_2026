import { ExternalLink, ShieldCheck, X } from 'lucide-react';
import type { Team } from '../types';
import { TeamMark } from './TeamIdentity';

interface TeamProfileModalProps {
  team: Team | null;
  onClose: () => void;
}

const profileStatusLabel = {
  official: '官方确认',
  pending: '待补充',
  manual: '人工维护',
};

export function TeamProfileModal({ team, onClose }: TeamProfileModalProps) {
  if (!team) return null;

  const starPlayers = team.starPlayers?.filter((player) => player && player !== '待补充') ?? [];
  const hasOfficialUrl = Boolean(team.officialUrl);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#07111f]/[0.72] p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[8px] bg-white shadow-card sm:rounded-[8px]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <TeamMark team={team} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-summer-blue">Team Profile</p>
              <h2 className="truncate text-xl font-black">{team.name}</h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="关闭球队名片"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <div className="overflow-hidden rounded-[8px] bg-[#172033] text-white">
            {team.posterUrl ? (
              <img src={team.posterUrl} alt={`${team.name}球队图片`} className="h-36 w-full object-cover sm:h-44" />
            ) : (
              <div
                className="relative min-h-32 p-4 sm:min-h-44 sm:p-5"
                style={{
                  background: `linear-gradient(135deg, #172033 0%, ${team.color} 48%, #25b96f 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(255,159,67,0.26),transparent_34%)]" />
                <div className="relative flex h-full min-h-36 flex-col justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <TeamMark team={team} size="lg" />
                    {team.group && <span className="rounded-[6px] bg-white/18 px-2 py-1 text-xs font-black">{team.group}</span>}
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase text-white/70 sm:text-xs">Team Profile</p>
                    <p className="mt-1 text-2xl font-black sm:text-3xl">{team.name}</p>
                    <p className="text-xs font-bold text-white/72 sm:text-sm">{team.nameEn ?? team.shortName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
            <Info label="英文名" value={team.nameEn ?? '待补充'} />
            <Info label="缩写" value={team.shortName} />
            <Info label="所属小组" value={team.group ?? '待确认'} />
          </div>

          <section className="mt-4 rounded-[8px] border border-slate-100 bg-slate-50 p-3 sm:mt-5 sm:p-4">
            <h3 className="font-black text-sm sm:text-base">一句话简介</h3>
            <p className="mt-1.5 text-xs font-semibold leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">{team.description ?? '球队资料待补充。'}</p>
          </section>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3">
            <section className="rounded-[8px] border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <p className="text-[11px] font-black uppercase text-slate-400 sm:text-xs">主教练</p>
              <p className="mt-1.5 text-sm font-black sm:mt-2">{team.coach || '待补充'}</p>
            </section>

            <section className="rounded-[8px] border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <p className="text-[11px] font-black uppercase text-slate-400 sm:text-xs">代表球星</p>
              {starPlayers.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {starPlayers.slice(0, 5).map((player) => (
                    <span key={player} className="rounded-[6px] bg-white px-2 py-1 text-xs font-black text-slate-700">
                      {player}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 font-black text-slate-700">代表球星待补充</p>
              )}
            </section>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            {hasOfficialUrl ? (
              <a
                href={team.officialUrl ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[8px] bg-[#172033] px-3 py-1.5 text-xs font-black text-white transition hover:bg-summer-blue sm:min-h-11 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                官方球队资料
                <ExternalLink size={13} className="sm:size-[15px]" />
              </a>
            ) : (
              <span className="inline-flex min-h-9 items-center justify-center rounded-[8px] bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500 sm:min-h-11 sm:px-4 sm:py-2 sm:text-sm">
                官方资料待补充
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 sm:gap-2 sm:text-xs">
              <ShieldCheck size={13} className="sm:size-[15px]" />
              资料状态：{profileStatusLabel[team.profileStatus ?? 'pending']}
            </span>
          </div>

          <p className="mt-3 text-[11px] font-semibold leading-5 text-slate-500 sm:mt-4 sm:text-xs">
            代表球星用于快速识别球队，不等同于官方最终名单或首发预测；球队资料由本地人工维护，当前不维护完整球员名单。
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-100 bg-slate-50 p-2 sm:p-3">
      <p className="text-[11px] font-black uppercase text-slate-400 sm:text-xs">{label}</p>
      <p className="mt-0.5 truncate text-sm font-black sm:mt-1">{value}</p>
    </div>
  );
}
