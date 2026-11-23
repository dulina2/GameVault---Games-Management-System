import React from 'react';
import { LibraryStats } from '../types/game';
import { Gamepad2, PlayCircle, CheckCircle2, Clock, Star, Layers } from 'lucide-react';

interface StatsBannerProps {
  stats: LibraryStats;
  onFilterStatus?: (status: any) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats, onFilterStatus }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Total Games */}
      <div
        onClick={() => onFilterStatus && onFilterStatus('All')}
        className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-3.5 transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px]">Vault Total</span>
          <Gamepad2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-2xl font-bold font-heading text-white">{stats.totalGames}</div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          {stats.favoriteCount} favorites starred
        </div>
      </div>

      {/* Currently Playing */}
      <div
        onClick={() => onFilterStatus && onFilterStatus('Playing')}
        className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-emerald-500/50 rounded-xl p-3.5 transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px]">Now Playing</span>
          <PlayCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-2xl font-bold font-heading text-emerald-400">{stats.currentlyPlaying}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Active campaigns</div>
      </div>

      {/* Backlog */}
      <div
        onClick={() => onFilterStatus && onFilterStatus('Backlog')}
        className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-amber-500/50 rounded-xl p-3.5 transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px]">Backlog Queue</span>
          <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-2xl font-bold font-heading text-amber-400">{stats.backlogCount}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Awaiting playthrough</div>
      </div>

      {/* Completed */}
      <div
        onClick={() => onFilterStatus && onFilterStatus('Completed')}
        className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-purple-500/50 rounded-xl p-3.5 transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px]">Finished</span>
          <CheckCircle2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-2xl font-bold font-heading text-purple-400">{stats.completedGames}</div>
        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
          <span>{stats.completionRate}% rate</span>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${Math.min(100, stats.completionRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Total Playtime */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px]">Hours Logged</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold font-heading text-blue-400">
          {stats.totalHoursPlayed} <span className="text-xs font-normal text-slate-400">hrs</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          ~{(stats.totalHoursPlayed / 24).toFixed(1)} full days
        </div>
      </div>

      {/* Avg Rating */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px]">Avg Score</span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
        </div>
        <div className="text-2xl font-bold font-heading text-yellow-400 flex items-baseline gap-1">
          {stats.averageRating}
          <span className="text-xs font-normal text-slate-500">/ 10</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">Critical vault average</div>
      </div>
    </div>
  );
};
