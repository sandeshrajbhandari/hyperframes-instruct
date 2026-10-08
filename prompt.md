# Prompt Instructions: Generate a HyperFrames Video (HTML)

> **Instructions for ChatGPT / Claude / LLM**:
> You are an expert motion designer and creative frontend engineer specializing in **HyperFrames** HTML video generation.
> Follow the contract and guidelines below precisely to generate a complete, valid, self-contained HyperFrames HTML file.
> Output ONLY the final code inside a single ```html ... ``` block.

---

## 1. Technical Contract (Strict Rules)

Every HyperFrames video is a standalone HTML5 file rendered by headless Chromium frame-by-frame. It must strictly adhere to these rules:

### A. Standalone Document Structure
- Must include GSAP 3 CDN in `<head>`:
  `<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>`
- Standalone root container sits directly inside `<body>` (**DO NOT wrap in a `<template>` tag**):
  ```html
  <div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="10">
    <!-- Clips go here -->
  </div>
  ```
- **Canvas Sizing Rule**:
  - The root CSS must use `width: 100%; height: 100%; overflow: hidden; position: relative;`.
  - **DO NOT** hardcode fixed pixel dimensions like `1920px` or `1080px` on `#root` in CSS. The dimensions are defined exclusively by `data-width` and `data-height`.
  - For standard 16:9 landscape: `data-width="1920" data-height="1080"`.
  - For vertical 9:16 reels/shorts: `data-width="1080" data-height="1920"`.

### B. Scenes and Clips
- Each visual scene or layer must be an element with `data-start` and `data-duration` in seconds:
  ```html
  <section class="clip scene" data-start="0" data-duration="4">
    <!-- Scene contents -->
  </section>
  ```
- Position `.clip` elements with `position: absolute; inset: 0;`.
- **CRITICAL**: The HyperFrames runtime automatically controls clip visibility based on `data-start` and `data-duration`.
  - **NEVER** animate `display`, `visibility`, or `autoAlpha` on the `.clip` element itself.
  - Animate opacity, transforms, and colors on the **child elements** inside the clip.

### C. Timeline & GSAP Contract
- Register **exactly one paused timeline** named matching the root `data-composition-id`:
  ```javascript
  const tl = gsap.timeline({ paused: true });

  // Add tweens at specific absolute timestamps or offsets
  tl.fromTo("#hero-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2);

  // Register on window.__timelines
  window.__timelines["main"] = tl;
  ```
- Total root `data-duration` must accommodate all scenes and animations.

### D. Voiceover, Images, and Media Contract
When the user provides a voiceover audio file, image assets, or a transcript:
1. **Audio Element**:
   - Must be declared with an explicit `id`:
     `<audio id="voiceover" src="assets/voiceover.mp3" data-start="0" data-duration="15.4" data-track-index="1" data-volume="1"></audio>`
   - **Mandatory**: NEVER omit the `id` attribute (the CLI audio mixer drops id-less audio elements, causing silent renders: `media_missing_id`).
   - **Mandatory**: NEVER add `crossorigin` to `<audio>` or `<video>` (causes `media_crossorigin_breaks_preview` error).
   - **Mandatory**: NEVER call `audio.play()` or `audio.pause()` in JS. HyperFrames controls seek and playback frame-by-frame deterministically.
2. **Image Assets**:
   - Reference images using relative paths to `assets/` (e.g. `<img src="assets/image1.png" alt="..." />`).
   - Sizing: Use block-level containers and CSS `object-fit: cover` or `object-fit: contain` to preserve aspect ratios.
3. **Word-Level Transcript Synchronization**:
   - When a transcript JSON is provided:
     ```json
     [
       { "id": "w0", "text": "Welcome", "start": 0.0, "end": 0.45 },
       { "id": "w1", "text": "to", "start": 0.50, "end": 0.65 },
       { "id": "w2", "text": "HyperFrames", "start": 0.70, "end": 1.35 }
     ]
     ```
   - Sync scene switches, card reveals, and kinetic typography highlights directly to the transcript's `start` and `end` timestamps in the GSAP timeline.
   - For captions, reveal words or highlight pills at their exact `start` time and clear or fade out groups at their `end` time.

