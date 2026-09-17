/**
 * What is actually in public/brand/, read at build time.
 *
 * The brand page lists every mark and every raster the site serves. Typing that
 * list would guarantee it goes stale the first time an asset is added — the
 * presentation set alone is 20 sources and 42 rasters, and it grew by twelve
 * files the week it was written. So nothing here is typed except the prose: the
 * files are read off disk, their sizes are read out of the SVG and out of the
 * PNG's own name, and the page renders whatever it finds.
 *
 * Only the descriptions are editorial, in META below. An asset with no entry
 * there still lists; it simply lists without a sentence.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Resolved from the project root, not from this file: Astro bundles this module
// into dist/.prerender/ before running it, so a path relative to import.meta.url
// points into the build output rather than at the sources.
const BRAND = join(process.cwd(), 'public', 'brand');

/** Human names for the repositories, matching the catalogue's spelling. */
const PRODUCT = {
  vaporsoft: 'Vaporsoft',
  akira: 'Akira',
  kata: 'Kata',
  nfty: 'NFTY',
  crispr: 'CRISPR',
  sen: 'Sen'
};

/** The presentation assets, in the order the page lists them. */
const META = {
  'wallpaper': { title: 'Wallpaper', shape: '16:9', use: 'Desktops, and YouTube channel art — the lockup sits inside the area YouTube crops to.' },
  'wallpaper-ultrawide': { title: 'Wallpaper, ultrawide', shape: '43:18', use: 'The 3440×1440 ultrawide shape.' },
  'wallpaper-ultrawide-64x27': { title: 'Wallpaper, ultrawide', shape: '64:27', use: 'The 2560×1080 shape, which is not the same as 43:18.' },
  'wallpaper-crt': { title: 'Wallpaper, 4:3', shape: '4:3', use: 'Square-ish panels, down to 800×600.' },
  'header-wide': { title: 'Header, wide', shape: '3:1', use: 'Profile and social headers, Discord.' },
  'header-slim': { title: 'Header, slim', shape: '5:1', use: 'Page and README headers.' },
  'header-thin': { title: 'Header, thin', shape: '5.9:1', use: 'LinkedIn page covers and narrow banners.' },
  'social-card': { title: 'Social card', shape: '1.9:1', use: 'Open Graph and link previews.' },
  'email-banner': { title: 'Email banner', shape: '3:1', use: 'Email headers at the 600px standard.' },
  'badge': { title: 'Badge', shape: '6.5:1', use: 'Footers and READMEs, beside a row of shields.' },
  // The logo is deliberately absent: it is a mark, listed under Icons. Leaving
  // it here counted it among the assets while no group on that tab rendered it.
  'banner': { title: 'Banner', shape: '5:1', use: 'The original banner, drawn by hand rather than generated.' }
};

const ORDER = Object.keys(META);

const dims = (file) => {
  const head = readFileSync(file, 'utf8').slice(0, 400);
  const vb = /viewBox="\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/.exec(head);
  if (vb) return [Number(vb[1]), Number(vb[2])];
  const w = /\bwidth="([\d.]+)"/.exec(head);
  const h = /\bheight="([\d.]+)"/.exec(head);
  return w && h ? [Number(w[1]), Number(h[1])] : [0, 0];
};

