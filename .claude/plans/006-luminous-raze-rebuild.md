# 006 — Luminous Botanical-Minimal: Raze & Rebuild

Status: IN PROGRESS (Phase 1 DONE 2026-06-15, commit 4dc4b53, build+check green, pushed/deploying. Phases 2–3 PENDING — rest of site still on OLD dark/koson language until run.)
Tier: Haiku-executable (all creative decisions are pre-made below; transcribe, don't invent).
Dispatched by: partnership · Opus · plan session, 2026-06-15.

## The call (KP, 2026-06-15)
"Raze to studs, new visual language." Overrode the keep-the-bones recommendation
knowingly. New language = **Luminous botanical-minimal**: evolve the garden/privacy
soul, **drop the koson ukiyo-e art direction and the dark-forest-dominant palette**.
Light, airy, vast whitespace, big serif display, soft organic light instead of prints.
Target polish: "impeccable / GitHub-grade."

**What survives the raze (reuse, do NOT re-ship):**
- All 4 self-hosted font families in `public/fonts/verdant/` + their `@font-face` blocks.
- `src/layouts/Verdant.astro` shell: SEO/OG meta, font preloads, the reveal
  IntersectionObserver, the parallax driver. (Edits below.)
- `src/components/verdant/GrowingGarden.tsx` — repurposed as the homepage hero
  signature (light version). Already reduced-motion/touch safe.
- `src/data/verdant.ts` — **copy is strong and KP owns voice. Reuse all prose verbatim.
  Do NOT rewrite user-facing wording in this pass.**

**What dies:** dark-forest-dominant token map, all `public/verdant/art/koson-*.jpg`
print usage, the custom `Cursor.tsx` (`data-cursor`), the `vh-cta-moon`/print-field
grammar on the homepage.

## New token map — replace the color block in `src/styles/verdant.css`
Keep the `@font-face` and `--font-*` lines. Replace the `[data-skin="verdant"]` COLOR
vars with this luminous map (light base, living-green accent, soft light fields):

```
[data-skin="verdant"] {
  /* luminous paper base — warm near-white, lots of it */
  --paper:      #fcfdf9;   /* page bg, the dominant surface */
  --paper-soft: #f4f6ec;   /* alternating section wash */
  --mist:       #e9f0e2;   /* soft sage light field */
  --dawn:       #f6f1e2;   /* warm light field */

  /* living greens — brighter, alive (not the old deep-forest mass) */
  --leaf:       #2f7d4f;   /* primary living-green accent */
  --leaf-deep:  #1f5a39;   /* hover / emphasis */
  --moss:       #6f9a78;   /* secondary, muted */
  --sage:       #b9cfa9;   /* tint / borders */

  /* ink + single calligraphic gold */
  --ink:        #16241b;   /* body text — deep green-black, not pure black */
  --ink-soft:   #45584a;   /* secondary text */
  --gold:       #b88a2e;   /* the one delicate-hand accent */

  /* contract used by global.css + components */
  --bg:     var(--paper);
  --fg:     var(--ink);
  --muted:  var(--ink-soft);
  --line:   rgba(22, 36, 27, 0.12);
  --card:   #ffffff;
  --accent: var(--leaf);
  --radius: 4px;           /* organic comes from layout asymmetry, not fat radii */
  /* keep all --font-* and the --text-*/--display-* scale tokens from plan 005 */
}
```

## Layout shell edits — `src/layouts/Verdant.astro`
1. **Remove** `import Cursor` and the `<Cursor .../>` line. (Custom cursor hurts
   the boomer/a11y/legibility lens; it's gone.)
2. Keep Nav, keep the reveal IO + parallax + Lenis script as-is (Lenis is already
   gated to fine-pointer desktop + respects reduced-motion — safe, keep it).
3. Body bg becomes `--paper` via existing global contract (no change needed if
   global.css reads `--bg`).

## Homepage rebuild — `src/pages/verdant/index.astro` (the proof page, do first)
Luminous botanical-minimal. Structure (top to bottom), all copy reused from current file:

1. **Hero — luminous, type-on-light, headline is REAL HTML (robustness fix).**
   - `<GrowingGarden client:visible>` as a soft full-bleed light field BEHIND the
     hero (low opacity, sits over `--paper`), NOT a dark band.
   - `<h1>` rendered as plain server HTML with the headline text
     "Software grown for people, not advertisers." — split into `<span>`s for the
     reveal, but the TEXT is in the DOM with no JS. **Do not gate the headline behind
     `client:load`.** Reveal via `data-v-reveal` (CSS/IO progressive enhancement).
   - Sub: existing "Quiet software — tools that do their work…" copy.
   - Two CTAs: "See the work" (#work), "The ethos" (/verdant/ethos). Use `--leaf` accent.
2. **Manifesto** — on `--paper-soft` wash (light, not a dark band). The 4 `ethos.creed`
   lines as a calm hairline-separated list. Young Serif on the 2-word emphasis.
3. **Work / first project (Garden)** — keep the dual-phone mock, but reframe on light:
   phone frames on `--paper`, soft shadow, `--leaf` name hover (not gold-on-dark).
   Reuse `garden.oneLine`, `garden.blurb`. CTA "Walk through Garden".
4. **Pull quote** — KP's quote, big Instrument Serif on `--paper`, generous whitespace.
5. **Closing CTA** — soft `--mist`→`--dawn` luminous gradient field (NOT the koson moon
   print). "Grow something quiet." + "Start a conversation" → /verdant/ethos#talk.
6. Footer.

**Asymmetry is structural** (per KP's organic-is-structural principle): vary section
rhythm and alignment — do not center everything; let the hero text sit left, the work
section offset, the quote centered. No two sections share the same vertical rhythm.

## Phase plan (stage it — this is a multi-page build, not one pass)
- **Phase 1 (THIS dispatch):** new token map + layout shell edit (drop Cursor) +
  homepage (`verdant/index.astro`) + Nav.tsx + Footer.tsx reskinned to luminous.
  Build green → commit `feat: 006-phase1 — luminous raze, homepage + tokens`.
- **Phase 2:** `ethos.astro`, `garden.astro` reskinned to luminous (drop koson prints,
  use light fields). Commit per page.
- **Phase 3:** `security.astro`, `team.astro`, `team/[slug].astro`, `emerald.astro`,
  `404.astro`. Commit per page.
- After each phase: `npm run build` + `npm run check` must pass before commit.

## Verify (per step)
- `npm run build` — must exit 0 (Astro build).
- `npm run check` — astro check, no new type errors.
- Push to main = Cloudflare Pages deploy (do not run wrangler manually).

## FLAGGED — needs KP, do NOT fabricate
1. **Product URL trust gap.** Garden CTA + `nav.cta` point to
   `garden.khushinpatel1.workers.dev` — reads as a dev sandbox to non-technical /
   investor eyes and undercuts the trust pitch. Needs a real domain (e.g.
   `garden.verdant.studio`). **Leave the existing URL in place; surface this to KP.**
2. **Canonical domain.** Layout hardcodes `https://verdant.studio`. Confirm it's
   owned/live before relying on it for OG/canonical.
3. **Copy.** Voice is KP's. This pass is VISUAL only — reuse all prose from
   `src/data/verdant.ts` and existing pages verbatim. No wording changes.

## Out of scope this pass
Copy rewrite, new fonts, new product screenshots, the workers.dev → real-domain swap.
