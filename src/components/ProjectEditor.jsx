import React, { useState, useEffect } from 'react';
import {
  Save,
  ClipboardPaste,
  Code2,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  Columns,
  Monitor,
  Smartphone,
  Check,
  ShieldAlert,
  FolderOpen,
} from 'lucide-react';
import VideoPlayer from './VideoPlayer.jsx';
import AssetManager from './AssetManager.jsx';

export default function ProjectEditor({
  project,
  onSave,
  onOpenPromptHelper,
  onOpenAudit,
  onLaunchStudio,
}) {
  const [title, setTitle] = useState(project.title);
  const [html, setHtml] = useState(project.html);
  const [width, setWidth] = useState(project.width || 1920);
  const [height, setHeight] = useState(project.height || 1080);
  const [duration, setDuration] = useState(project.duration || 5);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pastedSuccess, setPastedSuccess] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'code', 'preview'

  // Update when project prop changes
  useEffect(() => {
    setTitle(project.title);
    setHtml(project.html);
    setWidth(project.width || 1920);
    setHeight(project.height || 1080);
    setDuration(project.duration || 5);
    setHasUnsavedChanges(false);
  }, [project.id]);

  // Handle changes in HTML
  const handleHtmlChange = (newHtml) => {
    setHtml(newHtml);
    setHasUnsavedChanges(true);

    // Auto-detect attributes from HTML
    const wMatch = newHtml.match(/data-width=["']?(\d+)["']?/i);
    const hMatch = newHtml.match(/data-height=["']?(\d+)["']?/i);
    const dMatch = newHtml.match(/data-duration=["']?([0-9.]+)["']?/i);

    if (wMatch) setWidth(parseInt(wMatch[1], 10));
    if (hMatch) setHeight(parseInt(hMatch[1], 10));
    if (dMatch) setDuration(parseFloat(dMatch[1]));
  };

  const handleSave = () => {
    onSave({
      id: project.id,
      title,
      html,
      width: Number(width),
      height: Number(height),
      duration: Number(duration),
    });
    setHasUnsavedChanges(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 0) {
        handleHtmlChange(text);
        setPastedSuccess(true);
        setTimeout(() => setPastedSuccess(false), 2000);
      }
    } catch (err) {
      alert('Unable to read clipboard. Please paste directly into the editor.');
    }
  };

  // Keyboard shortcut Cmd/Ctrl + S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, html, width, height, duration]);

  // Validation checks
  const validations = [
    {
      label: 'Includes GSAP library',
      passed: html.includes('gsap') || html.includes('gsap.min.js'),
    },
    {
      label: 'Declared composition root (data-composition-id)',
      passed: html.includes('data-composition-id'),
    },
    {
      label: 'Registered window.__timelines timeline',
      passed: html.includes('window.__timelines'),
    },
    {
      label: 'Timeline is paused by default',
      passed: html.includes('paused: true') || html.includes('paused:true'),
    },
  ];

  const allValid = validations.every((v) => v.passed);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Project Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Project Title"
            className="text-base font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 transition-all w-64"
          />

          <div className="flex items-center gap-2 border-l border-slate-800 pl-4 text-xs">
            {/* Format quick buttons */}
            <button
              onClick={() => {
                setWidth(1920);
                setHeight(1080);
                setHasUnsavedChanges(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                width === 1920 && height === 1080
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3 h-3" />
              16:9 Landscape
            </button>

            <button
              onClick={() => {
                setWidth(1080);
                setHeight(1920);
                setHasUnsavedChanges(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                width === 1080 && height === 1920
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              9:16 Vertical
            </button>

            <div className="flex items-center gap-1 ml-2 text-slate-400">
              <span>Dur:</span>
              <input
                type="number"
                step="0.5"
                min="1"
                max="300"
                value={duration}
                onChange={(e) => {
                  setDuration(parseFloat(e.target.value) || 5);
                  setHasUnsavedChanges(true);
                }}
                className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-white text-center focus:outline-none focus:border-indigo-500"
              />
              <span>s</span>
            </div>
          </div>
        </div>

        {/* View mode & Actions */}
        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Code Only
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Preview Only
            </button>
            <button
              onClick={() => setViewMode('assets')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'assets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Assets (Images & VO)
            </button>
          </div>

          <button
            onClick={handlePasteClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
          >
            {pastedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Pasted!</span>
              </>
            ) : (
              <>
                <ClipboardPaste className="w-3.5 h-3.5 text-indigo-400" />
                <span>Paste HTML</span>
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Asset Manager Pane */}
        {viewMode === 'assets' && (
          <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
            <AssetManager projectId={project.id} projectTitle={title} />
          </div>
        )}

        {/* Code Editor Pane */}
        {viewMode !== 'assets' && (viewMode === 'code' || viewMode === 'split') && (
          <div
            className={`flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl transition-all ${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            }`}
          >
            <div className="h-10 bg-slate-900 px-4 flex items-center justify-between border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-400">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>index.html</span>
                {hasUnsavedChanges && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes"></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPromptHelper}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Need a Prompt for ChatGPT?
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="flex-1 relative bg-slate-950">
              <textarea
                value={html}
                onChange={(e) => handleHtmlChange(e.target.value)}
                spellCheck="false"
                placeholder="<!-- Paste your ChatGPT generated HyperFrames HTML here -->"
                className="w-full h-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-indigo-600/40"
              />
            </div>

            {/* Validation Bar */}
            <div className="h-8 bg-slate-900/90 border-t border-slate-800 px-4 flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                {allValid ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className={allValid ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                  {allValid ? 'HyperFrames Contract Valid' : 'Check Requirements'}
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto text-slate-400">
                {validations.map((v, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 shrink-0 ${
                      v.passed ? 'text-slate-300' : 'text-slate-600 line-through'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${v.passed ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
                    {v.label}
                  </span>
                ))}
              </div>

              {onOpenAudit && (
                <button
                  onClick={onOpenAudit}
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 shrink-0 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Audit & Prescribed Fixes →</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Preview Player Pane */}
        {viewMode !== 'assets' && (viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex flex-col transition-all ${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            }`}
          >
            <VideoPlayer
              project={{
                id: project.id,
                width,
                height,
                duration,
                updated_at: project.updated_at,
              }}
              onLaunchStudio={onLaunchStudio}
            />
          </div>
        )}
      </div>
    </div>
  );
}
