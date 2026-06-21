# Verdant Studio

> Read `CLAUDE.md`/`AGENTS.md` first; `.codesight/CODESIGHT.md` is a generated map — verify its **Last scanned** date before trusting it.

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

## Deploy — v3 production

**v3 (current):** Deploys from `main`, `v1`, or `v3` branches → Cloudflare Pages
project `verdant-studio-v3` with CF branch `v3`. Lives at
`https://verdant-studio-v3.pages.dev/`.

**Workflow:** `.github/workflows/deploy.yml` runs `wrangler pages deploy dist`
with:
```
--project-name=verdant-studio-v3 --branch=v3
```

When you `git push origin main`, the GitHub Action builds and deploys to v3. No
git-to-CF branch mapping — all branches deploy to the same CF project/branch.
CF projects are not git-connected; the Action is the deployment pipeline.

**Retired:** v1 (dark) and v2 (luminous) Cloudflare projects and branches were
deleted 2026-06-20. Only v3 lives. Use `main` for all work going forward.

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

## Visual assets — standing rules

**Rule 1: Assets bleed into their background (no stamped-photo edges)**
Every image and video must fade into the section background — no hard rectangular
frame, no "photo pasted on a page" look. Implement via radial mask gradients
(`mask-image` / `-webkit-mask-image`) in the Kit primitives (Hero, FeatureRow, Card):
- Large media (Hero, FeatureRow): `radial-gradient(ellipse 85% 85% at 50%, #000 0%, #000 60%, transparent 95%)`
- Icons (Card): `radial-gradient(circle at 50%, #000 0%, #000 75%, transparent 100%)`

The section's background is the cream ground (`--cream` or `--paper`); the mask makes
edges transparent so assets blend seamlessly. Apply the mask in the Kit component styles,
not per-image — it's automatic everywhere.

**Rule 2: No Japanese writing or iconography**
No kanji text, no hanko seals, no torii gates, no stone lanterns. These are KP's standing
preference — the site is English-only, visually Western. Koi, cranes, blossoms, moon,
landscapes, and other nature subjects are fine. Writing and shrine imagery are out.
Strip any inherited seals/script from incoming assets (use Python PIL, `sips`, or a
content-aware tool) before placing them.
