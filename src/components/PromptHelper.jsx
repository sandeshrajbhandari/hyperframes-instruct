import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Wand2,
  FileCode,
  Sliders,
  Monitor,
  Smartphone,
  Music,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function PromptHelper({ isOpen, onClose }) {
  const [basePromptTemplate, setBasePromptTemplate] = useState('');
  const [topic, setTopic] = useState('Product launch video for a developer AI coding tool');
  const [aspectRatio, setAspectRatio] = useState('16:9'); // '16:9' or '9:16'
  const [duration, setDuration] = useState('8');
  const [style, setStyle] = useState('Tech SaaS & Deep Gradient Glow');
  const [script, setScript] = useState(
    'Beat 1 (0s - 2.5s): Hook: "Stop writing boilerplate."\n' +
    'Beat 2 (2.5s - 5.5s): Feature: "Build deterministic motion videos purely with HTML and code."\n' +
    'Beat 3 (5.5s - 8s): CTA: "Try HyperFrames today at hyperframes.com"'
  );
  const [includeVoiceover, setIncludeVoiceover] = useState(false);
  const [voiceoverPath, setVoiceoverPath] = useState('assets/voiceover.mp3');
  const [includeImages, setIncludeImages] = useState(false);
  const [imageList, setImageList] = useState(
    'assets/image1.png - Hero product visual\nassets/image2.png - Metrics dashboard visual'
  );
  const [includeTranscript, setIncludeTranscript] = useState(false);
  const [transcriptJson, setTranscriptJson] = useState(
    '[\n  { "start": 0.0, "end": 0.45, "text": "Stop" },\n  { "start": 0.50, "end": 0.95, "text": "writing" },\n  { "start": 1.00, "end": 1.80, "text": "boilerplate." }\n]'
  );
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/prompt-template')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.template) {
          setBasePromptTemplate(data.template);
        }
      })
      .catch((err) => console.error('Failed to load prompt template', err));
  }, []);

  const resolutionText =
    aspectRatio === '16:9'
      ? '1920x1080 Landscape (16:9) -> data-width="1920" data-height="1080"'
      : '1080x1920 Vertical Portrait (9:16) -> data-width="1080" data-height="1920"';

  // Build the complete combined prompt
  let mediaSection = '';
  if (includeVoiceover || includeImages || includeTranscript) {
    mediaSection += `\n### Voiceover & Media Assets Contract:\n`;
    if (includeVoiceover) {
      mediaSection += `- **Audio Voiceover Element**: Include \`<audio id="voiceover" src="${voiceoverPath}" data-start="0" data-duration="${duration}" data-track-index="1" data-volume="1"></audio>\`.\n  - *CRITICAL CONTRACT*: Must have \`id="voiceover"\`, NEVER add \`crossorigin\`, and NEVER call \`audio.play()\` or \`audio.pause()\` in JS (HyperFrames owns seek & playback).\n`;
    }
    if (includeImages && imageList.trim()) {
      mediaSection += `- **Available Images in assets/**:\n${imageList
        .split('\n')
        .map((l) => (l.trim().startsWith('-') ? l : `- ${l}`))
        .join('\n')}\n  - Place using \`<img class="clip" src="..." style="object-fit: cover;" ... />\` or inside scene containers.\n`;
    }
    if (includeTranscript && transcriptJson.trim()) {
      mediaSection += `- **Word-Level Transcript (Synchronize animations & text highlights to these exact timestamps)**:\n\`\`\`json\n${transcriptJson.trim()}\n\`\`\`\n  - Reveal scenes, text words, or highlight pills right at each word's \`start\` time.\n`;
    }
  }

  const fullPrompt = `${basePromptTemplate ? basePromptTemplate.split('## 4. User Prompt / Project Specification')[0] : ''}## User Video Specification

- **Video Topic / Objective**: ${topic}
- **Target Duration**: ${duration} seconds (root data-duration="${duration}")
- **Aspect Ratio & Resolution**: ${resolutionText}
- **Visual & Creative Style**: ${style}
- **Script / Narrative Beats**:
${script}
${mediaSection}
---
### Final Instruction:
Generate the COMPLETE standalone HyperFrames HTML file adhering strictly to the contract above.
Ensure:
1. Valid GSAP timeline paused at window.__timelines["main"]
2. Root <div id="root" data-composition-id="main" ...> with proper data-width, data-height, and data-duration
3. Timed clips with data-start and data-duration
4. Return ONLY valid, executable HTML inside a single \`\`\`html code block.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                HyperFrames AI Prompt Generator
              </h2>
              <p className="text-xs text-slate-400">
                Generate tailored instructions for ChatGPT or Claude to get a ready-to-render HTML video
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Form */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              1. Video Parameters
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Video Topic / Objective
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Sizzle reel for my new mobile app"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      aspectRatio === '16:9'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    16:9
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      aspectRatio === '9:16'
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    9:16
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Visual Style Preset
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Tech SaaS & Deep Gradient Glow">Tech SaaS & Deep Gradient Glow</option>
                <option value="Kinetic Typography & Impact Words">Kinetic Typography & Impact Words</option>
                <option value="Minimalist Elegant & Clean Design">Minimalist Elegant & Clean Design</option>
                <option value="Cyberpunk Neon High Contrast">Cyberpunk Neon High Contrast</option>
                <option value="Bold Commercial Brand Sizzle">Bold Commercial Brand Sizzle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Script / Narrative Beats
              </label>
              <textarea
                rows="3"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Write your scene breakdown or voiceover script..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono resize-none"
              />
            </div>

            {/* Voiceover & Media Assets Accordion */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              <button
                type="button"
                onClick={() => setShowMediaSection(!showMediaSection)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Voiceover & Media Assets (Optional)</span>
                  {(includeVoiceover || includeImages || includeTranscript) && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  )}
                </div>
                {showMediaSection ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {showMediaSection && (
                <div className="p-3 border-t border-slate-800/80 flex flex-col gap-3 text-xs">
                  {/* Voiceover Checkbox & Path */}
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={includeVoiceover}
                        onChange={(e) => setIncludeVoiceover(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span className="font-medium">Include Voiceover Audio File</span>
                    </label>
                    {includeVoiceover && (
                      <input
                        type="text"
                        value={voiceoverPath}
                        onChange={(e) => setVoiceoverPath(e.target.value)}
                        placeholder="assets/voiceover.mp3"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>

                  {/* Images Checkbox & List */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/60">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={includeImages}
                        onChange={(e) => setIncludeImages(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span className="font-medium">Include List of Images</span>
                    </label>
                    {includeImages && (
                      <textarea
                        rows="2"
                        value={imageList}
                        onChange={(e) => setImageList(e.target.value)}
                        placeholder="assets/image1.png - Hero product shot&#10;assets/image2.png - Chart"
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    )}
                  </div>

                  {/* Transcript Checkbox & JSON */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/60">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={includeTranscript}
                        onChange={(e) => setIncludeTranscript(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span className="font-medium">Include Word-Level Transcript JSON</span>
                    </label>
                    {includeTranscript && (
                      <textarea
                        rows="4"
                        value={transcriptJson}
                        onChange={(e) => setTranscriptJson(e.target.value)}
                        placeholder='[&#10;  { "start": 0.0, "end": 0.5, "text": "Hello" }&#10;]'
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-white font-mono focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                2. Generated Prompt for LLM
              </h3>
              <span className="text-[11px] text-slate-500">Ready to paste into ChatGPT</span>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-y-auto max-h-[320px] select-all leading-relaxed">
              <pre className="whitespace-pre-wrap">{fullPrompt}</pre>
            </div>

            {/* Quick tips */}
            <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-xl p-3 text-[11px] text-indigo-300 flex items-start gap-2">
              <Wand2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>Workflow:</strong> Copy this prompt, paste into ChatGPT or Claude. Once it responds with the HTML, copy the code and click <strong>Paste HTML</strong> in your project editor!
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <a
            href="https://chat.openai.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Open ChatGPT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt for ChatGPT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
