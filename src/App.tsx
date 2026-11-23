/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { useGameStorage } from './hooks/useGameStorage';
import { Navbar, ActiveTab } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameTableView } from './components/GameTableView';
import { KanbanBoard } from './components/KanbanBoard';
import { AnalyticsView } from './components/AnalyticsView';
import { PlatformsView } from './components/PlatformsView';
import { ArchitectureGuideView } from './components/ArchitectureGuideView';
import { GameModal } from './components/GameModal';
import { GameDetailModal } from './components/GameDetailModal';
import { SessionLogModal } from './components/SessionLogModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Game, GameStatus, Platform } from './types/game';
import {
  Gamepad2,
  Plus,
  History,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export default function App() {
  const {
    games,
    sessions,
    filteredGames,
    stats,
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    addGame,
    updateGame,
    deleteGame,
    duplicateGame,
    toggleFavorite,
    updateStatus,
    quickAddPlaytime,
    logPlaySession,
    deleteSession,
    resetToDefaults,
    exportDataAsJSON,
    exportDataAsCSV,
    importDataFromJSON,
  } = useGameStorage();

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const [selectedDetailGame, setSelectedDetailGame] = useState<Game | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionTargetGame, setSessionTargetGame] = useState<Game | null>(null);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDangerous?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleOpenAddModal = () => {
    setEditingGame(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (game: Game) => {
    setEditingGame(game);
    setIsAddEditModalOpen(true);
  };

  const handleGameModalSubmit = (gameData: Omit<Game, 'id' | 'addedDate'>) => {
    if (editingGame) {
      updateGame(editingGame.id, gameData);
      showToast(`Updated "${gameData.title}"`);
      // sync with detail modal if open
      if (selectedDetailGame && selectedDetailGame.id === editingGame.id) {
        setSelectedDetailGame((prev) => (prev ? { ...prev, ...gameData } : null));
      }
    } else {
      const created = addGame(gameData);
      showToast(`Added "${created.title}" to library!`);
    }
  };

  const handleSelectGame = (game: Game) => {
    setSelectedDetailGame(game);
    setIsDetailModalOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    const game = games.find((g) => g.id === id);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Game?',
      message: `Are you sure you want to remove "${game?.title || 'this game'}" and its session history from your vault? This cannot be undone.`,
      isDangerous: true,
      onConfirm: () => {
        deleteGame(id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        if (selectedDetailGame?.id === id) {
          setIsDetailModalOpen(false);
        }
        showToast('Game deleted from vault.');
      },
    });
  };

  const handleResetDefaultsPrompt = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset to Sample Gaming Library?',
      message: 'This will reset your library and session history back to the curated 12 master titles. Any custom changes will be overwritten.',
      isDangerous: true,
      onConfirm: () => {
        resetToDefaults();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Library reset to default demo dataset.');
      },
    });
  };

  const handleQuickLog = (game: Game) => {
    setSessionTargetGame(game);
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = (sessionData: any) => {
    logPlaySession(sessionData);
    showToast(`Logged ${sessionData.durationMinutes}m for ${sessionData.gameTitle}!`);
    // update current detail game if opened
    if (selectedDetailGame && selectedDetailGame.id === sessionData.gameId) {
      const addedHours = +(sessionData.durationMinutes / 60).toFixed(1);
      setSelectedDetailGame((prev) =>
        prev
          ? {
              ...prev,
              hoursPlayed: +(prev.hoursPlayed + addedHours).toFixed(1),
            }
          : null
      );
    }
  };

  const handleImportJSON = (content: string) => {
    const res = importDataFromJSON(content);
    showToast(res.message);
  };

  const handleFilterByPlatform = (platform: Platform) => {
    setFilterOptions((prev) => ({ ...prev, platform }));
    setActiveTab('library');
  };

  // Sessions specifically for currently selected detail game
  const activeDetailSessions = React.useMemo(() => {
    if (!selectedDetailGame) return [];
    return sessions.filter((s) => s.gameId === selectedDetailGame.id);
  }, [sessions, selectedDetailGame]);

  return (
    <ChakraProvider value={defaultSystem}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={handleOpenAddModal}
          onOpenSessionModal={() => {
            setSessionTargetGame(null);
            setIsSessionModalOpen(true);
          }}
          onExportJSON={exportDataAsJSON}
          onExportCSV={exportDataAsCSV}
          onImportJSON={handleImportJSON}
          onResetDefaults={handleResetDefaultsPrompt}
          searchQuery={filterOptions.search}
          setSearchQuery={(q) =>
            setFilterOptions((prev) => ({ ...prev, search: q }))
          }
          totalGames={games.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Quick Metrics Banner (visible on library & backlog views) */}
          {(activeTab === 'library' || activeTab === 'kanban') && (
            <StatsBanner
              stats={stats}
              onFilterStatus={(status) => {
                setFilterOptions((prev) => ({ ...prev, status }));
                setActiveTab('library');
              }}
            />
          )}

          {/* VIEW: Library Catalog */}
          {activeTab === 'library' && (
            <div>
              <FilterBar
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                sortOption={sortOption}
                setSortOption={setSortOption}
                viewMode={viewMode}
                setViewMode={setViewMode}
                totalFiltered={filteredGames.length}
              />

              {/* View Output: Grid vs Table */}
              {viewMode === 'grid' ? (
                filteredGames.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                    <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold font-heading text-white">
                      No Games Found
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      No titles matched your filter criteria or search query. Try resetting your filters or adding a new game.
                    </p>
                    <button
                      onClick={handleOpenAddModal}
                      className="mt-4 px-4 py-2 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-xl hover:bg-cyan-300 transition-colors cursor-pointer"
                    >
                      + Add New Game
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onSelect={handleSelectGame}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeletePrompt}
                        onDuplicate={duplicateGame}
                        onToggleFavorite={toggleFavorite}
                        onUpdateStatus={updateStatus}
                        onQuickLog={handleQuickLog}
                      />
                    ))}
                  </div>
                )
              ) : (
                <GameTableView
                  games={filteredGames}
                  onSelect={handleSelectGame}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeletePrompt}
                  onDuplicate={duplicateGame}
                  onToggleFavorite={toggleFavorite}
                  onUpdateStatus={updateStatus}
                  onQuickAddPlaytime={quickAddPlaytime}
                  onQuickLog={handleQuickLog}
                />
              )}
            </div>
          )}

          {/* VIEW: Backlog Kanban */}
          {activeTab === 'kanban' && (
            <KanbanBoard
              games={games}
              onSelectGame={handleSelectGame}
              onUpdateStatus={updateStatus}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {/* VIEW: Play Sessions History */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">
                    Playtime Journal & Session Logs
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track gameplay history, session notes, unlocked achievements, and daily gaming duration.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSessionTargetGame(null);
                    setIsSessionModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Log New Session</span>
                </button>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold font-heading text-white">
                    No Sessions Logged Yet
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Start recording your play sessions to monitor total daily hours and campaign milestones.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4.5 transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-heading font-bold text-sm text-white">
                            {sess.gameTitle}
                          </span>
                          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800/80 text-cyan-300">
                            {(sess.durationMinutes / 60).toFixed(1)} hrs ({sess.durationMinutes}m)
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-slate-400 mb-2">
                          Logged on {sess.date}
                        </div>

                        {sess.notes && (
                          <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/70 italic">
                            "{sess.notes}"
                          </p>
                        )}

                        {sess.achievements && sess.achievements.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {sess.achievements.map((ach) => (
                              <span
                                key={ach}
                                className="text-[11px] font-mono bg-amber-950/50 border border-amber-800/60 text-amber-300 px-2 py-0.5 rounded-md"
                              >
                                🏆 {ach}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-end">
                        <button
                          onClick={() => deleteSession(sess.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Log</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: Analytics */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              games={games}
              sessions={sessions}
              stats={stats}
              onSelectGame={handleSelectGame}
            />
          )}

          {/* VIEW: Platforms */}
          {activeTab === 'platforms' && (
            <PlatformsView
              games={games}
              onSelectPlatform={handleFilterByPlatform}
              onSelectGame={handleSelectGame}
            />
          )}

          {/* VIEW: Architecture & Code Guide */}
          {activeTab === 'guide' && <ArchitectureGuideView />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span className="font-heading font-semibold text-slate-300">
                GameVault Pro
              </span>
              <span>· Pure React & Chakra UI Architecture</span>
            </div>
            <div>
              Client-side persistent storage · No external backend required
            </div>
          </div>
        </footer>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/60 text-slate-100 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Modals */}
        <GameModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          onSubmit={handleGameModalSubmit}
          initialGame={editingGame}
        />

        <GameDetailModal
          game={selectedDetailGame}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={handleOpenEditModal}
          onDelete={handleDeletePrompt}
          onDuplicate={duplicateGame}
          onToggleFavorite={toggleFavorite}
          onUpdateStatus={(id, st) => {
            updateStatus(id, st);
            setSelectedDetailGame((prev) => (prev ? { ...prev, status: st } : null));
          }}
          onQuickAddPlaytime={(id, hours) => {
            quickAddPlaytime(id, hours);
            setSelectedDetailGame((prev) =>
              prev
                ? {
                    ...prev,
                    hoursPlayed: +(prev.hoursPlayed + hours).toFixed(1),
                  }
                : null
            );
          }}
          onOpenSessionModal={handleQuickLog}
          gameSessions={activeDetailSessions}
        />

        <SessionLogModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          games={games}
          selectedGame={sessionTargetGame}
          onSaveSession={handleSaveSession}
        />

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          isDangerous={confirmDialog.isDangerous}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </ChakraProvider>
  );
}
