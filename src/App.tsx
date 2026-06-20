import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, Filter, Search, Star, Trash2, TreePine, Tv, X } from 'lucide-react';
import type { Match, Team, TournamentStage } from './types';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { MatchCard } from './components/MatchCard';
import { MatchModal } from './components/MatchModal';
import { TeamMark } from './components/TeamIdentity';
import { TeamProfileModal } from './components/TeamProfileModal';

const BracketTree = lazy(() => import('./components/BracketTree').then((m) => ({ default: m.BracketTree })));
const InstallPage = lazy(() => import('./components/InstallPage').then((m) => ({ default: m.InstallPage })));
const OfficialSources = lazy(() => import('./components/OfficialSources').then((m) => ({ default: m.OfficialSources })));
const ScheduleAssistant = lazy(() => import('./components/ScheduleAssistant').then((m) => ({ default: m.ScheduleAssistant })));
import { useFavoriteMatches } from './hooks/useFavoriteMatches';
import { getBracketRounds, getMatches, getTeamById } from './services/worldCupData';
import { findNextMatch, formatChineseDate, getTodayKey, getTomorrowKey, toMatchDate } from './utils/date';
import { getResolvedMatchStatus, getResolvedMatchStatusLabel, getStatusColorClasses } from './utils/matchStatus';

type AppView = 'home' | 'schedule' | 'bracket' | 'sources' | 'install';
type StageFilter = TournamentStage | '全部阶段';
type GroupFilter = string | '全部小组';
type DateFilter = string | '全部日期';
type MatchStatusFilter = '全部状态' | '未开始' | '进行中' | '已结束';

