import { useEffect, useState } from 'react';
import { CalendarDays, Clock, ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import type { Match } from '../types';
import { getTeamById } from '../services/worldCupData';
import { formatChineseDate, getCountdownParts } from '../utils/date';

interface HeroProps {
  nextMatch?: Match;
  onNavigate: (view: 'schedule' | 'bracket' | 'sources') => void;
  onOpenMatch: (match: Match) => void;
}

export function Hero({ nextMatch, onNavigate, onOpenMatch }: HeroProps) {
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
    <header className="hero-scene relative overflow-hidden px-4 pb-10 pt-6 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f4fbff] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/[0.86] via-[#07111f]/[0.46] to-[#07111f]/[0.14]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/[0.36] via-transparent to-[#32245f]/[0.26]" />

      <div className="relative z-10 mx-auto flex min-h-[640px] w-full max-w-7xl flex-col justify-between gap-8 sm:min-h-[620px]">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white text-summer-blue shadow-glow">
              <CalendarDays size={20} />
            </span>
            <span className="font-black">NovaW World Cup 2026</span>
          </div>
          <span className="hidden rounded-[8px] border border-white/[0.35] bg-white/[0.12] px-3 py-2 text-sm font-bold backdrop-blur sm:inline">
            北京时间 · 中文赛程
          </span>
        </nav>

        <div className="grid items-end gap-5 lg:grid-cols-[1fr_420px]">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-white/40 bg-white/[0.16] px-3 py-2 text-sm font-bold backdrop-blur">
              <ShieldCheck size={16} className="text-summer-lime" />
              为中文用户整理的世界杯赛程查看网站
            </div>

            <h1 className="text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
              NovaW World Cup 2026
            </h1>
            <p className="mt-3 text-2xl font-black text-summer-lime sm:text-3xl">2026 世界杯赛程日历</p>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/[0.88] sm:text-xl sm:leading-8">
              快速查看北京时间、比赛对阵、比赛地点、比赛阶段和晋级路径。轻量、清爽，适合手机上临时查赛程。
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <HeroButton label="全部赛程" onClick={() => onNavigate('schedule')} />
              <HeroButton label="晋级树" onClick={() => onNavigate('bracket')} />
              <HeroButton label="官方来源" onClick={() => onNavigate('sources')} />
            </div>
          </div>

          <aside className="rounded-[8px] border border-white/[0.45] bg-[#14162d]/[0.58] p-4 shadow-glow backdrop-blur-xl sm:p-5">
            <p className="mb-3 text-sm font-bold text-summer-lime">下一场重点比赛</p>
            {nextMatch && homeTeam && awayTeam ? (
              <>
                <button
                  type="button"
                  onClick={() => onOpenMatch(nextMatch)}
                  className="block w-full rounded-[8px] bg-white/[0.08] p-4 text-left transition hover:bg-white/[0.14]"
                >
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <TeamName name={homeTeam.name} shortName={homeTeam.shortName} />
                    <span className="rounded-[8px] bg-white px-3 py-2 text-sm font-black text-[#172033]">VS</span>
                    <TeamName name={awayTeam.name} shortName={awayTeam.shortName} alignRight />
                  </div>
                </button>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    ['天', countdown.days],
                    ['小时', countdown.hours],
                    ['分钟', countdown.minutes],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[8px] bg-white/[0.14] p-3 text-center">
                      <span className="block text-2xl font-black sm:text-3xl">{value}</span>
                      <span className="text-xs font-bold text-white/[0.66]">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-sm font-semibold text-white/[0.78]">
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> 北京时间 {formatChineseDate(nextMatch.date)} {nextMatch.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {nextMatch.city} · {nextMatch.stadium}
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
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-3 py-2 text-sm font-black text-[#172033] transition hover:-translate-y-0.5 hover:bg-summer-lime"
    >
      {label}
      <ExternalLink size={15} />
    </button>
  );
}

function TeamName({ name, shortName, alignRight = false }: { name: string; shortName: string; alignRight?: boolean }) {
  return (
    <span className={alignRight ? 'min-w-0 text-right' : 'min-w-0'}>
      <span className="block truncate text-xl font-black">{name}</span>
      <span className="mt-1 block text-xs font-bold text-white/[0.62]">{shortName}</span>
    </span>
  );
}
