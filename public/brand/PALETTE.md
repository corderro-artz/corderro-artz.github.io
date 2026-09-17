# Vaporsoft palette

The permanent reference for every colour the brand ships.

`src/styles/global.css` is authoritative — it is what the site actually renders.
[`palette.json`](palette.json) is the machine-readable mirror for anything outside
this repository, and `scripts/check-palette.mjs` fails the moment the two disagree.
This document explains the values; it does not define them.

Consume the palette from another repository at:

```
https://www.vaporsoft.dev/brand/palette.json
```

---

## Core

Four values. Everything else is derived from them or composed with them.

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--vapor-carmine` | `#a11f31` | `161, 31, 49` | The only accent. |
| `--vapor-ink` | `#07080b` | `7, 8, 11` | Dark-theme ground. |
| `--vapor-paper` | `#f2ede6` | `242, 237, 230` | Light-theme ground, and dark-theme text. |
| `--vapor-graphite` | `#121318` | `18, 19, 24` | Light-theme text and rules. |

Carmine and graphite each carry an `-rgb` companion (`--vapor-carmine-rgb`,
`--vapor-graphite-rgb`) so alpha variants are written
`rgba(var(--vapor-carmine-rgb), 0.5)` rather than by retyping the channels.
**Never retype the channels.** That is exactly how the drift below happened.

## Theme

Both themes follow the site's own toggle, stored in `localStorage` under
`vapor-theme`. They do not follow `prefers-color-scheme`, and neither does
`theme-color` or the `color-scheme` property.

| | Dark | Light |
|---|---|---|
| `--theme-canvas` | `#07080b` | `#f2ede6` |
| `--theme-bg` | `#07080b` | `#f4efe8` |
| `--theme-text` | `#f2ede6` | `#121318` |
| `--theme-muted` | `rgba(242, 237, 230, 0.78)` | `rgba(18, 19, 24, 0.72)` |
| `--theme-line` | `rgba(242, 237, 230, 0.14)` | `rgba(18, 19, 24, 0.12)` |

`--theme-canvas` is deliberately not `--theme-bg`. It is the opaque floor painted
on `html`, matching the end stop of the atmosphere gradient, so that nothing shows
through where a mobile browser exposes canvas past the body box.

## Atmosphere

Stops of the fixed background gradient on `body::after`, top to bottom. Background
only — never use these as a foreground or a plate.

- Dark: `#06070a` → `#090b0f` → `#07080b`
- Light: `#f7f3ed` → `#f4efe8` → `#f2ede6`

## Ramp

Anchored on carmine, with a roughly constant luminance ratio (~1.6) between
neighbours. Used by the CRISPR disc. Shades read on light grounds, tints on dark.

| Shades | | | | Anchor | | | | Tints |
|---|---|---|---|---|---|---|---|---|
| `#2d151d` | `#491822` | `#641a26` | `#801c2b` | **`#a11f31`** | `#b44f5b` | `#c3777e` | `#d39ea1` | `#e2c6c3` |

## Functional

| Hex | Role |
|---|---|
| `#2ea44f` | Status dot for a running service. Signal only — not a brand colour, never decorative. |

---

## Contrast

Measured against the grounds each colour is actually used on.

| Pair | Ratio | |
|---|---|---|
| paper text on ink | 17.20:1 | AAA |
| graphite text on light surface | 16.22:1 | AAA |
| carmine on light surface | 6.66:1 | AA |
| carmine on paper | 6.54:1 | AA |
| **carmine on ink** | **2.63:1** | **fails AA** |

**Carmine is not a text colour on ink.** At 2.63:1 it is below AA for any size.
It is fine as a fill, a rule, a glow or a plate, which is how the marks use it —
but `.vapor-label` and `.vapor-tagline-segment--accent` currently set it as
`color` on both themes, and on dark that text does not meet AA. Left as-is
because changing it is a design decision, not a correctness fix.

If an accent *text* colour on ink is wanted, the ramp already has one:
`#c3777e` reaches 5.97:1, and `#b44f5b` reaches 4.01:1 (large text only).

## Retired

These shipped. They are wrong wherever they appear and the check rejects them.

| Retired | Correct | Where it was |
|---|---|---|
| `#a42839` | `#a11f31` | CRISPR disc, dark |
| `#9b1f30` | `#a11f31` | CRISPR disc, light |
| `#121418` | `#121318` | 7 brand SVGs and 12 CSS rules |

`#f7f3ed` is not retired — it is a valid atmosphere stop. It was only wrong as an
icon plate in `kata-*-light.svg`, where `#f4efe8` belongs.

## Rules for brand SVGs

A file under `public/brand/**.svg` may use only the four core values, the two
theme grounds and the light surface, and the ramp. Anything else fails the check.

The PNGs under `public/brand/<name>/png/` are rendered from the SVGs and are
never edited by hand. After changing an SVG, re-render:

```bash
npm run brand:png
```

Then verify — this is the same check CI runs on every pull request:

```bash
npm run brand:check
```

It fails if `palette.json` and `global.css` disagree, if a retired value appears
anywhere in `src/` or `public/brand/`, if a brand SVG uses a colour outside the
palette, or if any SVG has changed since the PNG beside it was rendered. It
compares hashes, never pixels, so it gives the same answer on any machine.

