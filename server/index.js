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

// Bermuda Triangle template testing starter
export const BERMUDA_TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>The Bermuda Triangle Mystery</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #020617;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
        overflow: hidden;
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #020617;
      }
      .clip {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .bg-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform-origin: center center;
      }
      .overlay-gradient {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.85) 100%);
        pointer-events: none;
      }
      .letterbox-top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 70px;
        background: #020617;
        z-index: 10;
      }
      .letterbox-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 70px;
        background: #020617;
        z-index: 10;
      }
      .content-wrap {
        position: absolute;
        inset: 70px 100px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 60px;
        z-index: 5;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 22px;
        border-radius: 9999px;
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(56, 189, 248, 0.4);
        color: #38bdf8;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 24px;
        backdrop-filter: blur(16px);
        width: fit-content;
      }
      .pill.amber {
        border-color: rgba(251, 191, 36, 0.4);
        color: #fbbf24;
      }
      .pill.crimson {
        border-color: rgba(244, 63, 94, 0.4);
        color: #f43f5e;
      }
      .headline {
        margin: 0;
        font-size: 84px;
        font-weight: 900;
        line-height: 1.1;
        letter-spacing: -0.02em;
        text-shadow: 0 10px 30px rgba(0,0,0,0.8);
      }
      .highlight-cyan {
        color: #38bdf8;
        text-shadow: 0 0 30px rgba(56, 189, 248, 0.6);
      }
      .highlight-amber {
        color: #fbbf24;
        text-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
      }
      .highlight-rose {
        color: #f43f5e;
        text-shadow: 0 0 30px rgba(244, 63, 94, 0.6);
      }
      .subtext {
        margin: 20px 0 0;
        font-size: 32px;
        color: #cbd5e1;
        max-width: 1100px;
        line-height: 1.45;
        text-shadow: 0 4px 16px rgba(0,0,0,0.9);
      }
      .telemetry-bar {
        margin-top: 36px;
        display: flex;
        align-items: center;
        gap: 32px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 18px;
        color: #94a3b8;
      }
      .telemetry-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .telemetry-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #38bdf8;
      }
      .compass-reticle {
        position: absolute;
        top: 120px;
        right: 120px;
        width: 160px;
        height: 160px;
        border: 2px dashed rgba(56, 189, 248, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
        pointer-events: none;
      }
      .compass-inner {
        width: 110px;
        height: 110px;
        border: 1px solid rgba(56, 189, 248, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .compass-needle {
        width: 4px;
        height: 60px;
        background: linear-gradient(to top, #38bdf8 50%, #f43f5e 50%);
        border-radius: 2px;
      }
      .sub-container {
        position: absolute;
        bottom: 80px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        z-index: 25;
      }
      .sub-card {
        position: absolute;
        background: rgba(15, 23, 42, 0.90);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 9999px;
        padding: 12px 34px;
        font-size: 26px;
        font-weight: 700;
        color: #ffffff;
        text-align: center;
        max-width: 1300px;
        box-shadow: 0 12px 36px rgba(0,0,0,0.7);
        letter-spacing: -0.01em;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="46">
      <!-- Voiceover Audio Track -->
      <audio id="voiceover" src="assets/bermuda-voiceover.wav" data-start="0" data-duration="45.84" data-track-index="1" data-volume="1"></audio>

      <!-- Letterbox Cinematic Bars -->
      <div class="letterbox-top"></div>
      <div class="letterbox-bottom"></div>

      <!-- Synchronized Subtitles Track -->
      <div class="sub-container">
        <div id="sub-0" class="sub-card" style="opacity: 0;">The Bermuda Triangle is one of the world's most famous mysteries.</div>
        <div id="sub-1" class="sub-card" style="opacity: 0;">Located between Florida, Bermuda, and Puerto Rico, it has been linked to stories of ships and planes mysteriously disappearing.</div>
        <div id="sub-2" class="sub-card" style="opacity: 0;">One of the most famous cases happened in 1945, when five US Navy aircraft vanished during a training mission.</div>
        <div id="sub-3" class="sub-card" style="opacity: 0;">But is the area actually dangerous?</div>
        <div id="sub-4" class="sub-card" style="opacity: 0;">Scientists have found no evidence that disappearances happen here more often than in other busy parts of the ocean.</div>
        <div id="sub-5" class="sub-card" style="opacity: 0;">Strong storms, unpredictable weather, and powerful currents may explain many of the incidents.</div>
        <div id="sub-6" class="sub-card" style="opacity: 0;">So, there may be no supernatural mystery after all. Just a fascinating legend that refuses to disappear.</div>
      </div>

      <!-- Scene 1: Map Coordinates (0s - 14.5s) -->
      <section id="scene-map" class="clip" data-start="0" data-duration="14.5">
        <img id="img-map" class="bg-image" src="assets/bermuda-triangle-overlay-on-globe-map.png" alt="Bermuda Triangle Globe Map" />
        <div class="overlay-gradient"></div>
        <div class="compass-reticle" id="reticle-1">
          <div class="compass-inner">
            <div class="compass-needle" id="needle-1"></div>
          </div>
        </div>
        <div class="content-wrap">
          <div id="badge-1" class="pill">⚡ CLASSIFIED DOSSIER</div>
          <h1 id="title-1" class="headline">THE BERMUDA <span class="highlight-cyan">TRIANGLE</span></h1>
          <p id="sub-1" class="subtext">Between Florida, Bermuda, and Puerto Rico lies 500,000 square miles of inexplicable vanished history.</p>
          <div id="tele-1" class="telemetry-bar">
            <div class="telemetry-item"><span class="telemetry-dot"></span> COORD: 25.0000° N, 71.0000° W</div>
            <div class="telemetry-item"><span class="telemetry-dot"></span> STATUS: ANOMALOUS</div>
          </div>
        </div>
      </section>

      <!-- Scene 2: Flight 19 Fighters (14.5s - 26.5s) -->
      <section id="scene-flight" class="clip" data-start="14.5" data-duration="12.0">
        <img id="img-flight" class="bg-image" src="assets/fighter-pilots-flying-over-rough-sea-dark-cloud-on-horizon.png" alt="Fighter Pilots in Storm" />
        <div class="overlay-gradient" style="background: radial-gradient(circle at 50% 50%, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.9) 100%);"></div>
        <div class="content-wrap">
          <div id="badge-2" class="pill amber">⚠️ DECEMBER 5, 1945 • FLIGHT 19</div>
          <h1 id="title-2" class="headline">Five Navy Avengers <span class="highlight-amber">Vanished</span></h1>
          <p id="sub-2" class="subtext">"We are entering white water... nothing seems right. We don\\'t know which way is west." Last words before radio silence.</p>
          <div id="tele-2" class="telemetry-bar">
            <div class="telemetry-item" style="color: #fbbf24;"><span class="telemetry-dot" style="background: #fbbf24;"></span> COMPASS: TOTAL FAILURE</div>
            <div class="telemetry-item">WRECKAGE FOUND: ZERO</div>
          </div>
        </div>
      </section>

      <!-- Scene 3: Lost Ship in the Storm (26.5s - 46s) -->
      <section id="scene-ship" class="clip" data-start="26.5" data-duration="19.5">
        <img id="img-ship" class="bg-image" src="assets/ship drone shot wide angle bermuda triangle in strom.png" alt="Ship in Violent Storm" />
        <div class="overlay-gradient"></div>
        <div class="content-wrap">
          <div id="badge-3" class="pill crimson">🌊 THE DEVIL\\'S TRIANGLE</div>
          <h1 id="title-3" class="headline">Swallowed by <span class="highlight-rose">The Abyss</span></h1>
          <p id="sub-3" class="subtext">Rogue ocean waves over 100 feet tall, magnetic fissures, or secrets still locked deep below the surface?</p>
          <div id="tele-3" class="telemetry-bar">
            <div class="telemetry-item" style="color: #f43f5e;"><span class="telemetry-dot" style="background: #f43f5e;"></span> CASUALTIES: 1,000+ LIVES</div>
            <div class="telemetry-item">VESSELS LOST: 50+</div>
          </div>
        </div>
      </section>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });

      // Scene 1: Map Animations (0s - 14.5s)
      tl.fromTo("#img-map", { scale: 1.0, x: 0 }, { scale: 1.12, x: -30, duration: 14.5, ease: "none" }, 0);
      tl.fromTo("#needle-1", { rotation: 0 }, { rotation: 720, duration: 14.5, ease: "none" }, 0);
      tl.fromTo("#badge-1", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
      tl.fromTo("#title-1", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, 0.9);
      tl.fromTo("#sub-1", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, 1.3);
      tl.fromTo("#tele-1", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.8);
      tl.to(["#badge-1", "#title-1", "#sub-1", "#tele-1", "#reticle-1"], { opacity: 0, y: -20, duration: 0.8, ease: "power2.in" }, 13.7);

      // Scene 2: Flight 19 Animations (14.5s - 26.5s)
      tl.fromTo("#img-flight", { scale: 1.0, y: 0 }, { scale: 1.14, y: -20, duration: 12.0, ease: "none" }, 14.5);
      tl.fromTo("#badge-2", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 15.0);
      tl.fromTo("#title-2", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, 15.4);
      tl.fromTo("#sub-2", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, 15.8);
      tl.fromTo("#tele-2", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, 16.3);
      tl.to(["#badge-2", "#title-2", "#sub-2", "#tele-2"], { opacity: 0, y: -20, duration: 0.8, ease: "power2.in" }, 25.7);

      // Scene 3: Ship in Storm Animations (26.5s - 46s)
      tl.fromTo("#img-ship", { scale: 1.15, x: -20 }, { scale: 1.02, x: 10, duration: 19.5, ease: "none" }, 26.5);
      tl.fromTo("#badge-3", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 27.0);
      tl.fromTo("#title-3", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, 27.4);
      tl.fromTo("#sub-3", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, 27.8);
      tl.fromTo("#tele-3", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, 28.3);
      tl.to(["#badge-3", "#title-3", "#sub-3", "#tele-3"], { opacity: 0, duration: 1.2, ease: "power2.in" }, 44.5);

      // Synchronized Subtitle Tweens (from transcript.json)
      tl.fromTo("#sub-0", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.29);
      tl.to("#sub-0", { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, 5.3);

      tl.fromTo("#sub-1", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 5.85);
      tl.to("#sub-1", { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, 13.9);

      tl.fromTo("#sub-2", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 14.12);
      tl.to("#sub-2", { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, 22.2);

      tl.fromTo("#sub-3", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 22.48);
      tl.to("#sub-3", { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, 25.9);

      tl.fromTo("#sub-4", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 26.2);
      tl.to("#sub-4", { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, 32.0);

      tl.fromTo("#sub-5", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 32.28);
      tl.to("#sub-5", { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, 38.3);

      tl.fromTo("#sub-6", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 38.56);
      tl.to("#sub-6", { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" }, 45.4);

      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;

export const BERMUDA_ASSETS = [
  'bermuda-voiceover.wav',
  'bermuda-triangle-overlay-on-globe-map.png',
  'fighter-pilots-flying-over-rough-sea-dark-cloud-on-horizon.png',
  'ship drone shot wide angle bermuda triangle in strom.png',
  'bermuda-transcript.json',
];

export function copyBermudaAssetsToProject(projectId) {
  const assetsFolder = path.join(projectsDir, projectId, 'assets');
  if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder, { recursive: true });
  }

  const copied = [];
  for (const filename of BERMUDA_ASSETS) {
    const src = path.join(rootDir, filename);
    if (fs.existsSync(src)) {
      const dest = path.join(assetsFolder, filename);
      fs.copyFileSync(src, dest);
      copied.push(filename);
      if (filename === 'bermuda-transcript.json') {
        fs.copyFileSync(src, path.join(assetsFolder, 'transcript.json'));
        copied.push('transcript.json');
      }
    }
  }
  return copied;
}

// Initialize sample projects
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

// Seed Bermuda Triangle template project if not already created
const existingBermuda = getProject('demo-bermuda');
if (!existingBermuda) {
  copyBermudaAssetsToProject('demo-bermuda');
  createProject({
    id: 'demo-bermuda',
    title: 'The Bermuda Triangle Mystery',
    html: BERMUDA_TEMPLATE,
    width: 1920,
    height: 1080,
    duration: 46,
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
    const { title, html, width, height, duration, template, loadBermudaAssets } = req.body;
    const id = 'prj_' + crypto.randomBytes(4).toString('hex');
    let projectHtml = html;
    let projectDur = duration;

    if (template === 'bermuda' || loadBermudaAssets) {
      projectHtml = html || BERMUDA_TEMPLATE;
      projectDur = duration || 46;
      copyBermudaAssetsToProject(id);
    }

    const project = createProject({
      id,
      title: title || (template === 'bermuda' ? 'The Bermuda Triangle Mystery' : 'Untitled Video'),
      html: projectHtml || STARTER_TEMPLATE,
      width: width || 1920,
      height: height || 1080,
      duration: projectDur || 5,
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

// Load Bermuda Triangle example assets into project
app.post('/api/projects/:id/load-bermuda-assets', (req, res) => {
  try {
    const copied = copyBermudaAssetsToProject(req.params.id);
    res.json({ success: true, count: copied.length, copied });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

function getAudioMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.wav':
      return 'audio/wav';
    case '.mp3':
      return 'audio/mp3';
    case '.m4a':
      return 'audio/m4a';
    case '.ogg':
      return 'audio/ogg';
    case '.aac':
      return 'audio/aac';
    case '.flac':
      return 'audio/flac';
    default:
      return 'audio/wav';
  }
}

function normalizeTranscript(parsed, audioDuration = 0) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON format received from Gemini');
  }

  let sentences = Array.isArray(parsed.sentences) ? parsed.sentences : [];
  let words = Array.isArray(parsed.words) ? parsed.words : [];

  // If words array is provided but sentences is not
  if (words.length > 0 && sentences.length === 0) {
    let currentSentenceWords = [];
    let sentenceIndex = 0;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      currentSentenceWords.push(w);
      const textStr = String(w.text || '').trim();
      const endsWithPunct = /[.?!]$/.test(textStr);
      const nextWord = words[i + 1];
      const gap = nextWord ? Number(nextWord.start) - Number(w.end) : 0;
      if (endsWithPunct || gap > 0.8 || i === words.length - 1) {
        const sStart = Number(currentSentenceWords[0].start || 0);
        const sEnd = Number(
          currentSentenceWords[currentSentenceWords.length - 1].end || sStart + 1
        );
        sentences.push({
          id: `s${sentenceIndex++}`,
          text: currentSentenceWords.map((cw) => cw.text).join(' '),
          start: Number(sStart.toFixed(2)),
          end: Number(sEnd.toFixed(2)),
          words: [...currentSentenceWords],
        });
        currentSentenceWords = [];
      }
    }
  }

  // If sentences is provided but words is not
  if (sentences.length > 0 && words.length === 0) {
    let wordIndex = 0;
    for (const s of sentences) {
      if (Array.isArray(s.words) && s.words.length > 0) {
        for (const w of s.words) {
          words.push({
            id: w.id || `w${wordIndex++}`,
            text: String(w.text || '').trim(),
            start: Number(Number(w.start || 0).toFixed(2)),
            end: Number(Number(w.end || (Number(w.start || 0) + 0.3)).toFixed(2)),
          });
        }
      } else if (s.text) {
        const tokens = String(s.text).trim().split(/\s+/);
        const sStart = Number(s.start || 0);
        const sEnd = Number(s.end || sStart + 1);
        const sDur = Math.max(0.1, sEnd - sStart);
        const perWord = sDur / tokens.length;
        tokens.forEach((token, idx) => {
          words.push({
            id: `w${wordIndex++}`,
            text: token,
            start: Number((sStart + idx * perWord).toFixed(2)),
            end: Number((sStart + (idx + 1) * perWord).toFixed(2)),
          });
        });
      }
    }
  }

  // Normalize IDs and numeric precision
  words = words.map((w, idx) => ({
    id: w.id || `w${idx}`,
    text: String(w.text || '').trim(),
    start: Number(Number(w.start || 0).toFixed(2)),
    end: Number(Number(w.end || Number(w.start || 0) + 0.3).toFixed(2)),
  }));

  sentences = sentences.map((s, idx) => ({
    id: s.id || `s${idx}`,
    text: String(s.text || '').trim(),
    start: Number(Number(s.start || 0).toFixed(2)),
    end: Number(Number(s.end || 0).toFixed(2)),
    words: Array.isArray(s.words)
      ? s.words.map((w, wIdx) => ({
          id: w.id || `w${idx}_${wIdx}`,
          text: String(w.text || '').trim(),
          start: Number(Number(w.start || 0).toFixed(2)),
          end: Number(Number(w.end || 0).toFixed(2)),
        }))
      : [],
  }));

  const maxEnd = Math.max(
    0,
    ...words.map((w) => w.end || 0),
    ...sentences.map((s) => s.end || 0),
    audioDuration || 0
  );

  return {
    duration: Number(maxEnd.toFixed(2)),
    sentences,
    words,
  };
}

// Transcribe audio using Gemini API
app.post('/api/projects/:id/transcribe', async (req, res) => {
  try {
    const { filename, apiKey, model } = req.body;
    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({ success: false, error: 'Gemini API key is required' });
    }

    const projectId = req.params.id;
    let audioFilePath = '';

    // Search in project assets
    if (filename) {
      const candidate1 = path.join(projectsDir, projectId, 'assets', path.basename(filename));
      const candidate2 = path.join(rootDir, path.basename(filename));
      if (fs.existsSync(candidate1)) {
        audioFilePath = candidate1;
      } else if (fs.existsSync(candidate2)) {
        audioFilePath = candidate2;
      }
    }

    if (!audioFilePath) {
      // Look for any audio file in projects/:id/assets/
      const assetsFolder = path.join(projectsDir, projectId, 'assets');
      if (fs.existsSync(assetsFolder)) {
        const files = fs.readdirSync(assetsFolder);
        const found = files.find((f) =>
          ['.wav', '.mp3', '.m4a', '.ogg', '.aac', '.flac'].includes(
            path.extname(f).toLowerCase()
          )
        );
        if (found) audioFilePath = path.join(assetsFolder, found);
      }
    }

    if (!audioFilePath) {
      // Check root for bermuda-voiceover.wav
      const rootWav = path.join(rootDir, 'bermuda-voiceover.wav');
      if (fs.existsSync(rootWav)) {
        audioFilePath = rootWav;
      }
    }

    if (!audioFilePath || !fs.existsSync(audioFilePath)) {
      return res.status(404).json({
        success: false,
        error: `Audio file "${filename || 'voiceover'}" not found in project assets or workspace.`,
      });
    }

    const stats = fs.statSync(audioFilePath);
    const maxBytes = 25 * 1024 * 1024; // 25 MB
    if (stats.size > maxBytes) {
      return res.status(400).json({
        success: false,
        error: `Audio file is too large (${(stats.size / 1024 / 1024).toFixed(1)}MB). Max supported size is 25MB.`,
      });
    }

    const mimeType = getAudioMimeType(audioFilePath);
    const audioBuffer = fs.readFileSync(audioFilePath);
    const base64Audio = audioBuffer.toString('base64');

    const targetModel = (model && model.trim()) || 'gemini-3.5-transcribe';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

    const promptText = `You are a professional audio transcription engine. Carefully transcribe all speech in this audio with millisecond-precision timestamps in seconds.
Return STRICT JSON adhering to this exact format:
{
  "duration": <total audio duration in seconds as float>,
  "sentences": [
    {
      "id": "s0",
      "text": "<full sentence or phrase text>",
      "start": 0.00,
      "end": 4.20,
      "words": [
        { "id": "w0", "text": "First", "start": 0.00, "end": 0.45 },
        { "id": "w1", "text": "word", "start": 0.48, "end": 0.90 }
      ]
    }
  ],
  "words": [
    { "id": "w0", "text": "First", "start": 0.00, "end": 0.45 },
    { "id": "w1", "text": "word", "start": 0.48, "end": 0.90 }
  ]
}

Strict requirements:
1. Every word must have a unique sequential id ("w0", "w1", ...), exact text, start time in seconds (float), and end time in seconds (float).
2. Every sentence must have a unique sequential id ("s0", "s1", ...), complete sentence text, start time in seconds, end time in seconds, and its nested words list.
3. The root "words" array must contain all words in sequential order matching the canonical HyperFrames format.
4. Timestamps must be non-decreasing, accurate to the spoken audio, and cover all spoken dialogue.`;

function extractJsonFromText(rawText) {
  if (!rawText) return null;
  const cleaned = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, '$1').trim();
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(rawText.slice(firstBrace, lastBrace + 1));
    } catch (_) {}
  }

  const firstBracket = rawText.indexOf('[');
  const lastBracket = rawText.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(rawText.slice(firstBracket, lastBracket + 1));
    } catch (_) {}
  }

  return null;
}

    // Build payload without forcing responseMimeType in generationConfig
    // This allows gemini-3.5-transcribe and all model variants to work without "JSON mode is not enabled" error.
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Audio,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 120s timeout

    let geminiRes;
    try {
      geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      return res.status(500).json({
        success: false,
        error: `Failed to connect to Gemini API: ${fetchErr.message}`,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!geminiRes.ok) {
      const errorJson = await geminiRes.json().catch(() => null);
      const errorMsg =
        errorJson?.error?.message ||
        `Gemini API returned status ${geminiRes.status} (${geminiRes.statusText})`;
      return res.status(geminiRes.status).json({
        success: false,
        error: errorMsg,
        details: errorJson?.error,
        modelUsed: targetModel,
      });
    }

    const data = await geminiRes.json();
    const candidate = data.candidates?.[0];
    const rawText = candidate?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        success: false,
        error: 'Gemini returned an empty response or blocked content.',
        data,
      });
    }

    const parsed = extractJsonFromText(rawText);
    if (!parsed) {
      return res.status(500).json({
        success: false,
        error: `Could not parse valid JSON from Gemini transcription response.`,
        rawText,
      });
    }

    const normalized = normalizeTranscript(parsed);

    // Save automatically to projects/:id/assets/transcript.json
    const assetsFolder = path.join(projectsDir, projectId, 'assets');
    if (!fs.existsSync(assetsFolder)) {
      fs.mkdirSync(assetsFolder, { recursive: true });
    }
    const transcriptPath = path.join(assetsFolder, 'transcript.json');
    fs.writeFileSync(transcriptPath, JSON.stringify(normalized, null, 2), 'utf8');

    res.json({
      success: true,
      transcript: normalized,
      savedPath: 'assets/transcript.json',
      modelUsed: targetModel,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save or update transcript manually
app.post('/api/projects/:id/save-transcript', (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, error: 'Transcript data is required' });
    }
    const assetsFolder = path.join(projectsDir, req.params.id, 'assets');
    if (!fs.existsSync(assetsFolder)) {
      fs.mkdirSync(assetsFolder, { recursive: true });
    }
    const filePath = path.join(assetsFolder, 'transcript.json');
    let content;
    if (typeof transcript === 'string') {
      try {
        const obj = JSON.parse(transcript);
        content = JSON.stringify(normalizeTranscript(obj), null, 2);
      } catch {
        content = transcript;
      }
    } else {
      content = JSON.stringify(normalizeTranscript(transcript), null, 2);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, savedPath: 'assets/transcript.json' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get existing transcript for project if present
app.get('/api/projects/:id/transcript', (req, res) => {
  try {
    const filePath = path.join(projectsDir, req.params.id, 'assets', 'transcript.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      return res.json({ success: true, transcript: data, exists: true });
    }
    res.json({ success: true, transcript: null, exists: false });
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
