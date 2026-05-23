import { useState } from 'react';
import type { Team } from '../types';

export function isConfirmedTeam(team?: Team) {
  return Boolean(team?.flagKey && !team.id.startsWith('tbd') && !team.id.startsWith('slot-'));
}

export function TeamMark({ team, size = 'md' }: { team?: Team; size?: 'sm' | 'md' | 'lg' }) {
  return <TeamFlag team={team} size={size} />;
}

export function TeamFlag({ team, size = 'md' }: { team?: Team; size?: 'sm' | 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const sizeClass = {
    sm: 'h-5 w-7',
    md: 'h-6 w-9',
    lg: 'h-9 w-12',
  }[size];

  if (isConfirmedTeam(team) && team?.flagKey && !failed) {
    return (
      <img
        src={`/flags/${team.flagKey}.svg`}
        alt={`${team.name}国旗`}
        className={`${sizeClass} shrink-0 rounded-[4px] border border-slate-200 bg-white object-cover`}
        loading="lazy"
        onError={() => {
          console.warn(`Missing flag asset: /flags/${team.flagKey}.svg`);
          setFailed(true);
        }}
      />
    );
  }

  return <PendingTeamMark className={sizeClass} />;
}

function PendingTeamMark({ className }: { className: string }) {
  return (
    <span className={`${className} inline-flex shrink-0 items-center justify-center rounded-[4px] border border-slate-200 bg-slate-100`}>
      <svg viewBox="0 0 40 28" role="img" aria-label="球队待确认" className="h-full w-full">
        <rect x="1" y="1" width="38" height="26" rx="5" fill="#e2e8f0" />
        <path d="M20 8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" fill="#94a3b8" />
        <path
          d="M17.8 12.4c.2-1.4 1.1-2.3 2.5-2.3 1.5 0 2.5.8 2.5 2.1 0 .9-.4 1.5-1.3 2-.8.5-1 .9-1 1.7v.3h-1.6v-.4c0-1.1.4-1.7 1.2-2.3.7-.5 1-.8 1-1.2 0-.5-.4-.9-1-.9-.7 0-1.1.4-1.2 1.1l-1.1-.1Zm1 5.8c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1Z"
          fill="white"
        />
      </svg>
    </span>
  );
}
