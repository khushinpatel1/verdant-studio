# 013 — Garden page round-table fixes

Status: PENDING — Haiku-executable in one pass. Opus reviewed live (preview @ localhost:4321).

Scope: the `/verdant/garden/` page + two cross-cutting bugs (FAQ hydration, bleed mask).
All findings reproduced in the local dev preview, not guessed.

---

## Findings (peer review)

1. **Middle garden images are bare full-bleed rectangles.** The 3 `FeatureRow`s render
   `garden-home/money/plan.webp` at 532×1151px as crisp rectangles with no device frame
   (`product={true}` → `.v-product-shot` → `mask:none`). They dwarf the hero phone and the
   GardenTour phone, and they duplicate the exact screens the GardenTour already cycles
   (Home→Money→Plan→Grove). Hero (GardenLive) and the tour are framed phones; the middle three
   are not. → Frame them in a phone bezel, smaller.

2. **FAQ accordion is dead — clicks do nothing (CONFIRMED).** `FAQAccordion` is a React island
   (`client:visible`) whose items carry `data-v-reveal`. The global IntersectionObserver in
   `Verdant.astro` mutates `className` (adds `.in`) on those same nodes *before/around* React
   hydration → hydration mismatch (console: "tree hydrated but some attributes… didn't match…
   won't be patched up"). The island never finishes hydrating (`astro-island` keeps its `ssr`
   attr; `.click()` never toggles state). Same `data-v-reveal`-inside-island pattern is on
   `Footer.tsx` (also throws the mismatch). Root cause = a non-React system writing DOM that
   React owns.

3. **Bleed mask reads as a circular vignette.** `.v-bleed` uses
   `radial-gradient(ellipse 60% 62% …)` — the feather lands deep inside the box, giving art a
   round "porthole" feel instead of just softening the hard rectangle edge. The garden-screenshot
   variant (`[src*="/verdant/garden/"]`, 76% ellipse) is the same problem. Garden screenshots
   should have **no** bleed at all; botanical art should only lose its hard edge, not become a circle.

4. **Sparse pages.** `studio` (Hero + one list + CTA), `roadmap` (Hero + flat timeline + CTA),
   `faq` (Hero + accordion + CTA) are single-column with large empty right-hand gutters and no
   supporting visual. They have unused botanical ink components (`ink/Enso, Koi, Bamboo,
   BlossomBranch, MountainRidge, Moon, MistLayer, PetalFall`) perfect for filling negative space.

5. **Minor:** GardenTour `.webp` screens are flagged PLACEHOLDER in code (real shots pending —
   leave). Hero CTA secondary "Security" duplicates the in-page "Built on the privacy spectrum"
   link target — fine, leave.

---

## Haiku steps (do all; verify command after each)

### Step A — Phone-frame the middle garden images
File: `src/components/verdant/kit/FeatureRow.astro`

1. Add a `phone?: boolean` prop (default false) to the `Props` interface + destructure.
2. When `phone` is true, wrap the `<img>/<video>` in a bezel:
   ```astro
   <div class="v-feature-row__media">
     {product && phone ? (
       <div class="v-phone-frame">
         <div class="v-phone-frame__screen">
           <img src={mediaSrc} alt="" class="v-feature-row__image v-product-shot" loading="lazy" decoding="async" />
         </div>
       </div>
     ) : ( …existing img/video branch unchanged… )}
   </div>
   ```
3. Add to the component `<style>` (values lifted from GardenTour `.vgt-frame-bezel`):
   ```css
   .v-phone-frame {
     --rad: 42px; --pad: 10px;
     position: relative;
     width: clamp(220px, 60%, 300px);
     aspect-ratio: 400 / 812;
     margin: 0 auto;
     border-radius: var(--rad);
     padding: var(--pad);
     background: linear-gradient(160deg, #f0f2ed 0%, #e8ebe6 46%, #dfe4d7 100%);
     box-shadow: 0 40px 90px -24px rgba(13,31,7,0.18), 0 0 0 1px rgba(47,125,79,0.08),
                 0 2px 0 rgba(255,255,255,0.6) inset, 0 -2px 8px rgba(0,0,0,0.06) inset;
   }
   .v-phone-frame::after {
     content:""; position:absolute; top:14px; left:50%; transform:translateX(-50%);
     width:38%; height:7px; border-radius:5px; background:rgba(47,125,79,0.2); z-index:2;
   }
   .v-phone-frame__screen {
     position:relative; width:100%; height:100%; overflow:hidden;
     border-radius: calc(var(--rad) - var(--pad)); background: var(--paper);
   }
   .v-phone-frame__screen .v-feature-row__image {
     width:100%; height:100%; object-fit:cover; object-position:50% 0; border-radius:0;
   }
   ```
