/**
 * Convert all PNG / JPG / JPEG in public/ to WebP, then
 * patch every .ts / .tsx / .css / .html source file that
 * references the old paths.
 *
 * Skip list (kept as original format):
 *   - favicon new.png      (browser favicon compat)
 *   - og-image.png         (social-share compat)
 *   - models/macbook/*.jpg (Three.js texture loader)
 */

import sharp from 'sharp';
import { readdir, stat, rm, rename, readFile, writeFile } from 'fs/promises';
import { join, extname, dirname, basename, relative } from 'path';
import { glob } from 'fs/promises';

const ROOT      = new URL('..', import.meta.url).pathname;
const PUBLIC    = join(ROOT, 'public');
const SRC       = join(ROOT, 'src');
const INDEX_HTML = join(ROOT, 'index.html');

const SKIP_FILES = new Set([
  'favicon new.png',
  'og-image.png',
]);

function shouldSkip(filePath) {
  const name = basename(filePath);
  if (SKIP_FILES.has(name)) return true;
  // Keep Three.js macbook textures as JPEG
  if (filePath.includes('models/macbook')) return true;
  return false;
}

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...await findImages(full));
    else if (e.isFile()) {
      const ext = extname(e.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext) && !shouldSkip(full)) {
        files.push(full);
      }
    }
  }
  return files;
}

function fmt(bytes) { return (bytes / 1024).toFixed(1) + ' KB'; }

// ── Step 1: Convert images ─────────────────────────────────────────────────
async function convertToWebP(filePath) {
  const ext     = extname(filePath).toLowerCase();
  const webpPath = filePath.slice(0, -ext.length) + '.webp';
  const tmp     = filePath + '.tmp.webp';

  const before = (await stat(filePath)).size;

  try {
    await sharp(filePath)
      .webp({ quality: 78, effort: 6, smartSubsample: true })
      .toFile(tmp);

    const after = (await stat(tmp)).size;

    // Replace original with WebP
    await rm(filePath);
    await rename(tmp, webpPath);

    return { old: filePath, webp: webpPath, before, after };
  } catch (err) {
    try { await rm(tmp); } catch {}
    console.error(`  ✗ ${relative(PUBLIC, filePath)}: ${err.message}`);
    return null;
  }
}

// ── Step 2: Patch source references ───────────────────────────────────────
async function patchFile(filePath, mapping) {
  let content = await readFile(filePath, 'utf8');
  let changed = false;

  for (const [oldRel, newRel] of mapping) {
    // Match the old path (with or without leading slash) followed by a quote/backtick/paren
    const escapedOld = oldRel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escapedOld, 'g');
    if (re.test(content)) {
      content = content.replace(new RegExp(escapedOld, 'g'), newRel);
      changed = true;
    }
  }

  if (changed) {
    await writeFile(filePath, content, 'utf8');
    return true;
  }
  return false;
}

async function findSourceFiles() {
  const exts = ['.ts', '.tsx', '.css', '.html'];
  const results = [];

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        await walk(full);
      } else if (e.isFile() && exts.includes(extname(e.name))) {
        results.push(full);
      }
    }
  }

  await walk(SRC);
  results.push(INDEX_HTML);
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('Step 1: Converting images to WebP…\n');
  const files = await findImages(PUBLIC);
  console.log(`Found ${files.length} images to convert\n`);

  let totalBefore = 0, totalAfter = 0;
  // mapping: [oldRelPath, newRelPath]  (paths relative to public, used for string replacement)
  const mapping = [];

  for (const f of files) {
    const result = await convertToWebP(f);
    if (!result) continue;

    const relOld = relative(PUBLIC, result.old);   // e.g. "Projectcard-images/foo.png"
    const relNew = relative(PUBLIC, result.webp);  // e.g. "Projectcard-images/foo.webp"
    const extOld = extname(result.old).toLowerCase();

    // Build replacement pairs for both /prefixed and bare paths
    mapping.push([relOld, relNew]);
    mapping.push(['/' + relOld, '/' + relNew]);

    totalBefore += result.before;
    totalAfter  += result.after;

    const pct = `-${((1 - result.after / result.before) * 100).toFixed(0)}%`;
    console.log(`  ${pct.padEnd(6)} ${fmt(result.before).padStart(10)} → ${fmt(result.after).padStart(10)}   ${relOld}`);
  }

  const saved   = totalBefore - totalAfter;
  const pct     = totalBefore > 0 ? ((saved / totalBefore) * 100).toFixed(1) : 0;

  console.log('\n─────────────────────────────────────────');
  console.log(`Before : ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`After  : ${(totalAfter  / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Saved  : ${(saved       / 1024 / 1024).toFixed(1)} MB  (${pct}%)`);

  console.log('\nStep 2: Patching source file references…\n');
  const sourceFiles = await findSourceFiles();
  let patchedCount = 0;

  for (const sf of sourceFiles) {
    const wasPatched = await patchFile(sf, mapping);
    if (wasPatched) {
      console.log(`  patched  ${relative(ROOT, sf)}`);
      patchedCount++;
    }
  }

  console.log(`\n${patchedCount} source file(s) updated.`);
  console.log('\nDone. Run `npm run build` to verify.');
}

main().catch(err => { console.error(err); process.exit(1); });
