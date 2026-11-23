import React, { useState, useRef } from 'react';
import {
  Gamepad2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  BookOpen,
  LayoutGrid,
  Kanban,
  BarChart3,
  Layers,
  History,
  Search,
  X,
} from 'lucide-react';

export type ActiveTab = 'library' | 'kanban' | 'sessions' | 'analytics' | 'platforms' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onOpenSessionModal: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportJSON: (content: string) => void;
  onResetDefaults: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalGames: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenSessionModal,
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onResetDefaults,
  searchQuery,
  setSearchQuery,
  totalGames,
}) => {
  const [showDataMenu, setShowDataMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onImportJSON(text);
        }
      };
      reader.readAsText(file);
    }
    // reset input
    if (e.target) e.target.value = '';
    setShowDataMenu(false);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'library', label: 'Library', icon: <LayoutGrid className="w-4 h-4" />, badge: totalGames },
    { id: 'kanban', label: 'Backlog Queue', icon: <Kanban className="w-4 h-4" /> },
    { id: 'sessions', label: 'Play Log', icon: <History className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'platforms', label: 'Platforms', icon: <Layers className="w-4 h-4" /> },
    { id: 'guide', label: 'Full Code & Guide', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('library')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg text-white tracking-wide">GAME<span className="text-cyan-400">VAULT</span></span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold">
                  REACT
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">Frontend Management System</div>
            </div>
          </div>

          {/* Search bar in header */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, developers, tags, or notes..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Session Log */}
            <button
              onClick={onOpenSessionModal}
              title="Log a gaming session"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Log Session</span>
            </button>

            {/* Add Game Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg shadow-sm shadow-cyan-500/30 transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Game</span>
            </button>

            {/* Data Management Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDataMenu(!showDataMenu)}
                title="Backup, export, and import options"
                className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>

              {showDataMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs"
                  onMouseLeave={() => setShowDataMenu(false)}
                >
                  <div className="px-3 py-1.5 font-semibold text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                    Data & Backups
                  </div>

                  <button
                    onClick={() => {
                      onExportJSON();
                      setShowDataMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Export JSON Backup</span>
                  </button>

                  <button
                    onClick={() => {
                      onExportCSV();
                      setShowDataMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV Spreadsheet</span>
                  </button>

                  <label className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Import JSON File</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      onResetDefaults();
                      setShowDataMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Sample Games</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60 -mb-[1px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
