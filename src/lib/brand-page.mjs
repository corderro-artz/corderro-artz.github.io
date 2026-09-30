/**
 * The Vaporsoft console: what the brand directory holds, and where every file
 * is. It is named after the studio rather than after the word "brand" because
 * all of it is the studio's — the assets, the marks, the palette, and Donate and
 * Merch.
 *
 * It is built out of the same console the repository pages use — the same bar,
 * frame, tab rail and columns — because it is the same kind of object: a record
 * of something, rendered whole at build time. Only the contents of the columns
 * are new, and those are the `bp-` classes in src/styles/brand.css.
 *
 * Nothing here decides what exists. src/lib/brand-inventory.mjs reads that off
 * disk, so an asset added to public/brand/ appears on this page by being added
 * to public/brand/.
 */
import { renderBar } from './repo-page.mjs';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const TABS = [
  { id: 'assets', label: 'Assets', url: '' },
  { id: 'icons', label: 'Icons', url: 'icons/' },
  { id: 'palette', label: 'Palette', url: 'palette/' },
  // Neither of these has a route of its own: Donate leaves for Sen, and Merch
  // has nothing to link to yet.
  { id: 'donate', label: 'Donate', url: '' },
  { id: 'merch', label: 'Merch', url: '' }
];

/* ── Pieces ── */

// Each row is drawn once per theme and the one that does not match is hidden by
// the same class that swaps the artwork, so the file a chip downloads is the
// file the reader is looking at. `theme` is 'dark' or 'light'.
const links = (rows) =>
  '<div class="bp-links">' + rows.filter(Boolean).map((row) =>
    '<div class="bp-links-row bp-theme--' + row.theme + '"><span class="bp-links-label">' + esc(row.label) + '</span>'
    + '<div class="bp-links-set">' + row.items.filter((i) => i && i.href).map((i) =>
        '<a class="bp-chip" href="' + esc(i.href) + '"' + (i.download ? ' download' : '') + '>'
        + esc(i.text) + '</a>').join('')
    + '</div></div>').join('') + '</div>';

function fAsset(a) {
  return '<article class="bp-asset">'
    + '<header class="bp-asset-head">'
    + '<h4>' + esc(a.title) + '<i>' + esc(a.shape) + '</i></h4>'
    + (a.use ? '<p>' + esc(a.use) + '</p>' : '')
    + '</header>'
    + links([
        { theme: 'dark', label: 'Dark', items: [
          { href: a.svg, text: 'SVG' },
          ...a.sizes.map((s) => ({ href: s.dark, text: s.label, download: true }))
        ] },
        a.svgLight || a.sizes.some((s) => s.light)
          ? { theme: 'light', label: 'Light', items: [
              { href: a.svgLight, text: 'SVG' },
              ...a.sizes.map((s) => ({ href: s.light, text: s.label, download: true }))
            ] }
          : null
      ])
    + '</article>';
}

const assetGroup = (assets, names) =>
  '<div class="bp-assets">'
  + names.map((n) => assets.find((a) => a.name === n)).filter(Boolean).map(fAsset).join('')
  + '</div>';

// A chip that follows the theme: two anchors, one per theme, and CSS shows the
// one that matches. A mark with no light twin keeps its one file in both.
const themedChip = (dark, light, text, download) => {
  const attrs = download ? ' download' : '';
  return '<a class="bp-chip bp-theme--dark" href="' + esc(dark) + '"' + attrs + '>' + text + '</a>'
    + '<a class="bp-chip bp-theme--light" href="' + esc(light || dark) + '"' + attrs + '>' + text + '</a>';
};

// Kinds in preference order: Vaporsoft has no `-icon`, its square mark is the
// logo, and leaving it out of the grid would drop the brand's own mark from the
// page that lists every mark.
function fMark(m, kinds) {
  const k = kinds.map((kind) => m.kinds.find((x) => x.kind === kind)).find(Boolean);
  if (!k) return '';
  return '<article class="bp-mark">'
    + '<div class="bp-mark-art">'
    + '<img class="bp-mark-img bp-mark-img--dark" src="' + esc(k.svg) + '" alt="" width="64" height="64" loading="lazy" />'
    + (k.svgLight
        ? '<img class="bp-mark-img bp-mark-img--light" src="' + esc(k.svgLight) + '" alt="" width="64" height="64" loading="lazy" />'
        : '')
    + '</div>'
    + '<h4>' + esc(m.name) + '</h4>'
    + '<span class="bp-mark-size">' + esc(k.size) + '</span>'
    + '<div class="bp-links-set">'
    + themedChip(k.svg, k.svgLight, 'SVG')
    + (k.png ? themedChip(k.png, k.pngLight, 'PNG', true) : '')
    + '</div>'
    + '</article>';
}

