# Branding guidelines

Visual identity modeled on [tiff.net](https://tiff.net/) (palette extracted
from its stylesheet, July 2026). Applied throughout `index.html` (all CSS
lives there), the favicon data-URI, and `manifest.json`.

## Palette

| Color | Hex | Use |
|---|---|---|
| White | `#ffffff` | Page background, card backgrounds, text on dark/red |
| Near-black | `#1d1d1d` | Body text, "want" markers (tag pill, card inset, timeline block border), theme color |
| Black | `#000000` | Buttons, dark chrome (update bar, notice pill), favicon clapper |
| TIFF red | `#d62400` | The single brand accent: links, hovers, active/selected states, "must" markers, wizard border, contested outlines |
| Red tints | `#fdf1ee` (hover fill), `#fbe9e4` (chip bg), `#e5a294` (soft border), `#fff8f6` (contested bg) | Backgrounds/borders derived from the accent |
| Grays | `#f2f2f2` / `#f5f5f5` (subtle fills), `#ccc` / `#ddd` / `#eee` (borders), `#555` / `#777` / `#888` (muted text) | Neutral structure |
| Green | `#1e8a4c` | **Semantic, not brand**: available cells, locked screenings, "get" chips. Keep green — don't rebrand it. |

Rules of thumb:

- One accent. Anything interactive or highlighted is `#d62400`; don't
  introduce second accent colors (the old blue/yellow scheme is gone).
- Hierarchy is black vs red: "must" = red (attention), "want" = near-black
  (strong but calm), untagged = gray.
- Success/availability stays green for meaning; red never signals "error"
  alone here, so avoid ambiguity by pairing state with icons/labels (✓/✕).

## Typography

- Font: **Libre Franklin** (Google Fonts, weights 400/600/700/900), falling
  back to `-apple-system, Segoe UI, sans-serif`.
- `h1`: weight 900, uppercase, `letter-spacing:.02em` — the TIFF-style
  headline look. Other headings default weights.

## Components

- **Buttons** (`.btn`): black background, white text, near-square corners
  (`border-radius:2px`), hover fills `#d62400`. Ghost variant: white with
  1px black border, hover inverts to red. Disabled: `#ccc`.
- **Chips/filters** (`.chipf`): white with `#ccc` border, hover turns text +
  border red. "Preferred" state uses the red-tint set.
- **Tag pills**: must = red fill, want = near-black fill, skip = gray.
- **Dark chrome** (update bar, update notice): pure black, white text.
- **Favicon / PWA**: red rounded square, white board, black clapper;
  `theme_color #1d1d1d`, `background_color #ffffff`.

When adding UI, pick colors from the table above — no new hues.

## Dark theme

All colors live as CSS custom properties in `index.html` (`:root` = light,
`:root[data-theme=dark]` = dark). **Never hardcode a palette hex in a rule —
use the tokens**, so both themes stay in sync. Theme resolution (head script):
saved choice (`localStorage tiff:theme`) > OS `prefers-color-scheme` > dark
when undetectable. Switcher: the `#theme` select in the topbar.

Dark values keep the same hues: neutrals become dark grays (`#161616` bg,
`#ececec` text), the accent stays `#d62400` for fills/borders but text-red
brightens to `#ff6a4d` (`--accent-ink`) for contrast, red/green tints get dark
equivalents, and black/white chrome inverts (`--ink`/`--on-ink` — buttons are
white in dark mode). "Want" markers invert with it (`--want`/`--on-want`).
