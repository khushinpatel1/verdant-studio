# Verdant Studio

> Cross-project rules live in `~/.claude/CLAUDE.md`.

## What this is
**Verdant Studio**'s site: a serene Japanese-garden studio site for Verdant, a
privacy-first software studio. Formerly the `verdant` skin inside the multi-skin
`pastures` repo (ridge/meadow/feral were retired, `04bee0a`); renamed to its own
project in the 2026-06-09 studio reset since it's the only live skin. Root (`/`)
redirects to `/verdant`.

For the technique vocabulary (SandGarden, EthosWater, BlueprintReveal, InkGrowth,
etc.) and full file map, see `docs/verdant-handoff.md`.

## Stack
Astro 5 + React 19 islands. `npm run dev` (port 4321) · `npm run build` ·
`npm run check`. GSAP/ScrollTrigger + Lenis for scroll. Self-hosted fonts under
`public/fonts/verdant/` — no Google Fonts.

## Deploy — two live versions, two branches

**v1 (dark / koson, frozen on 2026-06-15):** Lives at https://verdant-1wg.pages.dev/.
Deploys from the `v1` branch → Cloudflare Pages project `verdant`. Read-only by default,
but can be edited deliberately (see "Working style" below).

**v2 (luminous botanical-minimal, in progress):** Deploys from `main` branch →
Cloudflare Pages project `verdant-studio-v2` (created 2026-06-15, watching `main` branch).
Lives at `https://verdant-studio-v2.pages.dev/`.

**Workflow:** `.github/workflows/deploy.yml` conditionally deploys based on branch.
When you push:
- `git push origin main` → builds, deploys v2 to verdant-studio-v2
- `git push origin v1` → builds, deploys v1 to verdant

**Session declaration:** Each session explicitly targets one branch. Commit messages
tag the version: `feat: 006-v2 — ...` or `fix: 007-v1 — ...`. Session name in title
shows the version: "verdant-studio · feat · hero-v2" or "verdant-studio · fix · nav-v1".
Git log answers "what went where": `git log --oneline | grep v1` vs `git log --oneline | grep v2`.

## Screenshots / visual checks in this sandbox
Headless Chromium here is network-blocked — **do not start a dev server**. Instead:
- Render the built `dist/` via Playwright, intercepting requests with
  `page.route()` and serving files from `dist/` over `file://`.
- Inject any seed state into `localStorage` before navigating.
- The headless tab reports `document.hidden = true`, which freezes any canvas
  paused on `visibilitychange`. Override `document.hidden` and dispatch a fake
  `visibilitychange` event before capturing animated heroes.

## Working style
- Commit in logical chunks.
- Model tiering per `~/.claude/CLAUDE.md`: Haiku executes, Sonnet escalates per stalled step,
  Opus only on KP's explicit call for genuine cross-cutting architecture/redesign (never agent framing).
- Keep the existing canvas perf work intact — 30fps idle-throttle and
  `visibilitychange` pause on all canvases (SandGarden, EthosWater,
  GrowingGarden, etc.).
- All hero interactions must support touch (no hover-only affordances).
