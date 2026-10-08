import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Terminal,
  Volume2,
  Repeat,
  Sparkles,
} from 'lucide-react';

export default function VideoPlayer({ project, onLaunchStudio }) {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(project.duration || 5);
  const [isLooping, setIsLooping] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [studioStatus, setStudioStatus] = useState('');

  // Handle messages from the iframe bridge
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data || e.data.type !== 'HF_STATE') return;
      setCurrentTime(e.data.time);
      if (e.data.duration) setDuration(e.data.duration);
      setIsPlaying(!e.data.paused);

      // Handle loop
      if (isLooping && e.data.progress >= 0.995 && !e.data.paused) {
        sendCommand('restart');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isLooping]);

  // Send message to preview iframe
  const sendCommand = (action, payload = {}) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ action, ...payload }, '*');
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      sendCommand('pause');
      setIsPlaying(false);
    } else {
      sendCommand('play');
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    sendCommand('restart');
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    sendCommand('seek', { time: newTime });
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    sendCommand('setSpeed', { speed });
  };

  // Keyboard shortcut: Space to play/pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const next = Math.max(0, currentTime - 0.25);
        sendCommand('seek', { time: next });
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(duration, currentTime + 0.25);
        sendCommand('seek', { time: next });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration]);

  const copyPreviewUrl = () => {
    const url = `${window.location.origin}/preview/${project.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenStudio = async () => {
    setStudioStatus('Launching Studio...');
    try {
      const res = await fetch(`/api/projects/${project.id}/open-studio`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStudioStatus('Studio active! Check console or browser.');
      } else {
        setStudioStatus('Studio: ' + (data.error || 'Done'));
      }
    } catch (err) {
      setStudioStatus('Studio error: ' + err.message);
    }
    setTimeout(() => setStudioStatus(''), 4000);
  };

  // Format time display: mm:ss.s
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toFixed(1);
    return `${m.toString().padStart(2, '0')}:${s.padStart(4, '0')}`;
  };

  const isVertical = (project.height || 1080) > (project.width || 1920);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Top Bar */}
      <div className="h-12 bg-slate-900/80 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-300">Live Preview</span>
          <span className="text-[11px] text-slate-500 font-mono">
            {project.width}x{project.height} · {project.duration}s
          </span>
        </div>

        <div className="flex items-center gap-2">
          {studioStatus && (
            <span className="text-[11px] text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {studioStatus}
            </span>
          )}

          <button
            onClick={handleOpenStudio}
            title="Launch official HyperFrames Studio CLI preview server"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Launch Studio
          </button>

          <button
            onClick={copyPreviewUrl}
            title="Copy preview link"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <a
            href={`/preview/${project.id}`}
            target="_blank"
            rel="noreferrer"
            title="Open in new tab"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Video Viewport Area */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center p-4 overflow-hidden select-none">
        <div
          className="relative max-w-full max-h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-black flex items-center justify-center"
          style={{
            aspectRatio: `${project.width || 1920} / ${project.height || 1080}`,
            width: isVertical ? 'auto' : '100%',
            height: isVertical ? '100%' : 'auto',
            maxHeight: isVertical ? '650px' : 'none',
          }}
        >
          <iframe
            ref={iframeRef}
            key={project.updated_at}
            src={`/preview/${project.id}`}
            title="HyperFrames Composition"
            className="w-full h-full border-0 absolute inset-0"
            allow="autoplay"
          />
        </div>
      </div>

      {/* Bottom Timeline Controls */}
      <div className="bg-slate-900/90 border-t border-slate-800 p-3 flex flex-col gap-2">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={duration || 5}
            step="0.05"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={handleRestart}
              title="Restart timeline (0s)"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsLooping(!isLooping)}
              title="Toggle loop"
              className={`p-2 rounded-lg transition-colors ${
                isLooping
                  ? 'bg-indigo-950 text-indigo-400 border border-indigo-700/50'
                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Time Counter */}
            <div className="font-mono text-slate-300 text-xs ml-2">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span className="text-slate-500"> / {formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Multiplier */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700/50">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    playbackSpeed === s
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
