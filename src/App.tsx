import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, Filter, Search, TreePine, X } from 'lucide-react';
import type { Match, TournamentStage } from './types';
import { BracketTree } from './components/BracketTree';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { InstallPage } from './components/InstallPage';
import { MatchCard } from './components/MatchCard';
import { MatchModal } from './components/MatchModal';
import { OfficialSources } from './components/OfficialSources';
import { getBracketRounds, getMatches, getTeamById } from './services/worldCupData';
import { findNextMatch, getTodayKey, getTomorrowKey, toMatchDate } from './utils/date';

type AppView = 'home' | 'schedule' | 'bracket' | 'sources' | 'install';
type StageFilter = TournamentStage | '全部阶段';
type GroupFilter = string | '全部小组';
type DateFilter = string | '全部日期';

function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [dateFilter, setDateFilter] = useState<DateFilter>('全部日期');
  const [stageFilter, setStageFilter] = useState<StageFilter>('全部阶段');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('全部小组');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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
      const teamNames = `${homeTeam?.name ?? ''} ${homeTeam?.shortName ?? ''} ${awayTeam?.name ?? ''} ${
        awayTeam?.shortName ?? ''
      }`.toLowerCase();

      return (
        (dateFilter === '全部日期' || match.date === dateFilter) &&
        (stageFilter === '全部阶段' || match.stage === stageFilter) &&
        (groupFilter === '全部小组' || match.group === groupFilter) &&
        (!keyword || teamNames.includes(keyword))
      );
    });
  }, [dateFilter, groupFilter, searchKeyword, sortedMatches, stageFilter]);

  const todayMatches = sortedMatches.filter((match) => match.date === todayKey);
  const tomorrowMatches = sortedMatches.filter((match) => match.date === tomorrowKey);
  const upcomingMatches = sortedMatches
    .filter((match) => match.matchStatus !== 'finished' && toMatchDate(match).getTime() >= Date.now())
    .slice(0, 3);
  const focusMatches = sortedMatches.filter((match) => match.tag !== '普通').slice(0, 6);
  const headlineMatches = todayMatches.length > 0 ? todayMatches : tomorrowMatches.length > 0 ? tomorrowMatches : upcomingMatches;

  const resetFilters = () => {
    setDateFilter('全部日期');
    setStageFilter('全部阶段');
    setGroupFilter('全部小组');
    setSearchKeyword('');
  };

  return (
    <div className="app-shell min-h-screen overflow-hidden text-summer-ink">
      <Hero nextMatch={nextImportantMatch} onNavigate={setActiveView} onOpenMatch={setSelectedMatch} />

      <main className="relative z-10 -mt-10 space-y-10 pb-16 sm:-mt-14 lg:-mt-10">
        <NavTabs activeView={activeView} onChange={setActiveView} />

        {activeView === 'home' && (
          <>
            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                <PanelHeaderCard
                  icon={<CalendarDays size={20} />}
                  eyebrow="近期比赛"
                  title="今日 / 最近即将开赛"
                  description="打开页面先看这里，快速判断今晚或明早有没有值得关注的比赛。"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {headlineMatches.map((match) => (
                      <MatchCard key={match.id} match={match} compact onOpen={setSelectedMatch} />
                    ))}
                  </div>
                </PanelHeaderCard>

                <PanelHeaderCard
                  dark
                  icon={<TreePine size={20} />}
                  eyebrow="重点比赛"
                  title="推荐关注"
                  description="根据比赛阶段、时间和观赛价值人工标记，后续会随真实赛程更新。"
                >
                  <div className="space-y-3">
                    {focusMatches.slice(0, 4).map((match) => (
                      <FocusMatchButton key={match.id} match={match} onOpen={setSelectedMatch} />
                    ))}
                  </div>
                </PanelHeaderCard>
              </div>
            </section>
          </>
        )}

        {activeView === 'schedule' && (
          <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold text-summer-blue">Schedule</p>
                <h2 className="text-3xl font-black sm:text-4xl">全部赛程</h2>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
                  所有时间均按北京时间展示。当前示例 / 待确认数据会明确标注，正式数据以后续人工核对为准。
                </p>
              </div>

              <div className="flex gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => setFilterOpen(true)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#172033] px-4 py-2 text-sm font-black text-white"
                >
                  <Filter size={17} />
                  筛选赛程
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-11 rounded-[8px] bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm"
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
                  searchKeyword={searchKeyword}
                  setDateFilter={setDateFilter}
                  setStageFilter={setStageFilter}
                  setGroupFilter={setGroupFilter}
                  setSearchKeyword={setSearchKeyword}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} onOpen={setSelectedMatch} />
              ))}
            </div>
            {filteredMatches.length === 0 && (
              <div className="mt-4">
                <EmptyState title="没有找到符合条件的比赛" description="换一个日期、阶段、小组，或者清空球队搜索词再试试。" />
              </div>
            )}
          </section>
        )}

        {activeView === 'bracket' && <BracketTree rounds={getBracketRounds()} />}

        {activeView === 'sources' && (
          <OfficialSources />
        )}

        {activeView === 'install' && <InstallPage />}
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
            searchKeyword={searchKeyword}
            setDateFilter={setDateFilter}
            setStageFilter={setStageFilter}
            setGroupFilter={setGroupFilter}
            setSearchKeyword={setSearchKeyword}
          />
        </FilterDrawer>
      )}

      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
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
      <div className="grid grid-cols-5 gap-2 rounded-[8px] border border-white bg-white/90 p-2 shadow-card backdrop-blur">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'min-h-11 rounded-[8px] px-2 py-2 text-sm font-black transition',
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
  description: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={dark ? 'rounded-[8px] border border-white/70 bg-[#251b4c] p-5 text-white shadow-card' : 'rounded-[8px] border border-white/70 bg-white/[0.72] p-5 shadow-card backdrop-blur'}>
      <div className="mb-4 flex items-start gap-3">
        <span className={dark ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-summer-lime text-[#172033]' : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-summer-blue text-white'}>
          {icon}
        </span>
        <div>
          <p className={dark ? 'text-sm font-semibold text-summer-lime' : 'text-sm font-semibold text-summer-blue'}>{eyebrow}</p>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className={dark ? 'mt-1 text-sm leading-6 text-white/[0.68]' : 'mt-1 text-sm leading-6 text-slate-600'}>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FocusMatchButton({ match, onOpen }: { match: Match; onOpen: (match: Match) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(match)}
      className="group flex min-h-16 w-full items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-white/[0.08] px-4 py-3 text-left transition hover:border-summer-lime/70 hover:bg-white/[0.14]"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold">
          {getTeamById(match.homeTeamId)?.name} vs {getTeamById(match.awayTeamId)?.name}
        </span>
        <span className="block text-xs text-white/[0.64]">
          {match.date} {match.time} · {match.city}
        </span>
      </span>
      <span className="shrink-0 rounded-[6px] bg-summer-orange px-2 py-1 text-xs font-black text-[#271527]">
        {match.tag}
      </span>
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
  searchKeyword,
  setDateFilter,
  setStageFilter,
  setGroupFilter,
  setSearchKeyword,
}: {
  dates: string[];
  stages: TournamentStage[];
  groups: string[];
  dateFilter: DateFilter;
  stageFilter: StageFilter;
  groupFilter: GroupFilter;
  searchKeyword: string;
  setDateFilter: (value: DateFilter) => void;
  setStageFilter: (value: StageFilter) => void;
  setGroupFilter: (value: GroupFilter) => void;
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
      <div className="w-full rounded-t-[8px] bg-[#f4fbff] p-4 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-summer-blue">Filter</p>
            <h3 className="text-xl font-black">筛选赛程</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭筛选"
            className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        {children}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={onReset} className="min-h-11 rounded-[8px] bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm">
            重置
          </button>
          <button type="button" onClick={onClose} className="min-h-11 rounded-[8px] bg-[#172033] px-4 py-2 text-sm font-black text-white">
            查看结果
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
