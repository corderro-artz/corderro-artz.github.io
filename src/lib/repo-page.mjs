/**
 * Builds the markup for a repository page from the payload that
 * scripts/fetch-repo-data.mjs committed.
 *
 * Every fragment is a pure string builder taking one repository object, so the
 * same template renders any repository and the whole page is emitted at build
 * time. The only thing left to the browser is switching between panels and
 * indexing the readme, neither of which invents content.
 */

/* ── Formatting ── */

export const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const num = (n) => Number(n).toLocaleString('en-US');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
}

// Rendered at build time, so "today" would be a lie the moment the page is a
// day old. The page states the date and lets the reader do the subtraction.
function fmtBytes(b) {
  if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
  if (b >= 1024) return Math.round(b / 1024) + ' KB';
  return b + ' B';
}

/* The carmine ramp, from public/brand/palette.json. */
const RAMP = ['#a11f31', '#b44f5b', '#c3777e', '#d39ea1', '#e2c6c3'];

/* Line-drawn glyphs on one 16-unit grid at a single stroke weight, with butt
   caps and mitre joins, so they sit with the brand's corner brackets rather
   than with a vendor's icon set. */
const GLYPH = {
  source: '<path d="M5.9 3.9 2 8l3.9 4.1M10.1 3.9 14 8l-3.9 4.1"/>',
  release: '<path d="M8.4 2.2H2.2v6.2L8 14.2l6.2-6.2z"/><path d="M4.6 4.6h1.5v1.5H4.6z"/>',
  download: '<path d="M8 1.9v7.7"/><path d="M4.7 6.3 8 9.6l3.3-3.3"/><path d="M2.3 13.8h11.4"/>',
  open: '<path d="M7.6 2.9H2.6v10.5h10.5v-5"/><path d="M9.6 2.2h4.2v4.2"/><path d="M13.8 2.2 7.9 8.1"/>'
};
const icon = (k) => '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" '
  + 'stroke="currentColor" stroke-width="1.3" stroke-linecap="butt" stroke-linejoin="miter">'
  + GLYPH[k] + '</svg>';

/* The way back, the crumb and the theme control, on one row ABOVE the frame.
   Inside it, the arrow landed in the corner bracket — the bracket ends at
   exactly the inset the content line starts at, so the two touched with no gap
   and read as one broken glyph. Outside, there is nothing to collide with, and
   it is the more honest place for it: getting back to the site is not part of
   the repository's record. The arrow is drawn on the same grid and at the same
   stroke as the action rail's glyphs, and steps left on hover. */
function fBar(slug) {
  return '<div class="rp-bar">'
    + '<a class="rp-back" href="/">'
    + '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" '
    + 'stroke-width="1.3" stroke-linecap="butt" stroke-linejoin="miter">'
    + '<path d="M13.4 8H2.6"/><path d="M6.6 3.9 2.5 8l4.1 4.1"/></svg>'
    + '<span>Vaporsoft</span></a>'
    + '<span class="rp-crumb"><b>/</b> ' + esc(slug) + '</span>'
    + '<button type="button" class="vapor-theme-toggle rp-theme" data-theme-toggle aria-label="Toggle theme">'
    + '<span class="vapor-theme-toggle-dot"></span><span data-theme-label>LIGHT</span></button>'
    + '</div>';
}

/* The catalogue spells two of these as acronyms; GitHub spells every
   repository in lower case. The page's own heading is set in capitals either
   way, but the title tag, the breadcrumb and the structured data are not. */
const DISPLAY = { akira: 'Akira', kata: 'Kata', nfty: 'NFTY', crispr: 'CRISPR' };

export const displayName = (slug) =>
  DISPLAY[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);

/* ── Derived facts ── */

function langEntries(langs) {
  const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
  const all = Object.entries(langs).sort((a, b) => b[1] - a[1]);
  const top = all.slice(0, 4);
  const rest = all.slice(4).reduce((a, x) => a + x[1], 0);
  const out = top.map((e, i) => ({ name: e[0], bytes: e[1], pct: (e[1] / total) * 100, color: RAMP[i] }));
  if (rest) out.push({ name: 'Other', bytes: rest, pct: (rest / total) * 100, color: RAMP[4] });
  return out;
}

