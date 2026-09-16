// Raster fallbacks for the brand SVGs.
//
// Every consumer that will not render SVG needs these: GitHub social cards and
// og:image, app stores, README badges on mirrors, anything pasted into Slack or
// a doc. They were previously committed by hand with nothing to regenerate
// them, so an edit to an SVG left its PNG silently stale — which is how the
// palette drift this script was written alongside survived in the rendered
// output after the source was already correct.
//
// Sizes come from the SVG itself at 2x, matching what was already committed.
// The one exception is vaporsoft-favicon-256.png, a 4x favicon that predates
// the png/ directory and is referenced directly by its path.
//
// Renders also record the hash of the SVG they came from in png-manifest.json.
// That is what lets check-palette.mjs tell a current PNG from a stale one
// without re-rendering, which it cannot portably do — see the note there.
//
// Usage:  node scripts/render-brand-png.mjs [name-fragment ...]
//         node scripts/render-brand-png.mjs --check     (verify, write nothing)
//
// With no arguments every SVG is rendered. Fragments filter by file path, so
// `node scripts/render-brand-png.mjs kata crispr` re-renders just those two.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = join(ROOT, 'public', 'brand');
const MANIFEST = join(ROOT, 'scripts', 'png-manifest.json');
const SCALE = 2;

// Rasterising at the target size directly makes librsvg lay text out at that
// size; rendering large and downsampling instead keeps the glyph positions the
// SVG asks for and antialiases them, which is what the committed PNGs show.
const SUPERSAMPLE = 3;

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const filters = argv.filter((a) => !a.startsWith('--'));

const intrinsic = (svg) => {
  const head = svg.slice(0, 600);
  const vb = /viewBox="\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/.exec(head);
  if (vb) return [Number(vb[1]), Number(vb[2])];
  const w = /\bwidth="([\d.]+)"/.exec(head);
  const h = /\bheight="([\d.]+)"/.exec(head);
  if (w && h) return [Number(w[1]), Number(h[1])];
  throw new Error('no viewBox and no width/height');
};

const render = async (svgPath, width, height) => {
  const svg = await readFile(svgPath, 'utf8');
  return sharp(Buffer.from(svg), { density: 96 * SUPERSAMPLE })
    .resize(width, height, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer();
};

// Discovered rather than listed, so a new product directory is picked up by
// adding its SVG and nothing else.
const targets = [];
for (const product of await readdir(BRAND, { withFileTypes: true })) {
  if (!product.isDirectory()) continue;
  const dir = join(BRAND, product.name);
  for (const entry of await readdir(dir)) {
    if (!entry.endsWith('.svg')) continue;
    const src = join(dir, entry);
    const svg = await readFile(src, 'utf8');
    const [w, h] = intrinsic(svg);
    const sha = createHash('sha256').update(await readFile(src)).digest('hex');
    targets.push({ src, sha, out: join(dir, 'png', basename(entry, '.svg') + '.png'), w: w * SCALE, h: h * SCALE });
  }
}
const fav = join(BRAND, 'vaporsoft', 'vaporsoft-favicon.svg');
targets.push({
  src: fav, sha: createHash('sha256').update(await readFile(fav)).digest('hex'),
  out: join(BRAND, 'vaporsoft', 'vaporsoft-favicon-256.png'), w: 256, h: 256
});

// A filtered run must not drop the entries it did not touch, so the manifest is
// merged, not replaced.
let manifest = { note: 'Written by scripts/render-brand-png.mjs. sha256 is of the SVG at render time; check-palette.mjs fails when a source has moved on from its PNG.', rendered: {} };
try { manifest = { ...manifest, ...JSON.parse(await readFile(MANIFEST, 'utf8')) }; } catch {}

const record = (t, outRel, buf) => {
  const key = t.src.slice(ROOT.length + 1).split(sep).join('/');
  const e = manifest.rendered[key] ??= { sha256: '', png: {} };
  e.sha256 = t.sha;
  e.png[outRel] = createHash('sha256').update(buf).digest('hex');
  e.png = Object.fromEntries(Object.keys(e.png).sort().map((k) => [k, e.png[k]]));
};

let written = 0, stale = 0, same = 0;
for (const t of targets) {
  const rel = t.out.slice(ROOT.length + 1).split(sep).join('/');
  if (filters.length && !filters.some((f) => t.src.includes(f))) continue;

  const buf = await render(t.src, t.w, t.h);
  let prev = null;
  try { prev = await readFile(t.out); } catch {}

  if (prev && prev.equals(buf)) { same++; record(t, rel, buf); continue; }
  if (CHECK) { console.log(`  STALE  ${rel}`); stale++; continue; }

  await mkdir(dirname(t.out), { recursive: true });
  await writeFile(t.out, buf);
  record(t, rel, buf);
  console.log(`  ${prev ? 'updated' : 'added  '} ${rel}  ${t.w}x${t.h}`);
  written++;
}

if (!CHECK) {
  const ordered = Object.fromEntries(Object.keys(manifest.rendered).sort().map((k) => [k, manifest.rendered[k]]));
  manifest.rendered = ordered;
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
}

if (CHECK && stale) {
  console.error(`\n${stale} PNG(s) do not match their SVG. Run: node scripts/render-brand-png.mjs`);
  process.exit(1);
}
console.log(`\n${written} written, ${same} already current`);
