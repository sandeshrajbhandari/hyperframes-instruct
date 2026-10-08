import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const projectsDir = path.join(rootDir, 'projects');

// Ensure data and projects directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'hyperframes.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    html TEXT NOT NULL,
    width INTEGER NOT NULL DEFAULT 1920,
    height INTEGER NOT NULL DEFAULT 1080,
    duration REAL NOT NULL DEFAULT 5,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    render_status TEXT NOT NULL DEFAULT 'idle',
    render_output_path TEXT,
    render_log TEXT
  );
`);

/**
 * Sync project HTML to filesystem for HyperFrames CLI
 */
export function syncProjectToDisk(id, html) {
  const projectFolder = path.join(projectsDir, id);
  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder, { recursive: true });
  }
  const htmlPath = path.join(projectFolder, 'index.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  return htmlPath;
}

/**
 * Remove project folder from filesystem
 */
export function removeProjectFromDisk(id) {
  const projectFolder = path.join(projectsDir, id);
  if (fs.existsSync(projectFolder)) {
    fs.rmSync(projectFolder, { recursive: true, force: true });
  }
}

/**
 * Extract data-width, data-height, data-duration from HTML if present
 */
export function parseDimensionsAndDuration(html) {
  const widthMatch = html.match(/data-width=["']?(\d+)["']?/i);
  const heightMatch = html.match(/data-height=["']?(\d+)["']?/i);
  const durationMatch = html.match(/data-duration=["']?([0-9.]+)["']?/i);

  return {
    width: widthMatch ? parseInt(widthMatch[1], 10) : 1920,
    height: heightMatch ? parseInt(heightMatch[1], 10) : 1080,
    duration: durationMatch ? parseFloat(durationMatch[1]) : 5,
  };
}

export function getAllProjects() {
  const query = db.prepare(`
    SELECT id, title, width, height, duration, created_at, updated_at, render_status, render_output_path
    FROM projects
    ORDER BY updated_at DESC
  `);
  return query.all();
}

export function getProject(id) {
  const query = db.prepare(`SELECT * FROM projects WHERE id = ?`);
  return query.get(id);
}

export function createProject({ id, title, html, width, height, duration }) {
  const now = new Date().toISOString();
  const parsed = parseDimensionsAndDuration(html);
  const finalWidth = width || parsed.width || 1920;
  const finalHeight = height || parsed.height || 1080;
  const finalDuration = duration || parsed.duration || 5;

  const insert = db.prepare(`
    INSERT INTO projects (id, title, html, width, height, duration, created_at, updated_at, render_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'idle')
  `);
  insert.run(id, title, html, finalWidth, finalHeight, finalDuration, now, now);

  syncProjectToDisk(id, html);
  return getProject(id);
}

export function updateProject(id, { title, html, width, height, duration }) {
  const project = getProject(id);
  if (!project) return null;

  const now = new Date().toISOString();
  let updatedWidth = width ?? project.width;
  let updatedHeight = height ?? project.height;
  let updatedDuration = duration ?? project.duration;

  if (html && (width === undefined || height === undefined || duration === undefined)) {
    const parsed = parseDimensionsAndDuration(html);
    if (width === undefined && parsed.width) updatedWidth = parsed.width;
    if (height === undefined && parsed.height) updatedHeight = parsed.height;
    if (duration === undefined && parsed.duration) updatedDuration = parsed.duration;
  }

  const update = db.prepare(`
    UPDATE projects
    SET title = COALESCE(?, title),
        html = COALESCE(?, html),
        width = ?,
        height = ?,
        duration = ?,
        updated_at = ?
    WHERE id = ?
  `);
  update.run(title ?? null, html ?? null, updatedWidth, updatedHeight, updatedDuration, now, id);

  if (html) {
    syncProjectToDisk(id, html);
  }

  return getProject(id);
}

export function deleteProject(id) {
  const del = db.prepare(`DELETE FROM projects WHERE id = ?`);
  del.run(id);
  removeProjectFromDisk(id);
  return true;
}

export function updateRenderStatus(id, { status, outputPath = null, log = null }) {
  const update = db.prepare(`
    UPDATE projects
    SET render_status = ?,
        render_output_path = COALESCE(?, render_output_path),
        render_log = COALESCE(?, render_log),
        updated_at = ?
    WHERE id = ?
  `);
  update.run(status, outputPath, log, new Date().toISOString(), id);
  return getProject(id);
}

export { projectsDir, rootDir };
