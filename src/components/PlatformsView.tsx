import React from 'react';
import { Game, Platform } from '../types/game';
import { Layers, Monitor, Disc, Gamepad, Tv, Smartphone, Clock, Star, ArrowRight } from 'lucide-react';

interface PlatformsViewProps {
  games: Game[];
  onSelectPlatform: (platform: Platform) => void;
  onSelectGame: (game: Game) => void;
}

interface PlatformMeta {
  platform: Platform;
  icon: React.ReactNode;
  brandColor: string;
  borderColor: string;
  badgeBg: string;
  tagline: string;
}

const PLATFORM_CONFIGS: PlatformMeta[] = [
  {
    platform: 'PC / Steam',
    icon: <Monitor className="w-5 h-5 text-cyan-400" />,
    brandColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    badgeBg: 'bg-cyan-950/60',
    tagline: 'High-framerate PC gaming, mods & early access',
  },
  {
    platform: 'PlayStation 5',
    icon: <Disc className="w-5 h-5 text-blue-400" />,
    brandColor: 'text-blue-400',
    borderColor: 'border-blue-500/40 hover:border-blue-400',
    badgeBg: 'bg-blue-950/60',
    tagline: 'DualSense haptics, Sony first-party blockbusters',
  },
  {
    platform: 'Xbox Series X',
    icon: <Tv className="w-5 h-5 text-emerald-400" />,
    brandColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    badgeBg: 'bg-emerald-950/60',
    tagline: 'Game Pass ultimate library & Quick Resume',
  },
  {
    platform: 'Nintendo Switch',
    icon: <Gamepad className="w-5 h-5 text-rose-400" />,
    brandColor: 'text-rose-400',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    badgeBg: 'bg-rose-950/60',
    tagline: 'Portable hybrid gaming & timeless Nintendo franchises',
  },
  {
    platform: 'Epic Games',
    icon: <Layers className="w-5 h-5 text-purple-400" />,
    brandColor: 'text-purple-400',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    badgeBg: 'bg-purple-950/60',
    tagline: 'Weekly free game library & Unreal exclusives',
  },
  {
    platform: 'GOG',
    icon: <Layers className="w-5 h-5 text-amber-400" />,
    brandColor: 'text-amber-400',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    badgeBg: 'bg-amber-950/60',
    tagline: 'DRM-free ownership & classic PC preservation',
  },
  {
    platform: 'Retro / Emulation',
    icon: <Gamepad className="w-5 h-5 text-orange-400" />,
    brandColor: 'text-orange-400',
    borderColor: 'border-orange-500/40 hover:border-orange-400',
    badgeBg: 'bg-orange-950/60',
    tagline: 'PS2, GameCube, SNES & arcade retro preservation',
  },
  {
    platform: 'Mobile',
    icon: <Smartphone className="w-5 h-5 text-pink-400" />,
    brandColor: 'text-pink-400',
    borderColor: 'border-pink-500/40 hover:border-pink-400',
    badgeBg: 'bg-pink-950/60',
    tagline: 'On-the-go handheld tactical and casual gaming',
  },
];

export const PlatformsView: React.FC<PlatformsViewProps> = ({
  games,
  onSelectPlatform,
  onSelectGame,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-heading text-white">
          Hardware Ecosystems & Storefronts
        </h2>
        <p className="text-xs text-slate-400">
          Manage your multi-platform game distribution, hardware allocation, and completion stats per console.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLATFORM_CONFIGS.map((cfg) => {
          const platformGames = games.filter((g) => g.platform === cfg.platform);
          const count = platformGames.length;
          const totalHours = +platformGames
            .reduce((acc, g) => acc + g.hoursPlayed, 0)
            .toFixed(1);
          const completedCount = platformGames.filter(
            (g) => g.status === 'Completed' || g.status === '100% Club'
          ).length;
          const completionPct = count ? Math.round((completedCount / count) * 100) : 0;
          const avgScore = count
            ? +(platformGames.reduce((acc, g) => acc + g.rating, 0) / count).toFixed(1)
            : 0;

          return (
            <div
              key={cfg.platform}
              className={`bg-slate-900/80 border ${cfg.borderColor} rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${cfg.badgeBg} border border-slate-800`}>
                      {cfg.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-white">
                        {cfg.platform}
                      </h3>
                      <div className="text-[11px] text-slate-400">{cfg.tagline}</div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Games</div>
                    <div className="text-base font-bold text-white">{count}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Playtime</div>
                    <div className={`text-base font-bold ${cfg.brandColor}`}>{totalHours}h</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Avg Score</div>
                    <div className="text-base font-bold text-amber-400">
                      {avgScore ? `${avgScore}` : '—'}
                    </div>
                  </div>
                </div>

                {/* Completion Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Platform Clear Rate</span>
                    <span className="font-semibold text-slate-200">{completionPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                {/* Top Titles Mini List */}
                {platformGames.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1.5">
                      Installed Titles ({platformGames.length})
                    </div>
                    <div className="space-y-1">
                      {platformGames.slice(0, 3).map((g) => (
                        <div
                          key={g.id}
                          onClick={() => onSelectGame(g)}
                          className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-300 hover:text-white"
                        >
                          <span className="truncate max-w-[180px]">{g.title}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {g.hoursPlayed}h
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View Games Button */}
              <button
                onClick={() => onSelectPlatform(cfg.platform)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <span>Filter Vault by {cfg.platform.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
