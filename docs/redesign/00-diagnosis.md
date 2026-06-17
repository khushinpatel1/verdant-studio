# Verdant Studio v2 — Redesign Diagnosis (ground truth)

**Date:** 2026-06-17 · **Target:** v2, `main` branch → `verdant-studio-v2.pages.dev`
**Author:** Opus plan session · **Status:** DIAGNOSIS COMPLETE — feeds build plan `008`.

This is the verified record of *why the site feels stale, bare, too-AI, laggy, and corny.*
Every claim here was read off disk, not inferred. Tiers are marked: **[VERIFIED]** = read
in source, **[OBSERVED]** = read the structure/content and judged, **[SUSPECTED]** = needs
the audit subagent to confirm with numbers.

---

## TL;DR — four root causes, in priority order

1. **[VERIFIED] The design system is half-dead.** v2 redefined the palette but left 22+
   references to v1 token names that no longer exist. Broken `var()` fails *silently*, so a
   large slice of intended richness — including the marquee "wet pigment" green-band
   treatment — renders as nothing. This alone explains a lot of "flat / bare / AI."
2. **[OBSERVED] The pages are structurally thin.** The homepage is 5 light sections; for a
   studio that wants to read as a *growing business*, there is almost no depth: no proof, no
   "what Garden actually is" beyond three phone shots, no second look, no reason to scroll
   with appetite. It's a skeleton wearing nice type.
3. **[OBSERVED] The copy is metaphor-saturated.** Nearly every line reaches for the garden
   figure ("pull the weeds", "in the soil", "grow something quiet", "a presence that already
   sees your garden"). One or two land; thirty in a row reads as *a model handed a theme and
   told to run it into the ground.* This is the single biggest "too AI" tell in the words.
4. **[SUSPECTED] Perf is death-by-a-thousand-composites.** GSAP + Lenis + 3+ canvases
   (HeroGarden, GrowingGarden, reactive Cursor field) + a fixed full-page grain overlay with
   `mix-blend-mode: multiply` + an always-running 32s band-wash on `mix-blend-mode:
   soft-light`. Every one of those is a continuous compositing cost. Needs the perf audit to
   quantify, but the architecture predicts the "sometimes sluggish and laggy" report.

---

## [VERIFIED] Defect 1 — dead design tokens (the smoking gun)

The `[data-skin="verdant"]` map in `src/styles/verdant.css` defines the v2 palette:
`--paper, --paper-soft, --mist, --dawn, --leaf, --leaf-deep, --moss, --sage, --ink,
--ink-soft, --gold` (+ contract vars, fonts, scale, eases, shadows).

But the v1 token names below are **defined 0 times anywhere in `src/`** and still referenced:

| Dead var | Uses | What it silently kills |
|---|---|---|
| `--green` | 6 | green-band pigment bloom (richest visual move) |
| `--forest` | 4 | **`.v-cta` color** — every CTA's intended color |
| `--green-600` | 3 | green-band pigment bloom |
| `--moon` | 3 | `::selection` color, light-CTA color |
| `--moss-300` | 2 | light label color |
| `--cream` | 1 | **`body` background** |
| `--clay` | 1 | **`.v-label` color** — every mono kicker |
| `--parchment` | 1 | `.v-band--paper` background |
| `--forest-900` | 1 | green-band pigment bloom |

**Files affected:** `src/styles/verdant.css`, `src/components/verdant/Cursor.tsx`,
`src/components/verdant/InkGrowth.tsx`.

**Why it matters:** broken `var()` with no fallback drops the whole declaration → the
element inherits or goes transparent. So CTAs, labels, selection, the paper body wash, and
the *entire* living-pigment band treatment are all rendering wrong or invisible. The fix is
cheap (map the dead names to v2 tokens, or rename usages) and high-impact. **This is task 1
of build plan 008 and must ship before any visual judgement is re-made.**

---

## [OBSERVED] Defect 2 — structural thinness

Homepage (`src/pages/verdant/index.astro`) section inventory, in order:
1. Hero (one headline + sub + two text CTAs + canvas garden)
2. Manifesto (4 creed lines)
3. Work (one product: Garden, text + 2 phone images)
4. Quote (one pull-quote)
5. CTA band (one line + one link)

That's the whole page. For a *growing studio*, what's missing: a real "what is Garden / how
it works" beat with substance; any proof or specificity (numbers, principles made concrete,
a screen walkthrough that isn't 3 static jpgs); a second visual register between text blocks;
an Emerald tease with intrigue; a footer that does more than sit there. The subpages
(`garden`, `ethos`, `security`, `team`, `emerald`) need the same audit — see persona docs.

**Direction for build plan:** add *depth and growth*, not noise. More sections that each earn
their scroll, richer media, a sense the studio is alive and shipping — without turning serene
into busy. The Verdant taste bar (organic = structural asymmetry, not cosmetic curves) holds.

---

## [OBSERVED] Defect 3 — copy is corny because it's metaphor-saturated

Current copy from `src/data/verdant.ts` — the pattern, not cherry-picked:
- "Software grown for people, not advertisers."
- Garden tabs: "See the whole garden." / "Pull the weeds." / "Plant it, and untangle it."
- "A presence that already sees your garden."
- "A second project is in the soil — it ships when it's ready."
- "Grow something quiet."

The voice isn't bad — it's *relentless*. Every headline is a botanical pun. The fix is not to
strip the garden entirely; it's to make 2–3 metaphors load-bearing and let the rest be plain,
confident, specific. The full rewrite lives in `01-language-rewrite.md`. Target voice: dry,
exact, anti-corporate, no engagement-bait, no metaphor-for-metaphor's-sake. Say the real
thing plainly; let one good image do the lifting.

---

## [SUSPECTED] Defect 4 — perf, and Defect 5 — assets

**Perf (audit subagent to quantify):** continuous-composite architecture — multiple canvases,
fixed grain overlay (`mix-blend-mode: multiply`, full viewport, `z-index: 9000`), 32s infinite
band-wash on `soft-light` blend, GSAP+Lenis. Suspect: too many always-on blend-mode layers and
canvases not aggressively paused/throttled off-viewport. Garden's recent perf work is the
reference bar.

**Assets (audit subagent to quantify):** mixed `.jpg` textures (`tx-1..4`, Koson prints) +
`.webp` garden screens + `.png` favicons/og. Suspect: oversized/uncompressed jpgs, no
`width/height` or responsive `srcset`, Koson scans possibly low-res or heavy. KP: "the assets
aren't great." Audit must report byte sizes, dimensions, and format-vs-use mismatches.

---

## What feeds what

- `01-language-rewrite.md` — full new copy deck (Opus, written first, durable).
- `persona-1..5.md` — five-visitor "Meta approach" (subagent fan-out, each on disk).
- `audit-perf.md`, `audit-assets.md` — quantified audits (subagent, each on disk).
- `.claude/plans/008-v2-depth-and-voice.md` — the synthesized, Haiku-executable build plan.
