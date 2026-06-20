# 010 — V1 visuals on V2 architecture (the un-baiting)

Status: PENDING
Owner: Haiku sessions (execute, one per phase), KP (taste calls + live review)
Base branch: `main` (v2). Reference branch: `v1`. Asset source: `~/Dev/assets`.

## The decision (KP, 2026-06-19)
Keep ALL of v2's structure — every page, the 12-col grid, and the genuinely cool
interaction features (ScrollPillars pinned-crossfade = Anthropic's design-page move,
GardenTour, PrivacySpectrum, FAQAccordion, choreographedReveal). **Strip the entire
v2 visual layer** (palette, cropping, the canvas/SVG aesthetic, the temp logo) and
make v2 *literally look like v1* as the starting point. Then KP picks it apart.
Wire in new generated placeholder assets. Modernize anything stale (it's June 2026 —
this should read like Anthropic just launched it).

## Ground truth established (verified on disk)
- v1 and v2 share the SAME stack + layout foundation (Astro 5.7, React 19, GSAP,
  Lenis, IntersectionObserver reveal, parallax print-field math, view transitions).
  The only real v2 wins: the 12-col `.vh-sec` grid + the extra pages + feature islands.
- Fonts are IDENTICAL on both branches (Instrument Serif / Young Serif / Schibsted
  Grotesk / Fragment Mono). "v2 fonts terrible" = v2 SIZING/cropping, not the typefaces.
- The real visual delta is the PALETTE:
  - v1: deep forest (`--forest-900 #0d1f07`, `--green #2d5016`) + warm cream
    (`--cream #faf6ec`) + gold/terra/clay earth tones. Moody, layered, painted bands.
  - v2: bright near-white paper (`--paper #fcfdf9`) + thin living-greens (`--leaf
    #2f7d4f`), no forest mass, no earth tones, gradient washes. Flat, airy, generic.
- v2 home references ZERO painted art; v1 uses the Koson prints across 6 pages.
  All painted assets still exist on `main` in `public/verdant/art/`.
- `VerdantMark` was committed as "temp V glyph" (06df5af) — a placeholder that shipped.

## New asset library — `~/Dev/assets` (placeholders to wire in)
- **Hero landscape**: `lucid-origin_..._Hero_landscape...` (jpg ×2) +
  `specs__..._hero-_landscape...` series (png ×4 + mp4 ×2). → hero backgrounds / loops.
- **Square sculptural-clay icons** (single subject, off-white, clean cut):
  `lucid-origin_..._Icons_square_1_1_1024px...` (jpg ×3) + `hailuo-2_3_sculptural_clay
  _art_..._Icons_square...mp4`. → ScrollPillars pillar icons + feature icons.
- **Topic cards**: `same_spec_and_style_the_topics_have_changed...` (png ×3). → section
  illustrations on content pages (faq/ethos/security topics).
- Ignore the installers (Comfy/Blender .dmg). Dedupe the extension-less copies.

---

## PHASES (each = one Haiku session pointed at this doc; commit per phase)

### Phase 0 — Asset prep (`feat: 010-p0 — assets`)
1. Create `public/verdant/media/` (or reuse `art/`). Curate + rename the `~/Dev/assets`
   placeholders to slot-named files: `hero-landscape.{jpg,mp4}`, `pillar-{1..4}.jpg`,
   `topic-{slug}.jpg`. Convert stills to WebP (keep jpg fallback), keep mp4 as-is +
   generate a poster frame.
2. Restore any v1 art missing on main: `git show v1:public/verdant/art/hero-grasses-sun.jpg`
   etc. — pull v1's full `public/verdant/art/` so every v1 composition has its source.
3. Output: a short `MEDIA-MAP.md` mapping each asset → the page/slot it fills.
- Verify: `ls public/verdant/media` + all files <~400KB after WebP; mp4 has poster.

### Phase 1 — Palette swap = the keystone (`feat: 010-p1 — v1 palette`)
Single highest-leverage change. In `src/styles/verdant.css` `[data-skin="verdant"]`:
replace the v2 bright token block with v1's palette verbatim (forest-900/forest/green/
green-600/moss/sage scale, cream/parchment/moon paper, amber/gold/terra/clay earth,
--ink #10180c, --muted #5d6f4c, --radius 3px). DELETE the "v1→v2 token aliases" block
(it points old names at bright values). Keep the font-face + type-scale section.
- This flips the whole site to v1 warmth at the token level without touching markup.
- Verify (preview): every route re-renders moody/warm; no band or CTA reads wrong-color.
  Nudge individual shades only if a section inverts.

### Phase 2 — Logo + de-slop (`feat: 010-p2 — logo + kill generative`)
1. Restore v1 `Logo` (leaf mark) everywhere `VerdantMark` is used (Nav, Footer, hero
   marks); delete `VerdantMark.tsx`. Regenerate favicons from the leaf mark.
2. Hero: remove `GrowingGarden` canvas; replace with v1's painted print-field hero
   (`hero-reed-lake.jpg` / restored `hero-grasses-sun.jpg`) OR the new hero-landscape
   asset — KP's call at review. Same masked parallax `--pf-*` treatment as v1.
3. ink/ SVG system: demote to accents ONLY (per visual-asset-strategy) or remove from
   primary slots. They must never again replace painted/photographic art.
- Verify: no canvas/temp-glyph anywhere; logo is the leaf; hero reads like v1.

### Phase 3 — Per-page reskin, keep structure (`feat: 010-p3a..` per page)
For each v2 page — home, garden, pricing, security, ethos, studio, team(+[slug]),
beta, faq, notes, emerald, 404 — keep the v2 layout/grid/copy, re-express visuals in
v1's vocabulary: painted-art print fields, v1 cropping/masks, warm forest bands
(restore the dark `--forest-900→green-600` band gradient + `vh-band-edge` clip),
v1 type sizing. Wire new assets per MEDIA-MAP.
- **ScrollPillars**: KEEP the pinned-crossfade interaction. Swap the 4 ink icons for the
  sculptural-clay square assets (still/loop). This is the Anthropic-move kept, done right.
- Drop the numbered 00–05 gutter numerals (AI-tell) unless KP wants them.
- Verify each page in preview against the v1 branch render before commit.

### Phase 4 — June-2026 modernization audit (`chore: 010-p4 — modernize`)
1. `npm outdated`; check Astro latest (on 5.7 now) + bump deps; note any breaking.
2. Use `astro:assets` `<Image>`/`<Picture>` for art (responsive srcset, AVIF/WebP)
   instead of raw `<img>`; lazy + width/height to kill CLS.
3. Hero/section video: proper `<video>` with poster, `muted playsinline loop`,
   `preload=metadata`, reduced-motion fallback to the still.
4. Confirm native View Transitions usage is current (`<ClientRouter>`); a11y pass
   (contrast on the new dark bands, focus states, alt text); Lighthouse/perf check
   (the web-perf skill). Goal: reads like a fresh Anthropic launch, scores green.
- Verify: build green, Lighthouse ≥ (set target at review), no a11y regressions.

## Sequencing
P0 → P1 (keystone; biggest flip for least work) → P2 → P3 (parallelizable per-page) → P4.
Commit per phase; the post-commit hook syncs this header. KP reviews live after P1 and P3.

## Guardrails
- Never reintroduce generative canvas or SVG-as-primary-art. Painted/photographic only.
- Enumerate at the source: when a phase says "every page," touch all listed routes.
- KP tests on the LIVE site — ship when build+deploy green, report SHA, don't paste PNGs.