const markGrid = (marks, kinds) =>
  '<div class="bp-marks">' + marks.map((m) => fMark(m, kinds)).join('') + '</div>';

const swatch = (name, hex, note) =>
  '<div class="bp-swatch"><i aria-hidden="true" style="background:' + esc(hex) + '"></i>'
  + '<b>' + esc(name) + '</b><code>' + esc(hex) + '</code>'
  + (note ? '<span>' + esc(note) + '</span>' : '') + '</div>';

function fCore(p) {
  return '<div class="bp-swatches">'
    + Object.entries(p.core).map(([name, t]) => swatch(name, t.hex, t.css)).join('')
    + '</div>';
}

function fRamp(p) {
  const stops = [...p.ramp.shades].reverse().concat([p.ramp.anchor], p.ramp.tints);
  return '<div class="bp-ramp">'
    + stops.map((hex) => '<i style="background:' + esc(hex) + '" title="' + esc(hex) + '"></i>').join('')
    + '</div>'
    + '<div class="bp-swatches bp-swatches--tight">'
    + [['Anchor', p.ramp.anchor], ['Deepest shade', p.ramp.shades[p.ramp.shades.length - 1]],
       ['Lightest tint', p.ramp.tints[p.ramp.tints.length - 1]]]
      .map(([n, hex]) => swatch(n, hex)).join('')
    + '</div>';
}

const fileRow = (label, href, note) =>
  '<div class="rp-kv-row"><span><a class="bp-file" href="' + esc(href) + '">' + esc(label) + '</a></span>'
  + '<i aria-hidden="true"></i><span>' + esc(note) + '</span></div>';

const fFiles = () =>
  '<div class="rp-kv">'
  + fileRow('palette.json', '/brand/palette.json', 'The values')
  + fileRow('PALETTE.md', '/brand/PALETTE.md', 'The rules')
  + fileRow('site.webmanifest', '/site.webmanifest', 'App manifest')
  + fileRow('sitemap.xml', '/sitemap.xml', 'Every page')
  + fileRow('robots.txt', '/robots.txt', 'Crawl policy')
  + '</div>';

// A section that does not exist yet: the mark, and the line. The panel used to
// explain itself underneath, and an explanation of why a thing is not there yet
// is the thing nobody came to read. The tab already says what the section is.
const fFuture = (mark, lede) =>
  '<div class="bp-future">'
  + '<div class="bp-future-art">'
  + '<img class="rp-mark--dark" src="/brand/vaporsoft/vaporsoft-mark-' + mark + '.svg"'
  + ' alt="" width="256" height="256" loading="lazy" />'
  + '<img class="rp-mark--light" src="/brand/vaporsoft/vaporsoft-mark-' + mark + '-light.svg"'
  + ' alt="" width="256" height="256" loading="lazy" />'
  + '</div>'
  + '<p class="bp-future-lede">' + esc(lede) + '</p>'
  + '</div>';

// Donate is Vaporsoft's own page on Sen, the studio's own platform. The mark is
// Sen's, and the whole block is the link, so the glint on hover has the plate it
// crosses and the hover has one thing to belong to.
export const SEN_URL = 'https://sen.vaporsoft.dev/vaporsoft';

const fSen = () =>
  '<a class="bp-sen" href="' + SEN_URL + '" target="_blank" rel="noopener noreferrer"'
  + ' aria-label="Donate to Vaporsoft on Sen">'
  + '<span class="bp-sen-art">'
  + '<img class="rp-mark--dark" src="/brand/sen/sen-icon.svg" alt="" width="256" height="256" loading="lazy" />'
  + '<img class="rp-mark--light" src="/brand/sen/sen-icon-light.svg" alt="" width="256" height="256" loading="lazy" />'
  + '</span>'
  + '<span class="bp-sen-lede">Give on Sen</span>'
  + '<span class="bp-sen-url">sen.vaporsoft.dev/vaporsoft</span>'
  + '</a>';

/* ── Shell ── */

