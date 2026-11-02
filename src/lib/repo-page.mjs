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
  open: '<path d="M7.6 2.9H2.6v10.5h10.5v-5"/><path d="M9.6 2.2h4.2v4.2"/><path d="M13.8 2.2 7.9 8.1"/>',
  next: '<path d="M2.6 8h10.8"/><path d="M9.4 3.9 13.5 8l-4.1 4.1"/>',
  manual: '<path d="M8 3.6C6.6 2.6 4.6 2.2 2.2 2.4v10.2c2.4-.2 4.4.2 5.8 1.2 1.4-1 3.4-1.4 5.8-1.2V2.4c-2.4-.2-4.4.2-5.8 1.2z"/><path d="M8 3.6v10.2"/>'
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
   stroke as the action rail's glyphs, and steps left on hover.

   `sync`, on a repository page, says how old the record is: when this build
   fetched it, and which repository to ask whether that is still true. The
   server-rendered text is the absolute time, which is right whenever it is
   read; the page's script turns it into "12 min ago" and checks GitHub. */
function fmtStamp(iso) {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return fmtDate(iso) + ', ' + hh + ':' + mm + ' UTC';
}

function fSync(sync) {
  if (!sync || !sync.syncedAt) return '';
  return '<span class="rp-sync" data-sync data-synced="' + esc(sync.syncedAt) + '"'
    + (sync.repo ? ' data-repo="' + esc(sync.repo) + '" data-pushed="' + esc(sync.pushedAt) + '"' : '')
    + ' title="Fetched from GitHub ' + esc(fmtStamp(sync.syncedAt)) + '">'
    + '<i aria-hidden="true"></i>'
    + '<span data-sync-label>Synced ' + esc(fmtStamp(sync.syncedAt)) + '</span></span>';
}