// Percentages to whole cells out of a hundred, by largest remainder: floor each,
// then hand the leftover cells to the largest fractions. A language that is
// present at all is given a cell before anything else, so nothing named in the
// key is missing from the field — Kata's HTML is 0.4% and would otherwise floor
// to nothing.
function apportion(pcts) {
  const counts = pcts.map((p) => (p > 0 ? Math.max(1, Math.floor(p)) : 0));
  const order = pcts.map((p, i) => ({ i, frac: p - Math.floor(p) })).sort((a, b) => b.frac - a.frac);
  let total = counts.reduce((a, b) => a + b, 0);
  for (let k = 0; total < 100; k++, total++) counts[order[k % order.length].i]++;
  while (total > 100) {
    // Only ever take from a language that has more than its guaranteed cell.
    let big = 0;
    counts.forEach((c, i) => { if (c > counts[big]) big = i; });
    if (counts[big] <= 1) break;
    counts[big]--; total--;
  }
  return counts;
}

export function newestRelease(r) {
  // `/releases/latest` excludes prereleases and 404s on a repository that has
  // only ever shipped alphas — which is all of these. Take the newest
  // published entry instead, and say plainly that it is a prerelease.
  return r.releases[0] || null;
}

const cloneCommand = (r) => 'git clone ' + r.htmlUrl + '.git';

function packageCommand(r) {
  const nupkg = r.releases.reduce((a, x) => a.concat(x.assets), [])
    .find((a) => a.name.endsWith('.nupkg'));
  return nupkg ? 'dotnet add package ' + nupkg.name.replace(/\.\d+\.\d+\.\d+.*$/, '') : null;
}

/* Where the project actually runs, if it runs anywhere.
   This site's own host is not a live site, at the root or at any path: a
   repository whose homepage is its Vaporsoft page would otherwise render an
   Open button pointing at the page the reader is already on. A subdomain is a
   different matter — kata.vaporsoft.dev is where that app genuinely lives —
   and so is any host elsewhere. */
const SELF_HOSTS = new Set(['vaporsoft.dev', 'www.vaporsoft.dev']);

export function liveSite(r) {
  if (!r.homepage) return null;
  let url;
  try { url = new URL(r.homepage); } catch { return null; }
  if (!/^https?:$/.test(url.protocol)) return null;
  return SELF_HOSTS.has(url.hostname.toLowerCase()) ? null : url.href;
}

/* The bare host, which is what a reader recognises. A full URL with its scheme
   and trailing slash is noise in a table of five short values. */
export function siteLabel(site) {
  try { return new URL(site).hostname.replace(/^www\./, ''); } catch { return site; }
}

const totalDownloads = (r) =>
  r.releases.reduce((a, x) => a + x.assets.reduce((b, y) => b + y.downloads, 0), 0);

const people = (r) => r.contributors.filter((c) => !/\[bot\]$/.test(c.login));

/* ── Head ── */

function fRail(r) {
  const site = liveSite(r);
  const rel = newestRelease(r);
  const asset = rel && rel.assets.length ? rel.assets[0] : null;
  const items = [];
  if (site) items.push(['open', 'Open', 'Open the ' + r.name + ' app', site, true]);
  if (asset) items.push(['download', 'Download', 'Download ' + rel.tag, asset.url, !site]);
  items.push(['source', 'Source', 'Source code on GitHub', r.htmlUrl, false]);
  if (rel) items.push(['release', 'Releases', 'All releases on GitHub', r.htmlUrl + '/releases', false]);
  return '<nav class="rp-rail" aria-label="' + esc(r.name) + ' links">'
    + items.map((it) =>
        '<a class="rp-rail-btn' + (it[4] ? ' rp-rail-btn--accent' : '') + '" href="' + esc(it[3])
        + '" target="_blank" rel="noopener" aria-label="' + esc(it[2]) + '">'
        + '<span class="rp-rail-label" aria-hidden="true">' + esc(it[1]) + '</span>'
        + icon(it[0]) + '</a>').join('')
    + '</nav>';
}

