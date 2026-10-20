import React, { useState, useEffect, useMemo } from 'react';
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
  FileText,
  FolderOpen,
  Mic,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { SAMPLE_BERMUDA_TRANSCRIPT } from './TranscriptionView.jsx';

export const BERMUDA_PRESET_IMAGES = [
  {
    id: 'b-img-1',
    path: 'assets/bermuda-triangle-overlay-on-globe-map.png',
    role: 'Scene 1 (0s - 14.5s): Globe map overlay with Bermuda Triangle geometry, coordinates, and classified dossier badge',
    selected: true,
  },
  {
    id: 'b-img-2',
    path: 'assets/fighter-pilots-flying-over-rough-sea-dark-cloud-on-horizon.png',
    role: 'Scene 2 (14.5s - 26.5s): Flight 19 Navy Avenger aircraft flying into storm clouds over rough seas',
    selected: true,
  },
  {
    id: 'b-img-3',
    path: 'assets/ship drone shot wide angle bermuda triangle in strom.png',
    role: 'Scene 3 (26.5s - 46s): Wide angle drone shot of abandoned ship in violent storm waves and rogue waters',
    selected: true,
  },
];

// Helper to normalize transcripts from JSON or raw text
export function parseTranscriptInput(input) {
  if (!input) return null;
  if (typeof input === 'object') {
    return normalizeTranscriptObject(input);
  }
  const trimmed = String(input).trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return normalizeTranscriptObject(parsed);
    } catch {
      // not valid JSON, proceed to text parser
    }
  }

  // Parse timestamped lines: e.g. [0.29s - 5.51s]: "The Bermuda Triangle..."
  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
  const sentences = [];
  const words = [];
  let totalDur = 0;

  lines.forEach((line, idx) => {
    const match = line.match(
      /(?:\[|\()?([0-9.]+)(?:s)?\s*(?:-|–|—|->)\s*([0-9.]+)(?:s)?(?:\]|\))?:?\s*["']?(.*?)["']?$/
    );
    if (match) {
      const start = parseFloat(match[1]);
      const end = parseFloat(match[2]);
      const text = match[3].trim().replace(/^["']|["']$/g, '');
      totalDur = Math.max(totalDur, end);
      sentences.push({
        id: `s${idx}`,
        start,
        end,
        text,
      });
      const lineWords = text.split(/\s+/).filter(Boolean);
      const span = (end - start) / Math.max(1, lineWords.length);
      lineWords.forEach((w, wIdx) => {
        words.push({
          id: `w${words.length}`,
          text: w,
          start: parseFloat((start + wIdx * span).toFixed(2)),
          end: parseFloat((start + (wIdx + 1) * span).toFixed(2)),
        });
      });
    } else {
      sentences.push({
        id: `s${idx}`,
        start: idx * 4,
        end: (idx + 1) * 4,
        text: line,
      });
      totalDur = (idx + 1) * 4;
    }
  });

  if (sentences.length > 0) {
    return {
      duration: parseFloat(totalDur.toFixed(2)),
      sentences,
      words,
    };
  }
  return null;
}

function normalizeTranscriptObject(data) {
  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0].start === 'number' && data[0].text) {
      const words = data;
      const duration = words[words.length - 1].end || 0;
      const sentences = [];
      let curWords = [];
      let sStart = words[0].start;
      words.forEach((w, idx) => {
        curWords.push(w.text);
        if (/[.!?]$/.test(w.text) || idx === words.length - 1) {
          sentences.push({
            id: `s${sentences.length}`,
            start: sStart,
            end: w.end,
            text: curWords.join(' '),
          });
          curWords = [];
          if (idx + 1 < words.length) sStart = words[idx + 1].start;
        }
      });
      return { duration, sentences, words };
    }
    if (data.length > 0 && data[0].text) {
      const sentences = data;
      const duration = sentences[sentences.length - 1].end || 0;
      let words = [];
      sentences.forEach((s) => {
        if (Array.isArray(s.words)) words.push(...s.words);
      });
      return { duration, sentences, words };
    }
  }

  if (typeof data === 'object' && data !== null) {
    const sentences = Array.isArray(data.sentences) ? data.sentences : [];
    let words = Array.isArray(data.words) ? data.words : [];
    if (words.length === 0 && sentences.length > 0) {
      sentences.forEach((s) => {
        if (Array.isArray(s.words)) words.push(...s.words);
      });
    }
    const duration =
      data.duration ||
      (sentences.length ? sentences[sentences.length - 1].end : words.length ? words[words.length - 1].end : 0);
    return { duration, sentences, words };
  }
  return null;
}

