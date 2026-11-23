export type GameStatus =
  | 'Playing'
  | 'Backlog'
  | 'Completed'
  | '100% Club'
  | 'On Hold'
  | 'Dropped'
  | 'Wishlist';

export type Platform =
  | 'PC / Steam'
  | 'PlayStation 5'
  | 'Xbox Series X'
  | 'Nintendo Switch'
  | 'Epic Games'
  | 'GOG'
  | 'Retro / Emulation'
  | 'Mobile';

export type Genre =
  | 'Action RPG'
  | 'Open World'
  | 'Souls-like'
  | 'Sci-Fi'
  | 'Strategy'
  | 'FPS'
  | 'Indie'
  | 'Survival Horror'
  | 'Adventure'
  | 'Roguelike'
  | 'Simulation'
  | 'Racing'
  | 'Platformer';

export type Priority = 'Low' | 'Medium' | 'High' | 'Immediate';

export interface PlaySession {
  id: string;
  gameId: string;
  gameTitle: string;
  date: string; // ISO date string (YYYY-MM-DD)
  durationMinutes: number;
  notes?: string;
  achievements?: string[];
}

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  genre: Genre;
  secondaryGenres?: string[];
  status: GameStatus;
  rating: number; // 1 to 10
  hoursPlayed: number;
  estimatedHours: number;
  releaseYear: number;
  coverImage: string;
  developer: string;
  publisher: string;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  completionDate?: string;
  addedDate: string;
  priority: Priority;
  achievementProgress?: {
    unlocked: number;
    total: number;
  };
}

export interface FilterOptions {
  search: string;
  status: GameStatus | 'All';
  platform: Platform | 'All';
  genre: Genre | 'All';
  favoriteOnly: boolean;
  minRating: number;
}

export type SortField =
  | 'title'
  | 'rating'
  | 'hoursPlayed'
  | 'releaseYear'
  | 'addedDate'
  | 'priority';

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export interface LibraryStats {
  totalGames: number;
  currentlyPlaying: number;
  completedGames: number;
  totalHoursPlayed: number;
  averageRating: number;
  completionRate: number;
  backlogCount: number;
  favoriteCount: number;
}
