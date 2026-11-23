import React from 'react';
import { Game, PlaySession, LibraryStats, Genre, Platform } from '../types/game';
import {
  BarChart3,
  Trophy,
  Clock,
  CheckCircle2,
  Layers,
  Star,
  Flame,
  TrendingUp,
  Award,
  History,
} from 'lucide-react';

interface AnalyticsViewProps {
  games: Game[];
  sessions: PlaySession[];
  stats: LibraryStats;
  onSelectGame: (game: Game) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  games,
  sessions,
  stats,
  onSelectGame,
}) => {
  // Aggregate Genre statistics
  const genreStats = React.useMemo(() => {
    const map: Record<string, { count: number; hours: number }> = {};
    games.forEach((g) => {
      if (!map[g.genre]) {
        map[g.genre] = { count: 0, hours: 0 };
      }
      map[g.genre].count += 1;
      map[g.genre].hours += g.hoursPlayed;
    });

    return Object.entries(map)
      .map(([genre, data]) => ({
        genre,
        count: data.count,
        hours: +data.hours.toFixed(1),
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [games]);

  // Aggregate Platform statistics
  const platformStats = React.useMemo(() => {
    const map: Record<string, { count: number; hours: number }> = {};
    games.forEach((g) => {
      const p = g.platform;
      if (!map[p]) {
        map[p] = { count: 0, hours: 0 };
      }
      map[p].count += 1;
      map[p].hours += g.hoursPlayed;
    });

    return Object.entries(map)
      .map(([platform, data]) => ({
        platform,
        count: data.count,
        hours: +data.hours.toFixed(1),
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [games]);

  // Top 5 rated games
  const topRatedGames = React.useMemo(() => {
    return [...games].sort((a, b) => b.rating - a.rating || b.hoursPlayed - a.hoursPlayed).slice(0, 5);
  }, [games]);

  // Most played games
  const mostPlayedGames = React.useMemo(() => {
    return [...games].sort((a, b) => b.hoursPlayed - a.hoursPlayed).slice(0, 5);
  }, [games]);

  const maxGenreHours = Math.max(...genreStats.map((g) => g.hours), 1);
  const maxPlatformHours = Math.max(...platformStats.map((p) => p.hours), 1);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Vault Analytics & Gaming Intelligence</h2>
        <p className="text-xs text-slate-400">
          Deep-dive analysis of your play habits, genre affinities, platform utilization, and backlog completion rate.
        </p>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px]">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-400">
            {stats.completionRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.completedGames} of {stats.totalGames} titles finished
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px]">Total Time Invested</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-cyan-400">
            {stats.totalHoursPlayed} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Equivalent to {(stats.totalHoursPlayed / 24).toFixed(1)} days of playtime
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px]">Backlog Deficit</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-amber-400">
            {stats.backlogCount} <span className="text-xs font-normal text-slate-400">games</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Estimated ~{games.filter(g => g.status === 'Backlog').reduce((acc, g) => acc + g.estimatedHours, 0)} hours needed
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px]">Vault Quality Score</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-yellow-400">
            {stats.averageRating} <span className="text-xs font-normal text-slate-400">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {stats.totalGames} curated experiences
          </p>
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Hours Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Hours by Genre</span>
            </h3>
            <span className="text-[11px] text-slate-400">Playtime ranking</span>
          </div>

          <div className="space-y-3">
            {genreStats.map((item) => {
              const widthPct = Math.round((item.hours / maxGenreHours) * 100);
              return (
                <div key={item.genre} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{item.genre}</span>
                    <span className="font-mono text-cyan-400 font-semibold">
                      {item.hours} hrs ({item.count} games)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, widthPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Hours Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Platform Investment</span>
            </h3>
            <span className="text-[11px] text-slate-400">Hardware ecosystems</span>
          </div>

          <div className="space-y-3">
            {platformStats.map((item) => {
              const widthPct = Math.round((item.hours / maxPlatformHours) * 100);
              return (
                <div key={item.platform} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{item.platform}</span>
                    <span className="font-mono text-purple-400 font-semibold">
                      {item.hours} hrs · {item.count} games
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, widthPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Played Games */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Top 5 Most Played</span>
            </h3>
            <span className="text-[11px] text-slate-400">All-time hours</span>
          </div>

          <div className="space-y-2.5">
            {mostPlayedGames.map((game, idx) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="flex items-center justify-between p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 text-center font-heading font-bold text-sm text-slate-500 group-hover:text-cyan-400">
                    #{idx + 1}
                  </span>
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-8 h-10 object-cover rounded bg-slate-900 border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-400 truncate">
                      {game.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{game.platform}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    {game.hoursPlayed} hrs
                  </div>
                  <div className="text-[10px] text-slate-400">{game.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Rated Games */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Critical Masterpieces</span>
            </h3>
            <span className="text-[11px] text-slate-400">Highest rated</span>
          </div>

          <div className="space-y-2.5">
            {topRatedGames.map((game, idx) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="flex items-center justify-between p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 text-center font-heading font-bold text-sm text-slate-500 group-hover:text-amber-400">
                    #{idx + 1}
                  </span>
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-8 h-10 object-cover rounded bg-slate-900 border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400 truncate">
                      {game.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{game.genre}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{game.rating}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions Activity Feed */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Recent Play Session Feed</span>
          </h3>
          <span className="text-[11px] text-slate-400">{sessions.length} total logs</span>
        </div>

        <div className="space-y-2">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-bold text-white">{sess.gameTitle}</div>
                {sess.notes && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{sess.notes}</p>
                )}
                {sess.achievements && sess.achievements.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-amber-400 font-mono">
                    <Trophy className="w-3 h-3" />
                    <span>Unlocked: {sess.achievements.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="text-right font-mono text-xs">
                <div className="text-cyan-400 font-semibold">{sess.durationMinutes} mins</div>
                <div className="text-[10px] text-slate-500">{sess.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
