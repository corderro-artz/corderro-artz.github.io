# vaporsoft.dev

CRT terminal portfolio — a retro terminal experience with 125+ themes, 50+ prompts, TUI browsers, and full keyboard navigation. Built with vanilla JS, no frameworks.

**Live:** [vaporsoft.dev](https://vaporsoft.dev)

---

## Features

- **125 Themes** — 50 dark, 50 light, 25 animated (CRT pulse, matrix rain, disco, etc.)
- **50+ Prompts** — Static and animated prompt styles with Powerline, minimal, and decorative variants
- **GitHub Browser** — Live repo fetching with pinned repos, detail view with README rendering
- **Design Showcase** — `showcase` command displays all badges, glyphs, theme colors, and TUI components
- **Zen Mode** — Centered distraction-free terminal with responsive width scaling
- **Full Keyboard Navigation** — Arrow keys, Tab to toggle views, Vim-style bindings (j/k), PageUp/PageDown
- **CRT Effects** — Scanlines, phosphor glow, screen curvature, glitch animations
- **Mobile Support** — Responsive command bar, hamburger menu, touch-friendly TUI controls

## Commands

| Command | Description |
|---------|-------------|
| `help` / `?` | Show available commands |
| `about` / `neofetch` | Display system information |
| `github` / `projects` | Browse GitHub repositories |
| `links` / `social` | View links & social profiles |
| `showcase` / `dev` | View design component showcase |
| `theme [name]` | Browse or set themes |
| `prompt [name]` | Browse or set prompts |
| `zen` | Toggle zen mode |
| `keybinds` | Show keyboard shortcuts |
| `ls` / `cd` / `cat` / `pwd` / `tree` | Virtual filesystem navigation |
| `whoami` / `date` / `echo` | Utility commands |
| `clear` | Clear terminal screen |

## Language & Framework Badge Reference

All badges supported in the GitHub browser and showcase. Each badge has a unique color and abbreviation.

| Language / Framework | Badge | CSS Class |
|---------------------|-------|-----------|
| JavaScript | `JS` | `badge-js` |
| TypeScript | `TS` | `badge-ts` |
| Python | `PY` | `badge-py` |
| Jupyter Notebook | `JNB` | `badge-py` |
| Rust | `RS` | `badge-rs` |
| Go | `GO` | `badge-go` |
| CSS | `CSS` | `badge-css` |
| HTML | `HTML` | `badge-html` |
| C++ | `C++` | `badge-cpp` |
| C# | `C#` | `badge-cs` |
| C | `C` | `badge-cpp` |
| Java | `JV` | `badge-java` |
| Kotlin | `KT` | `badge-kotlin` |
| Swift | `SW` | `badge-swift` |
| Dart | `DT` | `badge-dart` |
| Ruby | `RB` | `badge-ruby` |
| PHP | `PHP` | `badge-php` |
| Perl | `PL` | `badge-perl` |
| Lua | `LUA` | `badge-lua` |
| Shell / Bash | `SH` | `badge-shell` |
| PowerShell | `PS` | `badge-ps` |
| R | `R` | `badge-r` |
| MATLAB | `MAT` | `badge-matlab` |
| Julia | `JL` | `badge-julia` |
| Scala | `SC` | `badge-scala` |
| Clojure | `CLJ` | `badge-clojure` |
| Haskell | `HS` | `badge-haskell` |
| Elixir | `EX` | `badge-elixir` |
| Erlang | `ERL` | `badge-erlang` |
| F# | `F#` | `badge-fsharp` |
| OCaml | `ML` | `badge-ocaml` |
| Zig | `ZIG` | `badge-zig` |
| Nim | `NIM` | `badge-nim` |
| V | `V` | `badge-go` |
| Assembly | `ASM` | `badge-asm` |
| WASM | `WA` | `badge-wasm` |
| SQL | `SQL` | `badge-sql` |
| GraphQL | `GQL` | `badge-gql` |
| Solidity | `SOL` | `badge-sol` |
| YAML | `YML` | `badge-yaml` |
| TOML | `TML` | `badge-toml` |
| JSON | `JSN` | `badge-json` |
| Markdown | `MD` | `badge-md` |
| LaTeX | `TEX` | `badge-latex` |
| Dockerfile | `DKR` | `badge-docker` |
| Makefile | `MK` | `badge-shell` |
| Objective-C | `OC` | `badge-objc` |
| Svelte | `SVT` | `badge-svelte` |
| Vue | `VUE` | `badge-vue` |
| Sass / SCSS | `SAS` / `SCS` | `badge-sass` |
| Less | `LES` | `badge-css` |
| CoffeeScript | `COF` | `badge-coffee` |
| Crystal | `CR` | `badge-crystal` |
| Fortran | `FTN` | `badge-fortran` |
| COBOL | `COB` | `badge-cobol` |
| Pascal | `PAS` | `badge-pascal` |
| Groovy | `GRV` | `badge-groovy` |
| Terraform / HCL | `TF` / `HCL` | `badge-terraform` |
| Nix | `NIX` | `badge-nix` |
| Verilog / VHDL | `VLG` / `VHD` | `badge-verilog` |
| Prolog | `PRO` | `badge-prolog` |
| D | `D` | `badge-dlang` |
| Ada | `ADA` | `badge-ada` |
| Apex | `APX` | `badge-apex` |
| ABAP | `ABP` | `badge-abap` |

### Theme Type Badges

| Type | Badge | CSS Class |
|------|-------|-----------|
| Dark | `DARK` | `badge-dark` |
| Light | `LIGHT` | `badge-light` |
| Animated | `ANIM` | `badge-animated` |

## Nerd Font Glyphs

The site uses [Nerd Font Symbols](https://www.nerdfonts.com/) for icons throughout the interface. Run `showcase` to see all available glyphs with their names.

## Tech Stack

- **Vanilla JavaScript** — Single IIFE, no build tools, no frameworks
- **CSS3** — Custom properties for theming, CRT effects via pseudo-elements
- **GitHub REST API** — Live repo fetching
- **GitHub Actions** — Automated pinned repos sync via GraphQL
- **Nerd Fonts** — Icon glyphs via CDN with local fallback

## License

MIT