function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [dateFilter, setDateFilter] = useState<DateFilter>('全部日期');
  const [stageFilter, setStageFilter] = useState<StageFilter>('全部阶段');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('全部小组');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [matchStatusFilter, setMatchStatusFilter] = useState<MatchStatusFilter>('全部状态');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [statusTick, setStatusTick] = useState(() => Date.now());
  const { favoriteIds, isFavorite, toggleFavorite, removeFavorite } = useFavoriteMatches();

  useEffect(() => {
    const timer = window.setInterval(() => setStatusTick(Date.now()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const sortedMatches = useMemo(
    () => [...getMatches()].sort((a, b) => toMatchDate(a).getTime() - toMatchDate(b).getTime()),
    [],
  );

  const todayKey = getTodayKey();
  const tomorrowKey = getTomorrowKey();
  const nextImportantMatch = findNextMatch(sortedMatches, true);

  const dates = useMemo(() => Array.from(new Set(sortedMatches.map((match) => match.date))), [sortedMatches]);
  const stages = useMemo(() => Array.from(new Set(sortedMatches.map((match) => match.stage))), [sortedMatches]);
  const groups = useMemo(
    () => Array.from(new Set(sortedMatches.map((match) => match.group).filter(Boolean))).sort() as string[],
    [sortedMatches],
  );

  const filteredMatches = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return sortedMatches.filter((match) => {
      const homeTeam = getTeamById(match.homeTeamId);
      const awayTeam = getTeamById(match.awayTeamId);
      const teamNames = [
        homeTeam?.name,
        homeTeam?.shortName,
        homeTeam?.fifaCode,
        homeTeam?.countryCode,
        homeTeam?.id,
        awayTeam?.name,
        awayTeam?.shortName,
        awayTeam?.fifaCode,
        awayTeam?.countryCode,
        awayTeam?.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        (dateFilter === '全部日期' || match.date === dateFilter) &&
        (stageFilter === '全部阶段' || match.stage === stageFilter) &&
        (groupFilter === '全部小组' || match.group === groupFilter) &&
        (matchStatusFilter === '全部状态' || getResolvedMatchStatusLabel(match) === matchStatusFilter) &&
        (!keyword || teamNames.includes(keyword))
      );
    });
  }, [dateFilter, groupFilter, matchStatusFilter, searchKeyword, sortedMatches, stageFilter, statusTick]);

  const todayMatches = sortedMatches.filter((match) => match.date === todayKey);
  const tomorrowMatches = sortedMatches.filter((match) => match.date === tomorrowKey);
  const upcomingMatches = sortedMatches
    .filter((match) => match.matchStatus !== 'finished' && toMatchDate(match).getTime() >= Date.now())
    .slice(0, 3);
  const focusMatches = sortedMatches
    .filter((match) => match.tag !== '普通' && getResolvedMatchStatus(match, statusTick) !== 'finished')
    .slice(0, 6);
  const headlineMatches = todayMatches.length > 0 ? todayMatches : tomorrowMatches.length > 0 ? tomorrowMatches : upcomingMatches;
  const favoriteMatches = useMemo(
    () =>
      favoriteIds
        .map((id) => sortedMatches.find((match) => match.id === id))
        .filter((match): match is Match => Boolean(match))
        .slice(0, 5),
    [favoriteIds, sortedMatches],
  );

  const resetFilters = () => {
    setDateFilter('全部日期');
    setStageFilter('全部阶段');
    setGroupFilter('全部小组');
    setMatchStatusFilter('全部状态');
    setSearchKeyword('');
  };

  return (
    <div className="app-shell min-h-screen overflow-hidden text-summer-ink">
      <Hero nextMatch={nextImportantMatch} onNavigate={setActiveView} onOpenMatch={setSelectedMatch} onOpenTeam={setSelectedTeam} />

      <main className="relative z-10 -mt-8 space-y-6 pb-12 sm:-mt-14 sm:space-y-10 sm:pb-16 lg:-mt-10">
        <NavTabs activeView={activeView} onChange={setActiveView} />

        {activeView === 'home' && (
          <>
            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                <PanelHeaderCard
                  icon={<CalendarDays size={16} className="sm:size-[20px]" />}
                  eyebrow="近期比赛"
                  title="今日 / 最近即将开赛"
                >
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    {headlineMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        compact
                        onOpen={setSelectedMatch}
                        onOpenTeam={setSelectedTeam}
                        isFavorite={isFavorite(match.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </PanelHeaderCard>

                <PanelHeaderCard
                  dark
                  icon={<TreePine size={16} className="sm:size-[20px]" />}
                  eyebrow="重点比赛"
                  title="推荐关注"
                >
                  <div className="space-y-2 sm:space-y-3">
                    {focusMatches.slice(0, 4).map((match) => (
                      <FocusMatchButton key={match.id} match={match} onOpen={setSelectedMatch} onOpenTeam={setSelectedTeam} />
                    ))}
                  </div>
                </PanelHeaderCard>
              </div>
            </section>

            <ViewingInfoSection onGoSources={() => setActiveView('sources')} />

            <FavoriteMatchesSection
              matches={favoriteMatches}
              onOpen={setSelectedMatch}
              onOpenTeam={setSelectedTeam}
              onRemove={removeFavorite}
              onGoSchedule={() => setActiveView('schedule')}
            />
          </>
        )}

        {activeView === 'schedule' && (
          <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold text-summer-blue sm:text-sm">Schedule</p>
                <h2 className="text-2xl font-black sm:text-4xl">全部赛程</h2>
                <p className="mt-2 max-w-2xl text-xs font-medium leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  所有时间均按北京时间展示。当前示例 / 待确认数据会明确标注，正式数据以后续人工核对为准。
                </p>
              </div>

              <div className="flex gap-1.5 md:hidden">
                <button
                  type="button"
                  onClick={() => setFilterOpen(true)}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#172033] px-3 py-1.5 text-xs font-black text-white sm:min-h-11 sm:px-4 sm:py-2 sm:text-sm"
                >
                  <Filter size={14} className="sm:size-[17px]" />
                  筛选赛程
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-10 rounded-[8px] bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm sm:min-h-11 sm:px-4 sm:py-2 sm:text-sm"
                >
                  重置
                </button>
              </div>

              <div className="hidden md:block">
                <FilterControls
                  dates={dates}
                  stages={stages}
                  groups={groups}
                  dateFilter={dateFilter}
                  stageFilter={stageFilter}
                  groupFilter={groupFilter}
                  matchStatusFilter={matchStatusFilter}
                  searchKeyword={searchKeyword}
                  setDateFilter={setDateFilter}
                  setStageFilter={setStageFilter}
                  setGroupFilter={setGroupFilter}
                  setMatchStatusFilter={setMatchStatusFilter}
                  setSearchKeyword={setSearchKeyword}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onOpen={setSelectedMatch}
                  onOpenTeam={setSelectedTeam}
                  isFavorite={isFavorite(match.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
            {filteredMatches.length === 0 && (
              <div className="mt-4">
                <EmptyState title="没有找到符合条件的比赛" description="换一个日期、阶段、小组，或者清空球队搜索词再试试。" />
              </div>
            )}
          </section>
        )}

        {activeView === 'bracket' && (
          <Suspense fallback={<div className="mx-auto w-full max-w-7xl px-4 py-12 text-center text-sm text-slate-400">加载中…</div>}>
            <BracketTree rounds={getBracketRounds()} />
          </Suspense>
        )}

        {activeView === 'sources' && (
          <Suspense fallback={<div className="mx-auto w-full max-w-7xl px-4 py-12 text-center text-sm text-slate-400">加载中…</div>}>
            <OfficialSources />
          </Suspense>
        )}

        {activeView === 'install' && (
          <Suspense fallback={<div className="mx-auto w-full max-w-7xl px-4 py-12 text-center text-sm text-slate-400">加载中…</div>}>
            <InstallPage />
          </Suspense>
        )}
      </main>

      {filterOpen && (
        <FilterDrawer onClose={() => setFilterOpen(false)} onReset={resetFilters}>
          <FilterControls
            dates={dates}
            stages={stages}
            groups={groups}
            dateFilter={dateFilter}
            stageFilter={stageFilter}
            groupFilter={groupFilter}
            matchStatusFilter={matchStatusFilter}
            searchKeyword={searchKeyword}
            setDateFilter={setDateFilter}
            setStageFilter={setStageFilter}
            setGroupFilter={setGroupFilter}
            setMatchStatusFilter={setMatchStatusFilter}
            setSearchKeyword={setSearchKeyword}
          />
        </FilterDrawer>
      )}

      <MatchModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        isFavorite={selectedMatch ? isFavorite(selectedMatch.id) : false}
        onToggleFavorite={toggleFavorite}
        onOpenTeam={setSelectedTeam}
      />
      <TeamProfileModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      <Suspense fallback={null}>
        <ScheduleAssistant matches={sortedMatches} onOpenMatch={setSelectedMatch} onNavigate={setActiveView} />
      </Suspense>
      <Footer />
    </div>
  );
}

function NavTabs({ activeView, onChange }: { activeView: AppView; onChange: (view: AppView) => void }) {
  const tabs: Array<{ id: AppView; label: string }> = [
    { id: 'home', label: '首页' },
    { id: 'schedule', label: '赛程' },
    { id: 'bracket', label: '晋级树' },
    { id: 'sources', label: '来源' },
    { id: 'install', label: 'App' },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-5 gap-1 rounded-[8px] border border-white bg-white/90 p-1.5 shadow-card backdrop-blur sm:gap-2 sm:p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'min-h-9 rounded-[8px] px-1 py-1.5 text-xs font-black transition sm:min-h-11 sm:px-2 sm:py-2 sm:text-sm',
              activeView === tab.id ? 'bg-[#172033] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function PanelHeaderCard({
  icon,
  eyebrow,
  title,
  description,
  dark = false,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={dark ? 'rounded-[8px] border border-white/70 bg-[#251b4c] p-4 text-white shadow-card sm:p-5' : 'rounded-[8px] border border-white/70 bg-white/[0.72] p-4 shadow-card backdrop-blur sm:p-5'}>
      <div className="mb-3 flex items-start gap-2 sm:mb-4 sm:gap-3">
        <span className={dark ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-summer-lime text-[#172033] sm:h-10 sm:w-10' : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-summer-blue text-white sm:h-10 sm:w-10'}>
          {icon}
        </span>
        <div>
          <p className={dark ? 'text-xs font-semibold text-summer-lime sm:text-sm' : 'text-xs font-semibold text-summer-blue sm:text-sm'}>{eyebrow}</p>
          <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
          {description && (
            <p className={dark ? 'mt-1 text-xs leading-5 text-white/[0.68] sm:text-sm sm:leading-6' : 'mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6'}>{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function FocusMatchButton({
  match,
  onOpen,
  onOpenTeam,
}: {
  match: Match;
  onOpen: (match: Match) => void;
  onOpenTeam: (team: Team) => void;
}) {
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

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
      className="group flex min-h-[44px] w-full items-center justify-between gap-2 rounded-[8px] border border-white/10 bg-white/[0.08] px-3 py-2 text-left transition hover:border-summer-lime/70 hover:bg-white/[0.14] sm:min-h-16 sm:gap-3 sm:px-4 sm:py-3"
    >
      <span className="min-w-0">
        <span className="flex min-w-0 items-center gap-1 text-xs font-bold sm:text-sm">
          <TeamNameInline team={homeTeam} onOpenTeam={onOpenTeam} />
          <span className="text-white/50">vs</span>
          <TeamNameInline team={awayTeam} onOpenTeam={onOpenTeam} />
        </span>
        <span className="block text-[11px] text-white/[0.64] sm:text-xs">
          {match.date} {match.time} · {match.city}
        </span>
      </span>
      <span className="shrink-0 rounded-[6px] bg-summer-orange px-1.5 py-0.5 text-[10px] font-black text-[#271527] sm:px-2 sm:py-1 sm:text-xs">
        {match.tag}
      </span>
    </article>
  );
}

function ViewingInfoSection({ onGoSources }: { onGoSources: () => void }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[8px] border border-summer-sky/30 bg-[#f8fcff]/90 p-4 shadow-card backdrop-blur sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#172033] text-white sm:h-10 sm:w-10">
              <Tv size={16} className="sm:size-[20px]" />
            </span>
            <div>
              <p className="text-xs font-semibold text-summer-blue sm:text-sm">Viewing Guide</p>
              <h2 className="text-xl font-black sm:text-2xl">观赛信息</h2>
              <p className="mt-1 max-w-3xl text-xs font-medium leading-5 text-slate-600 sm:text-sm sm:leading-6">
                中国大陆电视端可先关注
                <span className="mx-1 inline-flex rounded-[6px] bg-[#172033] px-2 py-0.5 text-xs font-black text-white sm:text-sm">
                  CCTV-5
                </span>
                。具体每场频道、平台和转播安排，以赛前官方节目单为准。
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoSources}
            className="inline-flex min-h-9 items-center justify-center rounded-[8px] bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm transition hover:bg-summer-lime hover:text-[#172033] sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm"
          >
            查看官方来源
          </button>
        </div>
      </div>
    </section>
  );
}

function FavoriteMatchesSection({
  matches,
  onOpen,
  onOpenTeam,
  onRemove,
  onGoSchedule,
}: {
  matches: Match[];
  onOpen: (match: Match) => void;
  onOpenTeam: (team: Team) => void;
  onRemove: (matchId: string) => void;
  onGoSchedule: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[8px] border border-white/70 bg-white/[0.76] p-4 shadow-card backdrop-blur sm:p-5">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-summer-orange text-[#271527] sm:h-10 sm:w-10">
              <Star size={16} className="sm:size-[20px]" fill="currentColor" />
            </span>
            <div>
              <p className="text-xs font-semibold text-summer-blue sm:text-sm">Favorites</p>
              <h2 className="text-xl font-black sm:text-2xl">我的收藏</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                收藏仅保存在当前设备浏览器中，清除浏览器数据后可能会丢失。
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoSchedule}
            className="inline-flex min-h-9 items-center justify-center rounded-[8px] bg-[#172033] px-3 py-1.5 text-xs font-black text-white transition hover:bg-summer-blue sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm"
          >
            查看全部赛程
          </button>
        </div>

        {matches.length === 0 ? (
          <EmptyState
            title="还没有收藏比赛"
            description="去赛程页点击星标，把想看的比赛放到这里。"
          />
        ) : (
          <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
            {matches.map((match) => (
              <FavoriteMatchItem key={match.id} match={match} onOpen={onOpen} onOpenTeam={onOpenTeam} onRemove={onRemove} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FavoriteMatchItem({
  match,
  onOpen,
  onOpenTeam,
  onRemove,
}: {
  match: Match;
  onOpen: (match: Match) => void;
  onOpenTeam: (team: Team) => void;
  onRemove: (matchId: string) => void;
}) {
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  return (
    <article className="rounded-[8px] border border-summer-sky/20 bg-[#fbfdff]/90 p-3 shadow-[0_10px_24px_rgba(23,32,51,0.06)] sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase text-summer-blue sm:text-xs">Match {match.matchNo}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-sm font-black sm:text-base">{match.stage}</span>
            {match.group && <span className="rounded-[6px] bg-slate-100 px-1.5 py-0.5 text-[10px] font-black sm:px-2 sm:py-1 sm:text-xs">{match.group}</span>}
          </div>
        </div>
        <span className="rounded-[6px] bg-summer-lime px-1.5 py-0.5 text-[10px] font-black text-[#17331d] sm:px-2 sm:py-1 sm:text-xs">{match.tag}</span>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:mt-4 sm:gap-3">
        <FavoriteTeam team={homeTeam} fallback="待确认" onOpenTeam={onOpenTeam} />
        <span className={`rounded-[8px] px-2 py-1.5 text-center text-xs font-black sm:px-3 sm:py-2 sm:text-sm ${getStatusColorClasses(match).bg} ${getStatusColorClasses(match).text}`}>
          {getResolvedMatchStatusLabel(match)}
        </span>
        <FavoriteTeam team={awayTeam} fallback="待确认" alignRight onOpenTeam={onOpenTeam} />
      </div>

      <p className="mt-3 text-xs font-bold text-slate-600 sm:mt-4 sm:text-sm">
        北京时间 {formatChineseDate(match.date)} {match.time}
      </p>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-1.5 sm:mt-4 sm:gap-2">
        <button
          type="button"
          onClick={() => onOpen(match)}
          className="min-h-9 rounded-[8px] bg-[#172033] px-3 py-1.5 text-xs font-black text-white transition hover:bg-summer-blue sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm"
        >
          查看详情
        </button>
        <button
          type="button"
          onClick={() => onRemove(match.id)}
          aria-label="取消收藏"
          className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-summer-orange hover:text-summer-orange"
        >
          <Trash2 size={16} className="sm:size-[17px]" />
        </button>
      </div>
    </article>
  );
}

function FavoriteTeam({
  team,
  fallback,
  alignRight = false,
  onOpenTeam,
}: {
  team?: ReturnType<typeof getTeamById>;
  fallback: string;
  alignRight?: boolean;
  onOpenTeam: (team: Team) => void;
}) {
  const canOpen = Boolean(team && !team.id.startsWith('tbd') && !team.id.startsWith('slot-'));

  return (
    <button
      type="button"
      disabled={!canOpen}
      onClick={() => {
        if (team && canOpen) onOpenTeam(team);
      }}
      className={[
        alignRight ? 'flex min-w-0 items-center justify-end gap-1.5 text-right' : 'flex min-w-0 items-center gap-1.5',
        canOpen ? 'rounded-[8px] outline-none transition hover:text-summer-blue focus-visible:ring-2 focus-visible:ring-summer-sky' : 'cursor-default',
        'min-h-[44px]',
      ].join(' ')}
    >
      {!alignRight && <TeamMark team={team} size="sm" />}
      <span className="min-w-0">
        <span className="block truncate text-xs font-black sm:text-sm">{team?.name ?? fallback}</span>
        <span className="block text-[10px] font-bold text-slate-400 sm:text-xs">{team?.shortName ?? 'TBD'}</span>
      </span>
      {alignRight && <TeamMark team={team} size="sm" />}
    </button>
  );
}

function TeamNameInline({ team, onOpenTeam }: { team?: ReturnType<typeof getTeamById>; onOpenTeam: (team: Team) => void }) {
  const canOpen = Boolean(team && !team.id.startsWith('tbd') && !team.id.startsWith('slot-'));

  return (
    <button
      type="button"
      disabled={!canOpen}
      onClick={(event) => {
        event.stopPropagation();
        if (team && canOpen) onOpenTeam(team);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
      className="min-w-0 truncate rounded-[6px] outline-none transition hover:text-summer-lime focus-visible:ring-2 focus-visible:ring-summer-lime"
    >
      {team?.name ?? '待确认'}
    </button>
  );
}

function FilterControls({
  dates,
  stages,
  groups,
  dateFilter,
  stageFilter,
  groupFilter,
  matchStatusFilter,
  searchKeyword,
  setDateFilter,
  setStageFilter,
  setGroupFilter,
  setMatchStatusFilter,
  setSearchKeyword,
}: {
  dates: string[];
  stages: TournamentStage[];
  groups: string[];
  dateFilter: DateFilter;
  stageFilter: StageFilter;
  groupFilter: GroupFilter;
  matchStatusFilter: MatchStatusFilter;
  searchKeyword: string;
  setDateFilter: (value: DateFilter) => void;
  setStageFilter: (value: StageFilter) => void;
  setGroupFilter: (value: GroupFilter) => void;
  setMatchStatusFilter: (value: MatchStatusFilter) => void;
  setSearchKeyword: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <select
        value={dateFilter}
        onChange={(event) => setDateFilter(event.target.value as DateFilter)}
        className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm outline-none focus:border-summer-blue"
      >
        <option value="全部日期">全部日期</option>
        {dates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      <select
        value={stageFilter}
        onChange={(event) => setStageFilter(event.target.value as StageFilter)}
        className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm outline-none focus:border-summer-blue"
      >
        <option value="全部阶段">全部阶段</option>
        {stages.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
      </select>

      <select
        value={groupFilter}
        onChange={(event) => setGroupFilter(event.target.value as GroupFilter)}
        className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm outline-none focus:border-summer-blue"
      >
        <option value="全部小组">全部小组</option>
        {groups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

      <select
        value={matchStatusFilter}
        onChange={(event) => setMatchStatusFilter(event.target.value as MatchStatusFilter)}
        className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm outline-none focus:border-summer-blue"
      >
        <option value="全部状态">全部状态</option>
        <option value="未开始">未开始</option>
        <option value="进行中">进行中</option>
        <option value="已结束">已结束</option>
      </select>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
        <input
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="搜索球队 / 占位"
          className="h-11 w-full rounded-[8px] border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold shadow-sm outline-none placeholder:text-slate-400 focus:border-summer-blue"
        />
      </label>
    </div>
  );
}

function FilterDrawer({
  children,
  onClose,
  onReset,
}: {
  children: ReactNode;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-[#07111f]/[0.52] backdrop-blur-sm md:hidden">
      <div className="w-full rounded-t-[8px] bg-[#f4fbff] p-3 shadow-card sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
          <div>
            <p className="text-xs font-bold text-summer-blue sm:text-sm">Filter</p>
            <h3 className="text-lg font-black sm:text-xl">筛选赛程</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭筛选"
            className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm"
          >
            <X size={18} className="sm:size-[20px]" />
          </button>
        </div>
        {children}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
          <button type="button" onClick={onReset} className="min-h-10 rounded-[8px] bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm sm:min-h-11 sm:px-4 sm:py-2 sm:text-sm">
            重置
          </button>
          <button type="button" onClick={onClose} className="min-h-10 rounded-[8px] bg-[#172033] px-3 py-1.5 text-xs font-black text-white sm:min-h-11 sm:px-4 sm:py-2 sm:text-sm">
            查看结果
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
