import { bracketRounds } from '../data/bracket';
import { matches } from '../data/matches';
import { officialSources } from '../data/sources';
import { teamById, teams } from '../data/teams';

export function getMatches() {
  return matches;
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
