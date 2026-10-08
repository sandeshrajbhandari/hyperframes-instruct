import React from 'react';
import { Video, Film, Wand2, Download, Plus, LayoutGrid, MonitorPlay, Sparkles, ShieldAlert } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  activeProject,
  onNewProject,
  onOpenRender,
  onOpenAudit,
  onOpenPromptHelper,
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => setCurrentView('projects')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              HyperFrames
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">Deterministic HTML Video Hub</p>
          </div>
        </div>

        {/* View Switcher */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setCurrentView('projects')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'projects'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Projects
          </button>

          {activeProject && (
            <button
              onClick={() => setCurrentView('editor')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span className="max-w-[140px] truncate">{activeProject.title}</span>
            </button>
          )}

          <button
            onClick={onOpenPromptHelper}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-indigo-400 hover:bg-slate-800/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Prompt Helper
          </button>
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {activeProject && currentView === 'editor' && (
          <>
            <button
              onClick={onOpenAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700/60 shadow-sm transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Check Overlaps
            </button>

            <button
              onClick={onOpenRender}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export MP4
            </button>
          </>
        )}

        <button
          onClick={onNewProject}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Video
        </button>
      </div>
    </header>
  );
}
