import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { projectsDir, updateRenderStatus } from './db.js';

// Active render processes in memory
const activeRenders = new Map();

/**
 * Start MP4 render for a given project
 */
export function startProjectRender(id) {
  if (activeRenders.has(id)) {
    return { status: 'already_running' };
  }

  const projectFolder = path.join(projectsDir, id);
  if (!fs.existsSync(projectFolder) || !fs.existsSync(path.join(projectFolder, 'index.html'))) {
    throw new Error('Project files not found on disk');
  }

  const outputMp4 = path.join(projectFolder, 'output.mp4');
  let renderLogs = [];

  updateRenderStatus(id, { status: 'rendering', log: 'Starting render...' });

  // Execute npx hyperframes render --quality looks --output output.mp4
  const child = spawn('npx', ['hyperframes', 'render', '--quality', 'looks', '--output', 'output.mp4'], {
    cwd: projectFolder,
    shell: true,
    env: process.env,
  });

  activeRenders.set(id, {
    child,
    logs: renderLogs,
    startTime: Date.now(),
  });

  const appendLog = (data) => {
    const text = data.toString();
    renderLogs.push(text);
    if (renderLogs.length > 200) {
      renderLogs = renderLogs.slice(-200);
    }
  };

  child.stdout?.on('data', appendLog);
  child.stderr?.on('data', appendLog);

  child.on('close', (code) => {
    activeRenders.delete(id);
    const finalLog = renderLogs.join('');
    if (code === 0 && fs.existsSync(outputMp4)) {
      updateRenderStatus(id, {
        status: 'done',
        outputPath: outputMp4,
        log: finalLog,
      });
    } else {
      updateRenderStatus(id, {
        status: 'error',
        log: finalLog || `Render exited with code ${code}`,
      });
    }
  });

  child.on('error', (err) => {
    activeRenders.delete(id);
    updateRenderStatus(id, {
      status: 'error',
      log: `Failed to launch hyperframes: ${err.message}`,
    });
  });

  return { status: 'started' };
}

/**
 * Get live status and logs of an ongoing or completed render
 */
export function getRenderLogs(id) {
  if (activeRenders.has(id)) {
    return {
      active: true,
      logs: activeRenders.get(id).logs.join(''),
    };
  }
  return { active: false, logs: '' };
}

/**
 * Launch HyperFrames Studio preview server in the background for a project
 */
export function launchStudioPreview(id) {
  const projectFolder = path.join(projectsDir, id);
  if (!fs.existsSync(projectFolder)) {
    throw new Error('Project folder not found');
  }

  // Spawns npx hyperframes preview --background
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['hyperframes', 'preview', '--background'], {
      cwd: projectFolder,
      shell: true,
      env: process.env,
    });

    let output = '';
    child.stdout?.on('data', (d) => (output += d.toString()));
    child.stderr?.on('data', (d) => (output += d.toString()));

    child.on('close', (code) => {
      resolve({ code, output });
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Run automated audit (lint, layout, overlaps, contrast) with snapshots
 */
export function runProjectCheck(id) {
  const projectFolder = path.join(projectsDir, id);
  if (!fs.existsSync(projectFolder)) {
    throw new Error('Project folder not found');
  }

  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['hyperframes', 'check', '--json', '--snapshots'], {
      cwd: projectFolder,
      shell: true,
      env: process.env,
    });

    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d) => (stdout += d.toString()));
    child.stderr?.on('data', (d) => (stderr += d.toString()));

    child.on('close', () => {
      try {
        const jsonMatch = stdout.match(/\{[\s\S]*"layout"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return resolve(parsed);
        }
      } catch (e) {
        console.error('Failed to parse check JSON', e);
      }
      resolve({ ok: false, rawOutput: stdout || stderr });
    });

    child.on('error', (err) => reject(err));
  });
}
