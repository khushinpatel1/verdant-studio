# Verdant Studio

> Law: `~/.claude/CLAUDE.md`. Intent: `VISION.md`. Backlog: `TODO.md`. Technique: `docs/verdant-handoff.md`.

**Verdant Studio site** — serene Japanese-garden studio site. Formerly multi-skin `pastures` repo; now standalone (v3 only). Root redirects to `/verdant`.

## Stack
- **Astro 5 + React 19** islands. `npm run dev` (4321) / `build` / `check`.
- **Motion:** GSAP/ScrollTrigger + Lenis.
- **Fonts:** self-hosted under `public/fonts/verdant/`. No Google Fonts.

## Deploy — v3 (current)
- Deploys from any branch → Cloudflare Pages project `verdant-studio-v3`, CF branch `v3`.
- **Workflow:** `.github/workflows/deploy.yml` runs `wrangler pages deploy dist --project-name=verdant-studio-v3 --branch=v3`.
- `git push origin main` → auto-build + deploy to v3.
- **Retired:** v1 (dark), v2 (luminous) deleted 2026-06-20. Use `main` only.

## Screenshots in sandbox
- No dev server (network-blocked). Build `dist/` → serve via Playwright + `page.route()` over `file://`.
- Inject state into `localStorage` before nav.
- Override `document.hidden` + dispatch fake `visibilitychange` for canvas capture.

## Working style
- Commit in logical chunks.
- Model tiering: Haiku executes, Sonnet escalates per stalled step, Opus only on KP's explicit call.
- Canvas perf: keep 30fps idle-throttle + `visibilitychange` pause intact.
- All hero interactions must support touch (no hover-only).

## Visual assets — standing rules
**Rule 1: Assets bleed into background** (no stamped-photo edges).
- Large media: `radial-gradient(ellipse 85% 85% at 50%, #000 0%, #000 60%, transparent 95%)`
- Icons: `radial-gradient(circle at 50%, #000 0%, #000 75%, transparent 100%)`
- Apply in Kit component styles (Hero, FeatureRow, Card), not per-image.

**Rule 2: No Japanese writing/iconography.** (KP preference: English-only, Western visuals.)
- OK: Koi, cranes, blossoms, moon, landscapes, nature.
- OUT: Kanji, hanko seals, torii gates, stone lanterns.
- Strip inherited seals/script before placing (PIL/`sips`/content-aware).
