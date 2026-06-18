# 009 — Verdant site visual overhaul (layout bugs + asset/visual deficit + type)

**Status:** SHIPPED (overnight 2026-06-17, main, CF Pages auto-builds). KP decisions locked:
**Hybrid** look, **both** asset routes, execute everything. DONE: B1+B2 bugs (fe75f4f); ink kit +
3 painted webp assets + per-page density across all pages (903d408); type specimen for review
(5d7762c). Phase 2 type swap = KP's call after seeing /verdant/type-specimen. Phase 3 motion =
lightly covered (new sections animate via existing choreography; pointer-reactivity extension still open).
Asset route note: Canva/Figma MCPs are template/design generators, NOT illustration engines — no
real txt2img tool available, so painted PNG crops + procedural SVG carried the visuals. LLM-authored
bespoke SVG art tops out at "decent accent," not "commissioned" — the painted packs are the quality source.
See EXECUTION block at bottom.
**Tier:** Plan = this doc (Opus). Execution = Haiku per phase, Sonnet only on a stalled step.
**Source:** KP, 2026-06-17, with screenshots. Two confirmed bugs + a broad "it's bare and reads as
AI-made" critique. His words: text slammed to the far left and clipped; fonts disappearing into the
color blobs; most pages are plain cream with no assets/visuals/animations; he *likes* the growing
leaves next to the images and wants much more of that energy across every page.

## Confirmed bugs (fix FIRST — these are defects, not taste)

**B1 — Headline clipped at the left edge.** A display headline (the "…once." line on a product
page, `.v-display`/`.vh-hero-head` family) overflows past the viewport's left edge and gets cut.
Almost certainly horizontal overflow or a negative offset / `translateX` on the heading in
`src/styles/verdant.css` (the `vh-*` classes) or `HeroGarden.tsx`. Diagnose in the live DOM
(preview) — find which element's box extends `x < 0` — then fix the offending margin/transform/
`white-space`. Add `overflow-x: clip` on the section as a guard only after the real cause is found,
not as the fix.

**B2 — Footer text over the green blobs, low contrast.** `Footer.tsx` renders the "An independent
software studio…" line and the PAGES/STUDIO columns over soft green gradient blobs; text contrast
drops below legible. Fix at the source: either a scrim/overlay behind the footer text, a darker text
token, or constrain the blobs away from the text column. Verify with `preview_inspect` computed
color contrast, not by eye.

## The real work — three phases, KP picks scope per phase

### Phase 1 — Asset / visual density (the "bare cream" problem)
The complaint that matters most: pages are empty cream with nothing happening. The site already has
the right organic primitives — `InkGrowth.tsx`, `VineBorder.tsx`, `GrowingGarden.tsx`, the
leaf-beside-image motif KP likes. The deficit is they're used on the landing and nowhere else.

- **Inventory every page** and score its current visual content: `index`, `verdant/{index, garden,
  security, ethos, emerald, team, team/[slug]}`, `privacy`, `404`. Output a table: page → what's
  there now → what it needs.
- **Define a per-page treatment** so no page is naked cream: each gets at least one of — a
  growing/ink motif, a product visual, a section-marker numeral (the `vh-num` 00/01/02 system
  already exists), a vine border, or an illustrative asset.
- **Expand the leaf-beside-image motif** KP called out as the one thing he likes — make it a
  reusable, repeated signature, not a one-off on the hero.
- Asset sourcing is a KP direction-call: commissioned/illustrated botanical assets vs
  procedural/SVG-generated vs the Canva/Figma MCP pipelines available in this session. Surface the
  options; don't pick for him.

### Phase 2 — Typography (taste-call, KP owns it)
Current stack is NOT the cheap AI tell (it's Instrument Serif / Young Serif / Schibsted Grotesk /
Fragment Mono — already distinctive families). So "mediocre fonts" is most likely the **pairing,
sizing, or rhythm**, not the families. Before swapping anything: build a one-page type specimen
showing the current pairing at real sizes so KP can judge what actually reads as generic. Then he
decides keep / re-pair / replace. Do not swap fonts on a hunch — that's his eye, not mine.
(Reference: [[fonts-are-an-ai-tell]] — the tell is real, but verify it applies here before acting.)

