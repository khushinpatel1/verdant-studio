# 003 — Tranquil-state polish pass

Status: DONE

## Execution notes (2026-06-11)
- A, C, D: done as specified. `npm run build` clean (8 pages).
- B: verified via Playwright against `dist/` (390×844 and 390×664, all 6
  verdant routes + 404, `reducedMotion: 'reduce'` so scroll-reveal sections
  render in fullPage capture). No horizontal overflow on any route. Garden's
  `onViewportShift` re-seed confirmed: after a 664→844 resize, scrollHeight
  matches a fresh 844 load exactly (7438px both). No dead gaps after the
  gardeners-section removal. **Verified, no change needed** — added
  `@playwright/test` as a devDependency for this and future dist-based checks.
- E: left as noted (no action), per instructions.

## Context

Audited 2026-06-11 after the art-led hero pass (3 commits: `0809a25` iOS canvas
fix + per-page OG + fake-KPI removal, `087a72e` five Koson prints, `99f87e8`
art-led hero replacement). `npm run build` is clean — 8 pages, no errors.

Goal: get Verdant to a calm, presentable state before the later beta-launch
(new pages — explicitly **not** scoped here; see last section for where they'd
slot in). This plan is polish + bugfix only, no new features.

---

## A. Fix: empty "gardeners" section on the home page (CRITICAL)

`src/pages/verdant/index.astro` lines 102–122 (the `<!-- ── PEOPLE ── -->`
section) maps over `team`, imported on line 5. But `team` was emptied to `[]`
in an earlier truth-pass commit (`2d61223`) and stayed empty. Confirmed in the
build output: `dist/verdant/index.html` renders the heading "The gardeners /
Small on purpose.", then a **completely empty `<ul class="vh-people-list">`**,
then the "All the people" link — a visible dead zone on the home page.

`/verdant/team` already covers this honestly via the `studio` object
(single-person statement, `src/data/verdant.ts` lines 106–114).

**Recommendation (default — this is a content/taste call, flag to KP if he'd
rather keep a mention):** remove the `vh-people` section entirely. Nav and
Footer both link to `/verdant/team` already; cutting the section tightens the
home page (Hero → Manifesto → Work/Garden → Pull quote → CTA band → Footer)
and is more in line with "small on purpose, nothing extra."

**Steps:**
1. `src/pages/verdant/index.astro`: delete the `<!-- ── PEOPLE ── -->` section,
   lines 102–122 (`<section class="vh-people">...</section>`).
2. Same file, line 5: change
   `import { brand, garden, team, ethos } from "../../data/verdant";`
   to drop `team` (keep `brand, garden, ethos`).
3. Same file, `<style is:global>` block: delete the `/* PEOPLE — text-only
   roster */` rules, lines 194–204 (`.vh-people-head` through the
   `@media (max-width: 600px) { .vh-person-row ... }` block).

**Acceptance:** `npm run build` clean; `dist/verdant/index.html` has no
`vh-people*` markup or `team` references; pull-quote section flows directly
into the CTA band with no dead gap.

---

## B. Verify: mobile Safari hero behaviour (the known issue)

The original "scroll hero broken on mobile Safari" report was about the
home-page canvas hero — that canvas (StudioInk/SandGarden) is now **deleted**;
home's hero is a static `v-hero-grid` (text + Koson print). Likely fixed as a
side effect, but needs visual confirmation, plus one remaining canvas to check:

1. **`/verdant/garden`** still runs `GrowingGarden`
   (`src/components/verdant/GrowingGarden.tsx` via `useReactiveField`).
   `0809a25` added `visualViewport`/`orientationchange` re-measure logic
   specifically for iOS address-bar collapse/expand
   (`src/components/verdant/useReactiveField.ts` lines 109–127). Confirm it
   actually re-seeds the canvas to the new box, not just that it doesn't error.
2. **New `v-hero-grid` heroes** (home/ethos/security/team): under 800px,
   `[data-skin="verdant"] .v-hero-grid` collapses to one column and
   `.v-hero-print` caps at `min(70vw, 340px)` (`src/styles/verdant.css` lines
   225–237). On the home page, `.vh-hero { min-height: 100svh }` (line 138)
   combined with the stacked print image — confirm no large empty gap or
   overflow on a short mobile viewport.

**Steps (per project CLAUDE.md — sandbox has no dev server / network-blocked
headless Chromium):**
1. Render `dist/` via Playwright using `page.route()` to serve files from
   `dist/` over `file://` (install `@playwright/test` if missing —
   `registry.npmjs.org` is allow-listed in this sandbox).
2. Screenshot at 390×844 (iPhone, address bar hidden) **and** 390×664 (address
   bar visible — the actual repro height for the original bug) for all six
   verdant routes: `/verdant`, `/verdant/garden`, `/verdant/ethos`,
   `/verdant/security`, `/verdant/team`, `/verdant/emerald`.
3. For `/verdant/garden`: after first paint, trigger a resize (simulating the
   address-bar shift) and re-screenshot — confirm `onViewportShift` in
   `useReactiveField.ts` re-seeds the canvas (no stretched/blank/stale field).
4. For the four `v-hero-grid` pages: confirm no horizontal scrollbar, hero
   print doesn't overflow its column, and `min-height: 100svh` doesn't leave a
   large dead gap once the image stacks under the text.

