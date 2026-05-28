/**
 * In-place image compression for the portfolio public folder.
 * - JPEGs  → 78% quality, progressive, strip metadata
 * - PNGs   → max 2400px wide, strip metadata, optimize palette
 * - WebPs  → 80% quality, strip metadata
 * - JEPGs  → same as JPEG
 * Paths are preserved so no code changes are needed.
 */

import sharp from 'sharp';
import { readdir, stat, rename, rm } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;

// Max width for any image — beyond this it's wasting bytes at web resolution
const MAX_WIDTH = 2400;

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findImages(full));
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

function fmt(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  const tmpPath = filePath + '.tmp';

  const beforeStat = await stat(filePath);
  const beforeSize = beforeStat.size;

  try {
    const img = sharp(filePath);
    const meta = await img.metadata();

    // Resize if wider than MAX_WIDTH (preserves aspect ratio)
    const pipeline = meta.width > MAX_WIDTH
      ? img.resize(MAX_WIDTH, null, { withoutEnlargement: true })
      : img;

    if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline
        .jpeg({ quality: 78, progressive: true, mozjpeg: true })
        .toFile(tmpPath);
    } else if (ext === '.png') {
      await pipeline
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(tmpPath);
    } else if (ext === '.webp') {
      await pipeline
        .webp({ quality: 80, effort: 6 })
        .toFile(tmpPath);
    } else {
      return null;
    }

    const afterStat = await stat(tmpPath);
    const afterSize = afterStat.size;

    // Only replace if the compressed version is actually smaller
    if (afterSize < beforeSize) {
      await rm(filePath);
      await rename(tmpPath, filePath);
      return { beforeSize, afterSize, saved: beforeSize - afterSize };
    } else {
      await rm(tmpPath);
      return { beforeSize, afterSize: beforeSize, saved: 0 };
    }
  } catch (err) {
    // Clean up tmp if something went wrong
    try { await rm(tmpPath); } catch {}
    console.error(`  ✗ ${filePath.replace(PUBLIC_DIR, '')}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('Scanning images in public/…\n');
  const files = await findImages(PUBLIC_DIR);
  console.log(`Found ${files.length} images\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let skipped = 0;

  for (const file of files) {
    const result = await compress(file);
    if (!result) { skipped++; continue; }

    totalBefore += result.beforeSize;
    totalAfter  += result.afterSize;

    const pct = result.saved > 0
      ? `-${((result.saved / result.beforeSize) * 100).toFixed(0)}%`
      : 'already optimal';
    const label = file.replace(PUBLIC_DIR + '/', '');
    console.log(`  ${pct.padEnd(8)} ${fmt(result.beforeSize).padStart(10)} → ${fmt(result.afterSize).padStart(10)}   ${label}`);
  }

  const totalSaved = totalBefore - totalAfter;
  const totalPct = totalBefore > 0 ? ((totalSaved / totalBefore) * 100).toFixed(1) : 0;

  console.log('\n─────────────────────────────────────────');
  console.log(`Before : ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`After  : ${(totalAfter  / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Saved  : ${(totalSaved  / 1024 / 1024).toFixed(1)} MB  (${totalPct}%)`);
  if (skipped) console.log(`Skipped: ${skipped} files`);
}

main().catch(err => { console.error(err); process.exit(1); });