function fChips(r) {
  const rel = newestRelease(r);
  const chips = [];
  chips.push(r.archived
    ? '<span class="rp-tag">Archived</span>'
    : '<span class="rp-tag rp-tag--live"><i class="rp-dot-live"></i>Active</span>');
  if (rel) chips.push('<span class="rp-tag ' + (rel.prerelease ? 'rp-tag--pre' : '') + '">'
    + esc(rel.tag) + (rel.prerelease ? ' &middot; prerelease' : '') + '</span>');
  if (r.license) chips.push('<span class="rp-tag">' + esc(r.license) + '</span>');
  if (r.stars) chips.push('<span class="rp-tag">' + num(r.stars) + (r.stars === 1 ? ' star' : ' stars') + '</span>');
  if (r.forks) chips.push('<span class="rp-tag">' + num(r.forks) + (r.forks === 1 ? ' fork' : ' forks') + '</span>');
  r.topics.forEach((t) => chips.push('<span class="rp-tag">' + esc(t) + '</span>'));
  return '<div class="rp-chips">' + chips.join('') + '</div>';
}

function fCommand(r) {
  const cmd = packageCommand(r) || cloneCommand(r);
  return '<div class="rp-cmd"><code id="rp-cmd">' + esc(cmd) + '</code>'
    + '<button class="rp-copy" type="button" data-copy="rp-cmd">Copy</button></div>';
}

function fHead(r) {
  const slug = r.name.toLowerCase();
  return '<header class="rp-head">'
    + '<div class="rp-hero-copy">'
    + '<h1>' + esc(r.name) + '</h1>'
    + '<p class="rp-lede">' + esc(r.description) + '</p>'
    + fChips(r)
    + '</div>'
    + '<div class="rp-hero-cmd">' + fCommand(r) + '</div>'
    + '<div class="rp-hero-mark">'
    + '<img class="rp-mark rp-mark--dark" src="/brand/' + slug + '/' + slug + '-icon.svg" alt="" width="152" height="152" />'
    + '<img class="rp-mark rp-mark--light" src="/brand/' + slug + '/' + slug + '-icon-light.svg" alt="" width="152" height="152" />'
    + '</div>'
    + '<div class="rp-hero-rail">' + fRail(r) + '</div>'
    + '</header>';
}

function fLedger(r) {
  const plural = (n, word) => (n === 1 ? word : word + 's');
  const contributors = people(r).length;
  const downloads = totalDownloads(r);
  const cells = [
    [plural(r.commitTotal, 'Commit'), r.commitTotal],
    [plural(r.releases.length, 'Release'), r.releases.length],
    [plural(downloads, 'Download'), downloads],
    [plural(contributors, 'Contributor'), contributors]
  ].filter((c) => c[1]);
  if (!cells.length) return '';
  return '<div class="rp-ledger-strip" style="--rp-cells:' + cells.length + '">'
    + cells.map((c) => '<div class="rp-metric"><b>' + num(c[1]) + '</b><span>' + c[0] + '</span></div>').join('')
    + '</div>';
}

/* ── Block bodies ── */

function fKv(rows) {
  return '<div class="rp-kv">' + rows.filter((r) => r[1] != null).map((r) =>
    '<div class="rp-kv-row"><span>' + esc(r[0]) + '</span><i aria-hidden="true"></i>'
    + '<span>' + r[1] + '</span></div>').join('') + '</div>';
}

