# 009 — Verdant density system (shared spec for page-density executors)

Goal: no page stays bare cream. Hybrid look — **cream is the dominant base**, each page gets **one
dark "moonlit" feature moment** + **brush-stroke ink accents** + the **leaf-beside-image signature**
expanded. Cohesion across pages matters more than novelty per page: follow these exact patterns.

## Assets available
**Painted (use ONLY inside dark `.v-night` sections — they're on dark backgrounds):**
- `/verdant/paint/moonlit-garden.webp` (1600×1013) — moon, pagoda, bridge, blossoms. The hero scene.
- `/verdant/paint/ink-panels.webp` (1000×716) — gold-framed scroll panels + moon + lantern. A gallery.
- `/verdant/paint/garden-band.webp` (1536×146) — wide thin dark garden band. Section divider / footer strip.

**Ink SVG components** `src/components/verdant/ink/` (props `{className?, style?, side?}`):
- STRONG, use freely: `Enso`, `Moon`, `MountainRidge`, `MistLayer`, `StoneLantern`.
- OK, use smaller / supporting: `BlossomBranch`, `Bamboo`, `Koi`, `PetalFall` (overlay, pointer-events:none).
- DROPPED — do NOT use: `Crane` (renders wrong). It will be deleted.
- Existing primitives still in play: `InkGrowth`, `VineBorder` (the leaf-beside-image motif), `GrowingGarden`, `HeroGarden`.

## Tokens / theming
Cream base uses existing tokens (`--paper --ink --leaf --gold` …). Dark sections use `.v-night`
(already in verdant.css: `--night-bg #10171b`, `--night-ink #f2efe2`, `--night-gold #d8b25e`, …).
`.v-night` already remaps headings/body/labels to night tokens — just add the class to a section.

## The three reusable patterns (build once on ethos, copy everywhere)

### P1 — `.v-night` painted feature section (the moonlit moment)
A full-bleed (or wide inset) section with a painted webp behind a legibility scrim + text on top.
```
<section class="vh-night-feature v-night" data-v-choreograph>
  <div class="vh-night-bg" style="background-image:url(/verdant/paint/moonlit-garden.webp)"></div>
  <div class="vh-night-scrim"></div>            <!-- linear-gradient rgba(10,15,19,.72)→(.42) for text legibility -->
  <Moon client:visible class="vh-night-moon" />  <!-- optional SVG moon layered in -->
  <div class="vh-night-copy">… heading + body, choreographed …</div>
</section>
```
Scrim must keep body text ≥4.5:1 (night-ink on the darkened image). Background `cover`, `center`.
On mobile, reduce min-height. Honour reduced-motion (the SVG/anim components already do).

### P2 — ink accents on cream sections
- `Enso` large + low-opacity (~0.10) behind/beside a section numeral (`vh-num`) or heading — a watermark mark.
- `MountainRidge` + `MistLayer` as a soft atmospheric band at a cream section's bottom edge (low opacity, behind content, pointer-events:none).
- `BlossomBranch` / `InkGrowth` entering from one side beside an image or a heading column (use `side`).
- `PetalFall` as a subtle overlay on ONE hero/feature moment per page max (not everywhere — restraint).

### P3 — leaf-beside-image signature (expand the motif KP likes)
Every product screenshot / portrait / framed image gets an ink vine or blossom branch at one edge,
slightly overlapping, so the image feels hand-placed in a garden. Reuse `InkGrowth` (existing) or
`BlossomBranch`; alternate `side` per instance for asymmetry.

## Per-page assignments
- **ethos** (REFERENCE BUILD): P1 dark moment = `moonlit-garden` behind the manifesto/creed; P2 Enso watermark on the creed numerals + Mountain/Mist band on the story section; P3 BlossomBranch beside the existing story image.
- **garden** (product): P1 dark moment = `ink-panels` gallery section showcasing the app philosophy; P3 InkGrowth/BlossomBranch beside each of the 3 product screens; P2 Enso on a feature numeral.
- **security**: P1 dark moment = `garden-band` as a full-bleed band behind the principles intro; P2 Mountain/Mist band under the headers table; Enso watermark on a principle numeral.
- **team**: P1 dark moment = `moonlit-garden` behind the closing "the door is open" CTA; P2 BlossomBranch beside the roster statement; PetalFall subtle on the hero.
- **privacy** & **404**: lighter touch — P2 only (an Enso watermark + a Mountain/Mist bottom band) so they're not naked, no heavy dark section.
- **index** (polish): add one `.v-night` moment using `ink-panels` between Work and Quote; PetalFall on the CTA band; Enso watermark on a section numeral. Keep existing hero/choreography intact.

## Rules
- Cream stays dominant — ONE dark section per page (index/ethos may have it as the standout moment).
- Do NOT break existing layout, grid, choreography (`data-v-choreo-*`), or the existing HeroGarden/GrowingGarden heroes.
- React ink components need a client directive in Astro: use `client:visible` (cheap) for accents.
- Every dark section: verify text contrast; every animation: reduced-motion safe (components handle it).
- Per page: `npm run build` green. Keep it tasteful — restraint beats clutter. This is a studio site, AAA floor.
