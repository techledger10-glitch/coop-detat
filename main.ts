// Turkey Escape game hand-in program
// Writes the entry the site reads: copies game/ and screenshots/, then writes dossier.json
// Reads settings from environment: MAKEFUN_OUTPUT_DIR (default 'out')

import { cpSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? 'out';

// Create output directories
mkdirSync(out, { recursive: true });

// Copy game directory
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });

// Copy screenshots directory
if (existsSync(join(here, 'screenshots'))) {
  mkdirSync(join(out, 'screenshots'), { recursive: true });
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Helper function to get sha256 hash of a file
function getFileHash(filePath: string): string {
  const buffer = readFileSync(filePath);
  return createHash('sha256').update(buffer).digest('hex');
}

// Helper function to get file info recursively
function getFiles(dir: string, prefix = ''): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const relPath = prefix ? join(prefix, entry) : entry;
    if (statSync(fullPath).isDirectory()) {
      files.push(...getFiles(fullPath, relPath));
    } else {
      files.push(relPath);
    }
  }
  return files.sort();
}

// Helper function to get image dimensions
function getImageDimensions(filePath: string): [number, number] | null {
  try {
    const buffer = readFileSync(filePath);
    // PNG header: width and height are at bytes 16-24
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const width = view.getUint32(16, false);
    const height = view.getUint32(20, false);
    return [width, height];
  } catch {
    return null;
  }
}

// Read game metadata from game/src/main.js
function readGameMetadata(): { title: string; description: string; tags: string[] } {
  // These are stored in the game data
  return {
    title: 'Coop D\'État: Turkey Escape',
    description: 'A turkey escapes Thanksgiving dinner, chased by a farmer, dodging the oven and the carving knife',
    tags: ['game', 'turkey', 'escape', 'farmer', 'adventure']
  };
}

// Build the dossier.json
function buildDossier(outputDir: string): object {
  const gameDir = join(outputDir, 'game');
  const screenshotsDir = join(outputDir, 'screenshots');
  
  // Get metadata
  const metadata = readGameMetadata();
  
  // Build stages from game/src/levels.js
  const levels = [
    { name: 'Farmyard', description: 'Escape through the farmyard - watch for fences and hay bales' },
    { name: 'Barn', description: 'Navigate the dark barn - use crates and cover to hide' },
    { name: 'Kitchen', description: 'The kitchen is alive with danger - avoid the ovens and carving knives' }
  ];
  
  // Get control descriptions
  const controls = 'Arrow Keys: Move, Shift: Sprint, Space: Jump';
  
  // Process screenshots
  const screenshots: object[] = [];
  if (existsSync(screenshotsDir)) {
    for (const file of readdirSync(screenshotsDir).sort()) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const filePath = join(screenshotsDir, file);
        const dims = getImageDimensions(filePath);
        if (dims) {
          screenshots.push({
            path: `screenshots/${file}`,
            sha256: getFileHash(filePath),
            width: dims[0],
            height: dims[1]
          });
        }
      }
    }
  }
  
  // Process game files
  const gameFiles: object[] = [];
  if (existsSync(gameDir)) {
    for (const relPath of getFiles(gameDir)) {
      if (relPath !== 'dossier.json') { // shouldn't happen but safety
        const filePath = join(gameDir, relPath);
        gameFiles.push({
          path: relPath,
          sha256: getFileHash(filePath)
        });
      }
    }
  }
  
  // Build dossier
  const dossier = {
    title: metadata.title,
    pitch: metadata.description,
    description: metadata.description,
    tags: metadata.tags,
    controls: controls,
    stages: levels,
    screenshots: screenshots,
    game: gameFiles,
    toolchain: {
      name: 'node',
      version: process.version
    }
  };
  
  return dossier;
}

// Write dossier.json
const dossier = buildDossier(out);
writeFileSync(join(out, 'dossier.json'), JSON.stringify(dossier, null, 2) + '\n');

// Print summary
console.log(`Wrote dossier.json for "${dossier.title}"`);
console.log(`Screenshots: ${dossier.screenshots.length}`);
console.log(`Game files: ${dossier.game.length}`);
console.log(`Output directory: ${out}`);
