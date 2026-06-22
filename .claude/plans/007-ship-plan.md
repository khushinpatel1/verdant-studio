# 007 — Verdant site ship plan (Haiku execution)

Status: DONE (Phases 1–7 executed + shipped live 2026-06-22; CI green, verdant 200)
Tier: Haiku — sequential, ONE session. Commit per phase, then STOP.

## CTA options for KP (pick at your leisure — swapping is a one-line change)
Three premium closers were built. **CTAClose1 is live as the default** on all main pages.
The other two are ready-to-swap (same props): edit each page's import + tag in `src/pages/verdant/*.astro`.
- **CTAClose1 — "Editorial closer" (SHIPPED).** Left-aligned headline, thin gold hairline rule,
  hairline `.v-cta` links. Quiet, confident, no blobs. The safe premium default.
- **CTAClose2 — "Split surface" (Linear/Vercel).** Copy left, crisp product slot right — pass
  `<GardenLive slot="media" />` on product pages; right column collapses on trust/studio pages.
  Best for the Garden product page.
- **CTAClose3 — "Manifesto" (Apple/Anthropic).** One oversized centered display line + a single
  hairline link. No sub-copy, no card. Best for trust/studio/ethos pages where nothing should compete.
Recommendation: keep CTAClose1 sitewide; swap CTAClose2 onto `/verdant/garden`, CTAClose3 onto
`/verdant/ethos` + `/verdant/studio`. Your call — all three are live-ready.

Owner: KP · authored by Opus 4.8 session 2026-06-22
Input: `006-site-deficiency-audit.md` (Codex audit — read it first; every step cites its evidence)

## Goal
Take verdant-studio from "looks like faded AI-slop" to genuinely shippable + premium with a
small number of high-leverage changes. Ship-first: do every SAFE MECHANICAL phase below now.
The TASTE-CALL items (Phase 7) are gated on KP — do NOT invent them.

## Standing constraints
- Verify each phase before committing: `npm run build` exits 0 AND `npx astro check` = 0 errors.
- No invented copy, dates, or terms. Where the audit says "verified data only," use only
  `src/data/verdant.ts`. If a date/term isn't in source → leave a `{{KP}}` placeholder + note it.
- Aesthetic stays sumi-e/botanical, but product proof (Garden UI) must read CRISP — never paper-blended.
- If a step fails twice or disk diverges from this plan → STOP, write `BLOCKED: <step> — <reason>`,
  continue to the next INDEPENDENT phase. Do not improvise structural redesigns.
- Commit message format: `fix: 007-phaseN — <what>` (post-commit hook syncs this header).

---

## PHASE 1 — un-fade product screenshots at the source (THE #1 visual fix)
Audit §1. App screenshots are run through `.v-bleed` (paper treatment). Give product media its
own crisp path.

1. In `src/styles/verdant.css` add a product-shot class near the `.v-bleed` block (~line 168):
   ```css
   .v-product-shot, .v-product-shot img, .v-product-shot video {
     mix-blend-mode: normal !important;
     filter: none !important;
     mask-image: none !important;
     -webkit-mask-image: none !important;
     opacity: 1 !important;
   }
   ```
2. `src/components/verdant/kit/Hero.astro` (~line 58-73) and `FeatureRow.astro` (~line 34-47):
   add an optional `product?: boolean` prop; when true, add `v-product-shot` to the media wrapper
   class alongside (or instead of) `v-bleed`.
3. Mark app-screenshot placements `product`:
   - `src/pages/verdant/index.astro:17` (Hero media `garden-home.webp`)
   - `src/pages/verdant/garden.astro` the three `FeatureRow` screenshots (lines ~32-54)
4. `src/components/verdant/GardenTour.tsx` (~line 355-370): remove the `mask-image`/radial fade on
   the *active* screenshot; keep only the cross-fade `opacity` transition between screens.

**Verify:** `npm run build`. Then `npm run preview` and confirm via DOM/inspect that the Garden
screenshot containers compute `mix-blend-mode: normal`, `filter: none`, `mask-image: none`.
**Commit:** `fix: 007-phase1 — product screenshots render crisp (own media path, not paper .v-bleed)`

## PHASE 2 — kill the footer "green ink blobs"
Audit §3. The blobs are the global pigment-bloom pseudo-element on `.v-footer`.

1. `src/styles/verdant.css:291-310`: remove `.v-footer` from the radial-gradient pigment selector
   (keep `.vh-band/.ve-band/.vg-band` if those are intentional section art — only drop `.v-footer`).
