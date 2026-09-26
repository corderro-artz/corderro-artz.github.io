# Vaporsoft

Static site for www.vaporsoft.dev — minimal landing page, product showcase, contact flow, and Vaporsoft design system reference.

## Pages

- **/** — Brand landing page and product catalogue
- **/contact/** — Business inquiry form
- **/vaporsoft/**, **/vaporsoft/icons/**, **/vaporsoft/palette/** — The studio's
  console: brand assets, marks and palette
- **/&lt;repo&gt;/** and **/&lt;repo&gt;/docs/** — A console per repository (akira, kata,
  nfty, crispr), rendered from `src/data/repos.json`; `/nfty/docs/` is instead
  the hosted MkDocs manual built by `npm run docs:external`
- **/components/** — Design system component reference (unlisted, `noindex`)
- **/404.html** — Served by GitHub Pages for any unknown path

## Brand assets

Other repositories embed the brand marks from here, so `public/brand/` is a
public contract: **do not move, rename, or delete anything under it.** Add new
brands as `public/brand/<name>/`.

Reference them from another repository by tracking `main`:

```
https://raw.githubusercontent.com/corderro-artz/corderro-artz.github.io/main/public/brand/<name>/<name>-icon.svg
```

or, where a served URL is needed (HTML email, for example):

```
https://www.vaporsoft.dev/brand/<name>/<name>-icon.svg
```

The `brand/` prefix is not cosmetic. This is a *user* Pages site, so a
repository that publishes its own Pages site is served at `/<repo>/` and
shadows any top-level directory of the same name — `/nfty/` and `/kata/`
already do. Assets kept at the top level are silently unreachable, or worse,
answered by the other site.

### Palette

[`public/brand/PALETTE.md`](public/brand/PALETTE.md) is the reference for every
colour the brand ships — the core values, both themes, the ramp, measured
contrast, and the values that are retired. [`palette.json`](public/brand/palette.json)
is the same thing machine-readable, for anything outside this repository:

```
https://www.vaporsoft.dev/brand/palette.json
```

`src/styles/global.css` remains authoritative; `npm run brand:check` fails if the
two disagree, if a retired value reappears, if a brand SVG strays outside the
palette, or if a PNG no longer matches the SVG it was rendered from. It runs on
every pull request. PNGs are generated, never hand-edited — after changing an
SVG, run `npm run brand:png`.

## Stack

- Astro (static output)
- Plain CSS (custom properties, no preprocessor)
- GitHub Pages via GitHub Actions

## Development

Requires Node 22.12 or later (Astro 7).

```bash
npm install
npm run dev
```

`npm run docs:external` builds the hosted NFTY manual into `public/nfty/docs/`.
It needs Python 3 and git on the path.

## Build

```bash
npm run build
```

The production build outputs to `dist/`.

## Preview

```bash
npm run preview
```

## Deployment

The repository includes a GitHub Pages workflow at `.github/workflows/deploy.yml` that builds and deploys the Astro site on pushes to `main`.

The Astro site URL is configured for the Vaporsoft custom domain.

## Contact Form Setup

The contact page is wired for Formspree so submissions work on static GitHub Pages without exposing the business email address in the site source.

1. Create a Formspree form that forwards to `CorderroArtz@live.com`.
2. Copy the endpoint, for example `https://formspree.io/f/yourFormId`.
3. In GitHub, add a repository variable named `PUBLIC_FORMSPREE_ENDPOINT` with that endpoint value.
4. Optionally create a local `.env` from `.env.example` for local testing.

The endpoint is embedded into the static build, so it should be stored as a repository variable, not treated as a secret.

### Testing the contact form locally

`dev/form-mock.mjs` stands in for Formspree on port 4320 and prints each
submission to the terminal.

1. Put `PUBLIC_FORMSPREE_ENDPOINT=http://localhost:4320` in `.env`.
2. Run `npm run dev:mock` in one terminal and `npm run dev` in another.
3. Submit the form at `/contact/`.