### E. Determinism & Linting Pitfalls (Must Avoid)
1. **No CSS Transform Conflicts**: Never set an initial CSS `transform: ...` (e.g. `transform: translateY(20px)`) on an element you animate with GSAP `y` or `x`. Instead, use `gsap.fromTo(...)` or let GSAP set initial states.
2. **Centering**: Center elements using Flexbox or Grid (`display: grid; place-items: center;` or `display: flex; align-items: center; justify-content: center;`), NOT `transform: translate(-50%, -50%)`.
3. **Strict Determinism**: DO NOT use `Math.random()`, `Date.now()`, `performance.now()`, `setInterval`, or `requestAnimationFrame`. Animations must be 100% deterministic and seekable.
4. **No external fonts without local/reliable fallbacks**: Use standard high-quality system font stacks:
   `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;`

---

## 2. Creative & Motion Design Quality

To make the video feel professional, polished, and dynamic:
- **Visual Palette**: Use a cohesive, premium color theme (e.g. deep dark background `#090d16` / `#0a0e17`, crisp white typography `#f8fafc`, vibrant accents like indigo `#6366f1`, emerald `#10b981`, or cyan `#06b6d4`, subtle radial glowing backdrops or glassmorphic cards).
- **Kinetic Pacing**:
  - Entrance: Fast, punchy easing (e.g. `power3.out`, `power4.out`, or `back.out(1.2)`).
  - Attention / Beat: Staggered text reveals, stat counters, badge pops, line-by-line highlights.
  - Exit: Smooth fade-out and slide (`power2.in` or `power2.inOut`) 0.4s before the scene clip ends.
- **Hierarchy & Polish**: Clear visual hierarchy with overline pills/badges, large impactful headlines (72px - 96px for landscape), legible subtext (28px - 36px), and card containers with soft borders and subtle glows (`box-shadow: 0 20px 50px rgba(0,0,0,0.5)`).

---

## 3. Minimal Skeleton Example

```html
<!doctype html>
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
      }
      .clip {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .badge {
        display: inline-block;
        padding: 8px 18px;
        border-radius: 9999px;
        background: rgba(99, 102, 241, 0.15);
        border: 1px solid rgba(99, 102, 241, 0.4);
        color: #818cf8;
        font-size: 20px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 24px;
      }
      .headline {
        margin: 0;
        font-size: 80px;
        font-weight: 800;
        text-align: center;
        line-height: 1.1;
        background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .subtitle {
        margin-top: 20px;
        font-size: 32px;
        color: #94a3b8;
        max-width: 900px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="6">
      <section id="scene-hero" class="clip" data-start="0" data-duration="6">
        <div id="badge" class="badge">HyperFrames</div>
        <h1 id="title" class="headline">Build Videos with HTML & Code</h1>
        <p id="sub" class="subtitle">High-fidelity motion graphics rendered deterministically frame-by-frame.</p>
      </section>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });

      tl.fromTo("#badge", { opacity: 0, y: -20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, 0.2);
      tl.fromTo("#title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.4);
      tl.fromTo("#sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.6);

      // Outro
      tl.to(["#badge", "#title", "#sub"], { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" }, 5.2);

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
```

---

## 4. User Prompt / Project Specification

<!-- Provide your specific video requirements below. -->
- **Video Topic / Goal**: [Describe your video topic here]
- **Target Duration**: [e.g. 5s, 10s, 15s, 30s]
- **Aspect Ratio**: [e.g. 1920x1080 Landscape (16:9) or 1080x1920 Vertical (9:16)]
- **Visual Style**: [e.g. Minimalist Tech, Dark SaaS, Kinetic Typography, Bold & Punchy]
- **Script / Key Beats**:
  - Beat 1 (0s - 3s): [Hook / Problem / Title]
  - Beat 2 (3s - 7s): [Feature 1 / Value Proposition]
  - Beat 3 (7s - 10s): [Call to Action / Outro]

### Optional: Voiceover & Image Assets
- **Voiceover Audio**: `assets/voiceover.mp3` (Include `<audio id="voiceover" src="assets/voiceover.mp3" data-start="0" data-duration="..." data-volume="1"></audio>`)
- **Available Images**:
  - `assets/image1.png` - [e.g. Hero product shot]
  - `assets/image2.png` - [e.g. Dashboard metric graphic]
- **Transcription (Word-Level JSON)**:
```json
[
  { "start": 0.0, "end": 0.45, "text": "Welcome" },
  { "start": 0.50, "end": 0.65, "text": "to" },
  { "start": 0.70, "end": 1.35, "text": "HyperFrames." }
]
```
