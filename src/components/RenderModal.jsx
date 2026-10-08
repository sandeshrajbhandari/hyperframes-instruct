import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Film,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
} from 'lucide-react';

export default function RenderModal({ project, isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'rendering' | 'done' | 'error'
  const [logs, setLogs] = useState('');
  const [hasVideo, setHasVideo] = useState(false);

  // Poll render status when open
  useEffect(() => {
    if (!isOpen || !project) return;

    let timer = null;
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}/render-status`);
        const data = await res.json();
        if (data.success) {
          setStatus(data.status);
          if (data.log) setLogs(data.log);
          setHasVideo(data.hasVideo);

          if (data.status === 'rendering') {
            timer = setTimeout(checkStatus, 1500);
          }
        }
      } catch (err) {
        console.error('Failed to fetch render status', err);
      }
    };

    checkStatus();
    return () => clearTimeout(timer);
  }, [isOpen, project?.id, status]);

  const handleStartRender = async () => {
    setStatus('rendering');
    setLogs('Initializing HyperFrames render engine...\n');
    setHasVideo(false);

    try {
      const res = await fetch(`/api/projects/${project.id}/render`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!data.success) {
        setStatus('error');
        setLogs((prev) => prev + `\nError: ${data.error}`);
      }
    } catch (err) {
      setStatus('error');
      setLogs((prev) => prev + `\nNetwork error: ${err.message}`);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export to MP4 Video</h2>
              <p className="text-xs text-slate-400">
                Deterministic frame-by-frame rendering with HyperFrames CLI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Status info */}
          <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <div>
              <div className="font-semibold text-white">{project.title}</div>
              <div className="text-slate-400 mt-0.5">
                {project.width}x{project.height} · {project.duration}s · 60 FPS
              </div>
            </div>

            <div>
              {status === 'rendering' ? (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Rendering Frames...
                </span>
              ) : status === 'done' ? (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Render Complete
                </span>
              ) : status === 'error' ? (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Render Failed
                </span>
              ) : (
                <button
                  onClick={handleStartRender}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Start Render
                </button>
              )}
            </div>
          </div>

          {/* Video preview if done */}
          {hasVideo && status === 'done' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">Rendered Video Output</label>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video max-h-56 flex items-center justify-center">
                <video
                  controls
                  autoPlay
                  loop
                  src={`/api/projects/${project.id}/video`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex justify-end mt-2">
                <a
                  href={`/api/projects/${project.id}/video`}
                  download={`${project.title.replace(/\s+/g, '_')}.mp4`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download .MP4
                </a>
              </div>
            </div>
          )}

          {/* Terminal Logs */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                CLI Process Output
              </span>
              {status === 'rendering' && (
                <span className="text-[11px] text-indigo-400 animate-pulse">Running...</span>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-40 overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre-wrap">{logs || 'Ready to render video...'}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Uses <code className="text-slate-400">npx hyperframes render --quality looks</code>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
