import { Info } from 'lucide-react';
import type { BracketRound, BracketMatch, BracketSlot } from '../types';
import { getTeamById } from '../services/worldCupData';

interface BracketTreeProps {
  rounds: BracketRound[];
  onOpenMatch?: (matchId: string) => void;
}

export function BracketTree({ rounds, onOpenMatch }: BracketTreeProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-5">
        <p className="text-sm font-bold text-summer-blue">Bracket Path</p>
        <h2 className="text-3xl font-black sm:text-4xl">晋级路径</h2>
        <div className="mt-3 rounded-[8px] border border-summer-sky/40 bg-white/[0.9] p-3 text-xs font-medium leading-5 text-slate-600 shadow-sm backdrop-blur sm:mt-4 sm:p-4 sm:text-sm sm:leading-6">
          <p className="flex gap-1.5 sm:gap-2">
            <Info size={16} className="mt-0.5 shrink-0 text-summer-blue sm:size-[18px]" />
          32强对阵已按 FIFA 官方赛程更新；后续轮次将在官方确认后填入。
          </p>
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="grid gap-3 lg:hidden sm:gap-4">
        {rounds.map((round) => (
          <section key={round.stage} className="rounded-[8px] border border-white/80 bg-white/[0.92] p-3 shadow-sm backdrop-blur sm:p-4">
            <h3 className="mb-2 text-base font-black sm:mb-3 sm:text-lg">{round.stage}</h3>
            <div className="space-y-3">
              {round.matches.map((match) => (
                <BracketMobileCard key={match.id} match={match} onOpenMatch={onOpenMatch} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 桌面端布局 */}
      <div className="hidden rounded-[8px] border border-white/80 bg-white/[0.88] p-4 shadow-card backdrop-blur sm:p-5 lg:block">
        <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
          <div>
            <p className="text-xs font-bold text-summer-blue sm:text-sm">Knockout Tree</p>
            <h3 className="text-lg font-black sm:text-xl">淘汰赛晋级树</h3>
          </div>
        </div>

        <div className="bracket-grid">
          {rounds.map((round) => (
            <div key={round.stage} className="bracket-column">
              <div className="bracket-round-title mb-2 rounded-[8px] bg-[#172033] px-2 py-1.5 text-center text-xs font-black text-white sm:mb-3 sm:px-3 sm:py-2 sm:text-sm">
                <span>{round.stage}</span>
                <span className="mt-0.5 block text-[10px] font-bold text-white/55 sm:mt-1 sm:text-[11px]">{round.matches.length} 场</span>
              </div>
              <div className={round.matches.length > 1 ? 'bracket-stack has-multiple' : 'bracket-stack'}>
                {round.matches.map((match) => (
                  <div
                    key={match.id}
                    className={`bracket-match ${match.matchId && onOpenMatch ? 'cursor-pointer transition hover:shadow-md' : ''}`}
                    onClick={match.matchId && onOpenMatch ? () => onOpenMatch(match.matchId!) : undefined}
                    role={match.matchId && onOpenMatch ? 'button' : undefined}
                    tabIndex={match.matchId && onOpenMatch ? 0 : undefined}
                    onKeyDown={match.matchId && onOpenMatch ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenMatch(match.matchId!); } } : undefined}
                  >
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
                      <BracketChampion winnerTeamId={match.winnerTeamId} />
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

function BracketMobileCard({ match, onOpenMatch }: { match: BracketRound['matches'][number]; onOpenMatch?: (matchId: string) => void }) {
  const clickable = match.matchId && onOpenMatch;
  return (
    <article
      className={`rounded-[8px] bg-slate-50 p-3 ${clickable ? 'cursor-pointer transition hover:bg-slate-100' : ''}`}
      onClick={clickable ? () => onOpenMatch(match.matchId!) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenMatch(match.matchId!); } } : undefined}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="font-black">{match.title}</h4>
        {match.date && match.date !== '待确认' && (
          <span className="rounded-[6px] bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">{match.date}</span>
        )}
      </div>
      {match.round === '冠军' ? (
        <BracketChampion winnerTeamId={match.winnerTeamId} />
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
  const team = slot.teamId ? getTeamById(slot.teamId) : null;
  const label = slot.label.replace(/\s*\/\s*待确认/g, '');

  if (team && slot.status === 'confirmed') {
    return (
      <div className="relative flex items-center gap-3 rounded-[8px] border border-summer-sky/30 bg-white px-3 py-2.5 shadow-sm">
        {team.flagKey && (
          <img
            src={`/flags/${team.flagKey}.svg`}
            alt={team.name}
            className="h-5 w-7 rounded-sm object-cover shadow-sm sm:h-6 sm:w-8"
          />
        )}
        <span className="min-w-0">
          <span className="block text-sm font-black leading-5">{team.name}</span>
          {team.shortName && team.shortName !== team.name && (
            <span className="mt-0.5 block text-[11px] font-bold text-slate-400">{team.shortName}</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-3 rounded-[8px] border border-dashed border-slate-300 bg-white px-3 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-black leading-5">{label}</span>
      </span>
    </div>
  );
}

function BracketChampion({ winnerTeamId }: { winnerTeamId: string | null }) {
  const team = winnerTeamId ? getTeamById(winnerTeamId) : null;

  if (team) {
    return (
      <div className="relative flex min-h-[68px] items-center justify-center gap-3 rounded-[8px] border-2 border-amber-300 bg-amber-50 px-3 py-3 text-center shadow-sm">
        {team.flagKey && (
          <img
            src={`/flags/${team.flagKey}.svg`}
            alt={team.name}
            className="h-8 w-11 rounded-sm object-cover shadow"
          />
        )}
        <span className="text-base font-black leading-5">{team.name}</span>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[68px] items-center justify-center rounded-[8px] border border-dashed border-slate-300 bg-white px-3 py-3 text-center">
      <span className="text-base font-black leading-5">冠军</span>
    </div>
  );
}