const blocks = (list, mod) =>
  '<div class="rp-subtabs" role="tablist" aria-label="Section">'
  + list.map((b, i) => '<button class="rp-subtab" role="tab" type="button" data-block="' + b.id
      + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">'
      + '<i aria-hidden="true">' + b.jp + '</i>' + esc(b.label) + '</button>').join('')
  + '</div>'
  + '<div class="rp-blocks rp-blocks--' + mod + '">'
  + list.map((b, i) => '<section class="rp-block' + (i === 0 ? ' is-on' : '') + '" data-block="' + b.id + '">'
      + '<h3 class="rp-block-title"><i aria-hidden="true">' + b.jp + '</i>' + esc(b.label) + '</h3>'
      + '<div class="rp-block-body' + (b.bodyClass ? ' ' + b.bodyClass : '') + '">' + b.body + '</div>'
      + '</section>').join('')
  + '</div>';

const panel = (id, list, mod, on) =>
  '<section class="rp-panel' + (on ? ' is-on' : '') + '" data-panel="' + id + '"'
  + ' role="tabpanel" aria-labelledby="rp-tab-' + id + '">' + blocks(list, mod) + '</section>';

function head(totals) {
  return '<header class="bp-head">'
    + '<div class="bp-head-copy">'
    + '<h1>Vaporsoft</h1>'
    + '<p class="rp-lede">Wallpapers, headers, cards, icons and the palette, '
    + 'as vectors and rasters, in dark and light.</p>'
    + '</div>'
    + '<div class="bp-head-mark">'
    + '<img class="rp-mark rp-mark--dark" src="/brand/vaporsoft/vaporsoft-logo.svg" alt="" width="132" height="132" />'
    + '<img class="rp-mark rp-mark--light" src="/brand/vaporsoft/vaporsoft-logo-light.svg" alt="" width="132" height="132" />'
    + '</div>'
    + '</header>'
    + '<div class="rp-ledger-strip" style="--rp-cells:4">'
    + [[totals.assets, 'Assets'], [totals.marks, 'Mark sets'],
       [totals.sources, 'Vector sources'], [totals.rasters, 'Rasters']]
      .map((c) => '<div class="rp-metric"><b>' + c[0] + '</b><span>' + c[1] + '</span></div>').join('')
    + '</div>';
}

export function renderBrandPage({ assets, marks, sections, palette, totals }, open = 'assets') {
  return renderBar('vaporsoft')
    + '<div class="rp-console vapor-frame">'
    + head(totals)
    + '<div class="rp-tabs" role="tablist" aria-label="Vaporsoft">'
    + TABS.map((t) => {
        const on = t.id === open;
        return '<button class="rp-tab" role="tab" type="button" id="rp-tab-' + t.id + '"'
          + ' data-tab="' + t.id + '" data-url="' + t.url + '" aria-controls="' + t.id + '"'
          + ' aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + t.label + '</button>';
      }).join('')
    + '</div>'
    + '<div class="rp-panels">'
    + panel('assets', [
        { id: 'wallpapers', jp: '壁紙', label: 'Wallpapers',
          body: assetGroup(assets, ['wallpaper', 'wallpaper-ultrawide', 'wallpaper-ultrawide-64x27', 'wallpaper-crt']) },
        { id: 'headers', jp: '帯', label: 'Headers',
          body: assetGroup(assets, ['header-wide', 'header-slim', 'header-thin', 'banner']) },
        { id: 'pieces', jp: '札', label: 'Cards and badge',
          body: assetGroup(assets, ['social-card', 'email-banner', 'badge']) }
      ], '3', open === 'assets')
    + panel('icons', [
        { id: 'marks', jp: '印', label: 'Product marks', body: markGrid(marks, ['icon', 'logo']) },
        { id: 'favicons', jp: '符', label: 'Favicons', body: markGrid(marks, ['favicon']) },
        { id: 'sections', jp: '章', label: 'Section marks', body: markGrid(sections, ['section']) }
      ], '3', open === 'icons')
    + panel('palette', [
        { id: 'core', jp: '色', label: 'Core', body: fCore(palette) },
        { id: 'ramp', jp: '階', label: 'Ramp', body: fRamp(palette) },
        { id: 'files', jp: '索', label: 'Files', body: fFiles() }
      ], '3', open === 'palette')
    + panel('donate', [
        { id: 'donate', jp: '寄', label: 'Donate', bodyClass: 'rp-block-body--fill',
          body: fSen() }
      ], '1', open === 'donate')
    + panel('merch', [
        { id: 'merch', jp: '品', label: 'Merch', bodyClass: 'rp-block-body--fill',
          body: fFuture('merch', 'Coming soon') }
      ], '1', open === 'merch')
    + '</div>'
    + '</div>';
}
