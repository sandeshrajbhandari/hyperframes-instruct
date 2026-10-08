import React, { useState } from 'react';
import {
  Plus,
  Play,
  ExternalLink,
  Copy,
  Trash2,
  Clock,
  Film,
  Search,
  Monitor,
  Smartphone,
  Check,
} from 'lucide-react';

export default function ProjectList({
  projects,
  onSelectProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
}) {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const copyPreviewLink = (e, id) => {
    e.stopPropagation();
    const url = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Video Projects</h1>
          <p className="text-sm text-slate-400 mt-1">
            Deterministic HTML5 HyperFrames compositions backed by SQLite.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64 transition-all"
            />
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Card */}
        <div
          onClick={onNewProject}
          className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group bg-slate-900/20 hover:bg-indigo-950/10 transition-all min-h-[260px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 flex items-center justify-center text-slate-400 transition-colors mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors text-sm">
            Create New Video
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
            Start with standard 16:9, vertical 9:16, or paste raw HTML code.
          </p>
        </div>

        {/* Existing Projects */}
        {filtered.map((proj) => {
          const isVertical = proj.height > proj.width;
          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="group bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-950/20 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail / Header Area */}
                <div className="relative h-36 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-4 border-b border-slate-800/80 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/80 text-slate-300 border border-slate-700/60 backdrop-blur-sm">
                      {isVertical ? (
                        <Smartphone className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <Monitor className="w-3 h-3 text-indigo-400" />
                      )}
                      {proj.width} × {proj.height}
                    </span>

                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 backdrop-blur-sm">
                      <Clock className="w-3 h-3" />
                      {Number(proj.duration).toFixed(1)}s
                    </span>
                  </div>

                  <div className="z-10">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Updated {new Date(proj.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Ambient background glow */}
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-950/40 flex items-center justify-between text-xs border-t border-slate-800/40">
                <button
                  onClick={(e) => copyPreviewLink(e, proj.id)}
                  title="Copy direct preview link"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
                >
                  {copiedId === proj.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy Link</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={`/preview/${proj.id}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Open standalone preview in new tab"
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateProject(proj.id);
                    }}
                    title="Duplicate project"
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${proj.title}"?`)) onDeleteProject(proj.id);
                    }}
                    title="Delete project"
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
