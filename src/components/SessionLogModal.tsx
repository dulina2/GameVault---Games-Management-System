import React, { useState, useEffect } from 'react';
import { Game, PlaySession } from '../types/game';
import { X, Clock, Calendar, Check, Trophy } from 'lucide-react';

interface SessionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  selectedGame: Game | null;
  onSaveSession: (sessionData: Omit<PlaySession, 'id'>) => void;
}

export const SessionLogModal: React.FC<SessionLogModalProps> = ({
  isOpen,
  onClose,
  games,
  selectedGame,
  onSaveSession,
}) => {
  const [gameId, setGameId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [achievement, setAchievement] = useState('');

  useEffect(() => {
    if (selectedGame) {
      setGameId(selectedGame.id);
    } else if (games.length > 0) {
      // Pick first playing or first game
      const playing = games.find((g) => g.status === 'Playing');
      setGameId(playing ? playing.id : games[0].id);
    }
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setAchievement('');
    setDurationMinutes(60);
  }, [selectedGame, games, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetGame = games.find((g) => g.id === gameId);
    if (!targetGame) return;

    onSaveSession({
      gameId,
      gameTitle: targetGame.title,
      date,
      durationMinutes: Number(durationMinutes) || 30,
      notes: notes.trim(),
      achievements: achievement.trim() ? [achievement.trim()] : [],
    });

    onClose();
  };

  const presetDurations = [30, 60, 90, 120, 180, 240];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">
                Log Play Session
              </h3>
              <p className="text-xs text-slate-400">
                Record your playtime, session milestones, and quest progress.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Game Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Game
            </label>
            <select
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white cursor-pointer"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.platform}) - [{g.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Session Duration & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Duration: <span className="text-cyan-400 font-mono font-bold">{(durationMinutes / 60).toFixed(1)} hrs</span> ({durationMinutes} mins)
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {presetDurations.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="15"
              max="480"
              step="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Session Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Achievement Unlocked */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Achievement or Milestone Unlocked (Optional)
            </label>
            <input
              type="text"
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="e.g. Defeated Malenia, Finished Act 2, Reached Level 50"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Session Highlights & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened in this session? Gear acquired, boss strategies, story twists..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Save Session & Add Hours
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
