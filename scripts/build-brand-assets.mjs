// Generates the Vaporsoft presentation assets — the wallpapers, the headers,
// the cards and the badge — from one set of rules, into public/brand/vaporsoft/.
//
//   node scripts/build-brand-assets.mjs
//
// They were hand-authored first, and every coordinate in them was typed. That is
// why they drifted: the first wallpaper's lockup sat 29px below the centre of
// its own canvas, because the stack was placed by its kanji baseline rather than
// by its ink, and nothing measured it. Eight assets across three aspect ratios
// cannot be kept square that way. Here the geometry is derived, so a new size is
// a row in ASSETS rather than a fresh set of guesses.
//
// The logo, the favicon and the original banner are NOT generated. Those are the
// older marks, they are drawn by hand, and this leaves them alone.
//
// After running this, render the PNGs with CRISPR and re-record the manifest —
// see "Rules for brand SVGs" in public/brand/PALETTE.md.
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'brand', 'vaporsoft');

// ---------------------------------------------------------------------------
// Measured font metrics
//
// Not read off the font tables: measured from the pixels. Both strings were
// rendered at 200px through CRISPR with the real faces and the ink bounding box
// measured.
//
//   VAPORSOFT   cap height 145/200 = 0.725em,  ink width 1122/200 = 5.61em
//   仮想 (600)  ink runs from 0.845em above the baseline to 0.085em below it,
//               and is 1.965em wide
//
// Their optical centres land 0.3625em and 0.38em above their own baselines,
// which is what lets a Latin line and a kanji set to the same centre read level
// despite the two faces sitting differently on the baseline.
const CAP = 0.725;
const CAP_MID = 0.3625;
const CJK_ASC = 0.845;
const CJK_DESC = 0.085;
const CJK_MID = 0.38;
const CJK_H = CJK_ASC + CJK_DESC;
const CJK_W = 1.965;
const WORD_W = 5.61;
// The tagline, measured the same way: 271px of ink at 14px with 4px of letter
// spacing, which is 12.21em of glyph plus one spacing per gap. A band only
// carries it when that much ink clears the wordmark.
const TAG_W = 12.21;

// SVG centres text on its advance width, and that includes the letter-spacing
// trailing the final glyph. Half of it has to come back or the line sits left.
const mid = (x, ls) => x + ls / 2;

const r2 = (v) => Math.round(v / 2) * 2;
const r4 = (v) => Math.round(v / 4) * 4;
const r8 = (v) => Math.round(v / 8) * 8;
const n = (v) => String(Math.round(v * 10) / 10);

const JP = 'Noto Sans JP, Yu Gothic, Hiragino Kaku Gothic ProN, Meiryo, sans-serif';
const SANS = 'Noto Sans, Yu Gothic, Meiryo, sans-serif';
const CARMINE = '#a11f31';

// A wallpaper covers a screen, so it takes the canvas colour. Everything else is
// a bounded object sitting on a page, which is what the surface value is for.
const THEME = {
  dark: {
    ground: '#07080b', surface: '#07080b', mark: '#f2ede6',
    frame: 0.08, grid: 0.028, kanji: 0.92, word: 0.6, wordBand: 0.68,
    tag: 0.36, tagSep: 0.22, rule: 0.18, divider: 0.1, bracket: 0.16,
    edge: 0.12, glow: [0.13, 0.1, 0.05]
  },
  light: {
    ground: '#f2ede6', surface: '#f4efe8', mark: '#121318',
    frame: 0.12, grid: 0.035, kanji: 0.9, word: 0.66, wordBand: 0.72,
    tag: 0.46, tagSep: 0.3, rule: 0.2, divider: 0.14, bracket: 0.18,
    edge: 0.16, glow: [0.09, 0.075, 0.045]
  }
};

const WORDMARK = `VAPOR<tspan fill="${CARMINE}" fill-opacity="1">S</tspan>OFT`;

const tagline = (t) =>
  `NATIVE<tspan fill-opacity="${t.tagSep}"> · </tspan>WEB<tspan fill-opacity="${t.tagSep}"> · </tspan>` +
  `<tspan fill="${CARMINE}" fill-opacity="0.92">AI</tspan><tspan fill-opacity="${t.tagSep}"> · </tspan>` +
  `<tspan fill="${CARMINE}" fill-opacity="0.92">ASSETS</tspan>`;

