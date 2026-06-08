import { Bot, CalendarDays, HelpCircle, Star, Tv, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Match } from '../types';
import { getTeamById } from '../services/worldCupData';
import { findNextMatch, formatChineseDate, getTodayKey } from '../utils/date';

type AssistantAction = 'today' | 'next' | 'focus' | 'watch';

interface ScheduleAssistantProps {
  matches: Match[];
  onOpenMatch: (match: Match) => void;
  onNavigate: (view: 'schedule' | 'sources' | 'install') => void;
}

const actions: Array<{ id: AssistantAction; label: string; icon: typeof CalendarDays }> = [
  { id: 'today', label: '今晚有比赛吗', icon: CalendarDays },
  { id: 'next', label: '下一场比赛', icon: HelpCircle },
  { id: 'focus', label: '重点比赛', icon: Star },
  { id: 'watch', label: '哪里看', icon: Tv },
];

export function ScheduleAssistant({ matches, onOpenMatch, onNavigate }: ScheduleAssistantProps) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<AssistantAction>('today');

  const answer = useMemo(() => getAssistantAnswer(activeAction, matches), [activeAction, matches]);

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-5 sm:right-5">
      {open && (
        <section className="mb-2 w-[min(calc(100vw-1.5rem),320px)] overflow-hidden rounded-[8px] border border-white/70 bg-white/70 shadow-card backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 border-b border-white/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#172033]/90 text-white">
                <Bot size={16} />
              </span>
              <div>
                <p className="text-[11px] font-bold text-summer-blue">Local Helper</p>
                <h2 className="text-sm font-black">赛程助手</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="关闭赛程助手"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/70 text-slate-600 transition hover:bg-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => setActiveAction(action.id)}
                    className={[
                      'flex min-h-9 items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-left text-[11px] font-black transition',
                      activeAction === action.id ? 'bg-[#172033]/90 text-white' : 'bg-white/62 text-slate-600 hover:bg-white/85',
                    ].join(' ')}
                  >
                    <Icon size={14} />
                    {action.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 rounded-[8px] bg-[#f7fbff]/72 p-3">
              <p className="text-sm font-black">{answer.title}</p>
              <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600">{answer.description}</p>
              {answer.match && (
                <button
                  type="button"
                  onClick={() => onOpenMatch(answer.match!)}
                  className="mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-[8px] bg-[#172033]/90 px-3 py-1.5 text-xs font-black text-white transition hover:bg-summer-blue"
                >
                  查看这场比赛
                </button>
              )}
              {answer.cta && (
                <button
                  type="button"
                  onClick={() => onNavigate(answer.cta!.view)}
                  className="mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-[8px] bg-[#172033]/90 px-3 py-1.5 text-xs font-black text-white transition hover:bg-summer-blue"
                >
                  {answer.cta.label}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 items-center gap-1.5 rounded-full bg-[#172033]/70 px-3.5 py-2.5 text-xs font-black text-white shadow-glow backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-summer-blue/85"
      >
        <Bot size={16} />
        赛程助手
      </button>
    </div>
  );
}

function getAssistantAnswer(action: AssistantAction, matches: Match[]) {
  const todayKey = getTodayKey();
  const todayMatches = matches.filter((match) => match.date === todayKey);
  const nextMatch = findNextMatch(matches);
  const nextFocusMatch = findNextMatch(matches, true);

  if (action === 'today') {
    const candidate = todayMatches[0];
    return {
      title: todayMatches.length > 0 ? `今天有 ${todayMatches.length} 场比赛` : '今晚没有比赛',
      description: candidate
        ? describeMatch(candidate)
        : nextMatch
          ? `下一场比赛是：${describeMatch(nextMatch)}`
          : '当前本地数据里暂时没有未来比赛。',
      match: candidate,
    };
  }

  if (action === 'next') {
    return {
      title: '下一场比赛',
      description: nextMatch ? describeMatch(nextMatch) : '当前本地数据里暂时没有未来比赛。',
      match: nextMatch,
    };
  }

  if (action === 'focus') {
    return {
      title: '下一场重点关注',
      description: nextFocusMatch ? describeMatch(nextFocusMatch) : '当前暂无重点或推荐比赛。',
      match: nextFocusMatch,
    };
  }

  if (action === 'watch') {
    return {
      title: '哪里看比赛',
      description: '中国大陆电视端可先关注 CCTV-5。具体每场频道、平台和转播安排，以赛前官方节目单为准。',
      cta: { label: '查看观赛来源', view: 'sources' as const },
    };
  }

  return {
    title: '哪里看比赛',
    description: '中国大陆电视端可先关注 CCTV-5。具体每场频道、平台和转播安排，以赛前官方节目单为准。',
    cta: { label: '查看观赛来源', view: 'sources' as const },
  };
}

function describeMatch(match: Match) {
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const homeName = homeTeam?.name ?? '待确认';
  const awayName = awayTeam?.name ?? '待确认';
  const timeText = /^\d{2}:\d{2}$/.test(match.time) ? `${formatChineseDate(match.date)} ${match.time}` : `${match.date} ${match.time}`;

  return `${homeName} vs ${awayName}，北京时间 ${timeText}，${match.city} · ${match.stadium}。`;
}
