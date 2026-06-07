import { useEffect, useState } from 'react';
import { CalendarDays, Clock, ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import type { Match, Team } from '../types';
import { getTeamById } from '../services/worldCupData';
import { formatChineseDate, getCountdownParts } from '../utils/date';
import { getMatchStatusLabel } from '../utils/matchStatus';
import { TeamMark } from './TeamIdentity';

interface HeroProps {
  nextMatch?: Match;
  onNavigate: (view: 'schedule' | 'bracket' | 'sources') => void;
  onOpenMatch: (match: Match) => void;
  onOpenTeam: (team: Team) => void;
}

export function Hero({ nextMatch, onNavigate, onOpenMatch, onOpenTeam }: HeroProps) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(nextMatch));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(nextMatch));
    }, 1000 * 30);

    return () => window.clearInterval(timer);
  }, [nextMatch]);

  const homeTeam = nextMatch ? getTeamById(nextMatch.homeTeamId) : undefined;
  const awayTeam = nextMatch ? getTeamById(nextMatch.awayTeamId) : undefined;

  return (
    <header className="hero-scene relative overflow-hidden px-4 pb-12 pt-4 text-white sm:px-6 sm:pb-16 sm:pt-6 lg:px-8 lg:pb-16">
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e6f1f7] to-transparent sm:h-32" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/[0.86] via-[#07111f]/[0.46] to-[#07111f]/[0.14]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/[0.36] via-transparent to-[#32245f]/[0.26]" />

      <div className="relative z-10 mx-auto flex min-h-[400px] w-full max-w-7xl flex-col justify-start gap-8 sm:min-h-[480px] sm:gap-10 lg:min-h-[410px] lg:gap-8 xl:min-h-[440px] xl:gap-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white text-summer-blue shadow-glow sm:h-10 sm:w-10">
              <CalendarDays size={16} className="sm:size-[20px]" />
            </span>
            <span className="font-black text-sm sm:text-base">世界杯赛程·2026</span>
          </div>
          <span className="hidden rounded-[8px] border border-white/[0.35] bg-white/[0.12] px-2 py-1.5 text-xs font-bold backdrop-blur sm:px-3 sm:py-2 sm:text-sm sm:inline">
            北京时间 · 中文赛程
          </span>
        </nav>

        <div className="grid items-end gap-6 sm:grid-cols-[1fr_320px] lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-white/40 bg-white/[0.16] px-2 py-1.5 text-xs font-bold backdrop-blur sm:px-3 sm:py-2 sm:text-sm">
              <ShieldCheck size={14} className="text-summer-lime sm:size-[16px]" />
              为中文用户整理的世界杯赛程查看网站
            </div>

            <h1 className="text-2xl font-black leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl">
              2026 世界杯赛程日历
            </h1>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
              <HeroButton label="全部赛程" onClick={() => onNavigate('schedule')} />
              <HeroButton label="晋级树" onClick={() => onNavigate('bracket')} />
              <HeroButton label="官方来源" onClick={() => onNavigate('sources')} />
            </div>
          </div>

          <aside className="rounded-[8px] border border-white/[0.45] bg-[#14162d]/[0.58] p-3 shadow-glow backdrop-blur-xl sm:p-5">
            <p className="mb-2 text-xs font-bold text-summer-lime sm:mb-3 sm:text-sm">下一场重点比赛</p>
            {nextMatch && homeTeam && awayTeam ? (
              <>
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenMatch(nextMatch)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onOpenMatch(nextMatch);
                    }
                  }}
                  className="block w-full rounded-[8px] bg-white/[0.08] p-3 text-left transition hover:bg-white/[0.14] sm:p-4"
                >
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <TeamName team={homeTeam} name={homeTeam.name} shortName={homeTeam.shortName} onOpenTeam={onOpenTeam} />
                    <span className="rounded-[8px] bg-white px-2 py-1.5 text-xs font-black text-[#172033] sm:px-3 sm:py-2 sm:text-sm">
                      {getMatchStatusLabel(nextMatch.matchStatus)}
                    </span>
                    <TeamName team={awayTeam} name={awayTeam.name} shortName={awayTeam.shortName} alignRight onOpenTeam={onOpenTeam} />
                  </div>
                </article>

                <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
                  {[
                    ['天', countdown.days],
                    ['小时', countdown.hours],
                    ['分钟', countdown.minutes],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[8px] bg-white/[0.14] p-2 text-center sm:p-3">
                      <span className="block text-xl font-black sm:text-3xl">{value}</span>
                      <span className="text-[11px] font-bold text-white/[0.66] sm:text-xs">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 space-y-1.5 text-xs font-semibold text-white/[0.78] sm:mt-4 sm:space-y-2 sm:text-sm">
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="sm:size-[16px]" /> 北京时间 {formatChineseDate(nextMatch.date)} {nextMatch.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="sm:size-[16px]" /> {nextMatch.city} · {nextMatch.stadium}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-white/[0.74]">暂无未来重点比赛，更新本地赛程数据后这里会自动显示。</p>
            )}
          </aside>
        </div>
      </div>
    </header>
  );
}

function HeroButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[8px] bg-white px-2 py-1.5 text-xs font-black text-[#172033] transition hover:-translate-y-0.5 hover:bg-summer-lime sm:min-h-11 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
    >
      {label}
      <ExternalLink size={13} className="sm:size-[15px]" />
    </button>
  );
}

function TeamName({
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
  onOpenTeam: (team: Team) => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        if (team) onOpenTeam(team);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
      className={[
        alignRight ? 'flex min-w-0 items-center justify-end gap-2 text-right' : 'flex min-w-0 items-center gap-2',
        'rounded-[8px] outline-none transition hover:text-summer-lime focus-visible:ring-2 focus-visible:ring-summer-lime',
      ].join(' ')}
    >
      {!alignRight && <TeamMark team={team} size="sm" />}
      <span className="min-w-0">
        <span className="block truncate text-base font-black sm:text-xl">{name}</span>
        <span className="mt-0.5 block text-[11px] font-bold text-white/[0.62] sm:mt-1 sm:text-xs">{shortName}</span>
      </span>
      {alignRight && <TeamMark team={team} size="sm" />}
    </button>
  );
}