// The grid and the three carmine blooms, shared by every asset. Ids carry the
// asset's own prefix so two of these can be inlined on one page without their
// gradients colliding.
const atmosphere = (id, w, h, t) => {
  const cell = Math.max(24, r8(h * 0.0556));
  const reach = Math.max(w, h) * 0.42;
  const bloom = (key, x, y, scale, opacity) =>
    `    <radialGradient id="${id}-${key}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${x} ${y}) scale(${scale})">\n` +
    `      <stop stop-color="${CARMINE}" stop-opacity="${opacity}"/>\n` +
    `      <stop offset="1" stop-color="${CARMINE}" stop-opacity="0"/>\n` +
    `    </radialGradient>\n`;

  return {
    defs:
      bloom('a', r8(w * 0.05), r8(h * 0.08), r8(reach), t.glow[0]) +
      bloom('b', r8(w * 0.95), r8(h * 0.92), r8(reach * 0.95), t.glow[1]) +
      bloom('c', r8(w / 2), r8(h / 2), r8(reach * 0.8), t.glow[2]) +
      `    <pattern id="${id}-grid" width="${cell}" height="${cell}" patternUnits="userSpaceOnUse">\n` +
      `      <path d="M${cell} 0H0v${cell}" fill="none" stroke="${t.mark}" stroke-opacity="${t.grid}" stroke-width="1"/>\n` +
      `    </pattern>\n`,
    body: (rx) => {
      const r = rx ? ` rx="${rx}"` : '';
      return ['grid', 'a', 'b', 'c']
        .map((k) => `  <rect width="${w}" height="${h}"${r} fill="url(#${id}-${k})"/>`)
        .join('\n');
    }
  };
};

const fade = (id, x, width, colour, peak) =>
  `    <linearGradient id="${id}" x1="${x}" y1="0" x2="${x + width}" y2="0" gradientUnits="userSpaceOnUse">\n` +
  `      <stop stop-color="${colour}" stop-opacity="0"/>\n` +
  `      <stop offset="0.5" stop-color="${colour}" stop-opacity="${peak}"/>\n` +
  `      <stop offset="1" stop-color="${colour}" stop-opacity="0"/>\n` +
  `    </linearGradient>\n`;

