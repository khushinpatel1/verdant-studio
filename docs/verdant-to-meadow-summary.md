# Verdant → Meadow — Port Summary

> Branch: `feat/verdant-to-meadow` · Built overnight 2026-06-02.
> Companion: `verdant-to-meadow-mapping.md` (the page/section plan this executed).

## What this delivers
The **Meadow** skin is no longer the generic "Verda" plant-shop demo. It now carries
**Verdant Studio** — the privacy-first software studio whose muse is the Japanese garden
(moonlight, moss, stillness) — ported from the standalone `verdant-site` React SPA into
Pastures' config-driven framework. Same section-component library, swapped config + skin tokens.

## Pages (5, all config-driven via `SiteRenderer`)
| Route | Config | Source (verdant-site) |
|---|---|---|
| `/meadow` | `meadow.config.ts` | `Studio.jsx` — studio home / manifesto / seasons / work shelf |
| `/meadow-garden` | `meadow-garden.config.ts` | `Garden.jsx` — privacy-first finance product page |
| `/meadow-ethos` | `meadow-ethos.config.ts` | `Ethos.jsx` — values + how-we-work + FAQ |
| `/meadow-team` | `meadow-team.config.ts` | `Team.jsx` — small-studio team + open plots |
| `/meadow-emerald` | `meadow-emerald.config.ts` | `Emerald.jsx` — sparse "taking root" teaser |

Shared nav (`verdantNav`, exported from `meadow.config.ts`) wires all five together — fixing
the original complaint that the skins had no connective tissue.

## Skin retune (`tokens.css` → `[data-skin="meadow"]`)
Moved off generic Material green onto Verdant's palette, all referencing the muse:
cream `#FBF8F2` bg · forest-dark `#15300A` ink · moss `#7A9E7E` muted · forest `#2D5016`
accent · gold `#C8973F` highlight · parchment `#F4EEE2` cards · sage `#C8D5B9` rules ·
`--radius` dropped 24px→4px (austerity, no fat Material radii). Fonts → **Newsreader**
(display serif) · **Hanken Grotesque** (body) · **DM Mono** (data), loaded in `Base.astro`.
**Verified live:** computed `--bg` = `#FBF8F2`, `--accent` = `#2D5016`, headings render in Newsreader.

## Verification
- `npm run build` clean — **8 pages** (3 Ridge + 5 Meadow).
- All 5 Meadow routes return 200; nav cross-links resolve.
- Live DOM + computed-style check confirms skin/palette/fonts applied; hero screenshot captured.

## Deliberately left out (quality gate)
- **Old `meadow-care` / `meadow-about`** pages + configs — deleted; replaced by the richer
  Verdant narrative (care → home features, about → full Ethos page).
- **FluidBackground (WebGL)** — wasn't reliable in verdant-site itself; complex dependency.
- **Fireflies canvas** — candidate new section type, deferred (complexity vs. V1 value).
- **`Profile.jsx` (`/team/:slug`)** — needs dynamic routing; out of scope for this MPA port.
- **TxLoop / animated app frames** — no real screenshots exist; a placeholder would *lower* quality.

## Assets
Swapped Meadow's tropical/houseplant Unsplash URLs for serene Japanese-garden-aligned imagery
(moonlit water, moss stone, misty forest, dusk forest for Emerald). Still Unsplash CDN; VideoScene
still uses free Google sample MP4s. **Open item:** these are curated by photo-ID and should be
eyeballed for exact tone, then localized to your own CDN with attribution before production.

## Open decisions for you (when awake)
1. **Asset taste pass** — confirm each hero/section image hits the moonlight/moss tone you want;
   easy to swap any URL in the configs.
2. **Fireflies / fluid background** — want these as new Pastures section types? They'd add the
   "life moving slowly underneath" motion the muse calls for. Say the word and I'll build them.
3. **Emerald in nav?** — currently footer-only (it's an easter-egg teaser). Promote to nav or keep buried?
4. **Ridge skin** — untouched; still the old demo. Decide if Verdant should fully replace the demo
   content or live alongside it as a second sellable template.
