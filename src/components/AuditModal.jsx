import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  Layers,
  Wand2,
  Image,
  FileCode,
  LayoutGrid,
  Sun,
  RefreshCw,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

export default function AuditModal({ project, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lint', 'layout', 'contrast'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Markdown copy states
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState(null);

  // Run the full HyperFrames CLI audit (lint + runtime + layout + contrast + snapshots)
  const runCliAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/check`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to complete audit');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && project) {
      runCliAudit();
    }
  }, [isOpen, project?.id]);

  if (!isOpen || !project) return null;

  // Extraction of finding categories
  const lintFindings = result?.lint?.findings || [];
  const lintErrors = lintFindings.filter((f) => f.severity === 'error');
  const lintWarnings = lintFindings.filter((f) => f.severity === 'warning');

  const layoutFindings = result?.layout?.findings || [];
  const overlapErrors = layoutFindings.filter(
    (f) => f.code === 'content_overlap' || f.code === 'occlusion'
  );
  const otherLayoutIssues = layoutFindings.filter(
    (f) => f.code !== 'content_overlap' && f.code !== 'occlusion'
  );

  const contrastFindings = result?.contrast?.findings || [];
  const wasBrowserSkipped = result?.browserSkipped === true;

  const totalErrors =
    lintErrors.length +
    overlapErrors.length +
    (result?.layout?.errorCount || 0) +
    (result?.contrast?.errorCount || 0);

  const totalWarnings =
    lintWarnings.length +
    otherLayoutIssues.length +
    (result?.contrast?.warningCount || 0);

  const allPassed =
    result &&
    totalErrors === 0 &&
    totalWarnings === 0 &&
    domCollisions.length === 0;

  const handleCopyItem = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const generateMarkdownReport = () => {
    let md = `# HyperFrames Audit Report: ${project.title}\n\n`;
    md += `**Overall Status:** ${
      allPassed
        ? '✅ ALL AUDITS PASSED (0 Errors, 0 Warnings)'
        : totalErrors > 0
        ? `❌ AUDIT FAILED (${totalErrors} Error${totalErrors > 1 ? 's' : ''}, ${totalWarnings} Warning${totalWarnings !== 1 ? 's' : ''})`
        : `⚠️ AUDIT PASSED WITH WARNINGS (${totalWarnings} Warning${totalWarnings !== 1 ? 's' : ''})`
    }\n`;
    md += `**Timestamp:** ${new Date().toISOString()}\n`;
    md += `**Project ID:** \`${project.id}\` | **Canvas:** ${project.width}x${project.height} (${project.duration}s)\n\n`;

    // 1. Linter Section
    if (lintFindings.length > 0) {
      md += `## 1. Linter Findings & Prescribed Fixes (${lintFindings.length})\n\n`;
      lintFindings.forEach((f, i) => {
        md += `### ${i + 1}. [${f.severity.toUpperCase()}] \`${f.code}\`${f.selector ? ` on \`${f.selector}\`` : ''}\n`;
        md += `- **Problem:** ${f.message}\n`;
        if (f.fixHint) {
          md += `- **Prescribed Fix:** ${f.fixHint}\n`;
        }
        md += `\n`;
      });
    } else {
      md += `## 1. Linter Findings\n- ✅ Passed cleanly with 0 syntax or code contract errors.\n\n`;
    }

    // 2. CLI Layout Section
    if (layoutFindings.length > 0 && !wasBrowserSkipped) {
      md += `## 2. CLI Layout Engine Findings (${layoutFindings.length})\n\n`;
      layoutFindings.forEach((f, i) => {
        md += `### ${i + 1}. [${(f.severity || 'issue').toUpperCase()}] \`${f.code}\`${f.selector ? ` on \`${f.selector}\`` : ''}\n`;
        if (f.time !== undefined) md += `- **Time:** ${f.time}s\n`;
        md += `- **Problem:** ${f.message}\n`;
        if (f.fixHint) md += `- **Prescribed Fix:** ${f.fixHint}\n`;
        md += `\n`;
      });
    } else if (wasBrowserSkipped) {
      md += `## 2. CLI Layout Engine\n- ⚠️ Browser layout sweep was paused because the linter error above must be resolved first.\n\n`;
    } else {
      md += `## 2. CLI Layout Engine\n- ✅ Passed with 0 content overlaps and 0 canvas overflows.\n\n`;
    }

    // 3. Contrast Section
    if (contrastFindings.length > 0) {
      md += `## 3. Contrast & Legibility Fixes (${contrastFindings.length})\n\n`;
      contrastFindings.forEach((c, i) => {
        md += `### ${i + 1}. Contrast Failure on \`${c.selector}\`\n`;
        if (c.text) md += `- **Target Text:** "${c.text}"\n`;
        md += `- **Measured Ratio:** ${c.ratio}:1 (Requires ${c.requiredRatio}:1)\n`;
        if (c.suggestedColor) md += `- **Prescribed Compliant Color:** \`${c.suggestedColor}\`\n`;
        md += `\n`;
      });
    }

    md += `---\n`;
    md += `### Instruction for AI / ChatGPT:\n`;
    md += `Please modify the HyperFrames HTML composition to fix all the errors and issues listed above. Adhere strictly to the prescribed fixes while keeping the overall design and animation timeline intact.\n`;

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport();
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${
                allPassed
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                  : totalErrors > 0
                  ? 'bg-red-600/20 text-red-400 border-red-500/30'
                  : 'bg-amber-600/20 text-amber-400 border-amber-500/30'
              }`}
            >
              {allPassed ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">HyperFrames Quality & Audit Center</h2>
                {result && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      allPassed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : totalErrors > 0
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {allPassed ? 'ALL PASSED' : totalErrors > 0 ? `${totalErrors} ERRORS` : 'WARNINGS ONLY'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Automated programmatic verification: Linter rules, layout overlaps, and prescribed fixes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all cursor-pointer shadow-sm"
              title="Copy all errors and prescribed fixes formatted as Markdown"
            >
              {copiedMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Copy Report (Markdown)</span>
                </>
              )}
            </button>

            <button
              onClick={runCliAudit}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-run Audit</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800/80 grid grid-cols-3 gap-3 text-xs">
          {/* Linter Card */}
          <div
            onClick={() => setActiveTab('lint')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              lintErrors.length > 0
                ? 'bg-red-950/20 border-red-800/60 text-red-200'
                : lintWarnings.length > 0
                ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                Linter Contract
              </span>
              {lintErrors.length === 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              )}
            </div>
            <div className="text-lg font-bold mt-1 text-white">
              {lintErrors.length > 0
                ? `${lintErrors.length} Error${lintErrors.length > 1 ? 's' : ''}`
                : 'Passed'}
            </div>
            <div className="text-[11px] text-slate-400">
              {lintWarnings.length} warning{lintWarnings.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Layout & Overlap Card */}
          <div
            onClick={() => setActiveTab('layout')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              overlapErrors.length > 0
                ? 'bg-red-950/20 border-red-800/60 text-red-200'
                : wasBrowserSkipped
                ? 'bg-slate-900 border-slate-800 text-slate-400'
                : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                CLI Layout Overlaps
              </span>
              {wasBrowserSkipped ? (
                <span className="text-[10px] uppercase font-bold text-amber-400">Paused</span>
              ) : overlapErrors.length === 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              )}
            </div>
            <div className="text-lg font-bold mt-1 text-white">
              {wasBrowserSkipped ? 'Gated by Lint' : overlapErrors.length === 0 ? 'Passed' : `${overlapErrors.length} Overlaps`}
            </div>
            <div className="text-[11px] text-slate-400">
              {wasBrowserSkipped ? 'Fix lint error first' : `${layoutFindings.length} layout findings`}
            </div>
          </div>

          {/* Contrast & Text Card */}
          <div
            onClick={() => setActiveTab('contrast')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              contrastFindings.length > 0
                ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Contrast / AA
              </span>
              {contrastFindings.length === 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className="text-lg font-bold mt-1 text-white">
              {contrastFindings.length === 0 ? 'Passed' : `${contrastFindings.length} Fixes`}
            </div>
            <div className="text-[11px] text-slate-400">WCAG AA compliance</div>
          </div>
        </div>

        {/* Tab Selection Filter */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Findings ({lintFindings.length + layoutFindings.length + contrastFindings.length})
          </button>

          <button
            onClick={() => setActiveTab('lint')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'lint'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Linter Errors & Warnings ({lintFindings.length})
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'layout'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            CLI Layout Sweep ({layoutFindings.length})
          </button>

          <button
            onClick={() => setActiveTab('contrast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'contrast'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Contrast ({contrastFindings.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <div className="text-sm font-semibold text-white">Running Comprehensive Audit...</div>
              <p className="text-xs text-slate-400 max-w-sm">
                Auditing code structure, timeline contract, and frame-by-frame layout geometry.
              </p>
            </div>
          )}

          {!loading && (
            <>
              {/* Informational banner when browser skipped due to linter error */}
              {wasBrowserSkipped && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/80 text-xs text-amber-300 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">
                      Linter Error Paused the CLI Browser Check
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      HyperFrames CLI enforces a strict quality gate: <strong>if any linter error exists, it skips the headless Chromium layout audit</strong> to avoid rendering invalid animation syntax. Fix the linter error below to re-enable full CLI layout checks.
                    </p>
                  </div>
                </div>
              )}

              {/* 1. LINT FINDINGS WITH PRESCRIBED FIXES */}
              {(activeTab === 'all' || activeTab === 'lint') && lintFindings.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      Linter Findings & Prescribed Fixes ({lintFindings.length})
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">Static code contract</span>
                  </h3>

                  <div className="flex flex-col gap-3">
                    {lintFindings.map((item, idx) => {
                      const isErr = item.severity === 'error';
                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border p-4 flex flex-col gap-2.5 text-xs bg-slate-950 ${
                            isErr ? 'border-red-900/60 shadow-sm' : 'border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                                  isErr
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {item.severity}
                              </span>
                              <span className="font-mono text-[11px] font-semibold text-white">
                                {item.code}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.selector && (
                                <span className="font-mono text-[11px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/40">
                                  {item.selector}
                                </span>
                              )}
                              <button
                                onClick={() =>
                                  handleCopyItem(
                                    `lint-${idx}`,
                                    `### [${item.severity.toUpperCase()}] \`${item.code}\`${item.selector ? ` on \`${item.selector}\`` : ''}\n- **Problem:** ${item.message}${item.fixHint ? `\n- **Prescribed Fix:** ${item.fixHint}` : ''}`
                                  )
                                }
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                                title="Copy issue and fix as markdown"
                              >
                                {copiedItemId === `lint-${idx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="text-slate-200 leading-relaxed">{item.message}</div>

                          {/* Prescribed Fix Box */}
                          {item.fixHint && (
                            <div className="mt-1 p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/50 flex items-start gap-2.5 text-indigo-200">
                              <Wand2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <span className="font-bold text-indigo-300">Recommended Fix:</span>{' '}
                                <span className="text-[11px] text-indigo-100">{item.fixHint}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. CLI LAYOUT FINDINGS */}
              {(activeTab === 'all' || activeTab === 'layout') && !wasBrowserSkipped && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-cyan-400" />
                    CLI Layout Engine Sweep ({layoutFindings.length})
                  </h3>

                  {layoutFindings.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {layoutFindings.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col gap-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-amber-300">
                              {item.code}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 font-mono text-[11px]">
                                {item.selector}
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyItem(
                                    `cli-${idx}`,
                                    `### [${(item.severity || 'issue').toUpperCase()}] \`${item.code}\`${item.selector ? ` on \`${item.selector}\`` : ''}\n${item.time !== undefined ? `- **Time:** ${item.time}s\n` : ''}- **Problem:** ${item.message}${item.fixHint ? `\n- **Prescribed Fix:** ${item.fixHint}` : ''}`
                                  )
                                }
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                                title="Copy issue and fix as markdown"
                              >
                                {copiedItemId === `cli-${idx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="text-slate-300">{item.message}</div>
                          {item.fixHint && (
                            <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-[11px] text-indigo-300 flex items-start gap-2">
                              <Wand2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                              <div>
                                <b>Fix:</b> {item.fixHint}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3 text-xs text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">CLI Layout Engine Passed</div>
                        <div className="text-slate-400 text-[11px]">
                          0 content overlaps, 0 canvas escapes, and 0 clipping issues found.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. CONTRAST FINDINGS WITH PRESCRIBED COLORS */}
              {(activeTab === 'all' || activeTab === 'contrast') && contrastFindings.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    Contrast & Legibility Fixes ({contrastFindings.length})
                  </h3>

                  <div className="flex flex-col gap-3">
                    {contrastFindings.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col gap-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400">
                            {item.message}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono text-[11px]">
                              {item.selector}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyItem(
                                  `contrast-${idx}`,
                                  `### Contrast Failure on \`${item.selector}\`\n${item.text ? `- **Target Text:** "${item.text}"\n` : ''}- **Measured Ratio:** ${item.ratio}:1 (Requires ${item.requiredRatio}:1)${item.suggestedColor ? `\n- **Prescribed Compliant Color:** \`${item.suggestedColor}\`` : ''}`
                                )
                              }
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                              title="Copy contrast issue and fix as markdown"
                            >
                              {copiedItemId === `contrast-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {item.text && (
                          <div className="text-slate-300 text-[11px]">
                            Target text: <b className="text-white">"{item.text}"</b> (Ratio: {item.ratio}:1, needs {item.requiredRatio}:1)
                          </div>
                        )}

                        {item.suggestedColor && (
                          <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-[11px] text-indigo-300 flex items-center gap-2.5">
                            <Wand2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <div>
                              <b>Recommended Compliant Color:</b>{' '}
                              <code className="text-white px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 ml-1">
                                {item.suggestedColor}
                              </code>
                            </div>
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 ml-2 inline-block shadow-sm"
                              style={{ backgroundColor: item.suggestedColor }}
                            ></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {allPassed
              ? '✓ Composition satisfies all technical and layout contracts'
              : 'Apply recommended fixes in your HTML and re-audit'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-sm"
              title="Copy all errors and prescribed fixes formatted as Markdown"
            >
              {copiedMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Copy Report (Markdown)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
