import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Music,
  Trash2,
  Copy,
  Check,
  FileCode,
  AlertCircle,
  Loader2,
  Sparkles,
  FileAudio,
  FolderOpen,
  Mic,
} from 'lucide-react';

export default function AssetManager({
  projectId,
  projectTitle,
  onInsertSnippet,
  onOpenTranscription,
  onOpenPromptHelper,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingBermuda, setLoadingBermuda] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const loadAssets = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/assets`);
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error('Failed to load assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [projectId]);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const base64 = await base64Promise;
        await fetch(`/api/projects/${projectId}/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64,
          }),
        });
      } catch (err) {
        console.error('Failed to upload file', file.name, err);
      }
    }

    setUploading(false);
    await loadAssets();
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Delete ${filename}?`)) return;
    try {
      await fetch(`/api/projects/${projectId}/assets/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      loadAssets();
    } catch (err) {
      alert('Failed to delete asset: ' + err.message);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleLoadBermuda = async () => {
    setLoadingBermuda(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/load-bermuda-assets`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        await loadAssets();
      } else {
        alert(data.error || 'Failed to load Bermuda assets');
      }
    } catch (err) {
      alert('Error loading Bermuda assets: ' + err.message);
    } finally {
      setLoadingBermuda(false);
    }
  };

  const copyAllForPrompt = () => {
    if (assets.length === 0) return;
    let md = `### Available Project Assets in assets/:\n`;
    assets.forEach((a) => {
      if (a.type === 'audio') {
        md += `- Audio: \`${a.path}\` (Voiceover / sound)\n`;
      } else if (a.type === 'image') {
        md += `- Image: \`${a.path}\`\n`;
      } else {
        md += `- File: \`${a.path}\`\n`;
      }
    });
    copyToClipboard(md, 'all-prompt');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-y-auto p-6 gap-6">
      {/* Top Banner & Upload Drop Zone */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            Project Media Assets (assets/)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store voiceover audio, graphics, and image files for this HyperFrames video composition
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadBermuda}
            disabled={loadingBermuda}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 transition-all cursor-pointer"
            title="Copy Bermuda Triangle voiceover (.wav) and 3 scene images into this project"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{loadingBermuda ? 'Loading Bermuda Assets...' : 'Load Bermuda Example Assets'}</span>
          </button>

          {assets.length > 0 && (
            <>
              {onOpenPromptHelper && (
                <button
                  onClick={onOpenPromptHelper}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/40 hover:to-cyan-600/40 text-indigo-200 border border-indigo-500/40 transition-all cursor-pointer shadow-sm"
                  title="Open AI Prompt Creator with these assets pre-loaded"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Generate Prompt with Assets</span>
                </button>
              )}

              <button
                onClick={copyAllForPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Copy list of asset paths formatted for ChatGPT prompt"
              >
                {copiedId === 'all-prompt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Asset List!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy Asset List for Prompt</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-950/20'
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,.json,.srt,.vtt"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">
            {uploading ? 'Uploading Files...' : 'Drop images or audio files here, or click to browse'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Supports PNG, JPG, WebP, SVG, MP3, WAV, M4A (saved automatically to <code>projects/{projectId}/assets/</code>)
          </div>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span>Uploaded Files ({assets.length})</span>
          <span>Relative Path for HTML</span>
        </div>

        {loading && (
          <div className="py-12 flex justify-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        )}

        {!loading && assets.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500 border border-slate-800/80 rounded-xl bg-slate-950/30">
            No media assets uploaded yet. Drop your voiceover audio file (.mp3) or scene images above.
          </div>
        )}

        {!loading && assets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset) => {
              const isAudio = asset.type === 'audio';
              const isImage = asset.type === 'image';
              const audioSnippet = `<audio id="voiceover" src="${asset.path}" data-start="0" data-duration="10" data-track-index="1" data-volume="1"></audio>`;
              const imageSnippet = `<img class="clip" src="${asset.path}" data-start="0" data-duration="5" style="object-fit: cover; width: 100%; height: 100%;" />`;

              return (
                <div
                  key={asset.name}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        {isImage && (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                        {isAudio && <Music className="w-5 h-5 text-indigo-400" />}
                        {!isImage && !isAudio && <FileCode className="w-5 h-5 text-slate-400" />}
                      </div>

                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate" title={asset.name}>
                          {asset.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                          <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">
                            {asset.path}
                          </code>
                          <span>•</span>
                          <span>{formatSize(asset.size)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(asset.name)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Audio preview player */}
                  {isAudio && (
                    <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/80">
                      <audio controls src={asset.url} className="w-full h-8" />
                    </div>
                  )}

                  {/* Quick Copy Snippets */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => copyToClipboard(asset.path, `path-${asset.name}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                      title="Copy relative file path"
                    >
                      {copiedId === `path-${asset.name}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied Path!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy Path</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          isAudio ? audioSnippet : imageSnippet,
                          `tag-${asset.name}`
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-900/50 transition-colors"
                      title="Copy ready-to-paste HyperFrames HTML tag"
                    >
                      {copiedId === `tag-${asset.name}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied Tag!</span>
                        </>
                      ) : (
                        <>
                          <FileCode className="w-3 h-3 text-indigo-400" />
                          <span>Copy HTML Tag</span>
                        </>
                      )}
                    </button>

                    {isAudio && onOpenTranscription && (
                      <button
                        onClick={onOpenTranscription}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-sm transition-all cursor-pointer"
                        title="Transcribe voiceover with Gemini (Word & Sentence timestamps)"
                      >
                        <Mic className="w-3 h-3" />
                        <span>Transcribe</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