export function renderBar(crumb, sync) {
  return '<div class="rp-bar">'
    + '<a class="rp-back" href="/">'
    + '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" '
    + 'stroke-width="1.3" stroke-linecap="butt" stroke-linejoin="miter">'
    + '<path d="M13.4 8H2.6"/><path d="M6.6 3.9 2.5 8l4.1 4.1"/></svg>'
    + '<span>Vaporsoft</span></a>'
    + '<span class="rp-crumb"><b>/</b> ' + esc(crumb) + '</span>'
    + fSync(sync)
    + '<button type="button" class="vapor-theme-toggle rp-theme" data-theme-toggle>'
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

// The NuGet package a release ships, read off the .nupkg attached to it.
function nugetPackage(r) {
  const nupkg = r.releases.reduce((a, x) => a.concat(x.assets), [])
    .find((a) => a.name.endsWith('.nupkg'));
  if (!nupkg) return null;
  const m = /^(.+?)\.(\d+\.\d+\.\d+)(-[^.]+(?:\.[^.]+)*?)?\.nupkg$/.exec(nupkg.name);
  return { id: m ? m[1] : nupkg.name.replace(/\.\d+\.\d+\.\d+.*$/, ''), pre: Boolean(m && m[3]) };
}

function packageCommand(r) {
  const pkg = nugetPackage(r);
  if (!pkg) return null;
  // `dotnet add package` without a version resolves only stable releases and
  // fails outright when a package has none, as every alpha-only package here
  // does. `--prerelease` rather than a pinned `--version`: the release tag and
  // what is actually on NuGet have drifted before, and the flag always
  // resolves to a version the feed really has.
  return 'dotnet add package ' + pkg.id + (pkg.pre ? ' --prerelease' : '');
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

/* Projects whose documentation is a site of its own rather than a readme.
   /<repo>/docs/ is that site, built into public/ by
   scripts/build-external-docs.mjs, so the console must not also claim the
   address: its Documentation tab keeps showing the readme but stops rewriting
   the URL, and points at the manual instead. */
export const EXTERNAL_DOCS = { nfty: '/nfty/docs/' };

/* The ways out, each named. The rail used to be four square glyphs that said
   what they were only on hover, which a reader had to discover one at a time,
   and could not at all on a phone until the layout gave up and opened them.
   A glyph does not say where it goes; a word does. The glyph stays as the
   mark of the kind of place — leaves the site, downloads, stays here. */
function fRail(r) {
  const site = liveSite(r);
  const rel = newestRelease(r);
  const name = displayName(r.name.toLowerCase());
  const manual = EXTERNAL_DOCS[r.name.toLowerCase()];
  const items = [];
  if (site) items.push({ glyph: 'open', label: 'Open app', title: 'Open ' + name + ' at ' + siteLabel(site), href: site, ext: true });
  if (manual) items.push({ glyph: 'manual', label: 'Manual', title: 'The full ' + name + ' manual', href: manual, ext: false });
  if (rel && rel.assets.length) items.push({ glyph: 'download', label: 'Download', title: 'Download ' + rel.tag + ' on GitHub', href: rel.url, ext: true });
  const pkg = nugetPackage(r);
  if (pkg) items.push({ glyph: 'download', label: 'NuGet', title: pkg.id + ' on NuGet', href: 'https://www.nuget.org/packages/' + pkg.id, ext: true });
  items.push({ glyph: 'source', label: 'Source', title: 'Source code on GitHub', href: r.htmlUrl, ext: true });
  // The first is what the project is for, so it is the one in the accent.
  items[0].accent = items.length > 1;
  return '<nav class="rp-rail" aria-label="' + esc(name) + ' links">'
    + items.map((it) =>
        '<a class="rp-rail-btn' + (it.accent ? ' rp-rail-btn--accent' : '') + '" href="' + esc(it.href) + '"'
        + (it.ext ? ' target="_blank" rel="noopener"' : '') + ' title="' + esc(it.title) + '">'
        + '<span class="rp-rail-label">' + esc(it.label) + '</span>'
        + icon(it.glyph) + '</a>').join('')
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
    + '<h1>' + esc(displayName(slug)) + '</h1>'
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

const textOf = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/* What the project is, in its own words: the opening prose of its readme. The
   one-line description above says what it is called and what kind of thing it
   is; this is the paragraph that says why it exists, which is the thing a
   reader landing here does not yet know. Taken at build time from the
   document that is actually there, so it cannot drift from it.

   A readme opens with a bold tagline (the description, again) and sometimes
   an image; neither is prose, so neither is taken. Then whole sentences, in
   order, until the next would not fit the column without it scrolling. The
   full text is one press away, and the link to it follows the last sentence
   taken. A sentence is never cut in half. */
const LEAD_BUDGET = 440;

// Sentence ends in markup: a full stop, question or exclamation mark followed
// by a space, outside any tag. Returned as offsets into the HTML.
function sentenceEnds(html) {
  const ends = [];
  let inTag = false;
  for (let i = 0; i < html.length; i++) {
    const c = html[i];
    if (c === '<') inTag = true;
    else if (c === '>') inTag = false;
    else if (!inTag && /[.!?]/.test(c) && (i + 1 === html.length || /\s/.test(html[i + 1]))) ends.push(i + 1);
  }
  if (!ends.length || ends[ends.length - 1] !== html.length) ends.push(html.length);
  return ends;
}

// Close whatever inline elements a cut left open, innermost first.
function closeOpen(html) {
  const open = [];
  for (const m of html.matchAll(/<(\/?)([a-z]+)\b[^>]*?(\/?)>/gi)) {
    if (m[3] || /^(br|img)$/i.test(m[2])) continue;
    if (m[1]) open.pop(); else open.push(m[2]);
  }
  return html + open.reverse().map((t) => '</' + t + '>').join('');
}

export function readmeLead(html) {
  const paras = [];
  let used = 0;
  let rest = html;
  for (;;) {
    const m = /^\s*<p>([\s\S]*?)<\/p>/.exec(rest);
    if (!m) break;
    rest = rest.slice(m[0].length);
    const inner = m[1].trim();
    const prose = textOf(inner) && !/^<strong>[^<]*<\/strong>(?:\s*<br\s*\/?>)*$/.test(inner);
    if (!prose) {
      if (paras.length) break;
      continue;
    }
    let take = '';
    for (const end of sentenceEnds(inner)) {
      const next = inner.slice(0, end);
      // The first sentence is always taken, however long; after it, only
      // what still fits.
      if (take && used + textOf(next).length > LEAD_BUDGET) break;
      if (!take && !paras.length) { take = next; continue; }
      if (used + textOf(next).length > LEAD_BUDGET) break;
      take = next;
    }
    if (!take) break;
    paras.push(closeOpen(take.trim()));
    used += textOf(take).length;
    if (take.length < inner.length) break;
  }
  return paras;
}

function fAbout(r, doc, manual) {
  const lead = readmeLead(doc);
  const site = liveSite(r);
  const facts = [
    ['Live at', site
      ? '<a class="rp-kv-link" href="' + esc(site) + '" target="_blank" rel="noopener">' + esc(siteLabel(site)) + '</a>'
      : null],
    ['Licence', r.license ? esc(r.license) : null],
    ['Started', esc(fmtDate(r.createdAt))],
    ['Repository', '<a class="rp-kv-link" href="' + esc(r.htmlUrl) + '" target="_blank" rel="noopener">'
      + esc(r.fullName) + '</a>']
  ];
  return '<div class="rp-about">'
    + (lead.length
        ? '<div class="rp-about-lead">' + lead.map((p) => '<p>' + p + '</p>').join('') + '</div>'
        : '')
    + '<button class="rp-onward" type="button" data-goto="documentation">'
    + '<span>' + (manual ? 'Read the readme' : 'Read the documentation') + '</span>' + icon('next') + '</button>'
    + fKv(facts)
    + '</div>';
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

/* What has happened lately, newest first: the release, then the commits since.
   The release is a way into the Releases tab rather than a summary of it —
   the notes are one click away, at full width. */
function fActivity(r) {
  const rel = newestRelease(r);
  return '<div class="rp-activity">'
    + (rel
        ? '<button class="rp-latest" type="button" data-goto="releases">'
          + '<span class="rp-latest-label">Latest release</span>'
          + '<b>' + esc(rel.tag) + '</b>'
          + '<em>' + esc(fmtDate(rel.publishedAt)) + (rel.prerelease ? ' &middot; prerelease' : '') + '</em>'
          + icon('next') + '</button>'
        : '')
    + (r.commits.length
        ? '<div class="rp-commits">' + r.commits.map((c) =>
            '<a class="rp-commit" href="' + esc(c.url) + '" target="_blank" rel="noopener">'
            + '<span class="rp-commit-msg">' + esc(c.message) + '</span>'
            + '<span class="rp-commit-meta"><time datetime="' + esc(c.date) + '">' + esc(fmtDate(c.date)) + '</time>'
            + '<code>' + esc(c.sha) + '</code></span></a>').join('') + '</div>'
        : '<p class="rp-note">No commits returned.</p>')
    + (r.commitTotal > r.commits.length
        ? '<a class="rp-quiet-link" href="' + esc(r.htmlUrl) + '/commits/' + esc(r.defaultBranch) + '" target="_blank" rel="noopener">'
          + 'All ' + num(r.commitTotal) + ' commits on GitHub</a>'
        : '')
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

/* Releases are an index and a page, the way the documentation is: every
   version down the left, the one you picked at full width on the right. A
   stack of every release's notes made NFTY's forty-seven a column you scrolled
   through to find one, and gave the newest no more standing than the oldest.

   The newest fifteen carry their notes in the page; NFTY's full set came to
   190KB of markup. Older versions are still listed — the index is cheap — and
   link to their page on GitHub. Every entry is a real link to GitHub, so with
   no script the index still goes somewhere; the script keeps the ones it can
   show here. */
const RELEASES_SHOWN = 15;

function fVersions(r) {
  if (!r.releases.length) return '<p class="rp-note">No releases published.</p>';
  return '<nav class="rp-vers" aria-label="Versions">' + r.releases.map((x, i) => {
    const here = i < RELEASES_SHOWN;
    return '<a class="rp-ver' + (i === 0 ? ' is-on' : '') + (here ? '' : ' rp-ver--away') + '" href="' + esc(x.url) + '"'
      + (here ? ' data-rel="' + i + '"' : ' target="_blank" rel="noopener"')
      + (i === 0 ? ' aria-current="true"' : '') + '>'
      + '<b>' + esc(x.tag) + '</b>'
      + (x.prerelease ? '<span class="rp-ver-pre">pre</span>' : '')
      + '<time datetime="' + esc(x.publishedAt) + '">' + esc(fmtDate(x.publishedAt)) + '</time>'
      + (here ? '' : icon('open'))
      + '</a>';
  }).join('') + '</nav>';
}

function fNotes(r) {
  if (!r.releases.length) return '<p class="rp-note">Nothing has been released yet.</p>';
  return r.releases.slice(0, RELEASES_SHOWN).map((x, i) => {
    const notes = mdLite(x.body);
    const files = x.assets.length
      ? '<h4 class="rp-files-title">Files</h4><div class="rp-assets">' + x.assets.map((a) =>
          '<div class="rp-asset"><a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.name) + '</a>'
          + '<em>' + fmtBytes(a.size) + '</em><em>' + num(a.downloads)
          + (a.downloads === 1 ? ' download' : ' downloads') + '</em></div>').join('') + '</div>'
      : '';
    return '<article class="rp-rel-item" data-rel="' + i + '"' + (i === 0 ? '' : ' hidden') + '>'
      + '<header class="rp-rel-head"><h3>' + esc(x.tag) + '</h3>'
      + (x.prerelease ? '<span class="rp-tag rp-tag--pre">Prerelease</span>' : '')
      + '<span class="rp-rel-date">' + esc(fmtDate(x.publishedAt)) + '</span>'
      + '<a class="rp-quiet-link" href="' + esc(x.url) + '" target="_blank" rel="noopener">On GitHub</a></header>'
      + (notes ? '<div class="rp-rel-notes">' + notes + '</div>' : '<p class="rp-note">No notes with this release.</p>')
      + files + '</article>';
  }).join('');
}

/* ── Assembly ──────────────────────────────────────────────────────────────
   A block is a column of the panel at full width and an entry in the panel's
   own rail below that width. Both are written from one declaration, so the two
   tiers cannot fall out of step.

   The glyph names the section in the language the brand already speaks on the
   front page, where a single kanji sits between two hairlines. Here it carries
   the accent colour that the whole label used to carry. */
/* Ids carry an rp- prefix and the panel's id: a readme brings its own heading
   ids (a README's "overview" is an <h2 id="overview">), and two panels can
   both have a block of the same name. */
function blocks(list, mod, pid) {
  return '<div class="rp-subtabs" role="tablist" aria-label="Section">'
    + list.map((b, i) => '<button class="rp-subtab" role="tab" type="button" data-block="' + b.id
        + '" id="rp-subtab-' + pid + '-' + b.id + '" aria-controls="rp-block-' + pid + '-' + b.id
        + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">'
        + '<i aria-hidden="true">' + b.jp + '</i>' + esc(b.label) + '</button>').join('')
    + '</div>'
    + '<div class="rp-blocks rp-blocks--' + mod + '">'
    + list.map((b, i) => '<section class="rp-block' + (i === 0 ? ' is-on' : '') + '" data-block="' + b.id + '"'
        + ' id="rp-block-' + pid + '-' + b.id + '" role="tabpanel" aria-labelledby="rp-subtab-' + pid + '-' + b.id + '">'
        + '<h2 class="rp-block-title"><i aria-hidden="true">' + b.jp + '</i>' + esc(b.label) + '</h2>'
        + '<div class="rp-block-body' + (b.bodyClass ? ' ' + b.bodyClass : '') + '">' + b.body + '</div>'
        + '</section>').join('')
    + '</div>';
}

// `on` is what the page opens with. It has to be in the markup rather than
// applied by the wiring script: every panel is display:none by default, so a
// page that waits for JavaScript to open one renders blank until it runs, and
// renders blank for good if it never does.
const panel = (id, list, mod, on) =>
  '<section class="rp-panel' + (on ? ' is-on' : '') + '" data-panel="' + id + '" id="rp-panel-' + id + '"'
  + ' role="tabpanel" aria-labelledby="rp-tab-' + id + '">'
  + blocks(list, mod, id) + '</section>';

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

/* Which panel a route opens on. `url` is how the browser keeps the address in
   step when the reader switches tabs by hand, and it is the address a link to
   that tab should use. Overview is the repository's own root. */
const TABS = [
  { id: 'overview', label: 'Overview', url: '' },
  { id: 'documentation', label: 'Documentation', url: 'docs/' },
  { id: 'releases', label: 'Releases', url: '' }
];

/**
 * The whole page, as one HTML string.
 *
 * Three tabs, because three is what the record divides into cleanly: what the
 * project is, what it says about itself, and what it has shipped. `open` is
 * which one the route asked for; every panel is in the markup either way.
 * `syncedAt` is when this build fetched the record, for the line above it.
 */
export function renderRepoPage(r, open = 'overview', syncedAt = null) {
  const doc = stripHandWrittenToc(r.readmeHtml);
  const manual = EXTERNAL_DOCS[r.name.toLowerCase()] || null;
  return renderBar(r.name.toLowerCase(),
      syncedAt ? { syncedAt, repo: r.fullName, pushedAt: r.pushedAt } : null)
    + '<div class="rp-console vapor-frame">'
    + fHead(r)
    + fLedger(r)
    + '<div class="rp-tabs" role="tablist" aria-label="' + esc(r.name) + '">'
    + TABS.map((t) => {
        const on = t.id === open;
        // A repository with its own manual does not own /<repo>/docs/, so its
        // Documentation tab must not rewrite the address to it.
        const url = manual && t.id === 'documentation' ? '' : t.url;
        return '<button class="rp-tab" role="tab" type="button" id="rp-tab-' + t.id + '"'
          + ' data-tab="' + t.id + '" data-url="' + url + '" aria-controls="rp-panel-' + t.id + '"'
          + ' aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + t.label
          + (t.id === 'releases' ? '<span class="rp-tab-count">' + r.releases.length + '</span>' : '')
          + '</button>';
      }).join('')
    + '</div>'
    + '<div class="rp-panels">'
    + panel('overview', [
        { id: 'about', jp: '概要', label: 'About', body: fAbout(r, doc, manual) },
        { id: 'comp', jp: '構成', label: 'Built with', bodyClass: 'rp-block-body--fill', body: fLanguages(r) },
        { id: 'activity', jp: '履歴', label: 'Activity', body: fActivity(r) }
      ], 'overview', open === 'overview')
    + panel('documentation', [
        { id: 'toc', jp: '目次', label: 'Contents', body: fToc(doc) },
        { id: 'doc', jp: '文書', label: 'Readme', bodyClass: 'rp-doc-body',
          body: (manual
            ? '<a class="rp-manual" href="' + esc(manual) + '">'
              + '<span class="rp-manual-label">Full manual</span>'
              + '<span class="rp-manual-note">Installation, guides and reference. The readme below is the '
              + 'short version.</span>'
              + icon('next') + '</a>'
            : '')
            + '<div class="rp-readme">' + doc + '</div>' }
      ], 'doc', open === 'documentation')
    + panel('releases', [
        { id: 'versions', jp: '版', label: 'Versions', body: fVersions(r) },
        { id: 'notes', jp: '注記', label: 'Notes', bodyClass: 'rp-notes-body', body: fNotes(r) }
      ], 'doc', open === 'releases')
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
