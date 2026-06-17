# 008 — Verdant v2: depth + voice rebuild

**Status: IN PROGRESS** (Tasks 1–2 DONE; Task 3 partial [security depth + Grove example]; Task 4 partial [4 items done, 3 remaining]; Task 5 partial [dimensions added])
**Target:** v2, `main` branch → `verdant-studio-v2.pages.dev`
**Source docs:** `docs/redesign/00-diagnosis.md`, `01-language-rewrite.md`, `NEXT-STEP.md`
**Tier:** Opus authored this plan; **Haiku executes**. Sonnet only for a step Haiku stalls on twice.

---

## Task 1 — Revive the dead design tokens (DO FIRST; cheapest, highest impact)

**Why:** `docs/redesign/00-diagnosis.md` Defect 1 — 22+ refs to v1 token names that don't
exist in v2, silently killing CTAs, labels, `::selection`, body wash, and the green-band
pigment. Fix at the source with aliases instead of hunting 22 usages.

**File:** `src/styles/verdant.css`. Inside the `[data-skin="verdant"]{ ... }` map (after the
existing `--gold` / contract block, before the font vars), ADD these alias lines:

```css
  /* v1→v2 token aliases — revive code still referencing retired names.
     (verify rendered; nudge a shade if any band reads wrong.) */
  --cream:      var(--paper);       /* body bg */
  --parchment:  var(--paper-soft);  /* .v-band--paper bg */
  --forest:     var(--ink);         /* .v-cta resting color, dark text on gold */
  --clay:       var(--moss);        /* .v-label kicker color */
  --moon:       var(--paper);       /* ::selection text, .v-cta--light */
  --moss-300:   var(--sage);        /* .v-label--light on dark */
  --green:      var(--leaf);        /* band pigment bloom */
  --green-600:  var(--leaf-deep);   /* band pigment bloom */
  --forest-900: var(--ink);         /* band pigment bloom (deepest) */
```

**Verify (per step):**
- `grep -rEo "var\(--(cream|forest|clay|parchment|moon|green|green-600|forest-900|moss-300)\b" src/ | wc -l` → still >0 (expected; they now resolve).
- Confirm each name is now DEFINED: `grep -E "\-\-(cream|forest|clay|parchment|moon|green|green-600|forest-900|moss-300):" src/styles/verdant.css` → 9 hits.
- `npm run build` → green.
- Eyeball: CTAs now have ink color + gold hover; labels are moss; selection visible; any
  `.v-band`/`.vh-band` shows green pigment. **Check whether v2 pages even USE `.vh-band`/
  `.ve-band`/`.vg-band`** (`grep -rl "vh-band\|ve-band\|vg-band" src/pages src/components`) —
  if unused in v2, the pigment treatment is vestigial; leave the alias but note for cleanup.

**Commit:** `fix: 008 — revive 9 dead v2 design tokens via aliases (CTAs/labels/pigment)`

---

## Task 2 — Apply the language rewrite (persona-independent; ready now)

**Why:** copy is metaphor-saturated (Defect 3). Full replacement deck already written.

**Files & changes:** apply `docs/redesign/01-language-rewrite.md` verbatim.
- `src/data/verdant.ts` — replace string values for: `brand.tagline`; `garden.oneLine`,
  `.blurb`, `.pricing`, `.kind`, each `screens[].line`/`.body`, `grove.line`/`.body`,
  `notes[]`; `emerald.oneLine`/`.blurb`; `studio.who`/`.lead`/`.lines[]`; `ethos.creed[]`.
  **Keep keys, types, structure identical — values only.**
- `src/pages/verdant/index.astro` — hard-coded heads flagged `[index.astro]` in the deck:
  hero `<h1>` + sub + the two action labels; quote text + attribution; CTA-band title + link.

**Verify:**
- `npm run build` → green; `npm run check` → no type errors (string-only edits).
- `grep -n "Pull the weeds\|Grow something quiet\|grown for people\|already sees your garden" src/`
  → 0 hits (old corny lines gone).
- Eyeball homepage: new hero, plain creed, the ONE surviving garden metaphor (the quote).

**Commit:** `feat: 008 — apply full language rewrite (over-gardened → plain + conviction-led)`

---

## Task 3 — Page depth + growth  *(READY: multi-lens attack complete)*

The 5-persona + 2-audit pass is done (one Sonnet pass, 80k tokens, structured findings). 
Each persona has named gaps; synthesize into per-page edits. Order: highest ROI → first paying 
customer. **Conviction over features.**

