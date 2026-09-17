// Records the PNGs that exist on disk into scripts/png-manifest.json, so the
// palette check can tell a current raster from a stale one.
//
//   node scripts/record-brand-png.mjs
//
// render-brand-png.mjs already does this for the PNGs it renders itself. This
// exists for the ones it does not render: the presentation assets go through
// CRISPR, because at 132px the kanji is the composition and librsvg substitutes
// a face it does not have without saying so. There is also more than one PNG per
// source now — a wallpaper ships at three display sizes — and the renderer emits
// exactly one.
//
// It records, it does not render. Whatever is beside the source is what gets
// hashed, so run it after rendering, never instead of.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svgHash } from './svg-hash.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = join(ROOT, 'public', 'brand');
const MANIFEST = join(ROOT, 'scripts', 'png-manifest.json');
const rel = (p) => relative(ROOT, p).split(sep).join('/');

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

let sources = 0, rasters = 0, dropped = 0;
const seen = new Set();

for (const product of await readdir(BRAND, { withFileTypes: true })) {
  if (!product.isDirectory()) continue;
  const dir = join(BRAND, product.name);
  const files = await readdir(dir);
  const pngDir = join(dir, 'png');
  const pngs = files.includes('png') ? await readdir(pngDir) : [];

  for (const entry of files) {
    if (!entry.endsWith('.svg')) continue;
    const src = join(dir, entry);
    const key = rel(src);
    const base = entry.slice(0, -4);
    seen.add(key);

    // The base raster, plus any size-suffixed sibling. The suffix has to be a
    // real WxH or "-light" and "-crt" would be swept in as sizes of each other.
    const sized = new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+x\\d+\\.png$`);
    // Second guard: the stem a suffix makes must not be a source in its own
    // right, or wallpaper-ultrawide claims the 64x27 wallpaper's raster as a
    // size of itself — which it did, and both sources then pointed at one file.
    const own = (p) => !files.includes(p.replace(/\.png$/, '.svg'));
    const found = pngs.filter((p) => p === `${base}.png` || (sized.test(p) && own(p)))
      .map((p) => rel(join(pngDir, p)));

    // Anything recorded earlier that is not discoverable by name — the 4x
    // favicon is one — is kept as long as the file is still there. It still has
    // to pass `own`, or a wrong entry recorded before that rule existed would
    // survive every re-record by virtue of being in the file already.
    for (const old of Object.keys(manifest.rendered[key]?.png ?? {})) {
      if (found.includes(old) || !own(old.split('/').pop())) continue;
      const bytes = await readFile(join(ROOT, old)).catch(() => null);
      if (bytes) found.push(old); else dropped++;
    }

    if (!found.length) {
      console.error(`! ${key}: no PNG beside it — render it first`);
      process.exitCode = 1;
      continue;
    }

    const png = {};
    for (const p of found.sort()) png[p] = sha(await readFile(join(ROOT, p)));
    manifest.rendered[key] = { sha256: svgHash(await readFile(src)), png };
    sources++;
    rasters += found.length;
  }
}

for (const key of Object.keys(manifest.rendered)) if (!seen.has(key)) delete manifest.rendered[key];

manifest.rendered = Object.fromEntries(
  Object.entries(manifest.rendered).sort(([a], [b]) => (a < b ? -1 : 1))
);
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`recorded ${rasters} PNGs from ${sources} sources${dropped ? `, dropped ${dropped} missing` : ''}`);