function specRows(r) {
  // Version, licence and activity are already in the chip row, and the counts
  // are already in the ledger. Repeating them here was the page saying the
  // same thing three times in three type styles.
  const rel = newestRelease(r);
  const site = liveSite(r);
  return [
    // Stated, not only offered. The action rail carries an Open button, but a
    // glyph does not tell a reader *where* it goes; the address does, and it
    // is the single most useful fact about a project that is running.
    ['Live site', site
      ? '<a class="rp-kv-link" href="' + esc(site) + '" target="_blank" rel="noopener">'
        + esc(siteLabel(site)) + '</a>'
      : null],
    ['First commit', esc(fmtDate(r.createdAt))],
    ['Latest release', rel ? esc(fmtDate(rel.publishedAt)) : null],
    ['Last commit', esc(fmtDate(r.pushedAt))],
    ['Default branch', esc(r.defaultBranch)],
    ['Repository size', fmtBytes(r.sizeKb * 1024)]
  ];
}

function fLanguages(r) {
  const e = langEntries(r.languages);
  if (!e.length) return '';
  const cells = apportion(e.map((x) => x.pct));
  const field = [];
  e.forEach((x, i) => { for (let n = 0; n < cells[i]; n++) field.push(x.color); });
  return '<div class="rp-lang">'
    + '<div class="rp-lang-plot"><div class="rp-lang-grid" role="img" aria-label="'
    + esc(e.map((x, i) => cells[i] + ' parts in a hundred ' + x.name).join(', ')) + '">'
    + field.map((c) => '<i style="background:' + c + '"></i>').join('') + '</div></div>'
    + '<div class="rp-lang-key">' + e.map((x) =>
        '<span class="rp-lang-item"><i style="background:' + x.color + '"></i>'
        + '<b>' + x.pct.toFixed(1) + '%</b><span>' + esc(x.name) + '</span>'
        + '<em>' + fmtBytes(x.bytes) + '</em></span>').join('') + '</div>'
    + '</div>';
}

/* Release notes arrive as markdown. Only the constructs that actually appear
   in these notes are converted; everything else is escaped. */
