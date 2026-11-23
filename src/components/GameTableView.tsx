import React from 'react';
import { Game, GameStatus } from '../types/game';
import {
  Star,
  Clock,
  Play,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface GameTableViewProps {
  games: Game[];
  onSelect: (game: Game) => void;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateStatus: (id: string, status: GameStatus) => void;
  onQuickAddPlaytime: (id: string, hours: number) => void;
  onQuickLog: (game: Game) => void;
}

export const GameTableView: React.FC<GameTableViewProps> = ({
  games,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onUpdateStatus,
  onQuickAddPlaytime,
  onQuickLog,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 w-10 text-center">Fav</th>
              <th className="py-3 px-4 min-w-[220px]">Game Title</th>
              <th className="py-3 px-4 min-w-[120px]">Platform</th>
              <th className="py-3 px-4 min-w-[110px]">Genre</th>
              <th className="py-3 px-4 min-w-[130px]">Status</th>
              <th className="py-3 px-4 min-w-[90px]">Score</th>
              <th className="py-3 px-4 min-w-[150px]">Playtime (Hrs)</th>
              <th className="py-3 px-4 min-w-[90px]">Priority</th>
              <th className="py-3 px-4 min-w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {games.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No games match your current filter criteria.
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr
                  key={game.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Favorite */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleFavorite(game.id)}
                      className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          game.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>
                  </td>

                  {/* Title & Cover */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-9 h-11 object-cover rounded-md bg-slate-950 shrink-0 border border-slate-800"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div
                          onClick={() => onSelect(game)}
                          className="font-semibold text-slate-100 hover:text-cyan-400 transition-colors cursor-pointer truncate max-w-[200px] md:max-w-xs"
                          title={game.title}
                        >
                          {game.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {game.developer} · {game.releaseYear}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="py-3 px-4 font-mono text-[11px] text-cyan-300">
                    {game.platform}
                  </td>

                  {/* Genre */}
                  <td className="py-3 px-4 text-slate-400">
                    {game.genre}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={game.status}
                      onChange={(e) =>
                        onUpdateStatus(game.id, e.target.value as GameStatus)
                      }
                      className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-[11px] font-medium text-slate-200 focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="Playing">Playing</option>
                      <option value="Backlog">Backlog</option>
                      <option value="Completed">Completed</option>
                      <option value="100% Club">100% Club</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Dropped">Dropped</option>
                      <option value="Wishlist">Wishlist</option>
                    </select>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{game.rating}</span>
                      <span className="text-slate-500 text-[10px] font-normal">/10</span>
                    </div>
                  </td>

                  {/* Hours Played & Quick Boosters */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="min-w-[60px]">
                        <span className="font-semibold text-white">{game.hoursPlayed}</span>
                        <span className="text-slate-500 text-[10px]"> / {game.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onQuickAddPlaytime(game.id, 1)}
                          title="Add +1 hour"
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-cyan-900/60 text-[10px] text-cyan-400 border border-slate-700/60 cursor-pointer"
                        >
                          +1h
                        </button>
                        <button
                          onClick={() => onQuickAddPlaytime(game.id, 2)}
                          title="Add +2 hours"
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-cyan-900/60 text-[10px] text-cyan-400 border border-slate-700/60 cursor-pointer"
                        >
                          +2h
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
                        game.priority === 'Immediate'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : game.priority === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {game.priority}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onQuickLog(game)}
                        title="Log Session"
                        className="p-1.5 rounded hover:bg-slate-800 text-cyan-400 transition-colors cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(game)}
                        title="Edit Details"
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicate(game.id)}
                        title="Duplicate Game"
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(game.id)}
                        title="Delete Game"
                        className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
