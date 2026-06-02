# Pastures

> Cross-project rules live in `~/.claude/CLAUDE.md`. This file is the live state
> of *this* project. Read it first when resuming.

## What this is
**Pastures** — a product: sellable, cinematic website templates that look/feel as
polished as Apple's and Google's marketing pages, built so a client's entire site
is driven by **one config file**. Foundation + walls = a reusable section-component
library. Decorating = the config (logo, palette, copy, images, section order).
Occupant = the client's content. **Copy the file to reproduce; swap it to sell.**

We study how Apple/Google *architect* the feel and replicate the techniques in
original components. We never ship their logos, products, photos, copy, or
licensed fonts. Two skins are **original blended concepts**, not clones:
- **Ridge** — Apple cinematic dark depth × Google kinetic text & bold accent.
- **Meadow** — Google bright Material warmth × Apple seamless scroll & breathing room.

## Stack
- **Astro 5 + React 19 islands.** Scripts: `npm run dev` (port 4321) · `npm run build` · `npm run check`.
- **GSAP + ScrollTrigger** (reveals/pin/parallax, free) · **Lenis** (smooth scroll).
- **Theme engine:** flat CSS-var maps on `[data-skin]` in `src/styles/tokens.css`
  (same philosophy as the `garden` project). **Reference `--vars`, never hardcode hex.**
- **Free assets:** Unsplash/Pexels (img), Coverr/Mixkit (video), Lucide/Heroicons,
  unDraw, Google Fonts (Inter + Manrope). Currently using picsum placeholders.
- **Deploy target:** Cloudflare Pages.

## Architecture
- `src/config/types.ts` — **the contract.** `SiteConfig` = `{ skin, brand, nav, sections[] }`;
  `Section` is a discriminated union (one member per component). Add a component → add a member.
- `src/config/ridge.config.ts`, `meadow.config.ts` — demo brands (Lumen, Verda).
- `src/components/lib/SiteRenderer.tsx` — maps `config.sections` → components (switch on `type`).
- `src/components/lib/useReveal.ts` — GSAP reveal for any `[data-reveal]` (hides via JS so no-JS = visible).
- `src/components/sections/*` — the section library.
- `src/layouts/Base.astro` — sets `data-skin`, loads fonts + Lenis.
- `src/pages/index.astro` (Ridge) · `meadow.astro` (Meadow).

## Status (as of 2026-06-02)
**Working & verified in browser** — both skins render end-to-end; config swap re-skins+re-fills.
- Built (9 of 19): `StickyNav`, `KineticHero`, `RevealBlock`, `CardGrid`, `Accordion`,
  `MegaFooter`, + cinematic `PinnedShowcase`, `ParallaxLayers`, `CompareSlider`.
- Verified: pipeline, theme tokens, Lenis, GSAP reveals wired, dup-key bug fixed, `npm run build`
  clean. New sections added to both `ridge` + `meadow` configs (between RevealBlocks and CardGrid).
- Cinematic verification notes: PinnedShowcase = CSS-sticky media column + ScrollTrigger to light
  the active step + subtle scale. ParallaxLayers = GSAP scrub `yPercent` per layer `speed`.
  CompareSlider = pointer-capture wipe, clip tracks 0–100% (drag-tested 20%→85%).

## Next steps (recommended order)
1. **More cinematic components:** `VideoScene`/image-sequence next. Full inventory of all 19:
   `../partnership/docs/atelier-pattern-inventory.md`.
2. Swap picsum → curated free assets.
3. Expand each skin to a full 5–6 page site.
4. `git init` + first commit (remote not yet created).
5. Cloudflare Pages deploy.

## Known issues / notes
- **Meadow hero image washes out** — dark→`--bg` gradient over a light skin erases the photo;
  tune overlay per-skin if image presence is wanted.
- **Preview quirk:** the Claude preview tool reads `launch.json` from whatever folder the
  session is rooted in. Launched from `~/Dev/pastures`, create `pastures/.claude/launch.json`
  with `{name:"pastures", runtimeExecutable:"npm", runtimeArgs:["run","dev"], port:4321}`.
  (A temporary `pastures` entry was added to `garden/.claude/launch.json` during the build
  session — safe to remove from garden once this project owns its own.)
- **Preview screenshots are black at any non-zero scroll offset** (sandbox/CDP capture quirk —
  hero at offset 0 captures fine). Not a real rendering bug: verify deep sections via DOM instead
  (`preview_snapshot`, `elementFromPoint`, computed styles, image `naturalWidth`).

## Origin
Plan: `../partnership/.claude/plans/001-atelier-template-framework.md` (status PENDING → now IN PROGRESS).
Pattern inventory: `../partnership/docs/atelier-pattern-inventory.md`.
