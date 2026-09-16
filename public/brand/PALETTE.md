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

`npm run brand:verify` additionally re-renders and compares bytes. That only
means anything where Yu Gothic and Meiryo are installed, so it is local-only and
deliberately not in CI.

All of this exists because four values drifted with nothing watching, and the
PNGs kept serving the old ones after the sources were already corrected.
