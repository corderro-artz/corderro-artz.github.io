// Fails when the palette drifts.
//
// Four values had already drifted before this existed: carmine was retyped as
// #a42839 and #9b1f30 inside the CRISPR disc, the light ink was written
// rgba(18, 20, 24) in twelve CSS rules against a #121318 token, and kata's
// light plate used the atmosphere's top stop instead of the surface. All four
// shipped, in the SVGs and in the PNGs rendered from them. Nothing caught it
// because nothing was looking.
//
// Three gates:
//   1. palette.json agrees with global.css, which is what actually ships.
//   2. No retired value appears anywhere in src/ or public/brand/.
//   3. Every hex in a brand SVG is one the palette permits.
//   4. Every PNG was rendered from the SVG as it stands now.
//
// Gate 4 compares source hashes against scripts/png-manifest.json rather than
// looking at pixels. Two weaker designs were tried and rejected. Re-rendering
// and comparing bytes is not portable — the marks set Japanese text in Yu
// Gothic and Meiryo, so a Linux runner rasterises different pixels than the
// Windows box that generated them. Scanning the PNG for retired colours misses
// them outright: the drifted CRISPR rects carry fill-opacity="0.98", so #a42839
// over ink lands on #a12738 and an exact-match scan reports a stale file clean.
// A hash of the source is exact, cheap, and indifferent to the renderer.
//
// Usage:  node scripts/check-palette.mjs
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { svgHash } from './svg-hash.mjs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const rel = (p) => relative(ROOT, p).split(sep).join('/');
const fail = [];

const palette = JSON.parse(await readFile(join(ROOT, 'public/brand/palette.json'), 'utf8'));
const css = await readFile(join(ROOT, 'src/styles/global.css'), 'utf8');

// ---- 1. palette.json vs the stylesheet -------------------------------------
for (const [name, token] of Object.entries(palette.core)) {
  const m = new RegExp(`${token.css}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!m) { fail.push(`core.${name}: ${token.css} is not defined in global.css`); continue; }
  if (m[1].toLowerCase() !== token.hex) fail.push(`core.${name}: palette says ${token.hex}, global.css says ${m[1]}`);

  const rgbVar = `${token.css}-rgb`;
  if (css.includes(rgbVar)) {
    const r = new RegExp(`${rgbVar}:\\s*([0-9]+),\\s*([0-9]+),\\s*([0-9]+)`).exec(css);
    const got = r && r.slice(1, 4).map(Number);
    if (!got || got.join(',') !== token.rgb.join(','))
      fail.push(`core.${name}: ${rgbVar} is ${got ? got.join(', ') : 'unparseable'}, expected ${token.rgb.join(', ')}`);
    const asHex = '#' + token.rgb.map((n) => n.toString(16).padStart(2, '0')).join('');
    if (asHex !== token.hex) fail.push(`core.${name}: rgb ${token.rgb.join(', ')} is ${asHex}, not ${token.hex}`);
  }
}

// ---- 2. retired values, anywhere -------------------------------------------
const walk = async (dir, test, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, test, out);
    else if (test(e.name)) out.push(p);
  }
  return out;
};

const sources = [
  ...(await walk(join(ROOT, 'src'), (n) => /\.(css|astro|ts|js|mjs)$/.test(n))),
  ...(await walk(join(ROOT, 'public/brand'), (n) => n.endsWith('.svg'))),
];

for (const file of sources) {
  const text = await readFile(file, 'utf8');
  for (const [dead, live] of Object.entries(palette.retired)) {
    if (!dead.startsWith('#')) continue;
    const hits = text.toLowerCase().split(dead).length - 1;
    if (hits) fail.push(`${rel(file)}: ${hits}x retired ${dead} — use ${live}`);
  }
}

// ---- 3. brand SVGs stay inside the palette ---------------------------------
const allowed = new Set([
  ...Object.values(palette.core).map((t) => t.hex),
  palette.theme.dark.canvas, palette.theme.dark.text,
  palette.theme.light.canvas, palette.theme.light.surface, palette.theme.light.text,
  palette.ramp.anchor, ...palette.ramp.shades, ...palette.ramp.tints,
].map((h) => h.toLowerCase()));

for (const file of sources.filter((f) => f.endsWith('.svg'))) {
  const text = await readFile(file, 'utf8');
  const seen = new Set((text.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((h) => h.toLowerCase()));
  for (const hex of seen) if (!allowed.has(hex)) fail.push(`${rel(file)}: ${hex} is not in the palette`);
}

// ---- 4. the PNGs were rendered from the SVGs as they stand ------------------
let manifest = null;
try { manifest = JSON.parse(await readFile(join(ROOT, 'scripts/png-manifest.json'), 'utf8')); }
catch { fail.push('scripts/png-manifest.json is missing — run: npm run brand:png'); }

if (manifest) {
  const svgFiles = sources.filter((f) => f.endsWith('.svg'));
  for (const file of svgFiles) {
    const key = rel(file);
    const entry = manifest.rendered[key];
    if (!entry) { fail.push(`${key}: no PNG has been rendered from it — run: npm run brand:png`); continue; }
    // Line endings are normalised: git hands this file to a Linux runner
    // with LF and to a Windows clone with CRLF, and neither changes what
    // the renderer drew.
    if (svgHash(await readFile(file)) !== entry.sha256)
      fail.push(`${key}: changed since its PNG was rendered — run: npm run brand:png`);
    for (const [out, want] of Object.entries(entry.png)) {
      const bytes = await readFile(join(ROOT, out)).catch(() => null);
      if (!bytes?.length) { fail.push(`${out}: missing or empty — run: npm run brand:png`); continue; }
      // Catches a PNG replaced by hand or reverted on its own, which the source
      // hash alone cannot see.
      if (createHash('sha256').update(bytes).digest('hex') !== want)
        fail.push(`${out}: does not match what was rendered — run: npm run brand:png`);
    }
  }
  for (const key of Object.keys(manifest.rendered))
    if (!svgFiles.some((f) => rel(f) === key)) fail.push(`${key}: in the manifest but no longer exists`);
}

if (fail.length) {
  console.error(`palette check failed — ${fail.length} problem(s):\n`);
  for (const f of fail) console.error('  ' + f);
  process.exit(1);
}
const svgs = sources.filter((f) => f.endsWith('.svg')).length;
const pngs = Object.values(manifest?.rendered ?? {}).reduce((n, e) => n + Object.keys(e.png).length, 0);
console.log(`palette ok — ${Object.keys(palette.core).length} core tokens match global.css, ` +
            `${svgs} SVGs inside the palette, ${pngs} PNGs current, 0 retired values`);
