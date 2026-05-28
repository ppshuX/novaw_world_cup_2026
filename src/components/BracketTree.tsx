import { Info } from 'lucide-react';
import type { BracketRound, BracketSlot } from '../types';

interface BracketTreeProps {
  rounds: BracketRound[];
}

export function BracketTree({ rounds }: BracketTreeProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-5">
        <p className="text-sm font-bold text-summer-blue">Bracket Path</p>
        <h2 className="text-3xl font-black sm:text-4xl">晋级路径</h2>
        <div className="mt-4 rounded-[8px] border border-summer-sky/40 bg-white/[0.9] p-4 text-sm font-medium leading-6 text-slate-600 shadow-sm backdrop-blur">
          <p className="flex gap-2">
            <Info size={18} className="mt-0.5 shrink-0 text-summer-blue" />
            世界杯尚未开赛，当前晋级树仅展示赛制路径。具体晋级球队、胜者和冠军将在比赛进行后根据官方结果更新。
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {rounds.map((round) => (
          <section key={round.stage} className="rounded-[8px] border border-white/80 bg-white/[0.92] p-4 shadow-sm backdrop-blur">
            <h3 className="mb-3 text-lg font-black">{round.stage}</h3>
            <div className="space-y-3">
              {round.matches.map((match) => (
                <BracketMobileCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="hidden rounded-[8px] border border-white/80 bg-white/[0.88] p-5 shadow-card backdrop-blur lg:block">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-summer-blue">Knockout Tree</p>
            <h3 className="text-xl font-black">淘汰赛晋级树</h3>
          </div>
        </div>

        <div className="bracket-grid">
          {rounds.map((round) => (
            <div key={round.stage} className="bracket-column">
              <div className="bracket-round-title mb-3 rounded-[8px] bg-[#172033] px-3 py-2 text-center text-sm font-black text-white">
                <span>{round.stage}</span>
                <span className="mt-1 block text-[11px] font-bold text-white/55">{round.matches.length} 个节点</span>
              </div>
              <div className={round.matches.length > 1 ? 'bracket-stack has-multiple' : 'bracket-stack'}>
                {round.matches.map((match) => (
                  <div key={match.id} className="bracket-match">
                    <span className="bracket-node-dot" aria-hidden="true" />
                    <div className="mb-2 flex items-center justify-between gap-2 px-1">
                      <span className="text-xs font-black text-slate-500">{match.title}</span>
                      {match.date && match.date !== '待确认' && (
                        <span className="rounded-[6px] bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500">
                          {match.date}
                        </span>
                      )}
                    </div>
                    {round.stage === '冠军' ? (
                      <BracketChampion />
                    ) : (
                      <div className="space-y-2">
                        <BracketTeam slot={match.homeSlot} />
                        <BracketTeam slot={match.awaySlot} />
                      </div>
                    )}
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
        {match.date && match.date !== '待确认' && (
          <span className="rounded-[6px] bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">{match.date}</span>
        )}
      </div>
      {match.round === '冠军' ? (
        <BracketChampion />
      ) : (
        <div className="space-y-2">
          <BracketTeam slot={match.homeSlot} />
          <BracketTeam slot={match.awaySlot} />
        </div>
      )}
    </article>
  );
}

function BracketTeam({ slot }: { slot: BracketSlot }) {
  const label = slot.label.replace(/\s*\/\s*待确认/g, '');

  return (
    <div className="relative flex items-center gap-3 rounded-[8px] border border-dashed border-slate-300 bg-white px-3 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-black leading-5">{label}</span>
      </span>
    </div>
  );
}

function BracketChampion() {
  return (
    <div className="relative flex min-h-[68px] items-center justify-center rounded-[8px] border border-dashed border-slate-300 bg-white px-3 py-3 text-center">
      <span className="text-base font-black leading-5">冠军</span>
    </div>
  );
}
