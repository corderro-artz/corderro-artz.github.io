# Vaporsoft

Static site for vaporsoft.dev — minimal landing page and Vaporsoft design system reference.

## Pages

- **/** — Brand landing page
- **/components/** — Design system component reference

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

## Preview

```bash
npm run preview
```

## Deployment

The repository includes a GitHub Pages workflow at `.github/workflows/deploy.yml` that builds and deploys the Astro site on pushes to `main`.

The Astro site URL is configured for the Vaporsoft custom domain.

