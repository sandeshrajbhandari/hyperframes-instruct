import React, { useState } from 'react';
import {
  X,
  Plus,
  Monitor,
  Smartphone,
  FileCode,
  Sparkles,
  ClipboardPaste,
  FolderOpen,
} from 'lucide-react';

export default function NewProjectModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [templateType, setTemplateType] = useState('starter'); // 'starter', 'bermuda', 'blank', 'paste'
  const [pastedCode, setPastedCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'Untitled Video';
    const isVertical = aspectRatio === '9:16';
    const width = isVertical ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;

    if (templateType === 'bermuda') {
      onCreate({
        title: title.trim() || 'The Bermuda Triangle Mystery',
        width: 1920,
        height: 1080,
        duration: 46,
        template: 'bermuda',
      });
      setTitle('');
      setPastedCode('');
      onClose();
      return;
    }

    let html = '';
    if (templateType === 'paste' && pastedCode.trim()) {
      html = pastedCode;
    } else if (templateType === 'blank') {
      html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${width}, height=${height}" />
    <title>${finalTitle}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #090d16;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        overflow: hidden;
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .clip {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      h1 { font-size: 72px; margin: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="${width}" data-height="${height}" data-duration="5">
      <section id="scene-title" class="clip" data-start="0" data-duration="5">
        <h1 id="title">${finalTitle}</h1>
      </section>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2);
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;
    }

    onCreate({
      title: finalTitle,
      width,
      height,
      duration: 5,
      html: html || undefined, // server will use default starter if undefined
    });

    setTitle('');
    setPastedCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Create New Video Project</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Product Teaser"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Format / Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-bold">16:9 Landscape</div>
                  <div className="text-[10px] text-slate-500">1920 × 1080 (YouTube/Web)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-bold">9:16 Vertical</div>
                  <div className="text-[10px] text-slate-500">1080 × 1920 (Reels/Shorts)</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Initial Content
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('starter')}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  templateType === 'starter'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                Starter Sample
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('bermuda')}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  templateType === 'bermuda'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderOpen className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                Bermuda (VO)
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('blank')}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  templateType === 'blank'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                Minimal Blank
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('paste')}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  templateType === 'paste'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ClipboardPaste className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                Paste HTML
              </button>
            </div>
          </div>

          {templateType === 'paste' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste HyperFrames HTML Code
              </label>
              <textarea
                rows="4"
                value={pastedCode}
                onChange={(e) => setPastedCode(e.target.value)}
                placeholder="<!doctype html>..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono resize-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Create Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
