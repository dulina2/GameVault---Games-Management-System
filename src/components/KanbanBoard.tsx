import React from 'react';
import { Game, GameStatus } from '../types/game';
import {
  PlayCircle,
  Layers,
  CheckCircle2,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface KanbanBoardProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onUpdateStatus: (id: string, status: GameStatus) => void;
  onOpenAddModal: () => void;
}

interface ColumnDef {
  status: GameStatus;
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  description: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  games,
  onSelectGame,
  onUpdateStatus,
  onOpenAddModal,
}) => {
  const columns: ColumnDef[] = [
    {
      status: 'Backlog',
      title: 'Backlog Queue',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      accentColor: 'border-cyan-500/40',
      description: 'Owned titles waiting for launch',
    },
    {
      status: 'Playing',
      title: 'Currently Playing',
      icon: <PlayCircle className="w-4 h-4 text-emerald-400" />,
      accentColor: 'border-emerald-500/40',
      description: 'Active playthroughs & campaigns',
    },
    {
      status: 'On Hold',
      title: 'On Hold / Paused',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      accentColor: 'border-amber-500/40',
      description: 'Temporarily benched titles',
    },
    {
      status: 'Completed',
      title: 'Finished / Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
      accentColor: 'border-purple-500/40',
      description: 'Credits rolled & conquered',
    },
    {
      status: '100% Club',
      title: '100% Mastered',
      icon: <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />,
      accentColor: 'border-yellow-500/40',
      description: 'Platinum trophies & full secrets',
    },
  ];

  const getNextStatus = (current: GameStatus): GameStatus | null => {
    switch (current) {
      case 'Backlog':
        return 'Playing';
      case 'Playing':
        return 'Completed';
      case 'Completed':
        return '100% Club';
      case 'On Hold':
        return 'Playing';
      default:
        return null;
    }
  };

  const getPrevStatus = (current: GameStatus): GameStatus | null => {
    switch (current) {
      case 'Playing':
        return 'Backlog';
      case 'On Hold':
        return 'Playing';
      case 'Completed':
        return 'Playing';
      case '100% Club':
        return 'Completed';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-heading text-white">Backlog Kanban Workflow</h2>
          <p className="text-xs text-slate-400">
            Organize campaigns, transition games through play stages, and eliminate backlog paralysis.
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Game</span>
        </button>
      </div>

      {/* Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const columnGames = games.filter((g) => g.status === col.status);

          return (
            <div
              key={col.status}
              className={`bg-slate-900/70 border ${col.accentColor} rounded-2xl flex flex-col max-h-[750px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 rounded-t-2xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <span className="font-heading font-bold text-sm text-slate-100">
                      {col.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {columnGames.length}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{col.description}</div>
              </div>

              {/* Cards List */}
              <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                {columnGames.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 border border-dashed border-slate-800/80 rounded-xl text-xs">
                    No games in this stage
                  </div>
                ) : (
                  columnGames.map((game) => {
                    const nextSt = getNextStatus(game.status);
                    const prevSt = getPrevStatus(game.status);

                    return (
                      <div
                        key={game.id}
                        className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 shadow-xs hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-2.5">
                          <img
                            src={game.coverImage}
                            alt={game.title}
                            className="w-12 h-16 object-cover rounded-md shrink-0 bg-slate-900 border border-slate-800"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono text-cyan-400 truncate">
                                {game.platform.split('/')[0]}
                              </span>
                              <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold shrink-0">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{game.rating}</span>
                              </div>
                            </div>

                            <h4
                              onClick={() => onSelectGame(game)}
                              className="font-bold text-xs text-white hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1 mt-0.5"
                              title={game.title}
                            >
                              {game.title}
                            </h4>

                            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{game.hoursPlayed}h</span>
                              <span>/ {game.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Kanban Shift Controls */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80">
                          {prevSt ? (
                            <button
                              onClick={() => onUpdateStatus(game.id, prevSt)}
                              title={`Move back to ${prevSt}`}
                              className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-3 h-3" />
                              <span className="truncate max-w-[60px]">{prevSt}</span>
                            </button>
                          ) : (
                            <div />
                          )}

                          <button
                            onClick={() => onSelectGame(game)}
                            className="text-[10px] text-slate-400 hover:text-cyan-400 cursor-pointer"
                          >
                            Details
                          </button>

                          {nextSt ? (
                            <button
                              onClick={() => onUpdateStatus(game.id, nextSt)}
                              title={`Advance to ${nextSt}`}
                              className="flex items-center gap-0.5 text-[10px] text-cyan-400 hover:text-cyan-300 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors font-medium cursor-pointer"
                            >
                              <span className="truncate max-w-[60px]">{nextSt}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <div />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
