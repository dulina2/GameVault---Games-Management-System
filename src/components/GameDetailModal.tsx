import React, { useState } from 'react';
import { Game, GameStatus, PlaySession } from '../types/game';
import confetti from 'canvas-confetti';
import {
  X,
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Edit3,
  Trash2,
  Copy,
  Plus,
  Trophy,
  Flame,
  Award,
} from 'lucide-react';

interface GameDetailModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateStatus: (id: string, status: GameStatus) => void;
  onQuickAddPlaytime: (id: string, hours: number) => void;
  onOpenSessionModal: (game: Game) => void;
  gameSessions: PlaySession[];
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onUpdateStatus,
  onQuickAddPlaytime,
  onOpenSessionModal,
  gameSessions,
}) => {
  if (!isOpen || !game) return null;

  const handleCelebrateCompletion = (status: GameStatus) => {
    onUpdateStatus(game.id, status);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'],
    });
  };

  const progressPercent = game.estimatedHours > 0
    ? Math.min(100, Math.round((game.hoursPlayed / game.estimatedHours) * 100))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Hero Header with Game Art Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover object-center filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-cyan-950/80 border border-cyan-800 text-cyan-300 backdrop-blur-md">
              {game.platform}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-950/80 border border-slate-800 text-slate-300 backdrop-blur-md">
              {game.genre}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-950/80 border border-slate-800 text-slate-300 backdrop-blur-md">
              {game.releaseYear}
            </span>
          </div>

          {/* Floating Hero Content */}
          <div className="absolute bottom-4 inset-x-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-wide leading-tight drop-shadow-md">
                {game.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Developed by <span className="font-semibold text-white">{game.developer}</span> · Published by {game.publisher}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Rating score badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-amber-400 font-bold backdrop-blur-md shadow-md">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-base font-mono">{game.rating}</span>
                <span className="text-xs text-slate-400 font-normal">/ 10</span>
              </div>

              {/* Favorite Star */}
              <button
                onClick={() => onToggleFavorite(game.id)}
                className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 backdrop-blur-md text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                title={game.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
              >
                <Star
                  className={`w-4 h-4 ${
                    game.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Status:
              </span>
              <select
                value={game.status}
                onChange={(e) => onUpdateStatus(game.id, e.target.value as GameStatus)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:border-cyan-500 cursor-pointer"
              >
                <option value="Playing">Playing</option>
                <option value="Backlog">Backlog</option>
                <option value="Completed">Completed</option>
                <option value="100% Club">100% Mastered</option>
                <option value="On Hold">On Hold</option>
                <option value="Dropped">Dropped</option>
                <option value="Wishlist">Wishlist</option>
              </select>
            </div>

            {/* Quick Completion Button */}
            {game.status !== 'Completed' && game.status !== '100% Club' ? (
              <button
                onClick={() => handleCelebrateCompletion('Completed')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Finished 🎉</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Completed on {game.completionDate || 'Recent'}</span>
              </div>
            )}
          </div>

          {/* Playtime Progress & Quick Loggers */}
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Playtime Progress
                </div>
                <div className="text-lg font-bold font-mono text-white flex items-baseline gap-1 mt-0.5">
                  <span className="text-cyan-400">{game.hoursPlayed}</span>
                  <span className="text-slate-400 text-xs font-normal">
                    / {game.estimatedHours} hrs estimated
                  </span>
                </div>
              </div>

              {/* Quick Hours Booster Buttons */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Add time:</span>
                <button
                  onClick={() => onQuickAddPlaytime(game.id, 0.5)}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-xs text-cyan-300 cursor-pointer"
                >
                  +30m
                </button>
                <button
                  onClick={() => onQuickAddPlaytime(game.id, 1)}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-xs text-cyan-300 cursor-pointer"
                >
                  +1h
                </button>
                <button
                  onClick={() => onQuickAddPlaytime(game.id, 2)}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-xs text-cyan-300 cursor-pointer"
                >
                  +2h
                </button>
                <button
                  onClick={() => onOpenSessionModal(game)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-xs font-semibold text-cyan-300 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Session</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  progressPercent >= 100
                    ? 'bg-purple-500'
                    : progressPercent > 50
                    ? 'bg-cyan-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>{progressPercent}% Complete</span>
              <span>{Math.max(0, game.estimatedHours - game.hoursPlayed)} hrs remaining</span>
            </div>
          </div>

          {/* Achievement Progress if available */}
          {game.achievementProgress && (
            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Achievements & Trophies
                  </div>
                  <div className="text-xs text-slate-400">
                    {game.achievementProgress.unlocked} of {game.achievementProgress.total} unlocked
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold font-mono text-amber-400">
                {Math.round(
                  (game.achievementProgress.unlocked / game.achievementProgress.total) * 100
                )}
                %
              </div>
            </div>
          )}

          {/* Notes & Personal Journal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Personal Review & Notes
            </h4>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed italic">
              {game.notes || 'No review or notes recorded yet. Edit to add your playthrough impressions!'}
            </div>
          </div>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Tags & Descriptors
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800/60 px-2.5 py-0.5 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Session History Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Logged Sessions for this Game ({gameSessions.length})
              </h4>
              <button
                onClick={() => onOpenSessionModal(game)}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                + Add Session
              </button>
            </div>

            {gameSessions.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center border border-dashed border-slate-800 rounded-xl">
                No individual sessions logged yet. Use "Log Session" above!
              </div>
            ) : (
              <div className="space-y-2">
                {gameSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
                        <span>{sess.date}</span>
                        <span>·</span>
                        <span className="text-slate-300 font-semibold">{sess.durationMinutes} minutes</span>
                      </div>
                      {sess.notes && (
                        <p className="text-slate-300 mt-1 text-[11px]">{sess.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDuplicate(game.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>
            <button
              onClick={() => {
                onDelete(game.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 rounded-xl border border-rose-900/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(game);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Edit Game</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
