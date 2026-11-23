import React from 'react';
import { Game, GameStatus } from '../types/game';
import {
  Star,
  Clock,
  MoreVertical,
  Play,
  CheckCircle,
  Copy,
  Trash2,
  Edit3,
  Calendar,
  Layers,
} from 'lucide-react';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateStatus: (id: string, status: GameStatus) => void;
  onQuickLog: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onUpdateStatus,
  onQuickLog,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  // Status styling colors
  const statusColorMap: Record<GameStatus, { text: string; bg: string; border: string }> = {
    Playing: { text: 'text-emerald-400', bg: 'bg-emerald-950/60', border: 'border-emerald-800/80' },
    Completed: { text: 'text-purple-400', bg: 'bg-purple-950/60', border: 'border-purple-800/80' },
    '100% Club': { text: 'text-amber-300', bg: 'bg-amber-950/60', border: 'border-amber-700/80' },
    Backlog: { text: 'text-cyan-400', bg: 'bg-cyan-950/60', border: 'border-cyan-800/80' },
    'On Hold': { text: 'text-orange-400', bg: 'bg-orange-950/60', border: 'border-orange-800/80' },
    Dropped: { text: 'text-rose-400', bg: 'bg-rose-950/60', border: 'border-rose-800/80' },
    Wishlist: { text: 'text-pink-400', bg: 'bg-pink-950/60', border: 'border-pink-800/80' },
  };

  const statusStyle = statusColorMap[game.status] || {
    text: 'text-slate-400',
    bg: 'bg-slate-900',
    border: 'border-slate-800',
  };

  const progressPercent = game.estimatedHours > 0
    ? Math.min(100, Math.round((game.hoursPlayed / game.estimatedHours) * 100))
    : 0;

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/60 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between">
      {/* Top Cover Image Container */}
      <div
        className="relative h-44 w-full overflow-hidden bg-slate-950 cursor-pointer"
        onClick={() => onSelect(game)}
      >
        <img
          src={game.coverImage}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
          onError={(e) => {
            // fallback placeholder if image fails
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/40" />

        {/* Top Floating Controls */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          {/* Status Label (Clean boxed indicator) */}
          <div
            className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} backdrop-blur-md`}
          >
            {game.status}
          </div>

          <div className="flex items-center gap-1">
            {/* Favorite Star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(game.id);
              }}
              title={game.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
              className="p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  game.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                }`}
              />
            </button>

            {/* Quick Context Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-30 text-xs"
                  onClick={(e) => e.stopPropagation()}
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <button
                    onClick={() => {
                      onQuickLog(game);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Log Playtime</span>
                  </button>

                  <button
                    onClick={() => {
                      onEdit(game);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit Game</span>
                  </button>

                  <button
                    onClick={() => {
                      onDuplicate(game.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Duplicate</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  {/* Status submenu options */}
                  <div className="px-3 py-1 text-[10px] text-slate-400 font-semibold uppercase">
                    Move Status
                  </div>
                  {(['Playing', 'Backlog', 'Completed', 'On Hold'] as GameStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(game.id, st);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1 text-slate-300 hover:bg-slate-800 text-[11px]"
                    >
                      → {st}
                    </button>
                  ))}

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      onDelete(game.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-rose-950/50 text-rose-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Game</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating overlay badge at bottom-right of image */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-amber-400">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{game.rating}</span>
          <span className="text-[10px] text-slate-400 font-normal">/10</span>
        </div>

        {/* Priority indicator */}
        {game.priority === 'Immediate' && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-800 text-[10px] font-semibold text-rose-300 uppercase tracking-wider backdrop-blur-md">
            Next Up
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata unboxed text (anti-slop clean typography) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-mono">
            <span className="text-cyan-400/90 font-medium">{game.platform}</span>
            <span aria-hidden="true">·</span>
            <span>{game.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{game.releaseYear}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(game)}
            className="font-heading font-bold text-base text-slate-100 hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer"
            title={game.title}
          >
            {game.title}
          </h3>

          {/* Developer / Publisher */}
          <div className="text-xs text-slate-400 truncate mt-0.5">
            By {game.developer}
          </div>

          {/* Notes Preview */}
          {game.notes && (
            <p className="text-xs text-slate-300 line-clamp-2 mt-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 italic">
              "{game.notes}"
            </p>
          )}
        </div>

        {/* Bottom Playtime & Progress */}
        <div className="mt-4 pt-3 border-t border-slate-800/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-200">{game.hoursPlayed}</span>
              <span>/ {game.estimatedHours} hrs</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercent >= 100
                  ? 'bg-purple-500'
                  : progressPercent > 50
                  ? 'bg-cyan-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick interactive buttons footer */}
          <div className="flex items-center justify-between mt-3 pt-1">
            {/* Quick Playtime Button */}
            <button
              onClick={() => onQuickLog(game)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Play className="w-3 h-3 fill-cyan-400/20" />
              <span>Log Session</span>
            </button>

            {/* View Details CTA */}
            <button
              onClick={() => onSelect(game)}
              className="text-xs text-slate-400 hover:text-slate-200 hover:underline cursor-pointer"
            >
              Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