function mdLite(src) {
  if (!src) return '';
  const inline = (t) => t.replace(/`([^`]+)`/g, '<code>$1</code>')
                         .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const cells = (line) => line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
  const isRule = (line) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.indexOf('-') !== -1;

  const lines = esc(src).split(/\r?\n/);
  let out = '', list = false;
  const closeList = () => { if (list) { out += '</ul>'; list = false; } };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // A pipe table: a header row, a dashed rule, then rows until the pipes
    // stop. Anything else beginning with a pipe is left as text.
    if (/^\s*\|/.test(line) && i + 1 < lines.length && isRule(lines[i + 1])) {
      closeList();
      const head = cells(line);
      let body = '';
      i += 2;
      for (; i < lines.length && /^\s*\|/.test(lines[i]); i++) {
        body += '<tr>' + cells(lines[i]).map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>';
      }
      i--;
      out += '<table><thead><tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('')
           + '</tr></thead><tbody>' + body + '</tbody></table>';
      continue;
    }

    const text = inline(line);
    const li = /^[-*]\s+(.*)$/.exec(text);
    if (li) { if (!list) { out += '<ul>'; list = true; } out += '<li>' + li[1] + '</li>'; continue; }
    closeList();
    const h = /^(#{1,4})\s+(.*)$/.exec(text);
    if (h) { out += '<h4>' + h[2] + '</h4>'; continue; }
    if (text.trim()) out += '<p>' + text + '</p>';
  }
  closeList();
  return out;
}

// NFTY has forty-four published releases and their notes came to 190KB of
// markup on a page nobody scrolls that far down. The newest fifteen are the
// ones anyone reads; the rest are one link away, and the ledger still reports
// the true total.
const RELEASES_SHOWN = 15;

function fReleases(r) {
  if (!r.releases.length) return '<p class="rp-note">No releases published.</p>';
  const shown = r.releases.slice(0, RELEASES_SHOWN);
  const rest = r.releases.length - shown.length;
  return '<div class="rp-rel">' + shown.map((x) => {
    const assets = x.assets.length
      ? '<div class="rp-assets">' + x.assets.map((a) =>
          '<div class="rp-asset"><a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.name) + '</a>'
          + '<em>' + fmtBytes(a.size) + '</em><em>' + num(a.downloads)
          + (a.downloads === 1 ? ' download' : ' downloads') + '</em></div>').join('') + '</div>'
      : '';
    return '<div class="rp-rel-item">'
      + '<div class="rp-rel-head"><h4>' + esc(x.tag) + '</h4>'
      + (x.prerelease ? '<span class="rp-tag rp-tag--pre">Prerelease</span>' : '')
      + '<span class="rp-rel-date">' + esc(fmtDate(x.publishedAt)) + '</span></div>'
      + '<div class="rp-rel-notes">' + mdLite(x.body) + '</div>' + assets + '</div>';
  }).join('')
    + (rest
        ? '<p class="rp-note rp-rel-more"><a href="' + esc(r.htmlUrl) + '/releases" target="_blank" '
          + 'rel="noopener">' + num(rest) + ' earlier ' + (rest === 1 ? 'release' : 'releases')
          + ' on GitHub</a></p>'
        : '')
    + '</div>';
}

function fCommits(r) {
  if (!r.commits.length) return '<p class="rp-note">No commits returned.</p>';
  return '<div class="rp-commits">' + r.commits.map((c) =>
    '<a class="rp-commit" href="' + esc(c.url) + '" target="_blank" rel="noopener">'
    + '<code>' + esc(c.sha) + '</code><span>' + esc(c.message) + '</span>'
    + '<time datetime="' + esc(c.date) + '">' + esc(fmtDate(c.date)) + '</time></a>').join('') + '</div>';
}

const HEALTH_LABELS = {
  readme: 'Readme', license: 'Licence', contributing: 'Contributing guide',
  code_of_conduct: 'Code of conduct', issue_template: 'Issue template',
  pull_request_template: 'Pull request template'
};

function fTeam(r) {
  // github-actions is a workflow, not a contributor; listing it overstates the
  // team by one on every repository with CI.
  const rows = people(r).map((c) =>
    '<a class="rp-person" href="' + esc(c.url) + '" target="_blank" rel="noopener">'
    + '<span>' + esc(c.login[0].toUpperCase()) + '</span><b>' + esc(c.login) + '</b>'
    + '<em>' + num(c.contributions) + '</em></a>');
  const files = r.community ? r.community.files : null;
  if (files) {
    Object.keys(HEALTH_LABELS).forEach((k) => {
      const yes = Boolean(files[k]);
      // An absent optional file is not a failure, so it is not marked as one.
      rows.push('<div class="rp-file ' + (yes ? 'yes' : 'no') + '"><i>'
        + (yes ? '&#10003;' : '&ndash;') + '</i>' + HEALTH_LABELS[k] + '</div>');
    });
  }
  return '<div class="rp-team">' + rows.join('') + '</div>';
}

/* ── Assembly ──────────────────────────────────────────────────────────────
   A block is a column of the panel at full width and an entry in the panel's
   own rail below that width. Both are written from one declaration, so the two
   tiers cannot fall out of step.

   The glyph names the section in the language the brand already speaks on the
   front page, where a single kanji sits between two hairlines. Here it carries
   the accent colour that the whole label used to carry. */
function blocks(list, mod) {
  return '<div class="rp-subtabs" role="tablist" aria-label="Section">'
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
}

// `on` is what the page opens with. It has to be in the markup rather than
// applied by the wiring script: every panel is display:none by default, so a
// page that waits for JavaScript to open one renders blank until it runs, and
// renders blank for good if it never does.
const panel = (id, list, mod, on) =>
  '<section class="rp-panel' + (on ? ' is-on' : '') + '" data-panel="' + id + '"'
  + ' role="tabpanel" aria-labelledby="rp-tab-' + id + '">'
  + blocks(list, mod) + '</section>';

/* A readme that writes its own contents section now has two of them: the
   column standing beside the prose, and the list inside it. The one in the
   prose goes. */
function stripHandWrittenToc(html) {
  return html.replace(
    /<h[1-3] id="table-of-contents"[^>]*>[\s\S]*?<\/h[1-3]>\s*(?:<(ul|ol)[\s\S]*?<\/\1>\s*)*/i,
    ''
  );
}

/* The index is generated from the document that is actually there, so it works
   on a readme that never wrote one — and it is generated here, so the column
   is populated in the HTML the server sends rather than appearing a frame
   later. */
function fToc(html) {
  const heads = [...html.matchAll(/<(h[123]) id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)];
  if (!heads.length) return '<nav class="rp-toc"></nav>';
  return '<nav class="rp-toc">' + heads.map((m) => {
    const label = esc(m[3].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
    return '<a href="#' + esc(m[2]) + '" data-to="' + esc(m[2]) + '" title="' + label
      + '" class="' + (m[1] === 'h3' ? 'lv3' : 'lv2') + '">' + label + '</a>';
  }).join('') + '</nav>';
}

/**
 * The whole page, as one HTML string.
 *
 * Three tabs, because three is what the record divides into cleanly: what the
 * project is, what it says about itself, and what it has shipped.
 */
export function renderRepoPage(r) {
  const doc = stripHandWrittenToc(r.readmeHtml);
  return fBar(r.name.toLowerCase())
    + '<div class="rp-console vapor-frame">'
    + fHead(r)
    + fLedger(r)
    + '<div class="rp-tabs" role="tablist" aria-label="' + esc(r.name) + '">'
    +   '<button class="rp-tab" role="tab" type="button" id="rp-tab-overview" data-tab="overview" aria-controls="overview" aria-selected="true" tabindex="0">Overview</button>'
    +   '<button class="rp-tab" role="tab" type="button" id="rp-tab-documentation" data-tab="documentation" aria-controls="documentation" aria-selected="false" tabindex="-1">Documentation</button>'
    +   '<button class="rp-tab" role="tab" type="button" id="rp-tab-releases" data-tab="releases" aria-controls="releases" aria-selected="false" tabindex="-1">Releases'
    +     '<span class="rp-tab-count">' + r.releases.length + '</span></button>'
    + '</div>'
    + '<div class="rp-panels">'
    + panel('overview', [
        { id: 'spec', jp: '仕様', label: 'Specification', bodyClass: 'rp-block-body--fill', body: fKv(specRows(r)) },
        { id: 'comp', jp: '構成', label: 'Composition', bodyClass: 'rp-block-body--fill', body: fLanguages(r) },
        { id: 'team', jp: '開発', label: 'Project', bodyClass: 'rp-block-body--fill', body: fTeam(r) }
      ], '3', true)
    + panel('documentation', [
        { id: 'toc', jp: '目次', label: 'Contents', body: fToc(doc) },
        { id: 'doc', jp: '文書', label: 'Document', bodyClass: 'rp-doc-body',
          body: '<div class="rp-readme">' + doc + '</div>' }
      ], 'doc')
    + panel('releases', [
        { id: 'rel', jp: '版', label: 'Published', body: fReleases(r) },
        { id: 'log', jp: '履歴', label: 'Recent commits', body: fCommits(r) }
      ], '2')
    + '</div>'
    + '</div>';
}

/** Schema.org description of the repository, for the page's structured data. */
export function repoStructuredData(r, siteUrl) {
  const rel = newestRelease(r);
  const site = liveSite(r);
  const slug = r.name.toLowerCase();
  const url = new URL('/' + slug + '/', siteUrl).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: displayName(slug),
    url,
    description: r.description,
    codeRepository: r.htmlUrl,
    ...(rel ? { version: rel.tag } : {}),
    ...(r.license ? { license: 'https://spdx.org/licenses/' + r.license + '.html' } : {}),
    programmingLanguage: Object.keys(r.languages),
    dateCreated: r.createdAt,
    dateModified: r.pushedAt,
    ...(site ? { targetProduct: { '@type': 'SoftwareApplication', name: displayName(slug), url: site } } : {}),
    author: { '@type': 'Organization', name: 'Vaporsoft', url: new URL('/', siteUrl).href },
    maintainer: people(r).map((c) => ({ '@type': 'Person', name: c.login, url: c.url }))
  };
}
