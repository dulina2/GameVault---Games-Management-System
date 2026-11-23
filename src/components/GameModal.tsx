import React, { useState, useEffect } from 'react';
import { Game, GameStatus, Platform, Genre, Priority } from '../types/game';
import { X, Sparkles, Image as ImageIcon, Star, Clock } from 'lucide-react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gameData: Omit<Game, 'id' | 'addedDate'>) => void;
  initialGame?: Game | null;
}

const PLATFORMS: Platform[] = [
  'PC / Steam',
  'PlayStation 5',
  'Xbox Series X',
  'Nintendo Switch',
  'Epic Games',
  'GOG',
  'Retro / Emulation',
  'Mobile',
];

const GENRES: Genre[] = [
  'Action RPG',
  'Souls-like',
  'Open World',
  'Sci-Fi',
  'Strategy',
  'FPS',
  'Indie',
  'Survival Horror',
  'Adventure',
  'Roguelike',
  'Simulation',
  'Racing',
  'Platformer',
];

const STATUSES: GameStatus[] = [
  'Playing',
  'Backlog',
  'Completed',
  '100% Club',
  'On Hold',
  'Dropped',
  'Wishlist',
];

const PRIORITIES: Priority[] = ['Immediate', 'High', 'Medium', 'Low'];

const PRESET_COVERS = [
  {
    name: 'Cyber Sci-Fi',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dark Fantasy',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Neon Retro',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Action Racing',
    url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Eerie Horror',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vibrant World',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
  },
];

export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialGame,
}) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('PC / Steam');
  const [genre, setGenre] = useState<Genre>('Action RPG');
  const [status, setStatus] = useState<GameStatus>('Backlog');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [rating, setRating] = useState<number>(8);
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [estimatedHours, setEstimatedHours] = useState<number>(30);
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [developer, setDeveloper] = useState('');
  const [publisher, setPublisher] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialGame) {
      setTitle(initialGame.title);
      setPlatform(initialGame.platform);
      setGenre(initialGame.genre);
      setStatus(initialGame.status);
      setPriority(initialGame.priority || 'Medium');
      setRating(initialGame.rating);
      setHoursPlayed(initialGame.hoursPlayed);
      setEstimatedHours(initialGame.estimatedHours);
      setReleaseYear(initialGame.releaseYear);
      setDeveloper(initialGame.developer || '');
      setPublisher(initialGame.publisher || '');
      setCoverImage(initialGame.coverImage || '');
      setNotes(initialGame.notes || '');
      setTagsInput(initialGame.tags ? initialGame.tags.join(', ') : '');
      setIsFavorite(initialGame.isFavorite || false);
    } else {
      // Default new game values
      setTitle('');
      setPlatform('PC / Steam');
      setGenre('Action RPG');
      setStatus('Backlog');
      setPriority('Medium');
      setRating(8);
      setHoursPlayed(0);
      setEstimatedHours(35);
      setReleaseYear(new Date().getFullYear());
      setDeveloper('');
      setPublisher('');
      setCoverImage(PRESET_COVERS[0].url);
      setNotes('');
      setTagsInput('Must Play, Campaign');
      setIsFavorite(false);
    }
    setErrors({});
  }, [initialGame, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!developer.trim()) {
      newErrors.developer = 'Developer is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      platform,
      genre,
      status,
      priority,
      rating: Number(rating),
      hoursPlayed: Number(hoursPlayed) || 0,
      estimatedHours: Number(estimatedHours) || 10,
      releaseYear: Number(releaseYear) || new Date().getFullYear(),
      developer: developer.trim(),
      publisher: publisher.trim() || developer.trim(),
      coverImage: coverImage.trim() || PRESET_COVERS[0].url,
      notes: notes.trim(),
      tags,
      isFavorite,
      completionDate:
        status === 'Completed' || status === '100% Club'
          ? initialGame?.completionDate || new Date().toISOString().split('T')[0]
          : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">
                {initialGame ? 'Edit Game Details' : 'Add New Game to Vault'}
              </h3>
              <p className="text-xs text-slate-400">
                Track play status, time-to-beat, platforms, and critical review.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Row 1: Title & Release Year */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Game Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Elden Ring, Hades II, Baldur's Gate 3..."
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors ${
                  errors.title ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Release Year
              </label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                min={1970}
                max={2035}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Platform & Genre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-white cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-white cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Backlog / Play Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GameStatus)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-white cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Backlog Urgency Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-white cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Rating (Slider & Badge) & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Rating Score
                </label>
                <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {rating}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Playtime (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hoursPlayed}
                onChange={(e) => setHoursPlayed(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated to Beat (hrs)
              </label>
              <input
                type="number"
                min="1"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-sm text-white"
              />
            </div>
          </div>

          {/* Row 5: Developer & Publisher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Developer <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="e.g. FromSoftware, CD Projekt RED"
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors ${
                  errors.developer ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {errors.developer && (
                <p className="text-rose-400 text-xs mt-1">{errors.developer}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Publisher
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. Bandai Namco, Sony Interactive"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Row 6: Cover Image URL & Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Cover Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white"
              />
              {coverImage && (
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Quick Cover:</span>
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 7: Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. GOTY Winner, Hardcore, Great Soundtrack, Co-op"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          {/* Row 8: Personal Notes & Review */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Personal Journal & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record your thoughts, current progress, boss strats, or review..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white"
            />
          </div>

          {/* Row 9: Favorite Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFavorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <label htmlFor="isFavorite" className="text-xs text-slate-300 font-medium cursor-pointer">
              Mark as Favorite (⭐ Starred)
            </label>
          </div>

          {/* Footer Submit */}
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
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {initialGame ? 'Save Changes' : 'Add to Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
