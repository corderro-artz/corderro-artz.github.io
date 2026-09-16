// Fetch everything the repository pages render, once, and commit the result.
//
// The alternative is calling the API from the browser, which cannot work here:
// unauthenticated requests are limited to sixty an hour *per IP address*,
// shared, so one office network exhausts it and the page renders empty for
// everyone behind it. A build-time fetch gets five thousand an hour and ships
// a page that needs no loading state at all. The cost is staleness, which
// re-running this answers.
//
//   node scripts/fetch-repo-data.mjs
//
// Writes src/data/repos.json and mirrors every readme image into
// public/repo-assets/. Both are committed: the site build reads the JSON and
// never touches the network.
//
// Authentication is optional but strongly advised — without a token the
// sixty-an-hour limit applies to this script too, and it makes roughly thirty
// calls. It reads GITHUB_TOKEN or GH_TOKEN, and falls back to `gh auth token`.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OWNER = 'corderro-artz';
const REPOS = ['akira', 'kata', 'nfty', 'crispr'];
const ASSET_DIR = join(ROOT, 'public', 'repo-assets');
const OUT = join(ROOT, 'src', 'data', 'repos.json');

// An image larger than this is a screenshot recorded at full resolution, not a
// diagram. Mirroring it would put a megabyte in the repository for something
// the page shows at 320px tall.
const MAX_ASSET_BYTES = 512 * 1024;

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

const TOKEN = token();
if (!TOKEN) console.warn('! No token found. Falling back to 60 requests an hour.');

const api = async (path, accept = 'application/vnd.github+json') => {
  const res = await fetch('https://api.github.com/' + path, {
    headers: {
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'vaporsoft-site',
      ...(TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {})
    }
  });
  if (!res.ok) throw Object.assign(new Error(path + ' → ' + res.status), { status: res.status, res });
  return res;
};

const json = async (path) => (await api(path)).json();
const text = async (path, accept) => (await api(path, accept)).text();
const maybe = async (fn) => { try { return await fn(); } catch { return null; } };

// Total commits is not a field on any object. Asking for one commit per page
// and reading the last page number out of the Link header answers it in one
// request rather than walking the history.
async function commitTotal(full) {
  const res = await maybe(() => api(`repos/${full}/commits?per_page=1`));
  if (!res) return null;
  const link = res.headers.get('link');
  if (!link) return 1;
  const last = /[?&]page=(\d+)>;\s*rel="last"/.exec(link);
  return last ? Number(last[1]) : 1;
}

/* ── Readme ─────────────────────────────────────────────────────────────────
   `Accept: application/vnd.github.html` returns github.com's own rendered
   document. It is most of the way there, but it carries that site's class
   names, its permalink chrome, its badge imagery, and markup that only
   resolves on that origin. Each repair below is here because something was
   visibly wrong without it, and the order matters — which is why they all live
   in this one function. */

// github.com's own utility and presentation classes. They style nothing here,
// and leaving them in invites a future rule to collide with a name this site
// does not control. The syntax tokens (pl-*) stay: those are the only ones the
// page deliberately styles.
const DEAD_CLASSES =
  /\b(?:markdown-body|entry-content|container-lg|heading-element|notranslate|position-relative|overflow-auto|snippet-clipboard-content|anchor|octicon|octicon-link)\b/g;

const isBadge = (u) => /img\.shields\.io|\/badge\.svg|\/workflows\/.*\/badge/.test(u);

const EXT = {
  'image/svg+xml': '.svg', 'image/png': '.png', 'image/jpeg': '.jpg',
  'image/gif': '.gif', 'image/webp': '.webp', 'image/avif': '.avif'
};