export default function PromptHelper({ isOpen, onClose, project }) {
  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState('parameters'); // 'parameters' | 'assets' | 'transcript' | 'beats'

  // Video Parameters
  const [topic, setTopic] = useState('The Bermuda Triangle Mystery');
  const [aspectRatio, setAspectRatio] = useState('16:9'); // '16:9' or '9:16'
  const [duration, setDuration] = useState('46');
  const [style, setStyle] = useState('Cinematic Documentary & Mystery');
  const [targetModel, setTargetModel] = useState('claude'); // 'claude' | 'chatgpt' | 'gemini' | 'generic'

  // Assets State
  const [includeVoiceover, setIncludeVoiceover] = useState(true);
  const [voiceoverPath, setVoiceoverPath] = useState('assets/bermuda-voiceover.wav');
  const [voiceoverDuration, setVoiceoverDuration] = useState('45.84');
  const [includeImages, setIncludeImages] = useState(true);
  const [images, setImages] = useState(BERMUDA_PRESET_IMAGES);
  const [rawImagesText, setRawImagesText] = useState('');
  const [useRawImagesMode, setUseRawImagesMode] = useState(false);

  // Transcript State
  const [includeTranscript, setIncludeTranscript] = useState(true);
  const [includeSentenceSubtitles, setIncludeSentenceSubtitles] = useState(true);
  const [includeWordTimestamps, setIncludeWordTimestamps] = useState(true);
  const [transcriptRawInput, setTranscriptRawInput] = useState(
    JSON.stringify(SAMPLE_BERMUDA_TRANSCRIPT, null, 2)
  );
  const [parsedTranscript, setParsedTranscript] = useState(SAMPLE_BERMUDA_TRANSCRIPT);
  const [autoSyncDuration, setAutoSyncDuration] = useState(true);

  // Script / Narrative Beats
  const [scriptBeats, setScriptBeats] = useState(
    'Beat 1 (0s - 14.5s): Opening Hook & Coordinates — Florida, Bermuda, Puerto Rico. 500,000 square miles of disappeared ships & planes.\n' +
      'Beat 2 (14.5s - 26.5s): Flight 19 Incident — December 5, 1945. Five Navy Avengers vanish during routine training; compasses spin wildly.\n' +
      'Beat 3 (26.5s - 46s): The Devil\'s Triangle & The Reality — Rogue waves, unpredictable storms, and a myth that refuses to fade.'
  );

  // UI feedback states
  const [copied, setCopied] = useState(false);
  const [copiedWords, setCopiedWords] = useState(false);
  const [loadingProjectData, setLoadingProjectData] = useState(false);

  // Sync with project props when opened or project changes
  useEffect(() => {
    if (project && isOpen) {
      if (project.title) setTopic(project.title);
      if (project.duration) setDuration(String(project.duration));
      if (project.width && project.height) {
        setAspectRatio(project.width < project.height ? '9:16' : '16:9');
      }
      loadProjectAssetsAndTranscript(project.id);
    }
  }, [project?.id, isOpen]);

  // Load project assets and transcript from backend
  const loadProjectAssetsAndTranscript = async (projId) => {
    setLoadingProjectData(true);
    try {
      // 1. Fetch assets
      const assetsRes = await fetch(`/api/projects/${projId}/assets`);
      const assetsData = await assetsRes.json();
      if (assetsData.success && Array.isArray(assetsData.assets)) {
        const foundAudios = assetsData.assets.filter((a) => a.type === 'audio');
        if (foundAudios.length > 0) {
          setIncludeVoiceover(true);
          setVoiceoverPath(foundAudios[0].path);
        }

        const foundImages = assetsData.assets.filter((a) => a.type === 'image');
        if (foundImages.length > 0) {
          setIncludeImages(true);
          setImages(
            foundImages.map((img, idx) => ({
              id: `proj-img-${idx}`,
              path: img.path,
              role: `Scene ${idx + 1} visual asset (${img.name})`,
              selected: true,
            }))
          );
        }
      }

      // 2. Fetch transcript
      const transcriptRes = await fetch(`/api/projects/${projId}/transcript`);
      const transcriptData = await transcriptRes.json();
      if (transcriptData.success && transcriptData.transcript) {
        const normalized = normalizeTranscriptObject(transcriptData.transcript);
        if (normalized) {
          setParsedTranscript(normalized);
          setTranscriptRawInput(JSON.stringify(transcriptData.transcript, null, 2));
          setIncludeTranscript(true);
          if (normalized.duration) {
            setVoiceoverDuration(String(normalized.duration));
            setDuration(String(Math.ceil(normalized.duration)));
          }
        }
      }
    } catch (err) {
      console.warn('Could not auto-load project data into prompt creator', err);
    } finally {
      setLoadingProjectData(false);
    }
  };

  // Re-parse transcript whenever raw input changes
  const handleTranscriptInputChange = (newText) => {
    setTranscriptRawInput(newText);
    const parsed = parseTranscriptInput(newText);
    if (parsed) {
      setParsedTranscript(parsed);
      if (autoSyncDuration && parsed.duration > 0) {
        setDuration(String(Math.ceil(parsed.duration)));
        setVoiceoverDuration(String(parsed.duration));
      }
    }
  };

  // Load Bermuda Example Data
  const handleLoadBermudaExample = () => {
    setTopic('The Bermuda Triangle Mystery');
    setAspectRatio('16:9');
    setDuration('46');
    setStyle('Cinematic Documentary & Mystery');
    setIncludeVoiceover(true);
    setVoiceoverPath('assets/bermuda-voiceover.wav');
    setVoiceoverDuration('45.84');
    setIncludeImages(true);
    setImages(BERMUDA_PRESET_IMAGES);
    setIncludeTranscript(true);
    setIncludeSentenceSubtitles(true);
    setIncludeWordTimestamps(true);
    setTranscriptRawInput(JSON.stringify(SAMPLE_BERMUDA_TRANSCRIPT, null, 2));
    setParsedTranscript(SAMPLE_BERMUDA_TRANSCRIPT);
    setScriptBeats(
      'Beat 1 (0s - 14.5s): Opening Hook & Coordinates — Florida, Bermuda, Puerto Rico. 500,000 square miles of disappeared ships & planes.\n' +
        'Beat 2 (14.5s - 26.5s): Flight 19 Incident — December 5, 1945. Five Navy Avengers vanish during routine training; compasses spin wildly.\n' +
        'Beat 3 (26.5s - 46s): The Devil\'s Triangle & The Reality — Rogue waves, unpredictable storms, and a myth that refuses to fade.'
    );
  };

  // Auto-generate beats from transcript sentences
  const handleGenerateBeatsFromTranscript = () => {
    if (!parsedTranscript?.sentences || parsedTranscript.sentences.length === 0) return;
    const generated = parsedTranscript.sentences
      .map(
        (s, idx) =>
          `Beat ${idx + 1} (${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s): "${s.text}"`
      )
      .join('\n');
    setScriptBeats(generated);
  };

  // Add / remove image helpers
  const handleAddImage = () => {
    const newId = `img-custom-${Date.now()}`;
    setImages((prev) => [
      ...prev,
      {
        id: newId,
        path: `assets/image-${prev.length + 1}.png`,
        role: `Scene ${prev.length + 1} visual element`,
        selected: true,
      },
    ]);
  };

  const handleUpdateImage = (id, field, value) => {
    setImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteImage = (id) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  // Build the complete combined prompt
  const fullPrompt = useMemo(() => {
    const width = aspectRatio === '16:9' ? 1920 : 1080;
    const height = aspectRatio === '16:9' ? 1080 : 1920;
    const ratioLabel =
      aspectRatio === '16:9' ? '16:9 Landscape (1920x1080)' : '9:16 Vertical Portrait (1080x1920)';

    // Model specific tone
    let modelTone = '';
    if (targetModel === 'claude') {
      modelTone = `> **Target AI**: Claude 3.7 / 3.5 Sonnet. Prioritize sophisticated GSAP choreography, elegant easing, cinematic timing, and flawless deterministic layout.\n\n`;
    } else if (targetModel === 'chatgpt') {
      modelTone = `> **Target AI**: ChatGPT / GPT-4o. Write concise, clean, self-contained HTML with zero omissions and single-file executable execution.\n\n`;
    } else if (targetModel === 'gemini') {
      modelTone = `> **Target AI**: Gemini 2.5 Pro / Flash. Follow strict code generation contracts without markdown formatting noise.\n\n`;
    }

    let p = `# HyperFrames Video Generation Prompt\n\n${modelTone}`;
    p += `You are an expert motion designer and creative frontend engineer specializing in **HyperFrames** HTML video generation.\n`;
    p += `Your task is to generate a complete, valid, self-contained HyperFrames HTML video file adhering strictly to the technical contract, media assets, and transcription synchronization below.\n`;
    p += `Output ONLY the final code inside a single \`\`\`html ... \`\`\` block.\n\n`;
    p += `---\n\n`;

    // 1. Project Specifications
    p += `## 1. Project Specifications\n`;
    p += `- **Video Topic / Objective**: ${topic}\n`;
    p += `- **Aspect Ratio & Resolution**: ${ratioLabel}\n`;
    p += `- **Root Canvas Contract**: \`<div id="root" data-composition-id="main" data-start="0" data-width="${width}" data-height="${height}" data-duration="${duration}">\`\n`;
    p += `- **Total Duration**: ${duration} seconds\n`;
    p += `- **Visual & Creative Style**: ${style}\n\n`;

    // 2. Media Assets Contract
    p += `## 2. Media Assets in \`assets/\` Contract\n\n`;

    if (includeVoiceover && voiceoverPath) {
      p += `### A. Voiceover Audio Track:\n`;
      p += `- **File**: \`${voiceoverPath}\` (Duration: ${voiceoverDuration}s)\n`;
      p += `- **DOM Element**: Include exactly this in the composition root:\n`;
      p += `  \`\`\`html\n`;
      p += `  <audio id="voiceover" src="${voiceoverPath}" data-start="0" data-duration="${voiceoverDuration}" data-track-index="1" data-volume="1"></audio>\n`;
      p += `  \`\`\`\n`;
      p += `- **CRITICAL FRAMEWORK CONTRACT**:\n`;
      p += `  - MUST include \`id="voiceover"\` (missing ID causes silent render).\n`;
      p += `  - NEVER add \`crossorigin\` to \`<audio>\` (breaks video compilation).\n`;
      p += `  - NEVER call \`audio.play()\` or \`audio.pause()\` in JS (HyperFrames owns seek & frame-by-frame decoding).\n\n`;
    }

    if (includeImages) {
      p += `### B. Visual & Image Assets:\n`;
      if (useRawImagesMode && rawImagesText.trim()) {
        p += rawImagesText.trim() + '\n\n';
      } else {
        const selectedImgs = images.filter((img) => img.selected);
        if (selectedImgs.length > 0) {
          selectedImgs.forEach((img, idx) => {
            p += `- **Image ${idx + 1}**: \`${img.path}\`\n  - *Role / Scene*: ${img.role}\n`;
          });
          p += `\n`;
        } else {
          p += `- (No specific images selected; generate rich HTML/CSS visual graphics & cards)\n\n`;
        }
      }
      p += `- **Visual Implementation Rules**:\n`;
      p += `  - Place each image inside a scene clip: \`<section id="scene-..." class="clip" data-start="..." data-duration="...">\`\n`;
      p += `  - Sizing: \`<img id="img-..." class="bg-image" src="..." style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />\`\n`;
      p += `  - Motion: Apply subtle cinematic camera move (Ken Burns slow zoom \`scale: 1.0\` -> \`1.12\` or pan) across the scene's duration.\n\n`;
    }

    // 3. Transcription & Synchronization
    if (includeTranscript && parsedTranscript) {
      p += `## 3. Voiceover Transcription & Synchronization\n\n`;

      if (includeSentenceSubtitles && parsedTranscript.sentences?.length > 0) {
        p += `### A. Voiceover Sentences & Scene Pacing (${parsedTranscript.sentences.length} Sentences):\n`;
        parsedTranscript.sentences.forEach((s, idx) => {
          p += `${idx + 1}. [${s.start.toFixed(2)}s - ${s.end.toFixed(2)}s]: "${s.text}"\n`;
        });
        p += `\n`;

        p += `### B. Subtitles DOM & Animation Contract:\n`;
        p += `- Render a subtitles overlay container positioned at \`bottom: 80px\`:\n`;
        p += `  \`\`\`html\n`;
        p += `  <div class="sub-container" style="position: absolute; bottom: 80px; left: 0; right: 0; display: flex; justify-content: center; align-items: center; pointer-events: none; z-index: 50;">\n`;
        parsedTranscript.sentences.forEach((s) => {
          p += `    <div id="sub-${s.id}" class="sub-card" style="opacity: 0; position: absolute; max-width: 1200px; padding: 12px 32px; background: rgba(15,23,42,0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.15); border-radius: 9999px; font-size: 26px; font-weight: 700; color: #ffffff; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">${s.text}</div>\n`;
        });
        p += `  </div>\n`;
        p += `  \`\`\`\n`;
        p += `- **GSAP Subtitle Tweens**:\n`;
        p += `  In your single GSAP timeline, tween each subtitle card in and out matching its sentence timestamps:\n`;
        p += `  \`\`\`javascript\n`;
        parsedTranscript.sentences.slice(0, 3).forEach((s) => {
          const showDur = 0.35;
          const hideDur = 0.25;
          const hideTime = Math.max(s.start + showDur + 0.1, s.end - hideDur);
          p += `  tl.fromTo("#sub-${s.id}", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ${showDur}, ease: "power2.out" }, ${s.start});\n`;
          p += `  tl.to("#sub-${s.id}", { opacity: 0, y: -10, duration: ${hideDur}, ease: "power2.in" }, ${hideTime.toFixed(2)});\n`;
        });
        if (parsedTranscript.sentences.length > 3) {
          p += `  // ... continue for all sentences s3 to s${parsedTranscript.sentences.length - 1} ...\n`;
        }
        p += `  \`\`\`\n`;
        p += `- **CRITICAL RULE**: Subtitle IDs must be distinct (e.g. \`#sub-s0\`, \`#sub-s1\`) so they NEVER collide with scene subheadings.\n\n`;
      }

      if (includeWordTimestamps && parsedTranscript.words?.length > 0) {
        p += `### C. Word-Level Timestamps JSON (${parsedTranscript.words.length} Words):\n`;
        p += `Use these exact word timestamps for kinetic typography highlights, punch-in text words, or badge reveals:\n`;
        p += `\`\`\`json\n`;
        p += JSON.stringify(parsedTranscript.words.slice(0, 40), null, 2);
        if (parsedTranscript.words.length > 40) {
          p += `\n// ... (${parsedTranscript.words.length - 40} remaining words available) ...\n`;
        }
        p += `\n\`\`\`\n\n`;
      }
    }

    // 4. Script & Narrative Beats
    p += `## 4. Script / Narrative Beats & Visual Structure\n`;
    p += `${scriptBeats.trim()}\n\n`;

    // 5. Technical Contract & Linting Rules
    p += `## 5. Strict HyperFrames Technical Contract (100% Deterministic & Lint-Free)\n`;
    p += `Your generated code will be validated by \`hyperframes check\`. Adhere strictly to these rules:\n`;
    p += `1. **Standalone Document**:\n`;
    p += `   - Must load GSAP 3 CDN in \`<head>\`: \`<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>\`.\n`;
    p += `   - Root element \`<div id="root" data-composition-id="main" ...>\` sits directly in \`<body>\` (**DO NOT wrap in a \`<template>\` tag**).\n`;
    p += `2. **Canvas Sizing**:\n`;
    p += `   - The root CSS must use \`width: 100%; height: 100%; overflow: hidden; position: relative;\`.\n`;
    p += `   - **DO NOT** hardcode fixed dimensions like \`1920px\` or \`1080px\` on \`#root\` in CSS (dimensions are strictly governed by \`data-width\` and \`data-height\`).\n`;
    p += `3. **Timed Scenes & Clips**:\n`;
    p += `   - Each scene must be a clip: \`<section id="scene-..." class="clip" data-start="..." data-duration="...">\` positioned with \`position: absolute; inset: 0;\`.\n`;
    p += `   - **NEVER** animate \`display\`, \`visibility\`, or \`autoAlpha\` on a \`.clip\` element. Animate opacity/transforms on child elements instead.\n`;
    p += `4. **Timeline Contract**:\n`;
    p += `   - Register **exactly one paused timeline** named matching the root \`data-composition-id\`:\n`;
    p += `     \`\`\`javascript\n`;
    p += `     const tl = gsap.timeline({ paused: true });\n`;
    p += `     // add tweens...\n`;
    p += `     window.__timelines = window.__timelines || {};\n`;
    p += `     window.__timelines["main"] = tl;\n`;
    p += `     \`\`\`\n`;
    p += `5. **Centering & Layout (No Transform Conflicts)**:\n`;
    p += `   - Center elements using Flexbox or Grid. **NEVER** apply initial CSS \`transform: translate(-50%, -50%)\` to elements animated by GSAP \`x\` or \`y\`.\n`;
    p += `6. **Safe Fonts**:\n`;
    p += `   - Use standard system font stacks: \`font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;\` or generic \`ui-monospace, monospace\`.\n`;
    p += `   - DO NOT use undeclared fonts (e.g. \`SFMono-Regular\`) without an \`@font-face\` declaration.\n`;
    p += `7. **Audio Contract**:\n`;
    p += `   - Voiceover tag must have \`id="voiceover"\`, never \`crossorigin\`, never call \`audio.play()\`.\n`;
    p += `8. **Determinism**:\n`;
    p += `   - 100% deterministic: No \`Math.random()\`, no \`Date.now()\`, no \`requestAnimationFrame\`. Everything controlled by the GSAP timeline.\n\n`;

    // 6. Final Execution Instruction
    p += `## 6. Output Instruction\n`;
    p += `Generate the COMPLETE standalone HyperFrames HTML file adhering strictly to the contract above.\n`;
    p += `Return ONLY valid, ready-to-run HTML inside a single \`\`\`html code block with NO placeholders.\n`;

    return p;
  }, [
    topic,
    aspectRatio,
    duration,
    style,
    targetModel,
    includeVoiceover,
    voiceoverPath,
    voiceoverDuration,
    includeImages,
    images,
    useRawImagesMode,
    rawImagesText,
    includeTranscript,
    includeSentenceSubtitles,
    includeWordTimestamps,
    parsedTranscript,
    scriptBeats,
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyWordTimestampsOnly = () => {
    if (!parsedTranscript?.words) return;
    navigator.clipboard.writeText(JSON.stringify(parsedTranscript.words, null, 2));
    setCopiedWords(true);
    setTimeout(() => setCopiedWords(false), 2500);
  };

  const downloadPromptMarkdown = () => {
    const blob = new Blob([fullPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">HyperFrames AI Prompt Creator</h2>
                {project ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                    Project: {project.title}
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Universal Creator
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Craft production-ready prompts with voiceover audio, sentence/word timestamps & asset lists for Claude, ChatGPT, or Gemini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadBermudaExample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 transition-all cursor-pointer"
              title="Preload Bermuda Triangle assets & 7-sentence transcript as example"
            >
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Bermuda Example</span>
            </button>

            {project && (
              <button
                onClick={() => loadProjectAssetsAndTranscript(project.id)}
                disabled={loadingProjectData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="Refresh assets and transcript from current project"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-indigo-400 ${loadingProjectData ? 'animate-spin' : ''}`}
                />
                <span>Sync Project</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Form Configuration */}
          <div className="w-1/2 border-r border-slate-800 flex flex-col bg-slate-900/60 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 text-xs">
              <button
                onClick={() => setActiveTab('parameters')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'parameters'
                    ? 'border-indigo-500 text-indigo-300 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>1. Project & Style</span>
              </button>

              <button
                onClick={() => setActiveTab('assets')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'assets'
                    ? 'border-indigo-500 text-indigo-300 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2. Assets ({images.filter((i) => i.selected).length} Img, {includeVoiceover ? '1 Audio' : '0 Audio'})</span>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'transcript'
                    ? 'border-indigo-500 text-indigo-300 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>3. Transcript ({parsedTranscript?.sentences?.length || 0} Sentences)</span>
              </button>

              <button
                onClick={() => setActiveTab('beats')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'beats'
                    ? 'border-indigo-500 text-indigo-300 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>4. Narrative Beats</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB 1: PARAMETERS */}
              {activeTab === 'parameters' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Video Topic / Objective
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. The Bermuda Triangle Mystery"
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
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                            aspectRatio === '16:9'
                              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          16:9 Landscape
                        </button>
                        <button
                          type="button"
                          onClick={() => setAspectRatio('9:16')}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                            aspectRatio === '9:16'
                              ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          9:16 Vertical
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Target Duration (Seconds)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="3"
                          max="300"
                          step="1"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                        {parsedTranscript?.duration ? (
                          <button
                            type="button"
                            onClick={() => setDuration(String(Math.ceil(parsedTranscript.duration)))}
                            className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] whitespace-nowrap transition-colors"
                            title="Set duration to transcript duration"
                          >
                            Sync ({Math.ceil(parsedTranscript.duration)}s)
                          </button>
                        ) : null}
                      </div>
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
                      <option value="Cinematic Documentary & Mystery">Cinematic Documentary & Mystery (Deep ocean tones, telemetry badges, glowing reticles)</option>
                      <option value="Tech SaaS & Deep Gradient Glow">Tech SaaS & Deep Gradient Glow (Modern cards, vibrant accents, glassmorphic UI)</option>
                      <option value="Kinetic Typography & High Pacing">Kinetic Typography & High Pacing (Impact words, staggered reveals, bold contrast)</option>
                      <option value="Minimalist Elegant & Clean Design">Minimalist Elegant & Clean Design (Generous whitespace, refined serif/sans, subtle fades)</option>
                      <option value="Cyberpunk Neon High Contrast">Cyberpunk Neon High Contrast (Glowing cyan/magenta, dark scanlines, digital HUD)</option>
                      <option value="Bold Commercial Brand Sizzle">Bold Commercial Brand Sizzle (Punchy transitions, saturated palette, dynamic scale)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target AI Model
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'claude', name: 'Claude 3.7 / 3.5', tag: 'Best Choreography' },
                        { id: 'chatgpt', name: 'ChatGPT 4o / o1', tag: 'Direct Code' },
                        { id: 'gemini', name: 'Gemini 2.5 Pro', tag: 'Fast Execution' },
                        { id: 'generic', name: 'Universal LLM', tag: 'Standard' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setTargetModel(m.id)}
                          className={`p-2 rounded-lg text-left border transition-all ${
                            targetModel === m.id
                              ? 'bg-indigo-600/20 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-semibold text-xs">{m.name}</div>
                          <div className="text-[10px] text-slate-500">{m.tag}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ASSETS */}
              {activeTab === 'assets' && (
                <div className="space-y-5">
                  {/* Voiceover Section */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold text-xs">
                        <input
                          type="checkbox"
                          checked={includeVoiceover}
                          onChange={(e) => setIncludeVoiceover(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                        />
                        <div className="flex items-center gap-1.5">
                          <Music className="w-4 h-4 text-indigo-400" />
                          <span>Include Voiceover Audio Track</span>
                        </div>
                      </label>

                      {includeVoiceover && (
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Audio Contract Active
                        </span>
                      )}
                    </div>

                    {includeVoiceover && (
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                        <div className="col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Audio File Path in <code className="text-slate-300">assets/</code>
                          </label>
                          <input
                            type="text"
                            value={voiceoverPath}
                            onChange={(e) => setVoiceoverPath(e.target.value)}
                            placeholder="assets/bermuda-voiceover.wav"
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Audio Duration (s)
                          </label>
                          <input
                            type="text"
                            value={voiceoverDuration}
                            onChange={(e) => setVoiceoverDuration(e.target.value)}
                            placeholder="45.84"
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Images Section */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold text-xs">
                        <input
                          type="checkbox"
                          checked={includeImages}
                          onChange={(e) => setIncludeImages(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                        />
                        <div className="flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-cyan-400" />
                          <span>Include Visual & Image Assets ({images.length} available)</span>
                        </div>
                      </label>

                      {includeImages && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setUseRawImagesMode(!useRawImagesMode)}
                            className="text-[11px] text-slate-400 hover:text-white transition-colors"
                          >
                            {useRawImagesMode ? 'Switch to Card Mode' : 'Switch to Raw Text'}
                          </button>
                        </div>
                      )}
                    </div>

                    {includeImages && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-3">
                        {useRawImagesMode ? (
                          <div>
                            <p className="text-[11px] text-slate-400 mb-1.5">
                              Enter list of images (one per line) with descriptions:
                            </p>
                            <textarea
                              rows="5"
                              value={rawImagesText}
                              onChange={(e) => setRawImagesText(e.target.value)}
                              placeholder="- assets/img1.png - Hero scene visual&#10;- assets/img2.png - Feature comparison"
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 resize-none"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {images.map((img, idx) => (
                              <div
                                key={img.id}
                                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs"
                              >
                                <input
                                  type="checkbox"
                                  checked={img.selected}
                                  onChange={(e) =>
                                    handleUpdateImage(img.id, 'selected', e.target.checked)
                                  }
                                  className="mt-1 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                                />

                                <div className="flex-1 space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[11px] text-cyan-300 font-semibold">
                                      #{idx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={img.path}
                                      onChange={(e) =>
                                        handleUpdateImage(img.id, 'path', e.target.value)
                                      }
                                      placeholder="assets/image.png"
                                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>

                                  <input
                                    type="text"
                                    value={img.role}
                                    onChange={(e) =>
                                      handleUpdateImage(img.id, 'role', e.target.value)
                                    }
                                    placeholder="Visual description / role in scene..."
                                    className="w-full bg-slate-950 border border-slate-800/80 rounded px-2 py-1 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(img.id)}
                                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                  title="Delete image asset"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={handleAddImage}
                              className="w-full py-2 rounded-lg border border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-950/20 text-slate-400 hover:text-indigo-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Image Asset</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TRANSCRIPT */}
              {activeTab === 'transcript' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold text-xs">
                      <input
                        type="checkbox"
                        checked={includeTranscript}
                        onChange={(e) => setIncludeTranscript(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span>Include Transcript Synchronization in Prompt</span>
                    </label>

                    {parsedTranscript && (
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span>Duration: {parsedTranscript.duration || 0}s</span>
                        <span>•</span>
                        <span>{parsedTranscript.sentences?.length || 0} sentences</span>
                        <span>•</span>
                        <span>{parsedTranscript.words?.length || 0} words</span>
                      </div>
                    )}
                  </div>

                  {includeTranscript && (
                    <div className="space-y-3">
                      {/* Transcript Inclusion Sub-options */}
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                          <input
                            type="checkbox"
                            checked={includeSentenceSubtitles}
                            onChange={(e) => setIncludeSentenceSubtitles(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                          />
                          <span>Sentence Subtitles Breakdown</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                          <input
                            type="checkbox"
                            checked={includeWordTimestamps}
                            onChange={(e) => setIncludeWordTimestamps(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                          />
                          <span>Word-Level Timestamps JSON</span>
                        </label>
                      </div>

                      {/* Raw Transcript Input Textarea */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            Transcript Data (JSON or Timestamped Text)
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={copyWordTimestampsOnly}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                            >
                              {copiedWords ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedWords ? 'Copied Words!' : 'Copy Words JSON'}</span>
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows="7"
                          value={transcriptRawInput}
                          onChange={(e) => handleTranscriptInputChange(e.target.value)}
                          placeholder='Paste Whisper JSON, Gemini JSON, or timestamped text lines:&#10;[0.29s - 5.51s]: "The Bermuda Triangle is one of the world&apos;s most famous mysteries."'
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 resize-none selection:bg-indigo-600/40"
                        />
                      </div>

                      {/* Detected Sentences Preview */}
                      {parsedTranscript?.sentences && parsedTranscript.sentences.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Detected Sentences ({parsedTranscript.sentences.length})
                            </span>
                            <button
                              type="button"
                              onClick={handleGenerateBeatsFromTranscript}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                            >
                              <Wand2 className="w-3 h-3" />
                              <span>Copy to Narrative Beats</span>
                            </button>
                          </div>

                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {parsedTranscript.sentences.map((s, idx) => (
                              <div
                                key={s.id || idx}
                                className="p-2 rounded bg-slate-950/80 border border-slate-800/80 text-xs flex items-start gap-2"
                              >
                                <span className="font-mono text-[11px] text-indigo-400 font-semibold shrink-0">
                                  [{s.start.toFixed(1)}s - {s.end.toFixed(1)}s]
                                </span>
                                <span className="text-slate-200">{s.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: BEATS */}
              {activeTab === 'beats' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Script Breakdown / Narrative Beats
                    </label>
                    {parsedTranscript?.sentences && (
                      <button
                        type="button"
                        onClick={handleGenerateBeatsFromTranscript}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Auto-Fill from Sentences</span>
                      </button>
                    )}
                  </div>

                  <textarea
                    rows="8"
                    value={scriptBeats}
                    onChange={(e) => setScriptBeats(e.target.value)}
                    placeholder="Beat 1 (0s - 3s): Hook...&#10;Beat 2 (3s - 7s): Feature...&#10;Beat 3 (7s - 10s): Call to action..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500">
                    Beats guide the LLM on which images to display, when to transition scenes, and how to pace the visual storytelling.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Generated Prompt Preview */}
          <div className="w-1/2 flex flex-col bg-slate-950 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live Generated Prompt
                </h3>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{fullPrompt.length} chars</span>
                <span>•</span>
                <span>~{Math.round(fullPrompt.split(/\s+/).length)} words</span>
              </div>
            </div>

            {/* Prompt Code Preview Textarea */}
            <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 select-all leading-relaxed bg-slate-950">
              <pre className="whitespace-pre-wrap">{fullPrompt}</pre>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href="https://claude.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>Claude</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://chat.openai.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>ChatGPT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={downloadPromptMarkdown}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors ml-2"
                  title="Download prompt as markdown file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save .md</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
