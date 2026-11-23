import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Game,
  PlaySession,
  FilterOptions,
  SortOption,
  LibraryStats,
  GameStatus,
  Priority,
} from '../types/game';
import { INITIAL_GAMES, INITIAL_SESSIONS } from '../data/initialGames';

const STORAGE_KEY_GAMES = 'gamevault_games_v2';
const STORAGE_KEY_SESSIONS = 'gamevault_sessions_v2';

export function useGameStorage() {
  // Load initial from localStorage or fall back to defaults
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GAMES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load games from localStorage', e);
    }
    return INITIAL_GAMES;
  });

  const [sessions, setSessions] = useState<PlaySession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load sessions from localStorage', e);
    }
    return INITIAL_SESSIONS;
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to persist games to localStorage', e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to persist sessions to localStorage', e);
    }
  }, [sessions]);

  // Filters & Sorting state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    status: 'All',
    platform: 'All',
    genre: 'All',
    favoriteOnly: false,
    minRating: 0,
  });

  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'addedDate',
    direction: 'desc',
  });

  // Add game
  const addGame = useCallback((newGameData: Omit<Game, 'id' | 'addedDate'>) => {
    const newGame: Game = {
      ...newGameData,
      id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      addedDate: new Date().toISOString().split('T')[0],
    };
    setGames((prev) => [newGame, ...prev]);
    return newGame;
  }, []);

  // Update game
  const updateGame = useCallback((id: string, updates: Partial<Game>) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        // If status changed to Completed and no completion date was provided, set today
        let finalUpdates = { ...updates };
        if (
          (updates.status === 'Completed' || updates.status === '100% Club') &&
          !g.completionDate &&
          !updates.completionDate
        ) {
          finalUpdates.completionDate = new Date().toISOString().split('T')[0];
        }
        return { ...g, ...finalUpdates };
      })
    );
  }, []);

  // Delete game
  const deleteGame = useCallback((id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    // also prune related sessions
    setSessions((prev) => prev.filter((s) => s.gameId !== id));
  }, []);

  // Duplicate game
  const duplicateGame = useCallback((id: string) => {
    setGames((prev) => {
      const original = prev.find((g) => g.id === id);
      if (!original) return prev;
      const copy: Game = {
        ...original,
        id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: `${original.title} (Copy)`,
        hoursPlayed: 0,
        status: 'Backlog',
        addedDate: new Date().toISOString().split('T')[0],
        completionDate: undefined,
      };
      return [copy, ...prev];
    });
  }, []);

  // Toggle Favorite
  const toggleFavorite = useCallback((id: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isFavorite: !g.isFavorite } : g))
    );
  }, []);

  // Quick Status change
  const updateStatus = useCallback((id: string, status: GameStatus) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updates: Partial<Game> = { status };
        if (
          (status === 'Completed' || status === '100% Club') &&
          !g.completionDate
        ) {
          updates.completionDate = new Date().toISOString().split('T')[0];
        }
        return { ...g, ...updates };
      })
    );
  }, []);

  // Quick add playtime
  const quickAddPlaytime = useCallback((id: string, additionalHours: number) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newHours = Math.max(0, +(g.hoursPlayed + additionalHours).toFixed(1));
        return { ...g, hoursPlayed: newHours };
      })
    );
  }, []);

  // Log a new play session
  const logPlaySession = useCallback(
    (sessionData: Omit<PlaySession, 'id'>) => {
      const newSession: PlaySession = {
        ...sessionData,
        id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      setSessions((prev) => [newSession, ...prev]);

      // Automatically accumulate hours on the associated game
      const additionalHours = +(sessionData.durationMinutes / 60).toFixed(1);
      setGames((prev) =>
        prev.map((g) => {
          if (g.id !== sessionData.gameId) return g;
          return {
            ...g,
            hoursPlayed: +(g.hoursPlayed + additionalHours).toFixed(1),
          };
        })
      );
      return newSession;
    },
    []
  );

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  // Reset to initial defaults
  const resetToDefaults = useCallback(() => {
    setGames(INITIAL_GAMES);
    setSessions(INITIAL_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_GAMES);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
  }, []);

  // Export JSON
  const exportDataAsJSON = useCallback(() => {
    const data = {
      exportVersion: 2,
      exportDate: new Date().toISOString(),
      games,
      sessions,
    };
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gamevault-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [games, sessions]);

  // Export CSV
  const exportDataAsCSV = useCallback(() => {
    const headers = [
      'Title',
      'Platform',
      'Genre',
      'Status',
      'Rating',
      'Hours Played',
      'Estimated Hours',
      'Release Year',
      'Developer',
      'Priority',
      'Added Date',
      'Completed Date',
    ];

    const rows = games.map((g) => [
      `"${g.title.replace(/"/g, '""')}"`,
      `"${g.platform}"`,
      `"${g.genre}"`,
      `"${g.status}"`,
      g.rating,
      g.hoursPlayed,
      g.estimatedHours,
      g.releaseYear,
      `"${g.developer.replace(/"/g, '""')}"`,
      `"${g.priority}"`,
      g.addedDate,
      g.completionDate || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `gamevault-catalog-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [games]);

  // Import JSON
  const importDataFromJSON = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.games)) {
        setGames(parsed.games);
        if (Array.isArray(parsed.sessions)) {
          setSessions(parsed.sessions);
        }
        return {
          success: true,
          message: `Successfully imported ${parsed.games.length} games and ${parsed.sessions?.length || 0} sessions!`,
        };
      }
      return {
        success: false,
        message: 'Invalid file format: "games" array not found.',
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Import failed: ${e.message || 'JSON parse error'}`,
      };
    }
  }, []);

  // Filtered and Sorted games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Search filter (title, developer, publisher, notes, tags)
        if (filterOptions.search.trim()) {
          const q = filterOptions.search.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDev = game.developer.toLowerCase().includes(q);
          const matchNotes = game.notes.toLowerCase().includes(q);
          const matchTags = game.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDev && !matchNotes && !matchTags) {
            return false;
          }
        }

        // Status filter
        if (filterOptions.status !== 'All' && game.status !== filterOptions.status) {
          return false;
        }

        // Platform filter
        if (filterOptions.platform !== 'All' && game.platform !== filterOptions.platform) {
          return false;
        }

        // Genre filter
        if (filterOptions.genre !== 'All') {
          const matchPrimary = game.genre === filterOptions.genre;
          const matchSecondary = game.secondaryGenres?.includes(filterOptions.genre);
          if (!matchPrimary && !matchSecondary) return false;
        }

        // Favorite filter
        if (filterOptions.favoriteOnly && !game.isFavorite) {
          return false;
        }

        // Min rating
        if (filterOptions.minRating > 0 && game.rating < filterOptions.minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const { field, direction } = sortOption;
        let comp = 0;

        if (field === 'title') {
          comp = a.title.localeCompare(b.title);
        } else if (field === 'rating') {
          comp = a.rating - b.rating;
        } else if (field === 'hoursPlayed') {
          comp = a.hoursPlayed - b.hoursPlayed;
        } else if (field === 'releaseYear') {
          comp = a.releaseYear - b.releaseYear;
        } else if (field === 'addedDate') {
          comp = a.addedDate.localeCompare(b.addedDate);
        } else if (field === 'priority') {
          const priorityWeights: Record<Priority, number> = {
            Immediate: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };
          comp = priorityWeights[a.priority] - priorityWeights[b.priority];
        }

        return direction === 'asc' ? comp : -comp;
      });
  }, [games, filterOptions, sortOption]);

  // Overall Stats
  const stats: LibraryStats = useMemo(() => {
    const total = games.length;
    const playing = games.filter((g) => g.status === 'Playing').length;
    const completed = games.filter(
      (g) => g.status === 'Completed' || g.status === '100% Club'
    ).length;
    const backlog = games.filter((g) => g.status === 'Backlog').length;
    const favs = games.filter((g) => g.isFavorite).length;
    const totalHours = +(
      games.reduce((acc, g) => acc + (g.hoursPlayed || 0), 0)
    ).toFixed(1);
    const avgRating = total
      ? +(games.reduce((acc, g) => acc + g.rating, 0) / total).toFixed(1)
      : 0;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    return {
      totalGames: total,
      currentlyPlaying: playing,
      completedGames: completed,
      totalHoursPlayed: totalHours,
      averageRating: avgRating,
      completionRate,
      backlogCount: backlog,
      favoriteCount: favs,
    };
  }, [games]);

  return {
    games,
    sessions,
    filteredGames,
    stats,
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    addGame,
    updateGame,
    deleteGame,
    duplicateGame,
    toggleFavorite,
    updateStatus,
    quickAddPlaytime,
    logPlaySession,
    deleteSession,
    resetToDefaults,
    exportDataAsJSON,
    exportDataAsCSV,
    importDataFromJSON,
  };
}