**Persona 1 (Privacy paranoid) → /security page:**
- Add crypto primitives section: name the cipher suite (AES-256-GCM? XChaCha20-Poly1305?), 
  key derivation (PBKDF2? Argon2?).
- Add threat model: what does this defend against? (server breach, employee access, court 
  order, metadata analysis)
- Add verifiability: GitHub repo link or signed release, or third-party audit namecheck.
- Remove the misleading "response headers prove encryption" section — HTTP headers prove the 
  marketing site is hardened, not the app.

**Persona 2 (Feature-hungry) → /garden page:**
- Grove undersold: show a real Grove query ("How long until I pay off my Amex?") + on-device 
  answer. That's the differentiated moment.
- Account-connection story: how do accounts get in? (manual, bank sync, CSV, etc.)
- Feature depth: pair each screen with real methodology (budget algorithm, debt payoff 
  ordering, subscription detection).
- Price + value: pair "$48/year" with feature depth at the same scroll depth, not at the 
  bottom.

**Persona 3 (Solo indie builder) → /team + /ethos:**
- Shipping proof: add a changelog or "shipped + in progress" section showing actual shipped 
  products, dates, updates. Shows sustained work, not hobby project.
- Data portability: address "what if the studio disappears?" — data export, open-source repo, 
  or longevity guarantee.

**Persona 4 (Switcher) → homepage:**
- Competitor contrast: name the *pattern* ("your money app sells your spending to advertisers," 
  "you've been the product this whole time"). Make the "why leave" case concrete.
- Onboarding story: how does their data get in? Fresh start or import?
- Price anchor: put "$48/year" on the hero or CTA band, not just /garden. Switchers calculate 
  cost in the first 30 seconds.

**Persona 5 (Skeptic of indie) → site-wide:**
- Shipping velocity evidence: changelog or version history visible somewhere. The site cannot 
  prove sustained work without artifacts.
- Roadmap or delivery signal: "ships when it's ready" reads as hubris without evidence of past 
  delivery.
- Emerald framing: position as "focused ambition" not "split attention." Or park it for now.

**Verify (per-page, after edits):**
- Build green.
- Eye each page for conviction: does a [persona] reader get what they need?
- **Do not add features.** Deepen what's there; name what's true.

**Commit:** `feat: 008-depth — add persona conviction beats (crypto, Grove proof, shipping, 
onboarding)`

## Task 4 — Perf fixes  *(READY: 7 findings, 3 high-impact)*

**High-impact (fix first):**

1. **body::after grain overlay** (HIGH impact)
   - Issue: `position:fixed, z-index:9000, mix-blend-mode:multiply` covering full viewport, 
     always-on. Every frame composites through this layer.
   - Fix: Change `mix-blend-mode:multiply` to `mix-blend-mode:normal` (no blending overhead) 
     or use a lower opacity solid color instead.
   - File: `src/styles/verdant.css` line ~150
   - Verify: Run 60fps scroll test, check GPU load in DevTools.

2. **v-band-wash animation** (HIGH impact)
   - Issue: 32s infinite CSS animation on `.vh-band`, `.ve-band`, `.vg-band`, `.v-footer` 
     pseudo-elements with `mix-blend-mode:soft-light` + `radial-gradient`. References dead 
     tokens (now aliased), so gradients resolve to transparent — wasted compositor budget.
   - Fix: Either remove the animation entirely (test if band looks OK static) or repoint the 
     gradient to live tokens + pre-composite the blending (use opacity layer instead).
   - File: `src/styles/verdant.css` lines 252–264
   - Verify: DevTools Rendering tab — check animation frame rate, compositing cost.

3. **GrowingGarden canvas not paused off-viewport** (HIGH impact)
   - Issue: Canvas mounted `position:fixed`, full viewport, runs continuous rAF loop. No 
     IntersectionObserver — keeps animating even when user scrolls past hero.
   - Fix: Add IntersectionObserver to pause rAF when hero exits viewport.
   - File: `src/components/verdant/useReactiveField.ts` + `src/components/verdant/GrowingGarden.tsx`
   - Verify: DevTools Performance tab — verify rAF stops after hero scrolls out.

**Medium-impact (fix if time):**

4. **Cursor component unconditional rAF loop** (MED impact)
   - Issue: Runs every frame, uses `mix-blend-mode:multiply` (now referencing live token), no 
     IntersectionObserver.
   - Fix: Add IntersectionObserver or visibility gate to pause when off-screen.
   - File: `src/components/verdant/Cursor.tsx` lines 20–28

