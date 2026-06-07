# VERDANT — handoff (built 2026-06-06)

The third demo skin in Pastures, and the strongest. A serene **Japanese-garden**
studio site, built fresh from FERAL's *concepts* (per-skin layout, view
transitions, a persistent canvas signature with graceful fallback, smooth scroll,
distinctive self-hosted type) **without touching any FERAL files**.

## The concept (the client brief, as built)
- **Verdant = the studio.** Small, privacy-first software studio. "Software grown
  for people, not advertisers." Muse: the Japanese garden — composed, unhurried,
  alive underneath.
- **Garden = the flagship product** — a privacy-first personal-finance app, given
  its own page and dominant weight (it's the first official project). The five real
  app screens (Garden / Grow / Seeds / Roots / Grove) are shown in phone frames.
- **Emerald = the secret project** — reached only via the stray jade stone in the
  footer (`/verdant/emerald`), never in nav.
- **People = text-only roster** (no portraits exist; deliberately typographic).

## The harder bar (met)
- **Fonts, all self-hosted, zero Google-defaults** (`public/fonts/verdant/`):
  Instrument Serif (display), Young Serif (organic accent), Schibsted Grotesk
  (body), Fragment Mono (labels). Defined via `@font-face` in `src/styles/verdant.css`.
- **Signature interaction** — `src/components/verdant/SandGarden.tsx`: a raked
  *karesansui* canvas. Rake lines bow into concentric rings around fixed mossy
  stones; the cursor drags a rake that carves a wake which slowly settles. Reads
  CSS tokens, honours reduced-motion, degrades to nothing if 2D canvas is missing.
- **Secondary technique** — `InkGrowth.tsx`: sumi-e vines that draw themselves on
  scroll (stroke-dashoffset tied to scroll progress).

## File map (all under the verdant namespace; FERAL/ridge/meadow untouched)
- `src/styles/verdant.css` — the skin: `[data-skin="verdant"]` var map + @font-face
  + `.v-*` utility grammar. Self-contained (defines `--maxw`/`--ease` too).
- `src/layouts/Verdant.astro` — font preload, ClientRouter, persistent Cursor, Nav,
  Lenis re-boot + scroll-reveal observer re-armed on `astro:page-load`.
- `src/components/verdant/` — `SandGarden`, `InkGrowth`, `Cursor` (ink brush),
  `Nav`, `Footer` (holds the emerald easter-egg stone), `TextReveal` (line-mask,
  `%word%` → gold em), `Magnetic`, `useReveal`.
- `src/data/verdant.ts` — one source of truth: `brand`, `nav`, `garden` (+ its
  `screens`), `emerald`, `team`, `ethos`. Pages are driven from this.
- `src/pages/verdant/` — `index` (studio), `garden`, `ethos`, `team`,
  `team/[slug]`, `emerald`. 8 routes total.

## Gotchas learned (carried into memory candidates)
- **Astro scoped `<style>` does NOT reach className on hydrated framework islands**
  (the element rendered inside a React island gets no `data-astro-*` attribute).
  All six verdant pages use `<style is:global>`; class names are uniquely prefixed
  (`vh-/vg-/ve-/vt-/vp-/vem-`) so global scope is safe.
- **`.v-organic` lost to `[data-skin] h1..h4`** on specificity → utility classes are
  scoped `[data-skin="verdant"] .v-organic` to win.
- Dev server (Vite) can serve a **stale CSS module** after a full-file rewrite;
  restart the preview server if styles look wrong but the build is clean.

## Verified
`npm run build` clean — 22 pages total (8 verdant). Live checks: sand-garden
signature renders + rakes, all 4 typefaces load, all 5 Garden app screens load in
frames, text roster + profiles render, all routes 200 in production.

## Live
See `cloudflare-deploy.md` for all deploy links. Verdant's own link:
**https://verdant-1wg.pages.dev** (and `pastures.pages.dev/verdant`).

## Source
Built on branch `verdant-skin`, merged to `main`. Origin thesis:
`.claude/plans/001-atelier-template-framework.md` + `docs/atelier-pattern-inventory.md`.
