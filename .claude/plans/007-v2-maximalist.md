# 007 — v2 maximalist: the studio storefront

**Status: PENDING**
**Tier: Haiku-executable.** Plan by Opus (006-line). If a step fails twice or the repo
diverges from this plan, STOP and report — KP escalates that step to Sonnet. Do not improvise.

**Load first:** the `verdant-design` skill (`~/.claude/skills/verdant-design/SKILL.md`) — it is
the acceptance bar for every visual choice here. Every section must pass its review test:
*"would this survive being one-prompted?"* If yes, restructure.

## Goal
v2 (branch `main`, deploys to verdant-studio-v2) is the STUDIO'S OWN STOREFRONT. The design must
itself be the proof of what Verdant can build. Currently one bare, restrained homepage on a refined
skin. This plan spends the maximalist toolkit: a signature hero interaction + choreographed scroll
+ the vine-border motif, banked as REUSABLE primitives (the point is the library, not just this page).

## Constraints (non-negotiable)
- Foundation stays: verdant.css tokens, type voices, pigment bands, `.v-*` grammar, reduced-motion
  + touch fallbacks. We ADD maximalist moments; we do not rip out the skin.
- Every new motion has a reduced-motion path AND a touch (coarse-pointer) path, matching the
  existing Lenis/reveal pattern in `src/layouts/Verdant.astro`.
- Reference `--vars`, never raw hex. New primitives are `.v-*`-prefixed and reusable.
- No invented content (no fake people/numbers/dates) — copy comes from `src/data/verdant.ts`.

## Step 0 — Ground truth (do before any edit)
1. `cd ~/Dev/verdant-studio && git status` — confirm clean on `main`.
2. Read `src/pages/index.astro` (current homepage) and list every component under
   `src/components/verdant/`. Write the inventory into this file under "## Inventory" below.
3. **Resolve the undefined-var flag:** grep `--cream`, `--clay`, `--forest`, `--moon`,
   `--green-600` across `src/styles/`. If they're defined in global.css → fine, note it. If
   undefined → log each as a one-line fix (map to the nearest defined token) but do NOT mass-edit
   yet; list them under "## Var fixes" for KP to confirm the mapping.
4. `npm run dev` and confirm the page renders before touching anything. (verify: page loads, no console errors)

## Step 1 — The signature hero (the one unforgettable moment)
Build ONE growing-garden hero interaction per the skill's Verdant motion primitive (botanical
growth, not fade). Candidate: an SVG vine/branch that *draws itself* (stroke-dashoffset) on load
and sprouts leaves/blooms with a GSAP timeline; pointer moves the field subtly (cursor stays plain).
- New file: `src/components/verdant/HeroGarden.tsx` (React island, `client:load`).
- Primitive banked: a reusable `drawGrowth(timeline, paths)` helper — vine-draw logic other pages reuse.
- Reduced-motion: render the vine fully-grown, static. Touch: no pointer-react, growth plays once.
- verify: `npm run dev` → hero animates on load; toggle OS reduce-motion → static full vine; no layout shift.

## Step 2 — The vine-border motif (KP's revived idea)
A reusable border that reads as a growing vine, drawn on scroll-reveal — for section frames now,
and Garden's charts later. Asymmetric, NOT a uniform stroke.
- New: `.v-vine-border` in `verdant.css` + an SVG/JS draw helper armed by the existing reveal observer.
- Apply to one section on the homepage as the proof instance.
- verify: scroll into the section → border draws like a vine; reduced-motion → appears complete.

## Step 3 — Choreographed scroll (replace uniform reveal on the hero sections)
Where it elevates a moment, swap the blanket `[data-v-reveal]` fade for a GSAP staggered/parallax
sequence — elements enter differently, some hold still. Keep `[data-v-reveal]` as the default
elsewhere. Do NOT make every section a set-piece (that's its own slop).
- verify: scroll the page → motion feels composed, not uniform; reduced-motion → all visible, no motion.

## Step 4 — Maximalist content pass on the homepage
Restructure `index.astro` so no section is a one-prompt template: vary density, break the grid,
give the Garden showcase real visual weight (use the screens/print fields already in the skin).
Pull all copy from `verdant.ts`. Each section must pass the skill review test.
- verify: read top-to-bottom — asymmetric, uneven rhythm, one clear signature moment, no 3-card row.

## Step 5 — Verify + ship
1. `npm run build` → green.
2. Run through reduced-motion + a mobile (coarse-pointer) viewport — both must degrade cleanly.
3. Commit per repo convention: `feat: 007-phaseN — <what>` (post-commit hook syncs this header).
4. Push `main`; confirm the v2 deploy workflow goes green. Tell KP the SHA + that v2 is live. Stop.

## Inventory
_(Step 0 fills this in.)_

## Var fixes
_(Step 0 fills this in — KP confirms mappings before applying.)_
