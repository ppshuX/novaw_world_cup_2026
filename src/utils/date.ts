import type { Match } from '../types';

export function toMatchDate(match: Pick<Match, 'date' | 'time'>) {
  const time = /^\d{2}:\d{2}$/.test(match.time) ? match.time : '23:59';
  return new Date(`${match.date}T${time}:00+08:00`);
}

export function formatChineseDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00+08:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

export function getTodayKey() {
  const now = new Date();
  const beijing = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const year = beijing.getFullYear();
  const month = String(beijing.getMonth() + 1).padStart(2, '0');
  const day = String(beijing.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowKey() {
  const tomorrow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function findNextMatch(matches: Match[], importantOnly = false) {
  const now = Date.now();
  return matches
    .filter((match) => match.matchStatus !== 'finished')
    .filter((match) => !importantOnly || match.tag !== '普通')
    .map((match) => ({ match, startsAt: toMatchDate(match).getTime() }))
    .filter(({ startsAt }) => startsAt >= now)
    .sort((a, b) => a.startsAt - b.startsAt)[0]?.match;
}

export function getCountdownParts(match?: Match) {
  if (!match) return { days: 0, hours: 0, minutes: 0 };

  const diff = Math.max(0, toMatchDate(match).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes };
}