2. Confirm `src/components/verdant/Footer.tsx:62-68` local gradient is also quietened — footer
   should be cream/paper with a thin top rule, no radial green bloom.

**Verify:** build; preview every main page bottom — no green radial field behind the footer.
**Commit:** `fix: 007-phase2 — remove footer pigment blooms (quiet cream footer)`

## PHASE 3 — fix Studio truth mismatch (copy contradicts source data)
Audit §2 Studio. `src/data/verdant.ts:166-179` says studio-of-one, `team` is empty, but the page
renders an empty team grid + a hiring CTA.

1. `src/pages/verdant/studio.astro`: remove the empty `team.map` grid (lines ~35-43) and the
   "always looking for great people" hiring CTA (~45-49).
2. Replace with a single founder/studio-of-one editorial block using existing copy in
   `src/data/verdant.ts` (studio.who / lead / lines). No invented bios.

**Verify:** build + astro check; preview `/verdant/studio` — no empty grid, no hiring CTA.
**Commit:** `fix: 007-phase3 — studio page tells the true studio-of-one story`

## PHASE 4 — Security: promote the spectrum + fix the broken anchor
Audit §2 Security + §5. `Footer.tsx:39` links `/verdant/security#data` but no `id="data"` exists;
`PrivacySpectrum` (the strongest content) sits below generic cards.

1. `src/pages/verdant/security.astro`: add `id="data"` to the `PrivacySpectrum` wrapper (~line 36).
2. Move `PrivacySpectrum` above the three generic guarantee cards (~22-26).
3. Do NOT claim a formal audit exists — keep "architecture notes / privacy spectrum" language.

**Verify:** build; preview `/verdant/security#data` scrolls to the spectrum.
**Commit:** `fix: 007-phase4 — security: spectrum first + working #data anchor`

## PHASE 5 — Roadmap: replace three one-card grids with a real status artifact
Audit §2 Roadmap. Three single-card `CardGrid`s read as empty scaffolding.

1. `src/pages/verdant/roadmap.astro`: replace the three one-card grids with one timeline/table:
   columns/rows for Shipped · Live beta · Testing · Next · Later.
2. Use ONLY statuses/dates present in `src/data/verdant.ts:189-198`. Missing date → omit it; never invent.

**Verify:** build + astro check; preview `/verdant/roadmap` reads as a real roadmap.
**Commit:** `fix: 007-phase5 — roadmap is a status timeline, not empty card shells`

## PHASE 6 — responsive safety: footer mobile + grid breakpoints
Audit §5.

1. `src/components/verdant/Footer.tsx`: add a mobile `@media` — `.v-footer-cols` wraps/stacks,
   reduce gaps, legal row stacks.
2. `src/components/verdant/kit/CardGrid.astro` + `Steps.astro`: keep `auto-fit` longer; raise the
   forced multi-column `min-width` from 768px so cards don't cram on tablets.

**Verify:** build; `preview_resize` to 390px and 768px — footer + grids don't overflow/cram.
**Commit:** `fix: 007-phase6 — responsive: footer mobile stack + later grid breakpoints`

---

## PHASE 7 — TASTE-CALLS (do NOT execute without KP sign-off; listed for the decision)
These are the high-impact direction calls. Surface, don't decide:
- **A. Home + Garden hero composition** — mount crisp Garden proof first. Options: `GardenLive`
  (DOM phone, already built, unused) / static phone-framed screenshots / short product video.
  Files: `index.astro`, `garden.astro`, `GardenLive.astro`.
- **B. Bottom CTA grammar** — replace `CTABand`'s slab buttons + centered stack with a quiet
  editorial closer (left headline, hairline `.v-cta`, product phone only on product pages).
- **C. De-slop the core sales sections** — convert remaining three-card/three-bullet blocks
  (garden "Built on", beta steps, pricing, ethos "Three Laws") into editorial/proof layouts.
- **D. Beta + Pricing public promise terms** — "lifetime free beta" / "won't be much" must not
  ship without exact terms. KP/legal call (already flagged in `beta.astro:12`).

## Done = all true
- [ ] Phases 1–6 each: built green, astro check 0 errors, committed with 007-phaseN tag
- [ ] No invented copy/dates/terms; `{{KP}}` placeholders where source lacked data
- [ ] Final: clean summary or `BLOCKED:` lines; Phase 7 taste-calls surfaced to KP, not executed
```