const dirs = () =>
  readdirSync(BRAND, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

/**
 * The presentation assets: every Vaporsoft-branded file with a light twin and a
 * set of rasters. Each entry carries the source pair and every size on disk,
 * largest first.
 */
export function presentationAssets() {
  const dir = join(BRAND, 'vaporsoft');
  const files = readdirSync(dir);
  const pngs = existsSync(join(dir, 'png')) ? readdirSync(join(dir, 'png')) : [];

  return ORDER.filter((name) => files.includes(`vaporsoft-${name}.svg`)).map((name) => {
    const base = `vaporsoft-${name}`;
    const [w, h] = dims(join(dir, `${base}.svg`));

    // A raster is either the 2x render named after the source, or a sibling
    // carrying its own dimensions. Both are listed by the size they really are.
    const sizes = pngs
      // A sibling whose stem is itself a source belongs to that source, not to
      // this one: wallpaper-ultrawide-64x27.png is its own wallpaper, not a
      // 64x27 render of the 43:18 one.
      .filter((p) => p === `${base}.png`
        || (new RegExp(`^${base}-\\d+x\\d+\\.png$`).test(p) && !files.includes(p.replace(/\.png$/, '.svg'))))
      .map((p) => {
        // The size comes from the name only for a suffixed sibling. The raster
        // named after the source is its 2x render, whatever digits the source's
        // own name happens to end in: wallpaper-ultrawide-64x27.png is
        // 2560x1080, not 64x27.
        const m = p === `${base}.png` ? null : /-(\d+)x(\d+)\.png$/.exec(p);
        const px = m ? [Number(m[1]), Number(m[2])] : [w * 2, h * 2];
        const light = p.replace(base, `${base}-light`);
        return {
          w: px[0], h: px[1],
          label: `${px[0]}×${px[1]}`,
          dark: `/brand/vaporsoft/png/${p}`,
          light: pngs.includes(light) ? `/brand/vaporsoft/png/${light}` : null
        };
      })
      .sort((a, b) => b.w * b.h - a.w * a.h);

    return {
      name,
      title: META[name].title,
      shape: META[name].shape,
      use: META[name].use,
      source: `${w}×${h}`,
      svg: `/brand/vaporsoft/${base}.svg`,
      svgLight: files.includes(`${base}-light.svg`) ? `/brand/vaporsoft/${base}-light.svg` : null,
      sizes
    };
  });
}

/**
 * The marks: every product's icon and favicon, in both themes, with the raster
 * beside each. Vaporsoft's own marks come first; the rest follow in catalogue
 * order, and anything new in the directory lands at the end rather than going
 * missing.
 */
export function marks() {
  const known = Object.keys(PRODUCT);
  const order = [...known, ...dirs().filter((d) => !known.includes(d))];

  return order.filter((slug) => dirs().includes(slug)).map((slug) => {
    const dir = join(BRAND, slug);
    const files = readdirSync(dir).filter((f) => f.endsWith('.svg'));
    const pngs = existsSync(join(dir, 'png')) ? readdirSync(join(dir, 'png')) : [];

    const kinds = ['icon', 'favicon', 'logo']
      .filter((kind) => files.includes(`${slug}-${kind}.svg`))
      .map((kind) => {
        const base = `${slug}-${kind}`;
        const [w, h] = dims(join(dir, `${base}.svg`));
        return {
          kind,
          label: kind.charAt(0).toUpperCase() + kind.slice(1),
          size: `${w}×${h}`,
          svg: `/brand/${slug}/${base}.svg`,
          svgLight: files.includes(`${base}-light.svg`) ? `/brand/${slug}/${base}-light.svg` : null,
          png: pngs.includes(`${base}.png`) ? `/brand/${slug}/png/${base}.png` : null
        };
      });

    return { slug, name: PRODUCT[slug] || slug, kinds };
  }).filter((m) => m.kinds.length);
}

/**
 * The marks for the parts of the site that are not products — the brand
 * section's own pages. Same plate, same rail, same corner square; they are
 * listed here so the page that shows every mark shows them too.
 */
export function sectionMarks() {
  const dir = join(BRAND, 'vaporsoft');
  const files = readdirSync(dir).filter((f) => /^vaporsoft-mark-[a-z]+\.svg$/.test(f));
  const pngs = existsSync(join(dir, 'png')) ? readdirSync(join(dir, 'png')) : [];

  return files.map((file) => {
    const base = file.slice(0, -4);
    const name = base.replace('vaporsoft-mark-', '');
    const [w, h] = dims(join(dir, file));
    return {
      slug: base,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      kinds: [{
        kind: 'section',
        label: 'Section',
        size: `${w}×${h}`,
        svg: `/brand/vaporsoft/${base}.svg`,
        svgLight: files.includes(`${base}-light.svg`) || existsSync(join(dir, `${base}-light.svg`))
          ? `/brand/vaporsoft/${base}-light.svg` : null,
        png: pngs.includes(`${base}.png`) ? `/brand/vaporsoft/png/${base}.png` : null
      }]
    };
  });
}

/** The palette, straight out of the file the check script enforces. */
export function palette() {
  return JSON.parse(readFileSync(join(BRAND, 'palette.json'), 'utf8'));
}

/** What the whole directory adds up to, for the ledger strip. */
export function totals() {
  let sources = 0, rasters = 0;
  for (const slug of dirs()) {
    const dir = join(BRAND, slug);
    sources += readdirSync(dir).filter((f) => f.endsWith('.svg')).length;
    if (existsSync(join(dir, 'png'))) rasters += readdirSync(join(dir, 'png')).filter((f) => f.endsWith('.png')).length;
  }
  return { sources, rasters, marks: marks().length, assets: presentationAssets().length };
}
