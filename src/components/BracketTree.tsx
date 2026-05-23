import { Info, Trophy } from 'lucide-react';
import type { BracketRound, BracketSlot } from '../types';
import { getTeamById } from '../services/worldCupData';

interface BracketTreeProps {
  rounds: BracketRound[];
}

export function BracketTree({ rounds }: BracketTreeProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-5">
        <p className="text-sm font-bold text-summer-blue">Bracket Path</p>
        <h2 className="text-3xl font-black sm:text-4xl">晋级路径</h2>
        <div className="mt-4 rounded-[8px] border border-summer-sky/40 bg-white p-4 text-sm font-medium leading-6 text-slate-600 shadow-sm">
          <p className="flex gap-2">
            <Info size={18} className="mt-0.5 shrink-0 text-summer-blue" />
            世界杯尚未开赛，当前晋级树仅展示赛制路径。具体晋级球队、胜者和冠军将在比赛进行后根据官方结果更新。
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {rounds.map((round) => (
          <section key={round.stage} className="rounded-[8px] border border-white bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-black">{round.stage}</h3>
            <div className="space-y-3">
              {round.matches.map((match) => (
                <BracketMobileCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-[8px] border border-white bg-white/[0.82] p-4 shadow-card backdrop-blur lg:block">
        <div className="bracket-grid min-w-[1040px]">
          {rounds.map((round) => (
            <div key={round.stage} className="bracket-column">
              <div className="mb-4 rounded-[8px] bg-[#172033] px-3 py-2 text-center text-sm font-black text-white">
                {round.stage}
              </div>
              <div className="flex h-full flex-col justify-around gap-4">
                {round.matches.map((match) => (
                  <div key={match.id} className="bracket-match">
                    <div className="mb-2 flex items-center justify-between gap-2 px-1">
                      <span className="text-xs font-black text-slate-500">{match.title}</span>
                      <span className="text-xs font-bold text-slate-400">{match.date ?? '待确认'}</span>
                    </div>
                    <div className="space-y-2">
                      <BracketTeam slot={match.homeSlot} />
                      <BracketTeam slot={match.awaySlot} />
                    </div>
                    <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{match.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BracketMobileCard({ match }: { match: BracketRound['matches'][number] }) {
  return (
    <article className="rounded-[8px] bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="font-black">{match.title}</h4>
        <span className="rounded-[6px] bg-amber-100 px-2 py-1 text-xs font-black text-amber-700">待确认</span>
      </div>
      <div className="space-y-2">
        <BracketTeam slot={match.homeSlot} />
        <BracketTeam slot={match.awaySlot} />
      </div>
      <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{match.note}</p>
    </article>
  );
}

function BracketTeam({ slot }: { slot: BracketSlot }) {
  const team = slot.teamId ? getTeamById(slot.teamId) : undefined;

  return (
    <div className="relative flex items-center gap-3 rounded-[8px] border border-dashed border-slate-300 bg-white px-3 py-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[10px] font-black text-white"
        style={{ backgroundColor: team?.color ?? '#94a3b8' }}
      >
        {team?.shortName ?? 'TBD'}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-black">{team?.name ?? slot.label}</span>
        <span className="block truncate text-xs font-semibold text-slate-500">{slot.label}</span>
      </span>
      <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-black text-slate-400">
        <Trophy size={13} /> 待确认
      </span>
    </div>
  );
}