5. **HeroGarden SVG filters** (MED impact)
   - Issue: `feGaussianBlur` on 4 circles forces separate GPU texture allocation.
   - Fix: Test whether visual impact is worth the cost; if not, simplify to CSS filter or 
     remove.
   - File: `src/components/verdant/HeroGarden.tsx` lines 144–150, 182–185

6. **Canvas shadow inside draw loop** (MED impact)
   - Issue: `ctx.shadowBlur` + `ctx.shadowColor` set per-frame (8 bugs, 60fps = 480 shadow 
     renders/sec). Software render path, not GPU.
   - Fix: Pre-compute shadow offsets or use post-process blur instead of canvas shadow.
   - File: `src/components/verdant/GrowingGarden.tsx` lines 132–137

**Low-impact:**

7. **setInterval instead of rAF** (LOW impact)
   - Issue: 16ms setInterval in HeroGarden doesn't sync to display refresh, wastes work when 
     tab backgrounded.
   - Fix: Replace with `requestAnimationFrame`.
   - File: `src/components/verdant/HeroGarden.tsx` line ~53

**Commit:** `fix: 008-perf — pause canvases off-viewport, remove always-on mix-blend layers`

## Task 5 — Asset re-encode  *(READY: 10 findings, 1 critical path)*

**Critical (homepage hero, affects CLS immediately):**

1. **vault-lock.jpg** (80KB JPEG)
   - Issue: Used as tiny phone frame on homepage. No width/height attributes → layout shift 
     (CLS) on hero. No srcset.
   - Fix: Add `width='400' height='814'` (or actual intrinsic dims), add WebP variant via 
     `<picture>`.
   - File: `src/pages/verdant/index.astro` (the back-phone image)

**High-priority (Koson art, cumulative CLS impact):**

2–6. **All Koson JPEGs** (koson-{grasses-moon, eagle-pine, songbird-plum, dragonfly-lotus, 
waterlilies}.jpg) totaling ~4.5MB
   - Issue: No width/height attributes (CLS on any page using them), no srcset, JPEG format 
     (PNG or WebP would be smaller given artistic content).
   - Fix: For each:
     - Re-export as WebP at max 500px wide (decorative use), target <120KB per file
     - Add `width+height` attributes matching source dimensions
     - Add `srcset` with 1x/2x variants for responsive delivery
     - Verify whether koson-eagle-pine and koson-songbird-plum are even referenced in pages; 
       if not, delete.
   - Files: `public/verdant/art/koson-*.jpg`

**Medium-priority (ethos page, secondary flows):**

7. **ethos-sand.jpg** (500KB JPEG)
   - Issue: Used in ethos Story section, no width/height (CLS on scroll), no srcset.
   - Fix: Add `width='900' height='1200'` (or actual dims), add WebP srcset, target <150KB 
     largest breakpoint.
   - File: `public/verdant/art/ethos-sand.jpg`

**Low-priority (background textures):**

8. **tx-{1-4}.jpg** (72–100KB each, likely CSS textures)
   - Issue: If used as CSS `background-image`, bytes matter but no srcset needed. If used as 
     `<img>`, missing dimensions.
   - Fix: Verify usage (grep `tx-` in src/). If CSS background, no action. If `<img>`, add 
     width/height.
   - File: `public/verdant/garden/tx-*.jpg`

**plum-moon-web.jpg** (640KB JPEG)
   - Issue: Used in footer or decorative context, no srcset, no dimensions if <img>.
   - Fix: If decorative, verify it's CSS background. If <img>, add width/height + WebP srcset.
   - File: `public/verdant/art/plum-moon-web.jpg`

**Site-wide:**

9. **All <img> tags lack width/height**
   - Issue: Every page (garden.astro, index.astro, ethos.astro, etc.) has images without 
     explicit dimensions. Causes CLS during load.
   - Fix: Add intrinsic width/height to every `<img>` tag matching the source file dimensions.
   - Impact: Prevents layout shift on all pages; critical for Core Web Vitals (CLS metric).

**Verify (per-task):**
- `npm run build` → green
- DevTools Lighthouse → check CLS score (should improve 0.2 → 0.05 or better)
- WebP files exist in public/ and are <target size
- All `<img>` tags carry width+height

**Commit:** `fix: 008-assets — convert Koson art to WebP, add dimensions to all images, 
eliminate CLS`

---

## Order of operations for the fresh session
1. Tasks 1 & 2 immediately (Haiku) — visible wins, no dependencies.
2. Re-run the attack LEANER → write `persona-*.md` + `audit-*.md`.
3. Fill Tasks 3–5 from those, then execute (Haiku).