### Phase 3 — Motion / animation
Pages beyond the landing have little to no motion. The choreography system exists
(`data-v-choreograph`, `data-v-choreo-scale/slide`, `TextReveal.tsx`). Extend it page-by-page:
section reveals, the ink/vine growth on scroll, the hero garden's pointer-reactivity as a pattern
other pages can borrow. Respect `prefers-reduced-motion` everywhere.

## Order of operations
B1 + B2 first (they're embarrassing and cheap). Then Phase 1 (biggest perceived-quality win per
hour). Phase 2 and 3 are KP-gated — he steers whether type or motion comes next.

## Definition of done
Per the studio floor ([[aaa-baseline-stamp]]): no page is bare cream; the organic motif recurs as a
signature; every "fixed" claim verified in the live DOM/preview, not by screenshot. Ship per phase
(build green → push → confirm deploy → report SHA). Live = the verdant Cloudflare deploy.

## Open direction-calls for KP
1. Phase order after the two bug fixes (assets vs type vs motion first?).
2. Asset sourcing route (illustrated / procedural / Canva-Figma pipeline).
3. Whether the type pairing is actually wrong, after seeing the specimen.

---

## EXECUTION (overnight 2026-06-17) — locked plan, delegated to executors

**Art direction (the "less anime, more brush strokes" mandate).** Sumi-e / ink-wash, NOT flat vector
icons and NOT anime-render: tapered *filled* strokes (variable width, not uniform stroke), layered
opacity washes, deliberate asymmetry and negative space, one gold accent. Reference quality bar +
code pattern = existing `InkGrowth.tsx`. Every piece animates (draw-on / drift) and honours
`prefers-reduced-motion`. Source inspiration = the two moonlit garden packages in `~/Dev/assests`.

**Hybrid theming.** Cream stays the base skin. Add a dark **moonlit** section variant
(`.v-night` — deep ink-navy bg + moonlight gold + muted sage; new dark tokens in `verdant.css`) used
for 1–2 feature moments per page. Painted PNG crops back the richest dark full-bleed moments; SVG
art kit is the recurring lightweight signature everywhere else.

### A1 — Bugs (ship first) [Haiku]
B1 clipped headline + B2 footer contrast, fixed at source per the diagnosis above. Verify in live DOM.

### A2 — Asset pipeline
- **A2a slice** [Haiku/bash]: cut the large isolatable paintings from the 1536×1024 sheets (moonlit
  landscape, foreground garden strip, atmospheric variations) → `/public/verdant/ink/*.png` for dark
  section backgrounds; small decor (enso, dragon-swirl, bonsai, torii, lanterns, animal roundels) as
  accents. Small crops upscaled only where acceptable; SVG preferred for anything that must be crisp.
- **A2b SVG art kit** [Sonnet]: new `src/components/verdant/ink/` family — `Moon`, `BlossomBranch`,
  `Bamboo`, `Koi`, `Crane`, `Enso`, `StoneLantern`, `MistLayer`, `MountainRidge`, `PetalFall`,
  `FireflyField`. Brush-stroke per the art direction. The recurring signature.
- **A2c Canva/Figma regen** [Opus/MCP]: generate extra high-res brush-stroke botanical assets. Bonus.

### A3 — Page density [Haiku, one css owner + per-page]
No page stays bare cream. Per-page treatment using the kit + a dark moonlit feature moment + the
leaf-beside-image signature expanded site-wide: ethos, security, team, garden, privacy, 404, index polish.

### A4 — Motion [Haiku]  Extend `data-v-choreo-*` to the newly populated sections; scroll-driven ink/vine growth.
### A5 — Type specimen [Haiku]  Build a one-page specimen of the current pairing at real sizes for KP's keep/re-pair/replace call. Do NOT swap fonts.

**Done per phase:** `astro build` green → commit → push (CF Pages auto-builds). Visual verify in
main-session preview. Report SHAs.