// ---------------------------------------------------------------------------
// A plate: the lockup stacked and centred, for a canvas with room above and
// below it. The stack is centred on its ink — kanji ink, rule, cap height, rule
// — never on a baseline, which is the error this file exists to stop repeating.
function plate({ id, w, h, wallpaper = false, tag = false }, key) {
  const t = THEME[key];
  const ground = wallpaper ? t.ground : t.surface;
  const rx = wallpaper ? 0 : r4(h * 0.024);
  const margin = r8(h * 0.0815);
  const rail = Math.max(4, r2(h * 0.0056));
  const railH = r8(h * 0.444);
  const square = r4(rail * 3.2);

  const K = r4(h * 0.122);
  const W = r2(K * 0.197);
  const lsK = r2(K * 0.0758);
  const lsW = r2(W * 0.3077);
  const gap = r4(K * 0.3);
  const gapRule = r4(K * 0.55);
  const T = tag ? r2(K * 0.125) : 0;
  const gapTag = tag ? r4(K * 0.385) : 0;
  const lsT = tag ? r2(T * 0.385) : 0;

  let H = CJK_H * K + gap + 1 + gap + CAP * W + gapRule + 1;
  if (tag) H += gapTag + CAP * T;
  const top = h / 2 - H / 2;

  const kanjiBase = top + CJK_ASC * K;
  const ruleA = Math.round(top + CJK_H * K + gap);
  const wordBase = ruleA + 1 + gap + CAP * W;
  const ruleB = Math.round(wordBase + gapRule);
  const tagBase = ruleB + 1 + gapTag + CAP * T;

  const ruleAW = r4(K * 3.03);
  const ruleBW = r4(K * 3.94);
  const atm = atmosphere(id, w, h, t);
  const brk = r8(h * 0.0593);
  const arm = r4(brk * 0.6875);

  const edge = wallpaper
    ? `  <g stroke="${t.mark}" stroke-opacity="${t.bracket}" stroke-width="1" fill="none">
    <path d="M${brk} ${brk + arm}V${brk}h${arm}"/>
    <path d="M${w - brk} ${brk + arm}V${brk}h-${arm}"/>
    <path d="M${brk} ${h - brk - arm}v${arm}h${arm}"/>
    <path d="M${w - brk} ${h - brk - arm}v${arm}h-${arm}"/>
  </g>`
    : `  <rect x="${margin / 2}" y="${margin / 2}" width="${w - margin}" height="${h - margin}" rx="${Math.max(0, rx - 4)}" stroke="${t.mark}" stroke-opacity="${t.frame}"/>`;

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
${atm.defs}${fade(`${id}-rule-a`, (w - ruleAW) / 2, ruleAW, t.mark, t.rule)}${fade(`${id}-rule-b`, (w - ruleBW) / 2, ruleBW, CARMINE, 0.85)}  </defs>

  <rect width="${w}" height="${h}"${rx ? ` rx="${rx}"` : ''} fill="${ground}"/>
${atm.body(rx)}
${edge}

  <rect x="${margin}" y="${(h - railH) / 2}" width="${rail}" height="${railH}" fill="${CARMINE}" fill-opacity="0.9"/>
  <rect x="${w - margin - square}" y="${margin}" width="${square}" height="${square}" fill="${CARMINE}"/>

  <text x="${n(mid(w / 2, lsK))}" y="${n(kanjiBase)}" text-anchor="middle" font-size="${K}" font-weight="600" letter-spacing="${lsK}" fill="${t.mark}" fill-opacity="${t.kanji}" font-family="${JP}">仮想</text>
  <rect x="${(w - ruleAW) / 2}" y="${ruleA}" width="${ruleAW}" height="1" fill="url(#${id}-rule-a)"/>
  <text x="${n(mid(w / 2, lsW))}" y="${n(wordBase)}" text-anchor="middle" font-size="${W}" letter-spacing="${lsW}" fill="${t.mark}" fill-opacity="${t.word}" font-family="${SANS}">${WORDMARK}</text>
  <rect x="${(w - ruleBW) / 2}" y="${ruleB}" width="${ruleBW}" height="1" fill="url(#${id}-rule-b)"/>${tag ? `
  <text x="${n(mid(w / 2, lsT))}" y="${n(tagBase)}" text-anchor="middle" font-size="${T}" letter-spacing="${lsT}" fill="${t.mark}" fill-opacity="${t.tag}" font-family="${SANS}">${tagline(t)}</text>` : ''}
</svg>
`;
}

// ---------------------------------------------------------------------------
// A band: the lockup laid out horizontally, for a canvas too short to stack it.
// The kanji's ink centre and the wordmark block's centre both land on h/2, so
// the two read as one line however differently the two faces sit.
function band({ id, w, h }, key) {
  const t = THEME[key];
  const rx = r4(h * 0.024);
  const margin = r8(h * 0.1458);
  const rail = Math.max(4, r2(h * 0.0156));
  const railH = r8(h * 0.5);
  const square = r4(h * 0.0417);

  const K = r4(h * 0.1875);
  const lsK = r2(K * 0.111);
  const W = r2(K * 0.4167);
  const lsW = r2(W * 0.2667);
  const T = Math.max(11, r2(h * 0.039));
  const lsT = r2(T * 0.3333);

  const kanjiX = margin + r8(h * 0.1458);
  const kanjiBase = h / 2 + CJK_MID * K;
  const dividerX = r4(kanjiX + CJK_W * K + lsK + r8(h * 0.0729));
  const dividerH = r8(h * 0.375);
  const wordX = dividerX + r4(h * 0.1042);

  const gapRule = r4(W * 0.8);
  const blockH = CAP * W + gapRule + 1;
  const wordBase = h / 2 - blockH / 2 + CAP * W;
  const ruleY = Math.round(wordBase + gapRule);
  const ruleW = r4(W * 10);

  // The tagline is dropped rather than crowded. On a 600x200 email banner the
  // two ran into each other with 8px between them, which reads as one broken
  // line instead of two elements.
  const tagEnd = w - margin - square - r8(h * 0.0833);
  const wordEnd = wordX + WORD_W * W + 7 * lsW;
  const tagFits = tagEnd - (TAG_W * T + 25 * lsT) - wordEnd >= r8(h * 0.125);

  const atm = atmosphere(id, w, h, t);

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
${atm.defs}    <linearGradient id="${id}-rule" x1="${wordX}" y1="0" x2="${wordX + ruleW}" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="${CARMINE}" stop-opacity="0.8"/>
      <stop offset="1" stop-color="${CARMINE}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${w}" height="${h}" rx="${rx}" fill="${t.surface}"/>
${atm.body(rx)}
  <rect x="${margin / 2}" y="${margin / 2}" width="${w - margin}" height="${h - margin}" rx="${Math.max(0, rx - 4)}" stroke="${t.mark}" stroke-opacity="${t.frame}"/>

  <rect x="${margin}" y="${(h - railH) / 2}" width="${rail}" height="${railH}" fill="${CARMINE}"/>
  <rect x="${w - margin - square}" y="${margin}" width="${square}" height="${square}" fill="${CARMINE}"/>

  <text x="${kanjiX}" y="${n(kanjiBase)}" font-size="${K}" font-weight="600" letter-spacing="${lsK}" fill="${t.mark}" fill-opacity="${t.kanji}" font-family="${JP}">仮想</text>
  <rect x="${dividerX}" y="${(h - dividerH) / 2}" width="1" height="${dividerH}" fill="${t.mark}" fill-opacity="${t.divider}"/>
  <text x="${wordX}" y="${n(wordBase)}" font-size="${W}" letter-spacing="${lsW}" fill="${t.mark}" fill-opacity="${t.wordBand}" font-family="${SANS}">${WORDMARK}</text>
  <rect x="${wordX}" y="${ruleY}" width="${ruleW}" height="1" fill="url(#${id}-rule)"/>

${tagFits ? `
  <text x="${tagEnd}" y="${n(h / 2 + CAP_MID * T)}" text-anchor="end" font-size="${T}" letter-spacing="${lsT}" fill="${t.mark}" fill-opacity="${t.tag}" font-family="${SANS}">${tagline(t)}</text>` : ''}
</svg>
`;
}