File: `src/pages/verdant/garden.astro` — add `phone={true}` to all 3 `<FeatureRow … product={true}>`.

Verify: `npm run dev` → open `/verdant/garden/`, the 3 middle shots are now small framed phones
matching the hero/tour, no giant rectangles.

### Step B — Fix the FAQ (and Footer) hydration / dead-click bug
Root cause: `data-v-reveal` lives on nodes React owns; the global observer mutates them.
Remove the conflict — let these islands reveal via CSS that doesn't depend on the external observer.

1. `src/components/verdant/FAQAccordion.tsx` line ~63: remove `data-v-reveal` from the item `<div>`
   (keep the `style={{"--d"…}}`). The items are visible by default (no opacity:0 trap) and now
   hydrate cleanly.
2. `src/components/verdant/Footer.tsx` line ~10: remove `data-v-reveal` from the `<footer>`.
3. (Defensive, optional but preferred) In `src/layouts/Verdant.astro` `arm()`, skip island-internal
   nodes so this class of bug can't recur:
   change `querySelectorAll("[data-v-reveal]")` →
   `querySelectorAll("[data-v-reveal]:not(astro-island [data-v-reveal])")`.

Verify: `/verdant/faq/` → click any question → answer expands (item gets `is-open`, panel
un-hides). Console shows no "hydration mismatch" error. Footer still appears.

### Step C — De-circularize the bleed; zero bleed on garden screenshots
File: `src/styles/verdant.css`

1. `.v-bleed` (~line 169): replace the tight ellipse with an edge-only feather so art keeps its
   shape and only the hard rectangle edge dissolves:
   ```css
   -webkit-mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, #000 86%, transparent 100%);
           mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, #000 86%, transparent 100%);
   ```
2. Garden-screenshot variant (~line 183-188): make it **no mask, no blend** (crisp), since framed
   shots don't need a feather:
   ```css
   [data-skin="verdant"] img.v-bleed[src*="/verdant/garden/"],
   [data-skin="verdant"] video.v-bleed[src*="/verdant/garden/"] {
     mix-blend-mode: normal;
     -webkit-mask-image: none; mask-image: none;
   }
   ```
3. `.v-bleed--icon` (~line 205) and `.v-img-soft` (~line 214): same circular-porthole issue —
   bump the solid stop to `86%`/`#000 86%, transparent 100%` (icon: keep `circle`, art keeps shape).

Verify: any page using `.v-bleed` botanical art (e.g. `/verdant/`, `/verdant/ethos/`) — edges
fade softly with no round vignette; no garden screenshot anywhere shows a mask.

### Step D — Fill sparse pages (taste-light, structural only)
Goal: kill the empty right gutter + vertical dead space without inventing copy. Use existing data
+ existing ink components. Keep it restrained (verdant-design skill discipline — no slop).

1. `src/pages/verdant/studio.astro`: after the `studio.lines` list, add a 2-up `Band`/`Card`
   row OR a faint botanical ink (`<Enso/>` or `<BlossomBranch/>`) absolutely-positioned in the
   hero's empty right column. Minimum: place one ink component as a watermark in the hero.
2. `src/pages/verdant/roadmap.astro`: the flat timeline is a thin single column — add a left
   status-legend aside (Shipped / Live beta / In progress meaning) and an ink accent
   (`<MountainRidge/>` low-opacity) behind the timeline header.
3. `src/pages/verdant/faq.astro`: with the accordion now working, add a short left rail under the
   Hero — a 2–3 item "Most asked" quick-jump list or a single ink accent (`<MistLayer/>`).

Each: import the ink component from `../../components/verdant/ink`, render at low opacity
(`style="opacity:.12"` or an existing watermark class) so it reads as texture, not content.
Verify each page visually: the right gutter no longer reads as blank; nothing overlaps text.

---

## Commit
One commit per step, number-tagged: `fix: 013-A — garden middle shots framed`, etc.
Build green (`npm run build`) before the final push; confirm CI deploy green; report the SHA + live.