async function mirror(url, repo, seen) {
  if (seen.has(url)) return seen.get(url);
  let local = null;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'vaporsoft-site' } });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      const type = (res.headers.get('content-type') || '').split(';')[0].trim();
      const ext = EXT[type] || (/\.(svg|png|jpe?g|gif|webp|avif)$/i.exec(url) || [, ''])[0];
      if (buf.length && buf.length <= MAX_ASSET_BYTES && ext) {
        // Named after the file it came from, so a diff shows which diagram
        // changed rather than a wall of renamed hashes.
        const base = decodeURIComponent(url.split('/').pop().split('?')[0])
          .replace(/\.[^.]+$/, '').replace(/[^a-z0-9._-]+/gi, '-').slice(0, 60) || 'image';
        const name = base + (base.endsWith(ext) ? '' : ext);
        mkdirSync(join(ASSET_DIR, repo), { recursive: true });
        writeFileSync(join(ASSET_DIR, repo, name), buf);
        local = `/repo-assets/${repo}/${name}`;
      }
    }
  } catch { /* leave null; the element is left pointing at its original */ }
  seen.set(url, local);
  return local;
}

async function readme(repo, full, branch) {
  let html = await text(`repos/${full}/readme`, 'application/vnd.github.html');
  const rawBase = `https://raw.githubusercontent.com/${full}/${branch}/`;
  const blobBase = `https://github.com/${full}/blob/${branch}/`;
  const report = {};

  // 1 — unwrap. The readme arrives inside github.com's own #readme div and
  // .markdown-body article.
  html = html.replace(/^\s*<div id="readme"[^>]*>\s*<article[^>]*>/, '')
             .replace(/<\/article>\s*<\/div>\s*$/, '');

  // 2 — headings. GitHub puts the anchor id on a permalink <a> beside the
  // heading, prefixed `user-content-`, while every contents link points at the
  // bare slug. Deleting that anchor as chrome — which is exactly what it looks
  // like — takes the id with it and silently kills every in-page link in the
  // document. The id moves onto the heading instead.
  let headings = 0;
  html = html.replace(
    /<div class="markdown-heading"[^>]*>\s*<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>\s*<a id="user-content-([^"]+)"[^>]*>[\s\S]*?<\/a>\s*<\/div>/g,
    (m, level, attrs, inner, slug) => { headings++; return `<h${level} id="${slug}">${inner}</h${level}>`; });
  report.headings = headings;
  // Any permalink anchor that did not sit in that exact shape.
  html = html.replace(/<a id="user-content-[^"]*"[^>]*class="[^"]*anchor[^"]*"[\s\S]*?<\/a>/g, '');

  // 3 — GitHub wraps a themed <picture> in a non-standard element, and emits
  // an unbalanced closing tag for it.
  html = html.replace(/<\/?themed-picture[^>]*>/g, '');

  // 4 — absolutise. Markdown image syntax is absolutised by the API; raw HTML
  // blocks are passed through untouched, so every <picture>, <source srcset>
  // and <a href> inside one keeps a repository-relative path that 404s here.
  const abs = (u) => (/^(https?:|data:|#|mailto:)/.test(u) ? u : rawBase + u.replace(/^\.?\//, ''));
  html = html.replace(/(<(?:img|source)\b[^>]*?\b(?:src|srcset)=")([^"]+)(")/g, (m, a, u, z) => a + abs(u) + z);
  html = html.replace(/(<a\b[^>]*?\bhref=")([^"]+)(")/g, (m, a, u, z) =>
    (/^(https?:|mailto:|#)/.test(u) ? a + u + z : a + blobBase + u.replace(/^\.?\//, '') + z));

  // 5 — badges. shields.io is github.com's visual language, not this one; the
  // same facts are rendered from the API in the page's own type.
  const before = (html.match(/<img\b/g) || []).length;
  html = html.replace(/<a\b[^>]*>\s*<img\b[^>]*src="([^"]+)"[^>]*>\s*<\/a>/g, (m, u) => (isBadge(u) ? '' : m));
  html = html.replace(/<img\b[^>]*src="([^"]+)"[^>]*>/g, (m, u) => (isBadge(u) ? '' : m));
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '');
  report.badgesDropped = before - (html.match(/<img\b/g) || []).length;

  // 6 — GitHub carries a second plain-text copy of every code block in a data
  // attribute, for its own copy button. Dead weight that doubles the payload.
  html = html.replace(/\sdata-snippet-clipboard-copy-content="[^"]*"/g, '');

  // 7 — drop github.com's class names, then any class attribute left empty.
  html = html.replace(/\sclass="([^"]*)"/g, (m, cls) => {
    const kept = cls.replace(DEAD_CLASSES, '').replace(/\s+/g, ' ').trim();
    return kept ? ` class="${kept}"` : '';
  });
  html = html.replace(/\sdir="auto"/g, '');
  html = html.replace(/<svg[^>]*viewBox="0 0 16 16"[^>]*>\s*<path[^>]*>\s*<\/svg>/g, '');

  // 8 — mirror every surviving image. Hotlinking raw.githubusercontent.com
  // would tell GitHub who reads this site and would break the page whenever
  // the file moves; these are served from the same origin as the page.
  const seen = new Map();
  const urls = [...html.matchAll(/(?:<(?:img|source)\b[^>]*?\b(?:src|srcset)=")([^"]+)(?=")/g)].map((m) => m[1]);
  for (const u of urls) { if (!u.startsWith('data:') && !u.startsWith('/')) await mirror(u, repo, seen); }
  html = html.replace(/(<(?:img|source)\b[^>]*?\b(?:src|srcset)=")([^"]+)(")/g,
    (m, a, u, z) => (seen.get(u) ? a + seen.get(u) + z : m));
  report.mirrored = [...seen.values()].filter(Boolean).length;
  report.notMirrored = [...seen.values()].filter((v) => !v).length;

  // 9 — a themed <picture> switches on the reader's operating system. This
  // site's theme is a class the reader toggles and deliberately ignores the
  // OS, so a <picture> left alone puts the dark diagram on the light page for
  // anyone whose two choices disagree. Replaced with the image pair the site
  // already uses for its own marks, switched by the same class.
  let themed = 0;
  html = html.replace(
    /<picture>\s*<source media="\(prefers-color-scheme: dark\)" srcset="([^"]+)">\s*<source media="\(prefers-color-scheme: light\)" srcset="([^"]+)">\s*<img([^>]*?)>\s*<\/picture>/g,
    (m, dark, light, attrs) => {
      const alt = /alt="([^"]*)"/.exec(attrs);
      themed++;
      return '<img class="rp-themed rp-themed--dark" alt="' + (alt ? alt[1] : '') + '" src="' + dark + '">'
        + '<img class="rp-themed rp-themed--light" alt="" aria-hidden="true" src="' + light + '">';
    });
  report.themed = themed;

  // 10 — the readme opens with a row of brand marks and then its own title.
  // The page has already shown both, larger, directly above.
  const lead = /^\s*<p[^>]*>([\s\S]*?)<\/p>/.exec(html);
  if (lead && /<img\b/.test(lead[1]) && !lead[1].replace(/<[^>]*>/g, '').trim()) html = html.slice(lead[0].length);
  const h1 = /^\s*<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html);
  if (h1 && h1[1].replace(/<[^>]*>/g, '').trim().toLowerCase() === repo.toLowerCase()) html = html.slice(h1[0].length);

  // 11 — the lead paragraph that step 10 removed was a row of brand marks, and
  // those were mirrored back at step 8, before anything knew they were about to
  // go. Anything the finished document no longer points at is deleted rather
  // than committed.
  const kept = new Set([...html.matchAll(/\/repo-assets\/[^"']+/g)].map((m) => m[0]));
  let pruned = 0;
  for (const local of seen.values()) {
    if (local && !kept.has(local)) { rmSync(join(ROOT, 'public', local.slice(1)), { force: true }); pruned++; }
  }
  report.pruned = pruned;
  report.mirrored -= pruned;

  // 12 — report what the contents column will actually resolve to.
  const ids = new Set([...html.matchAll(/<h[1-6] id="([^"]+)"/g)].map((m) => m[1]));
  const links = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  report.inPageLinks = links.length;
  report.broken = links.filter((l) => !ids.has(l));

  return { html: html.trim(), report };
}

/* ── Fetch ── */

// Deliberately not fetched, and deliberately not rendered:
//   /stats/participation  — a cached statistic that answers 202 with an empty
//     body while GitHub computes it, and stays stale after. CRISPR has 22
//     commits and this endpoint reports 52 weeks of zeros; there is no way to
//     tell "no activity" from "not computed yet".
//   /traffic/*            — needs a token with push access and is a rolling
//     14-day window with no history. Owner analytics, not something a reader
//     of the page benefits from.
//   open_issues_count     — counts open pull requests as issues, and a true
//     split needs the search API on its own separate rate limit.
//   subscribers_count     — a watcher count nobody acts on.

rmSync(ASSET_DIR, { recursive: true, force: true });
const out = {};

for (const name of REPOS) {
  const full = `${OWNER}/${name}`;
  const r = await json(`repos/${full}`);
  const [langs, releases, contributors, community, commits, total, doc] = await Promise.all([
    json(`repos/${full}/languages`),
    json(`repos/${full}/releases?per_page=100`),
    maybe(() => json(`repos/${full}/contributors?per_page=20`)),
    maybe(() => json(`repos/${full}/community/profile`)),
    maybe(() => json(`repos/${full}/commits?per_page=8`)),
    commitTotal(full),
    readme(name, full, r.default_branch)
  ]);

  out[name] = {
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    homepage: r.homepage,
    htmlUrl: r.html_url,
    stars: r.stargazers_count,
    forks: r.forks_count,
    sizeKb: r.size,
    license: r.license ? r.license.spdx_id : null,
    topics: r.topics || [],
    defaultBranch: r.default_branch,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    archived: r.archived,
    languages: langs,
    commitTotal: total,
    commits: (commits || []).map((c) => ({
      sha: c.sha.slice(0, 7),
      date: c.commit.author.date,
      message: c.commit.message.split('\n')[0],
      url: c.html_url
    })),
    releases: releases.filter((x) => !x.draft).map((x) => ({
      tag: x.tag_name,
      prerelease: x.prerelease,
      publishedAt: x.published_at,
      url: x.html_url,
      body: x.body,
      assets: x.assets.map((a) => ({
        name: a.name, size: a.size, downloads: a.download_count, url: a.browser_download_url
      }))
    })),
    contributors: (contributors || []).map((c) => ({
      login: c.login, contributions: c.contributions, url: c.html_url
    })),
    community: community && community.files ? {
      files: Object.fromEntries(Object.entries(community.files).map(([k, v]) => [k, Boolean(v)]))
    } : null,
    readmeHtml: doc.html
  };

  const rep = doc.report;
  console.log(
    `${name.padEnd(7)} ${String(out[name].releases.length).padStart(3)} releases · `
    + `${String(Object.keys(langs).length).padStart(2)} languages · ${String(total).padStart(4)} commits · `
    + `readme ${rep.headings} headings, ${rep.inPageLinks} in-page links, ${rep.broken.length} broken`
    + (rep.broken.length ? ' (' + rep.broken.join(', ') + ')' : '')
    + `, ${rep.badgesDropped} badges dropped, ${rep.mirrored} images mirrored`
    + (rep.pruned ? `, ${rep.pruned} pruned` : '')
    + (rep.notMirrored ? `, ${rep.notMirrored} left remote` : '')
  );
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 0) + '\n');

// A readme that lost its ids renders a contents column that goes nowhere, and
// the page would still build and still look right. Fail here instead.
const broken = Object.entries(out).filter(([, r]) => !/<h[1-6] id="/.test(r.readmeHtml));
if (broken.length) {
  console.error('! No heading ids survived for: ' + broken.map(([k]) => k).join(', '));
  process.exit(1);
}
console.log(`\nwrote src/data/repos.json (${(JSON.stringify(out).length / 1024).toFixed(0)} KB)`);