// ---------------------------------------------------------------------------
// The badge. 20px tall because that is what a shield is, and it has to sit in a
// row of them without reading short or tall. Everything else follows from the
// measured ink: the split between the segments is where the wordmark's ink ends
// plus its padding, not a number that looked about right. The first one was
// typed, and it had 9px of air on the left of the text and 14px on the right.
function badge(key) {
  const t = THEME[key];
  const H = 20, F = 11, PAD = 8, GAP = 6, LS = 0.5, RAIL = 2, RAIL_H = 10;

  const wordInk = WORD_W * F + 8 * LS;
  const wordX = PAD + RAIL + GAP;
  const split = r2(wordX + wordInk + PAD);
  const right = Math.round(CJK_W * F + 2 * PAD + 2);
  const W = split + right;

  const ground = key === 'dark' ? t.ground : t.surface;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" rx="3" fill="${ground}"/>
  <path d="M${split} 0h${right - 3}a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-${right - 3}z" fill="${CARMINE}"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="2.5" stroke="${t.mark}" stroke-opacity="${t.edge}"/>
  <rect x="${PAD}" y="${(H - RAIL_H) / 2}" width="${RAIL}" height="${RAIL_H}" fill="${CARMINE}"/>
  <text x="${wordX}" y="${n(H / 2 + CAP_MID * F)}" font-size="${F}" letter-spacing="${LS}" fill="${t.mark}" fill-opacity="${key === 'dark' ? 0.94 : 0.92}" font-family="${SANS}">${WORDMARK}</text>
  <text x="${n(split + right / 2)}" y="${n(H / 2 + CJK_MID * F)}" text-anchor="middle" font-size="${F}" font-weight="600" fill="#f2ede6" fill-opacity="0.96" font-family="${JP}">仮想</text>
</svg>
`;
}

// ---------------------------------------------------------------------------
// Every asset, and the size its source is authored at. A source is authored at
// the size whose 2x render is the largest standard size for its shape, so the 2x
// PNG the rest of the brand directory expects is itself a real display size:
// 1920x1080 -> 4K, 1720x720 -> 3440x1440, 800x600 -> 1600x1200.
//
// The two ultrawides are two different shapes, not one. 3440x1440 is 43:18 and
// 2560x1080 is 64:27, and a 0.8% difference in aspect is a letterbox, not a
// rounding error: rendering the first at 2560 wide produces 2560x1072.
const ASSETS = [
  { id: 'wp', name: 'wallpaper', kind: plate, w: 1920, h: 1080, wallpaper: true },
  { id: 'wu', name: 'wallpaper-ultrawide', kind: plate, w: 1720, h: 720, wallpaper: true },
  { id: 'wf', name: 'wallpaper-ultrawide-64x27', kind: plate, w: 1280, h: 540, wallpaper: true },
  { id: 'wc', name: 'wallpaper-crt', kind: plate, w: 800, h: 600, wallpaper: true },
  { id: 'hw', name: 'header-wide', kind: plate, w: 1500, h: 500, tag: true },
  { id: 'sc', name: 'social-card', kind: plate, w: 1200, h: 630, tag: true },
  { id: 'hs', name: 'header-slim', kind: band, w: 1920, h: 384 },
  { id: 'ht', name: 'header-thin', kind: band, w: 1128, h: 191 },
  { id: 'eb', name: 'email-banner', kind: band, w: 600, h: 200 }
];

let count = 0;
for (const asset of ASSETS) {
  for (const key of ['dark', 'light']) {
    const suffix = key === 'dark' ? '' : '-light';
    const svg = asset.kind({ ...asset, id: asset.id + suffix }, key);
    await writeFile(join(OUT, `vaporsoft-${asset.name}${suffix}.svg`), svg, 'utf8');
    count++;
  }
}
for (const key of ['dark', 'light']) {
  await writeFile(join(OUT, `vaporsoft-badge${key === 'dark' ? '' : '-light'}.svg`), badge(key), 'utf8');
  count++;
}
console.log(`wrote ${count} sources into public/brand/vaporsoft/`);
