import React from 'react';
import {
  FilterOptions,
  SortOption,
  GameStatus,
  Platform,
  Genre,
  SortField,
} from '../types/game';
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  Star,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface FilterBarProps {
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  totalFiltered: number;
}

const ALL_STATUSES: (GameStatus | 'All')[] = [
  'All',
  'Playing',
  'Backlog',
  'Completed',
  '100% Club',
  'On Hold',
  'Wishlist',
];

const ALL_PLATFORMS: (Platform | 'All')[] = [
  'All',
  'PC / Steam',
  'PlayStation 5',
  'Xbox Series X',
  'Nintendo Switch',
  'Epic Games',
  'GOG',
];

const ALL_GENRES: (Genre | 'All')[] = [
  'All',
  'Action RPG',
  'Souls-like',
  'Open World',
  'Sci-Fi',
  'Strategy',
  'FPS',
  'Indie',
  'Survival Horror',
  'Roguelike',
  'Racing',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  setFilterOptions,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  totalFiltered,
}) => {
  const hasActiveFilters =
    filterOptions.search !== '' ||
    filterOptions.status !== 'All' ||
    filterOptions.platform !== 'All' ||
    filterOptions.genre !== 'All' ||
    filterOptions.favoriteOnly ||
    filterOptions.minRating > 0;

  const handleResetFilters = () => {
    setFilterOptions({
      search: '',
      status: 'All',
      platform: 'All',
      genre: 'All',
      favoriteOnly: false,
      minRating: 0,
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-6 space-y-3.5 backdrop-blur-sm">
      {/* Top row: Status segmented tabs + View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {ALL_STATUSES.map((status) => {
            const isSelected = filterOptions.status === status;
            return (
              <button
                key={status}
                onClick={() =>
                  setFilterOptions((prev) => ({ ...prev, status }))
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* View mode toggle (Grid vs Table) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-end sm:self-center">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid Card View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-slate-800 text-cyan-400 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Density Table View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-slate-800 text-cyan-400 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle row: Platform pills + Genre Dropdown + Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
        {/* Platform segmented filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mr-1">
            Platform:
          </span>
          {ALL_PLATFORMS.map((platform) => {
            const isSelected = filterOptions.platform === platform;
            return (
              <button
                key={platform}
                onClick={() =>
                  setFilterOptions((prev) => ({ ...prev, platform }))
                }
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-slate-800/60'
                }`}
              >
                {platform}
              </button>
            );
          })}
        </div>

        {/* Right controls: Genre, Sort & Favorites */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Genre select */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 text-[11px]">Genre:</label>
            <select
              value={filterOptions.genre}
              onChange={(e) =>
                setFilterOptions((prev) => ({
                  ...prev,
                  genre: e.target.value as Genre | 'All',
                }))
              }
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:border-cyan-500 text-xs cursor-pointer"
            >
              {ALL_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={`${sortOption.field}_${sortOption.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('_') as [
                  SortField,
                  'asc' | 'desc'
                ];
                setSortOption({ field, direction });
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:border-cyan-500 text-xs cursor-pointer"
            >
              <option value="addedDate_desc">Newest Added</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="hoursPlayed_desc">Most Playtime</option>
              <option value="priority_desc">Priority (High to Low)</option>
              <option value="title_asc">Title (A - Z)</option>
              <option value="releaseYear_desc">Release Year</option>
            </select>
          </div>

          {/* Favorites filter toggle */}
          <button
            onClick={() =>
              setFilterOptions((prev) => ({
                ...prev,
                favoriteOnly: !prev.favoriteOnly,
              }))
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              filterOptions.favoriteOnly
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                filterOptions.favoriteOnly ? 'fill-amber-400' : ''
              }`}
            />
            <span>Favorites</span>
          </button>

          {/* Reset Filters if active */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="flex items-center gap-1 px-2 py-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg border border-rose-900/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <div>
          Showing <span className="font-semibold text-slate-200">{totalFiltered}</span> games
          {hasActiveFilters && <span className="text-cyan-400 ml-1.5">(Filtered)</span>}
        </div>
      </div>
    </div>
  );
};