## Geometry

The palette rules above say which colours an asset may use. These say where
things go. They exist because the first presentation assets were drawn by hand
and drifted: the wallpaper's lockup sat 29px below the centre of its own canvas,
the badge had 9px of air to the left of its text and 14px to the right.

The presentation assets — every wallpaper, header, card and the badge — are
therefore generated, not drawn:

```bash
npm run brand:assets
```

`scripts/build-brand-assets.mjs` holds the rules. The logo, the favicon and the
original banner are older, hand-drawn, and left alone.

### Centre on the ink, never on a baseline

A baseline is not the middle of anything. Both faces were rendered at 200px and
their ink measured, and those measurements are what the layout uses:

| | measured |
|---|---|
| `VAPORSOFT` cap height | 0.725em |
| `VAPORSOFT` ink width | 5.61em |
| `仮想` ink above the baseline | 0.845em |
| `仮想` ink below the baseline | 0.085em |
| `仮想` ink width | 1.965em |
| `NATIVE · WEB · AI · ASSETS` ink | 12.21em + one letter-spacing per gap |

The optical centres fall 0.3625em and 0.38em above their own baselines, which is
what lets a Latin line and a kanji set to one centre read level.

Two consequences worth naming. A stacked lockup is centred on the whole run of
ink — kanji, rule, cap height, rule — not on any one baseline. And SVG centres
text on its advance width, which includes the letter-spacing trailing the last
glyph, so a centred line needs half of that back or it sits left.

### Everything else is derived from the canvas

Sizes come from the canvas height, so an asset in a new shape is a row in
`ASSETS` rather than a new set of guesses: the kanji is 0.122h on a plate and
0.1875h on a band, margins 0.0815h and 0.1458h, the rail 0.0056h wide, the corner
square 3.2 rails. Structural values round to 4 or 8.

A **plate** stacks the lockup and centres it, for a canvas with room above and
below. A **band** lays it out horizontally, for one too short to stack. A band
carries the tagline only when it clears the wordmark by 0.125h — on a 600x200
email banner the two came within 8px, which reads as one broken line, so there
the tagline is dropped rather than crowded.

### The assets, and the sizes they ship at

A source is authored at the size whose 2x render is the largest standard size for
its shape, so the PNG named after the source is itself a real display size.

| Source | 2x PNG | Also exported | For |
|---|---|---|---|
| `wallpaper` | 3840x2160 | 1920x1080, 2560x1440 | 16:9 desktops, YouTube channel art |
| `wallpaper-ultrawide` | 3440x1440 | — | 43:18 ultrawide |
| `wallpaper-ultrawide-64x27` | 2560x1080 | — | 64:27 ultrawide, and 5120x2160 at 4x |
| `wallpaper-crt` | 1600x1200 | 800x600, 1024x768, 1280x960 | 4:3 |
| `header-wide` | 3000x1000 | 1500x500 | profile and social headers, Discord |
| `header-slim` | 3840x768 | 1920x384 | page and README headers |
| `header-thin` | 2256x382 | 1128x191 | LinkedIn page cover, narrow banners |
| `social-card` | 2400x1260 | 1200x630 | Open Graph, link previews |
| `email-banner` | 1200x400 | 600x200 | email headers at the 600px standard |
| `badge` | 260x40 | 130x20 | footers and READMEs, beside shields |
| `mark-icons`, `mark-palette` | 512x512 | — | the brand section's own pages, on the product icons' plate |

The two ultrawides are two shapes, not one. 3440x1440 is 43:18 and 2560x1080 is
64:27; rendering the first at 2560 wide gives 2560x1072 and a letterbox.

The wallpapers' lockup sits inside the 1546x423 area YouTube crops a channel
banner to, so the 16:9 file serves both.

All of it is listed, with a link to every file, at
[vaporsoft.dev/brand](https://www.vaporsoft.dev/brand/). That page reads this
directory at build time rather than keeping a list of its own, so an asset added
here appears there by being added here.

### They are rendered by CRISPR, not by `brand:png`

```bash
node path/to/crispr/dist/crispr.js public/brand/vaporsoft/<name>.svg   -o public/brand/vaporsoft/png --scale 2   --font "google:Noto Sans JP" --font "google:Noto Sans"
npm run brand:record
```

CRISPR hands the file to headless Chromium and fetches the font the SVG actually
asks for. That matters at these sizes: the kanji is the composition, and librsvg
substitutes a face it does not have rather than failing, so a machine without Yu
Gothic renders it in the wrong design and says nothing.

`npm run brand:record` writes what is on disk into the manifest — including the
extra sizes, which `brand:png` cannot know about because it renders exactly one
PNG per source. Running `npm run brand:png` would overwrite these rasters with
substituted output and re-record them, and the check would still pass. Re-render
them with CRISPR instead.

`npm run brand:verify` additionally re-renders and compares bytes. That only
means anything where Yu Gothic and Meiryo are installed, so it is local-only and
deliberately not in CI.

All of this exists because four values drifted with nothing watching, and the
PNGs kept serving the old ones after the sources were already corrected.
