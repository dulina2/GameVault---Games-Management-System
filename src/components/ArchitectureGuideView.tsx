import React, { useState } from 'react';
import {
  Code,
  BookOpen,
  Check,
  Copy,
  Terminal,
  Layers,
  Database,
  Cpu,
  Sparkles,
  FileCode,
  Workflow,
} from 'lucide-react';

export const ArchitectureGuideView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<string>('types');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const steps = [
    {
      num: '01',
      title: 'Project Setup & Design System',
      desc: 'Initialize React SPA with Vite, Chakra UI v3 / modern styling tokens, Lucide icons, and Canvas Confetti.',
      codeSnippet: `npm create vite@latest games-management-system -- --template react-ts
cd games-management-system
npm install @chakra-ui/react @floating-ui/core @floating-ui/dom lucide-react canvas-confetti motion
npm install -D @types/canvas-confetti tailwindcss`,
    },
    {
      num: '02',
      title: 'Strongly Typed Data Models',
      desc: 'Define TypeScript contracts for Game entities, PlaySessions, Platforms, Statuses, and Analytics metrics in src/types/game.ts.',
      codeSnippet: `export type GameStatus = 'Playing' | 'Backlog' | 'Completed' | '100% Club' | 'On Hold' | 'Dropped' | 'Wishlist';
export type Platform = 'PC / Steam' | 'PlayStation 5' | 'Xbox Series X' | 'Nintendo Switch' | 'Epic Games' | 'GOG';
export interface Game {
  id: string;
  title: string;
  platform: Platform;
  status: GameStatus;
  rating: number; // 1-10
  hoursPlayed: number;
  estimatedHours: number;
  tags: string[];
}`,
    },
    {
      num: '03',
      title: 'Pure Frontend Persistence Engine',
      desc: 'Implement custom useGameStorage hook with localStorage serialization, automated playtime accretion, JSON/CSV exports, and filters.',
      codeSnippet: `export function useGameStorage() {
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('games_vault');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });
  useEffect(() => {
    localStorage.setItem('games_vault', JSON.stringify(games));
  }, [games]);
  // CRUD methods: addGame, updateGame, deleteGame, logSession...
}`,
    },
    {
      num: '04',
      title: 'Agile Kanban & Density Views',
      desc: 'Build Kanban Swimlanes (Backlog -> Playing -> Completed -> 100% Club) and compact tabular view for high-density cataloging.',
      codeSnippet: `// Move games seamlessly across stages
const advanceGame = (id: string, nextStatus: GameStatus) => {
  updateGame(id, { status: nextStatus });
  if (nextStatus === 'Completed') triggerConfetti();
};`,
    },
    {
      num: '05',
      title: 'Real-Time Analytics & Insights Engine',
      desc: 'Derive instant analytics on client side: genre playtime distributions, completion percentage, backlog debt, and leaderboard.',
      codeSnippet: `const stats = useMemo(() => {
  const total = games.length;
  const completed = games.filter(g => g.status === 'Completed').length;
  const totalHours = games.reduce((acc, g) => acc + g.hoursPlayed, 0);
  return { completionRate: Math.round((completed/total)*100), totalHours };
}, [games]);`,
    },
  ];

  const codeFiles: Record<string, { filename: string; code: string; language: string }> = {
    types: {
      filename: 'src/types/game.ts',
      language: 'typescript',
      code: `export type GameStatus =
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
  date: string;
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
}`,
    },
    hook: {
      filename: 'src/hooks/useGameStorage.ts',
      language: 'typescript',
      code: `import { useState, useEffect, useMemo, useCallback } from 'react';
import { Game, PlaySession, FilterOptions, SortOption } from '../types/game';
import { INITIAL_GAMES, INITIAL_SESSIONS } from '../data/initialGames';

export function useGameStorage() {
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const stored = localStorage.getItem('gamevault_games');
      return stored ? JSON.parse(stored) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  const [sessions, setSessions] = useState<PlaySession[]>(() => {
    try {
      const stored = localStorage.getItem('gamevault_sessions');
      return stored ? JSON.parse(stored) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('gamevault_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('gamevault_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Log session & auto-increment hours on the game
  const logPlaySession = useCallback((data: Omit<PlaySession, 'id'>) => {
    const newSession = { ...data, id: 'sess-' + Date.now() };
    setSessions(prev => [newSession, ...prev]);
    const addedHours = +(data.durationMinutes / 60).toFixed(1);
    setGames(prev => prev.map(g => g.id === data.gameId ? { ...g, hoursPlayed: g.hoursPlayed + addedHours } : g));
  }, []);

  return { games, sessions, logPlaySession /*, addGame, updateGame, deleteGame... */ };
}`,
    },
    card: {
      filename: 'src/components/GameCard.tsx',
      language: 'typescript',
      code: `export const GameCard: React.FC<GameCardProps> = ({ game, onSelect, onToggleFavorite }) => {
  const progressPercent = Math.min(100, Math.round((game.hoursPlayed / game.estimatedHours) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500 transition-all">
      <div className="relative h-44 cursor-pointer" onClick={() => onSelect(game)}>
        <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute top-2.5 right-2.5">
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(game.id); }}>
            <Star className={game.isFavorite ? "text-amber-400 fill-amber-400" : "text-white"} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-cyan-400 font-mono">{game.platform} · {game.genre}</div>
        <h3 className="font-bold text-base text-white">{game.title}</h3>
        <div className="mt-3 w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
          <div className="bg-cyan-500 h-full" style={{ width: \`\${progressPercent}%\` }} />
        </div>
      </div>
    </div>
  );
};`,
    },
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Terminal className="w-4 h-4" />
          <span>Full Frontend Engineering Blueprint</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          How to Build a Modern Games Management System
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          This system is crafted entirely on the client side with React 19, Chakra UI design language tokens,
          Tailwind styling, and persistent browser storage. Here is the step-by-step breakdown of how
          the data pipeline, reactivity model, and user interactions are architected.
        </p>
      </div>

      {/* 5-Step Process Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <Workflow className="w-5 h-5 text-cyan-400" />
          <span>Step-by-Step Architecture Guide</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl font-black font-heading text-cyan-400/80 mb-2">
                  {st.num}
                </div>
                <h4 className="font-heading font-bold text-sm text-white mb-1.5">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {st.desc}
                </p>
              </div>

              <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                <button
                  onClick={() => handleCopy(st.num, st.codeSnippet)}
                  className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  title="Copy snippet"
                >
                  {copiedKey === st.num ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <pre>{st.codeSnippet}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Inspector Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Full Source Code Inspector</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any core architectural module below to inspect or copy the full code.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {Object.entries(codeFiles).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setActiveCodeTab(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeCodeTab === key
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {val.filename.split('/').pop()}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Code Box */}
        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-500">
            <span>{codeFiles[activeCodeTab].filename}</span>
            <button
              onClick={() =>
                handleCopy(
                  activeCodeTab,
                  codeFiles[activeCodeTab].code
                )
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer text-xs"
            >
              {copiedKey === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto leading-relaxed max-h-[450px]">
            {codeFiles[activeCodeTab].code}
          </pre>
        </div>
      </div>
    </div>
  );
};
