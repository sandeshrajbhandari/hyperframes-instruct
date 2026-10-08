import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  projectsDir,
  rootDir,
} from './db.js';
import { startProjectRender, getRenderLogs, launchStudioPreview, runProjectCheck } from './cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3100;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Starter template for new projects
export const STARTER_TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>HyperFrames Video</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #090d16;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
        overflow: hidden;
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 70%);
      }
      .clip {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 20px;
        border-radius: 9999px;
        background: rgba(99, 102, 241, 0.12);
        border: 1px solid rgba(99, 102, 241, 0.35);
        color: #a5b4fc;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0.05em;
        margin-bottom: 24px;
      }
      .headline {
        margin: 0;
        font-size: 88px;
        font-weight: 800;
        text-align: center;
        line-height: 1.1;
        letter-spacing: -0.02em;
        background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .highlight {
        background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .subtitle {
        margin-top: 24px;
        font-size: 32px;
        color: #94a3b8;
        max-width: 900px;
        text-align: center;
        line-height: 1.5;
      }
      .feature-card {
        margin-top: 48px;
        padding: 20px 36px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        backdrop-filter: blur(12px);
        display: flex;
        gap: 24px;
      }
      .stat-item {
        text-align: center;
      }
      .stat-val {
        font-size: 36px;
        font-weight: 700;
        color: #38bdf8;
      }
      .stat-label {
        font-size: 16px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="6">
      <section id="scene-hero" class="clip" data-start="0" data-duration="6">
        <div id="badge" class="pill">⚡ HyperFrames Motion</div>
        <h1 id="title" class="headline">Code Your Next <span class="highlight">Masterpiece</span></h1>
        <p id="sub" class="subtitle">Turn raw HTML, CSS, and GSAP timelines into deterministic, high-framerate video.</p>
        <div id="card" class="feature-card">
          <div class="stat-item">
            <div class="stat-val">100%</div>
            <div class="stat-label">Deterministic</div>
          </div>
          <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
          <div class="stat-item">
            <div class="stat-val">60 FPS</div>
            <div class="stat-label">Frame Perfect</div>
          </div>
          <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
          <div class="stat-item">
            <div class="stat-val">Pure HTML</div>
            <div class="stat-label">Zero Bloat</div>
          </div>
        </div>
      </section>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });

      tl.fromTo("#badge", { opacity: 0, y: -25, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)" }, 0.2);
      tl.fromTo("#title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.4);
      tl.fromTo("#sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.6);
      tl.fromTo("#card", { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }, 0.8);

      // Subtle pulse and exit
      tl.to(["#badge", "#title", "#sub", "#card"], { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" }, 5.2);

      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;

// Initialize sample project if DB is empty
const existingProjects = getAllProjects();
if (existingProjects.length === 0) {
  createProject({
    id: 'demo-welcome',
    title: 'HyperFrames Welcome',
    html: STARTER_TEMPLATE,
    width: 1920,
    height: 1080,
    duration: 6,
  });
}

// REST API Routes

// List projects
app.get('/api/projects', (req, res) => {
  try {
    const list = getAllProjects();
    res.json({ success: true, projects: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create project
app.post('/api/projects', (req, res) => {
  try {
    const { title, html, width, height, duration } = req.body;
    const id = 'prj_' + crypto.randomBytes(4).toString('hex');
    const project = createProject({
      id,
      title: title || 'Untitled Video',
      html: html || STARTER_TEMPLATE,
      width,
      height,
      duration,
    });
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get project details
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = getProject(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  try {
    const project = updateProject(req.params.id, req.body);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Duplicate project
app.post('/api/projects/:id/duplicate', (req, res) => {
  try {
    const original = getProject(req.params.id);
    if (!original) return res.status(404).json({ success: false, error: 'Project not found' });

    const newId = 'prj_' + crypto.randomBytes(4).toString('hex');
    const newProject = createProject({
      id: newId,
      title: `${original.title} (Copy)`,
      html: original.html,
      width: original.width,
      height: original.height,
      duration: original.duration,
    });
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  try {
    deleteProject(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get prompt template (from prompt.md)
app.get('/api/prompt-template', (req, res) => {
  try {
    const promptPath = path.join(rootDir, 'prompt.md');
    if (fs.existsSync(promptPath)) {
      const content = fs.readFileSync(promptPath, 'utf8');
      res.json({ success: true, template: content });
    } else {
      res.json({ success: true, template: '' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Render MP4 via CLI
app.post('/api/projects/:id/render', (req, res) => {
  try {
    const result = startProjectRender(req.params.id);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Render status and logs
app.get('/api/projects/:id/render-status', (req, res) => {
  try {
    const project = getProject(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    const liveLogs = getRenderLogs(req.params.id);
    res.json({
      success: true,
      status: project.render_status,
      active: liveLogs.active,
      log: liveLogs.active ? liveLogs.logs : project.render_log,
      hasVideo: !!project.render_output_path && fs.existsSync(project.render_output_path),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Download or stream rendered video
app.get('/api/projects/:id/video', (req, res) => {
  const project = getProject(req.params.id);
  if (!project || !project.render_output_path || !fs.existsSync(project.render_output_path)) {
    return res.status(404).send('Video not found or not rendered yet');
  }
  res.sendFile(path.resolve(project.render_output_path));
});

// Run automated quality / overlap check
app.post('/api/projects/:id/check', async (req, res) => {
  try {
    const result = await runProjectCheck(req.params.id);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve project files (snapshots, rendered videos)
app.use('/projects-assets', express.static(projectsDir));

// Serve project assets under /preview/:id/assets
app.use('/preview/:id/assets', (req, res, next) => {
  const assetsFolder = path.join(projectsDir, req.params.id, 'assets');
  if (fs.existsSync(assetsFolder)) {
    return express.static(assetsFolder)(req, res, next);
  }
  next();
});

// List assets for a project
app.get('/api/projects/:id/assets', (req, res) => {
  try {
    const assetsFolder = path.join(projectsDir, req.params.id, 'assets');
    if (!fs.existsSync(assetsFolder)) {
      return res.json({ success: true, assets: [] });
    }
    const files = fs.readdirSync(assetsFolder);
    const assets = files
      .filter((file) => !file.startsWith('.'))
      .map((file) => {
        const filePath = path.join(assetsFolder, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        let type = 'other';
        if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
          type = 'image';
        } else if (['.mp3', '.wav', '.m4a', '.ogg', '.aac'].includes(ext)) {
          type = 'audio';
        } else if (['.mp4', '.webm'].includes(ext)) {
          type = 'video';
        } else if (['.json', '.srt', '.vtt'].includes(ext)) {
          type = 'transcript';
        }
        return {
          name: file,
          path: `assets/${file}`,
          url: `/preview/${req.params.id}/assets/${file}`,
          size: stats.size,
          type,
          updatedAt: stats.mtime,
        };
      });
    res.json({ success: true, assets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload asset to a project (base64 or text)
app.post('/api/projects/:id/assets', (req, res) => {
  try {
    const { filename, content, base64 } = req.body;
    if (!filename) {
      return res.status(400).json({ success: false, error: 'Filename is required' });
    }

    const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const assetsFolder = path.join(projectsDir, req.params.id, 'assets');
    if (!fs.existsSync(assetsFolder)) {
      fs.mkdirSync(assetsFolder, { recursive: true });
    }

    const filePath = path.join(assetsFolder, safeName);
    if (base64) {
      const base64Data = base64.includes(';base64,') ? base64.split(';base64,').pop() : base64;
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    } else if (content !== undefined) {
      fs.writeFileSync(filePath, content, 'utf8');
    } else {
      return res.status(400).json({ success: false, error: 'Missing content or base64 data' });
    }

    const stats = fs.statSync(filePath);
    res.json({
      success: true,
      asset: {
        name: safeName,
        path: `assets/${safeName}`,
        url: `/preview/${req.params.id}/assets/${safeName}`,
        size: stats.size,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete an asset from a project
app.delete('/api/projects/:id/assets/:filename', (req, res) => {
  try {
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(projectsDir, req.params.id, 'assets', safeName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Launch HyperFrames Studio preview
app.post('/api/projects/:id/open-studio', async (req, res) => {
  try {
    const result = await launchStudioPreview(req.params.id);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Preview endpoint: serves the HTML with interactive bridge
app.get('/preview/:id', (req, res) => {
  const project = getProject(req.params.id);
  if (!project) return res.status(404).send('Project not found');

  // If raw requested, send pure HTML
  if (req.query.raw === 'true') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(project.html);
  }

  // Interactive bridge script injected into the preview
  const bridgeScript = `
    <!-- HyperFrames Interactive Player Bridge -->
    <script>
      (function() {
        let tl = null;
        let isSeeking = false;

        function findTimeline() {
          if (window.__timelines) {
            const keys = Object.keys(window.__timelines);
            if (keys.length > 0) return window.__timelines[keys[0]];
          }
          return null;
        }

        function initBridge() {
          tl = findTimeline();
          if (!tl) {
            setTimeout(initBridge, 100);
            return;
          }

          // Broadcast state to parent
          function broadcastState() {
            if (!tl) return;
            const state = {
              type: 'HF_STATE',
              time: tl.time(),
              duration: tl.duration() || ${project.duration || 5},
              paused: tl.paused(),
              progress: tl.progress()
            };
            window.parent.postMessage(state, '*');
          }

          // Report on tick
          if (window.gsap && gsap.ticker) {
            gsap.ticker.add(broadcastState);
          } else {
            setInterval(broadcastState, 50);
          }

          // Listen for parent player commands
          window.addEventListener('message', (e) => {
            if (!e.data || !e.data.action || !tl) return;
            switch(e.data.action) {
              case 'play':
                if (tl.progress() >= 1) tl.restart();
                else tl.play();
                break;
              case 'pause':
                tl.pause();
                break;
              case 'seek':
                tl.pause();
                tl.seek(e.data.time, true);
                broadcastState();
                break;
              case 'restart':
                tl.restart();
                break;
              case 'setSpeed':
                tl.timeScale(e.data.speed || 1);
                break;
              case 'requestState':
                broadcastState();
                break;
            }
          });

          // Floating Player bar if viewed standalone (not in iframe)
          if (window === window.top) {
            const bar = document.createElement('div');
            bar.id = 'hf-floating-bar';
            bar.innerHTML = \`
              <style>
                #hf-floating-bar {
                  position: fixed;
                  bottom: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: rgba(15, 23, 42, 0.85);
                  backdrop-filter: blur(12px);
                  border: 1px solid rgba(255, 255, 255, 0.15);
                  border-radius: 9999px;
                  padding: 8px 18px;
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  color: white;
                  font-family: -apple-system, system-ui, sans-serif;
                  font-size: 13px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                  z-index: 99999;
                }
                #hf-floating-bar button {
                  background: #4f46e5;
                  border: none;
                  color: white;
                  padding: 6px 14px;
                  border-radius: 9999px;
                  cursor: pointer;
                  font-weight: 600;
                  font-size: 12px;
                  transition: background 0.15s;
                }
                #hf-floating-bar button:hover { background: #6366f1; }
                #hf-floating-bar input[type="range"] {
                  width: 140px;
                  cursor: pointer;
                  accent-color: #6366f1;
                }
              </style>
              <button id="hf-play-btn">Play</button>
              <input type="range" id="hf-scrub" min="0" max="100" value="0" step="0.1">
              <span id="hf-time-text">00:00.0 / 00:00.0</span>
            \`;
            document.body.appendChild(bar);

            const playBtn = document.getElementById('hf-play-btn');
            const scrubber = document.getElementById('hf-scrub');
            const timeText = document.getElementById('hf-time-text');

            playBtn.onclick = () => {
              if (tl.paused()) {
                if (tl.progress() >= 1) tl.restart();
                else tl.play();
                playBtn.textContent = 'Pause';
              } else {
                tl.pause();
                playBtn.textContent = 'Play';
              }
            };

            scrubber.oninput = (e) => {
              tl.pause();
              playBtn.textContent = 'Play';
              const progress = e.target.value / 100;
              tl.seek(progress * tl.duration());
            };

            function updateUI() {
              if (!tl) return;
              if (!tl.paused()) playBtn.textContent = 'Pause';
              else playBtn.textContent = 'Play';
              const dur = tl.duration() || 1;
              const cur = tl.time() || 0;
              scrubber.value = (cur / dur) * 100;
              timeText.textContent = cur.toFixed(1) + 's / ' + dur.toFixed(1) + 's';
              requestAnimationFrame(updateUI);
            }
            requestAnimationFrame(updateUI);
          }
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initBridge);
        } else {
          initBridge();
        }
      })();
    </script>
  `;

  let modifiedHtml = project.html;
  // Inject runtime bootstrap and base href into <head> so window.__timelines exists before any inline script runs
  const headBootstrap = `
    <base href="/preview/${project.id}/">
    <script>
      window.__timelines = window.__timelines || {};
      window.__hyperframes = window.__hyperframes || {
        getVariables: function() { return {}; },
        fitTextFontSize: function(text, opts) {
          return { fontSize: (opts && opts.baseFontSize) || 72 };
        }
      };
    </script>
  `;
  if (modifiedHtml.includes('<head>')) {
    modifiedHtml = modifiedHtml.replace('<head>', `<head>\n${headBootstrap}`);
  } else {
    modifiedHtml = `${headBootstrap}\n${modifiedHtml}`;
  }

  if (modifiedHtml.includes('</body>')) {
    modifiedHtml = modifiedHtml.replace('</body>', `${bridgeScript}</body>`);
  } else {
    modifiedHtml += bridgeScript;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(modifiedHtml);
});

// Serve frontend build if dist exists
const distPath = path.join(rootDir, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback for non-API routes
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/preview')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`[HyperFrames Hub] Server running at http://localhost:${PORT}`);
  console.log(`[HyperFrames Hub] Preview links: http://localhost:${PORT}/preview/:id`);
});
