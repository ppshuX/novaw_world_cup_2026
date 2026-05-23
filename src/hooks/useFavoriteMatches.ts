import { useCallback, useEffect, useState } from 'react';

const FAVORITE_MATCHES_KEY = 'novaw_worldcup_favorite_matches';

function readFavoriteIds() {
  if (typeof window === 'undefined') return [];

  try {
    const rawValue = window.localStorage.getItem(FAVORITE_MATCHES_KEY);
    if (!rawValue) return [];

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids: string[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(FAVORITE_MATCHES_KEY, JSON.stringify(ids));
  } catch {
    // localStorage can be unavailable in private modes or restricted browsers.
  }
}

export function useFavoriteMatches() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readFavoriteIds);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === FAVORITE_MATCHES_KEY) {
        setFavoriteIds(readFavoriteIds());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setAndStoreFavoriteIds = useCallback((updater: (currentIds: string[]) => string[]) => {
    setFavoriteIds((currentIds) => {
      const nextIds = Array.from(new Set(updater(currentIds)));
      writeFavoriteIds(nextIds);
      return nextIds;
    });
  }, []);

  const isFavorite = useCallback((matchId: string) => favoriteIds.includes(matchId), [favoriteIds]);

  const addFavorite = useCallback(
    (matchId: string) => {
      setAndStoreFavoriteIds((currentIds) => [...currentIds, matchId]);
    },
    [setAndStoreFavoriteIds],
  );

  const removeFavorite = useCallback(
    (matchId: string) => {
      setAndStoreFavoriteIds((currentIds) => currentIds.filter((id) => id !== matchId));
    },
    [setAndStoreFavoriteIds],
  );

  const toggleFavorite = useCallback(
    (matchId: string) => {
      setAndStoreFavoriteIds((currentIds) =>
        currentIds.includes(matchId) ? currentIds.filter((id) => id !== matchId) : [...currentIds, matchId],
      );
    },
    [setAndStoreFavoriteIds],
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
