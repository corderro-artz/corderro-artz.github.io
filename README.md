# Vaporsoft

Static site for vaporsoft.dev — minimal landing page and Akira theme component reference.

## Pages

- **/** — Brand landing page
- **/components/** — Design system component reference (Akira theme)

## Stack

- Astro (static output)
- Plain CSS (custom properties, no preprocessor)
- GitHub Pages via GitHub Actions

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build outputs to `dist/`.

## Deployment

The repository includes a GitHub Pages workflow at `.github/workflows/deploy.yml` that builds and deploys the Astro site on pushes to `main`.

The Astro site URL is configured for the Vaporsoft custom domain.

## Backup

The pre-reset terminal site has been preserved at `backup/pre-astro-reset-2026-03-21/`.

That backup includes the previous runtime files, support assets, workflow, fonts, and concept-art references so the old site can be restored if needed.