**Acceptance:** describe/attach screenshots in the session. Fix only what's
actually broken (likely candidates if something is: `.vh-hero` min-height vs.
stacked content height on home, or `.vg-hero { min-height: 94svh }` +
canvas on garden). If everything renders cleanly, note "verified, no change
needed."

---

## C. Dead-code / consistency cleanup (quick, low-risk)

1. **Unused hero-field CSS** left over from deleted canvas components —
   referenced by nothing in current markup:
   - `src/pages/verdant/ethos.astro` line 91:
     `.ve-hero-field { position: absolute; inset: 0; z-index: 0; pointer-events: none; }`
   - `src/pages/verdant/team.astro` line 58: `.vt-hero-field { ... }` (same shape)
   - `src/pages/verdant/emerald.astro` line 29: `.vem-field { ... }`

   Delete each one-line rule.

2. **`src/components/verdant/Magnetic.tsx`** — not imported anywhere
   (`grep -rn "Magnetic" src/pages src/layouts` returns nothing; only
   self-references in the file itself). If still unused after edits above,
   delete the file. Low priority — invisible to visitors, just dead weight.

3. **`docs/verdant-handoff.md` "Verified" section** (lines 57–60) is stale:
   still claims "sand-garden signature renders + rakes" (component deleted)
   and "text roster + profiles render" (team is `[]`,
   `/verdant/team/[slug]` intentionally generates zero pages — see
   `src/data/verdant.ts` line 102 comment). Rewrite to describe the current
   state: 4 Koson-print heroes + GrowingGarden (garden only) + InkGrowth, all
   routes 200, 4 typefaces load, 5 Garden screens load.

**Acceptance:** `npm run build` clean;
`grep -rn "ve-hero-field\|vt-hero-field\|vem-field\|Magnetic" src/` returns
nothing.

---

## D. `/404` doesn't match the verdant skin

`src/pages/404.astro` is a leftover generic dark page (`#0f1411` bg, system
sans, `#5fa777` button) — no `data-skin="verdant"`, none of the self-hosted
fonts or cream/forest palette. Visible on any broken link; currently looks like
a different product entirely.

**Steps:**
1. Restyle `src/pages/404.astro` with verdant tokens: `--cream` /
   `--forest-900` background, `--font-display` (Instrument Serif) for "404",
   `--font-body` for copy, `.v-cta`-style link for "Back to Verdant".
2. Add `data-skin="verdant"` to `<html>` and import `../styles/verdant.css` (in
   addition to existing `global.css`) so the tokens/fonts resolve. Keep it
   standalone — no Nav/Footer/Lenis needed, just matching type and color.
3. Keep existing copy ("This page doesn't exist. The garden grows, but not
   everywhere yet.") — already on-voice.

**Acceptance:** `npm run build` clean; `dist/404.html` rendered via Playwright
shows cream/forest verdant styling, Instrument Serif headline, gold/green CTA
— consistent with the rest of the site.

---

## E. Note only: unused asset `koson-grasses-moon.jpg`

`087a72e` added and credited five Koson prints
(`docs/art-credits.md`), but only four are placed: `koson-songbird-plum.jpg`
(home), `koson-dragonfly-lotus.jpg` (ethos), `koson-eagle-pine.jpg` (security),
`koson-waterlilies.jpg` (garden features). `koson-grasses-moon.jpg`
("Grasses and flowers at full moon") sits unused in `public/verdant/art/`.

Harmless (unused public asset, doesn't break the build) — but worth a decision
for an "intentional" site. **No default action — taste call for KP**:
- leave it (seed for a future page), or
- place it — natural fits: `/verdant/emerald` (currently uses studio-suite
  `emerald-dusk.jpg`) or as secondary art on `/verdant/team` or
  `/verdant/ethos`.

---

## Order of operations

1. **A** — empty gardeners section (highest-impact, single file).
2. **C** — dead CSS / Magnetic / handoff doc (mechanical, do alongside A).
3. **D** — 404 restyle (self-contained, high payoff for "presentable").
4. **B** — mobile Safari screenshot pass (last, may surface follow-up CSS).
5. **E** — note only; act only if KP has a quick preference.

## Final acceptance ("tranquil state")

- `npm run build` clean, all routes 200.
- No empty content sections (re-scan after edits, not just the one found).
- `/404` matches verdant visual identity.
- Mobile screenshots (375–430px, both address-bar heights) of all 6 verdant
  routes: no overflow, no broken/blank canvas, no dead space.
- `docs/verdant-handoff.md` "Verified" section matches reality.
- Commit in logical chunks per project CLAUDE.md, e.g.:
  `fix(home): remove empty gardeners section`,
  `chore(verdant): drop dead canvas-era CSS and Magnetic component`,
  `style(404): match verdant skin`,
  `fix(garden): mobile-safari hero adjustments` (only if B finds something).

---

## Where beta-launch pages slot in (not scoped here)

- `src/data/verdant.ts` is the single source of truth — new pages add an entry
  to `nav.links` (Nav + Footer both read from it automatically) plus a new
  content export.
- Follow the established per-page pattern: `<Verdant title=...
  image="/og/og-<page>.jpg">`, a `v-hero-grid`/`v-hero-print` hero (or reuse
  `GrowingGarden`/`InkGrowth` if a canvas signature fits the page), `<style
  is:global>` with page-prefixed classes (`vX-*`), `data-v-reveal` scroll-reveal
  hooks, closing `<Footer client:visible />`.
- `docs/verdant-handoff.md` (file map + gotchas) is the first read for whoever
  builds those pages — keep it current as part of this pass (item C.3).
