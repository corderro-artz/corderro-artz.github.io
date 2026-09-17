// Build the documentation sites that this site hosts but does not author, into
// public/<repo>/docs/, so they are served at /<repo>/docs/ like every other
// project's documentation.
//
//   node scripts/build-external-docs.mjs
//
// Why here rather than in the project's own repository: a repository that
// publishes its own GitHub Pages site takes /<repo>/** away from this one —
// GitHub reserves that path and redirects, whatever this build emits. That is
// what used to shadow /nfty/. Building the manual here keeps the repository
// page at /nfty/ and puts the manual at /nfty/docs/, which is where every
// project's documentation now lives.
//
// The output is not committed. NFTY's manual is 7.7 MB across 144 files with
// content-hashed asset names, so committing it would rewrite most of those
// files on every docs change. It is rebuilt in CI instead, which is why this
// script has to be cheap and deterministic: the toolchain is pinned by the
// project's own requirements file, not by anything here.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform, tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Each entry is a project whose documentation is a site of its own. */
const SITES = [
  {
    slug: 'nfty',
    repo: 'https://github.com/corderro-artz/nfty.git',
    // Paths inside the cloned repository.
    requirements: 'docs/requirements.txt',
    // MkDocs is given the destination explicitly so mkdocs.yml's own site_dir
    // (which is gitignored in that repository) is irrelevant here.
    build: (dest) => ['-m', 'mkdocs', 'build', '--strict', '--site-dir', dest]
  }
];

const WORK = join(tmpdir(), 'vaporsoft-external-docs');
const venvPython = (venv) =>
  join(venv, platform() === 'win32' ? 'Scripts' : 'bin', platform() === 'win32' ? 'python.exe' : 'python');

function python() {
  for (const candidate of ['python3', 'python']) {
    try {
      execFileSync(candidate, ['--version'], { stdio: 'ignore' });
      return candidate;
    } catch { /* try the next one */ }
  }
  return null;
}

const PY = python();
if (!PY) {
  // Local builds without Python still work; the route simply is not there.
  // CI installs Python explicitly, so a miss there is a real failure and the
  // workflow asserts the output exists afterwards.
  console.error('! No python on PATH. Skipping external documentation.');
  console.error('  /<repo>/docs/ will be absent from this build for: ' + SITES.map((s) => s.slug).join(', '));
  process.exit(0);
}

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

for (const site of SITES) {
  const src = join(WORK, site.slug);
  const venv = join(WORK, site.slug + '-venv');
  const dest = join(ROOT, 'public', site.slug, 'docs');

  const run = (cmd, args, cwd) =>
    execFileSync(cmd, args, { cwd: cwd || ROOT, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });

  // Shallow: the manual needs the working tree, never the history.
  run('git', ['clone', '--depth', '1', '--quiet', site.repo, src]);
  run(PY, ['-m', 'venv', venv]);
  run(venvPython(venv), ['-m', 'pip', 'install', '--quiet', '--disable-pip-version-check',
    '-r', join(src, site.requirements)]);

  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  run(venvPython(venv), site.build(dest), src);

  if (!existsSync(join(dest, 'index.html'))) {
    console.error(`! ${site.slug}: the build produced no index.html at ${dest}`);
    process.exit(1);
  }
  const files = run('git', ['-C', ROOT, 'status', '--porcelain', '--ignored', '--', `public/${site.slug}/docs`])
    .split('\n').filter(Boolean).length;
  console.log(`${site.slug}: manual built into public/${site.slug}/docs/ (${files ? files + ' entries, ' : ''}ignored by git)`);
}
