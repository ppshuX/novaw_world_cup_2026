import { bracketRounds } from '../data/bracket';
import { matches as baseMatches } from '../data/matches';
import matchResults from '../data/matchResults.json';
import { officialSources } from '../data/sources';
import { teamById, teams } from '../data/teams';
import type { Match } from '../types';

type ResultsMap = Record<string, { homeScore?: number; awayScore?: number; matchStatus?: Match['matchStatus']; resultStatus?: 'pending' | 'official' }>;

function mergeResults(matches: Match[], results: ResultsMap): Match[] {
  return matches.map((match) => {
    const result = results[String(match.matchNo)];
    if (!result) return match;
    return {
      ...match,
      homeScore: result.homeScore ?? match.homeScore,
      awayScore: result.awayScore ?? match.awayScore,
      matchStatus: result.matchStatus ?? match.matchStatus,
      resultStatus: result.resultStatus ?? match.resultStatus,
    };
  });
}

export function getMatches() {
  return mergeResults(baseMatches, matchResults as ResultsMap);
}

export function getTeams() {
  return teams;
}

export function getTeamById(teamId: string) {
  return teamById[teamId];
}

export function getBracketRounds() {
  return bracketRounds;
}

export function getOfficialSources() {
  return officialSources;
}
