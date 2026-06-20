# 011 — Verdant rebuild: V1 soul on Anthropic-grade bones

Status: DONE (phases P0-P5 complete, v3 live at verdant-studio-v3.pages.dev)
Owner: Haiku sessions (execute, one phase per session) · KP (taste calls + live review)
Supersedes the 010 approach (V2-base reskin) — that direction is abandoned.

## The decision (KP, 2026-06-19)
The 010 run reskinned the V2 structure into V1 colors. It's live on `main` and KP
hates it: V2's bones (sizing, cropping, generic grid) read wrong no matter the paint.
**Plan B inverts it.** Build a *fresh trunk* off the `v1` branch, cherry-pick V2's
extra pages + its 4 genuinely-good interaction islands onto V1's bones, and impose
**Anthropic / claude.com structural discipline** (pacing, card kit, scroll, video,
minimalism) on top — while keeping **V1's painterly soul** (cream paper, forest
greens, gold accent, Koson prints, dark painted bands).

KP's four answers (lock these):
1. **Look** — V1 painterly richness on Anthropic bones, with *a touch* of option-3
   cinematic (1–2 darker, video-forward dramatic moments per page max).
2. **Trunk** — fresh branch off `v1`, cherry-pick the best of both. Not `main`.
3. **Pages** — ALL V2 pages ship (16 routes, listed below).
4. **Video** — placeholder mp4s now (proper `<video>` structure + reduced-motion
   fallback), real footage swapped in later.

## Ground truth (verified on disk, 2026-06-19)
- `v1` and `main` share stack: Astro 5.7, React 19 islands, GSAP/ScrollTrigger, Lenis,
  IntersectionObserver reveal, View Transitions, self-hosted fonts (Instrument Serif /
  Young Serif / Schibsted Grotesk / Fragment Mono — identical on both branches).
- **V1 is NOT dark**: base bg is cream `#faf6ec`, forest-green type, gold accent, with
  *dark painted forest bands + Koson prints* for drama. Already Anthropic-compatible.
- **V1-only-missing pages** (pull from `main`, then reskin): `privacy`, `terms`,
  `verdant/{beta,faq,notes,pricing,studio,type-specimen}`.
- **V2-only components — keep the 4 islands, restyle to V1:** `ScrollPillars.tsx`
  (pinned-crossfade = Anthropic's design-page move), `GardenTour.tsx`,
  `PrivacySpectrum.tsx`, `FAQAccordion.tsx`. **Demote to accents only:** `ink/*` SVGs.
  **Drop from primary slots:** `GrowingGarden.tsx` + `HeroGarden.tsx` (generative
  canvas heroes KP killed) and their support (`drawGrowth.ts`, `useReactiveField.ts`)
  unless an island still imports them.
- **Media already curated** (on `main`, pull onto trunk): `public/verdant/media/`
  (`hero-landscape-{1,2}.{jpg,webp}`, `pillar-{1,2,3}.{jpg,webp}`, `pillar-loop.mp4`,
  `topic-{ethos,privacy,security}.{png,webp}`) + `public/verdant/MEDIA-MAP.md`.
  V1 painted art lives in `public/verdant/art/` on both branches.

## The Anthropic structural kit (extracted from anthropic.com, /product/cowork,
## /product/design — these three patterns recur on all three)
1. **Alternating feature rows** — stacked, media-left/right alternating, each with a
   *concrete* preview (folder tree, output, screenshot), not a vague graphic.
2. **Light card grids** — 2/3/5-col, card = icon + headline + one-liner, heavy negative
   space. Used for use-cases / values / pillars.
3. **Repeated centered CTA blocks** — top hero, mid-page, end. Same template reused.
4. **Tab-showcase with live preview** — cowork's "Power through tedious tasks": tabs
   swap a live prompt/output panel.
5. **Pinned-scroll / crossfade** — we already have ScrollPillars for this.
6. **Horizontal carousel w/ pagination** — testimonials / announcements.
7. **Accordion** — FAQ. We have FAQAccordion.
8. **3-step "how it works" flow.**
Pacing law: hero/whitespace → featured → dense card grid → breathe → CTA. At most ~3
type sizes per viewport. Whitespace over density everywhere except deliberate dark bands.

---

## PHASE 0 — Trunk + scaffold (`chore: 011-p0 — trunk off v1`)
Branch and assemble the raw materials. No design work yet; just get a buildable v3 that
looks like v1 with the extra pages present (ugly is fine pre-reskin).
1. `git checkout v1 && git checkout -b v3` (v1 is the trunk).
2. Pull V2-only pages from main (raw, will reskin in P2/P3):
   `git checkout main -- src/pages/privacy.astro src/pages/terms.astro
   src/pages/verdant/beta.astro src/pages/verdant/faq.astro src/pages/verdant/notes.astro
   src/pages/verdant/pricing.astro src/pages/verdant/studio.astro
   src/pages/verdant/type-specimen.astro`
3. Pull the 4 keeper islands + ink accents from main:
   `git checkout main -- src/components/verdant/ScrollPillars.tsx
   src/components/verdant/GardenTour.tsx src/components/verdant/PrivacySpectrum.tsx
   src/components/verdant/FAQAccordion.tsx src/components/verdant/ink`
4. Pull curated media + map:
   `git checkout main -- public/verdant/media public/verdant/MEDIA-MAP.md`
5. `npm install && npm run build`. Fix import breaks (pulled pages may reference V2-only
   components we didn't pull — stub or comment those sections; note each in a
   `P0-STUBS.md` so P3 knows what to rebuild). Do NOT pull GrowingGarden/HeroGarden.
- **Verify:** `npm run build` green; all 16 routes emit; `git log --oneline -1` shows v3.
  Routes: `/` (redirect), `/verdant`, `/verdant/{garden,emerald,ethos,security,team,
  studio,pricing,faq,beta,notes,type-specimen}`, `/verdant/team/[slug]`, `/privacy`,
  `/terms`, `/404`.

## PHASE 1 — The section kit (KEYSTONE) (`feat: 011-p1 — section kit`)
Build ~10 reusable section primitives in V1's vocabulary (V1 tokens, type, near-square
`--radius:3px`, painted-band grammar). Every page composes from these — this is what
makes the build tight and Haiku-safe. Put new components in `src/components/verdant/kit/`.
Each renders correct in isolation before moving on.
- `Hero.astro` — full-bleed centered stack: eyebrow + display headline + sub + dual CTA;
  optional `media` slot (painted print OR `<video poster muted playsinline loop
  preload=metadata>` with reduced-motion → still). Generous whitespace.
- `FeatureRow.astro` — split text/media, `align="left|right"` prop (alternates),
  `media` slot accepts painted art / video / island.
- `CardGrid.astro` — `cols={2|3|5}`, slot of cards; `Card.astro` = icon/headline/blurb/
  link, sage card bg, near-square radius.
- `CTABand.astro` — centered hero-style CTA block; reused top/mid/end.
- `Steps.astro` — 3-step horizontal/vertical process flow.
- `Band.astro` — the V1 **dark painted forest band** wrapper (`--forest-900→green-600`
  gradient + `vh-band-edge` clip). This carries the "touch of cinematic." Use sparingly.
- `Carousel.tsx` — horizontal scroll-snap, pagination dots, prev/next (testimonials /
  announcements). React island, touch-friendly.
- `TabShowcase.tsx` — tabbed live-preview panel (cowork pattern). React island.
- Restyle the 3 pulled islands to V1 tokens: `ScrollPillars` (swap ink icons → clay
  `pillar-*` assets), `PrivacySpectrum`, `FAQAccordion`, `GardenTour`.
- **Verify:** build green; spin a throwaway `/_kit` page rendering one of each; confirm
  V1 palette/type, near-square radius, touch works, reduced-motion respected. Delete
  `/_kit` before commit.

## PHASE 2 — Home + flagship (`feat: 011-p2 — home`)
Rebuild `src/pages/verdant/index.astro` purely from the kit. **Recipe (Anthropic pacing,
V1 skin):** `Hero` (hero-landscape video, dual CTA) → `CardGrid cols=3` (the three
product/ethos pillars) → `FeatureRow` ×3 alternating (garden / emerald / privacy, each
with concrete preview art) → `Band` cinematic moment (ScrollPillars pinned-crossfade,
clay pillars) → `Carousel` (notes/announcements) → `CTABand`. KP reviews live after this.
- **Verify:** build green; route renders the full sequence; deploy preview (P5 infra) and
  give KP the URL. Compare pacing against claude.com/product/cowork.

## PHASE 3 — All remaining pages (`feat: 011-p3-<page> — …`, one commit per page)
Compose each from the kit. Per-page recipe (keep V2 copy where it's good; rewrite cropping
/sizing to V1). One Haiku session may do several; commit per page.
- **garden** — Hero(video) → FeatureRow ×3 (features) → GardenTour island → CardGrid → CTABand
- **emerald** — Hero → FeatureRow ×2 → Band(cinematic) → CTABand
- **ethos** — Hero → prose/Steps → FeatureRow ×2 (topic art) → CTABand
- **security** — Hero → CardGrid cols=3 (guarantees) → PrivacySpectrum island → FAQ subset → CTABand
- **pricing** — Hero → pricing CardGrid → FAQAccordion → CTABand
- **faq** — Hero → FAQAccordion (full) → CTABand
- **studio** — Hero → FeatureRow ×2 → team CardGrid → CTABand
- **team** + **team/[slug]** — CardGrid(people) ; detail = Hero + prose
- **beta** — Hero → Steps (how to join) → CardGrid → CTABand
- **notes** — Hero → Carousel/list of notes → CTABand
- **type-specimen** — keep utilitarian; just V1 tokens (internal page, low polish)
- **privacy / terms** — legal layout, V1 type, single column, generous measure
- **404** — V1 minimal
- Resolve every entry in `P0-STUBS.md` here.
- **Verify per page:** build green; route renders; no stub left; spot-check vs v1 render.

## PHASE 4 — Cinematic + motion polish (`feat: 011-p4 — motion`)
- Hero videos: confirm `<video>` poster + `muted playsinline loop preload=metadata` +
  reduced-motion → still on every hero that uses one. Placeholders from `media/`.
- The "touch of cinematic": ≤2 `Band` dark-forest moments site-wide that matter most
  (home + one product page). Don't over-darken — KP wants option-1 dominant.
- Scroll choreography: GSAP/Lenis reveal on FeatureRows, pinned ScrollPillars smooth on
  touch + desktop. Respect reduced-motion globally.
- **Verify:** build green; reduced-motion path tested; no canvas/temp-glyph anywhere;
  60fps-feel scroll (no jank on the pinned section).

## PHASE 5 — Modernize, a11y, perf, deploy (`chore: 011-p5 — ship`)
1. `astro:assets` `<Picture>` for all art (AVIF/WebP srcset, width/height → no CLS).
2. a11y: contrast on dark bands, focus states, alt text, heading order.
3. Perf: run the `web-perf` skill; target Lighthouse ≥90 perf/a11y. Lazy-load below-fold
   media + video `preload=metadata`.
4. **Deploy wiring** (the one infra decision): create a **new** Cloudflare Pages project
   `verdant-studio-v3` watching branch `v3`, and add a `v3` branch condition to
   `.github/workflows/deploy.yml` (mirror the existing v1/main blocks). v1 + v2 stay live
   untouched until KP picks the winner + domain. `git push origin v3` → preview URL.
- **Verify:** build green → push → CI deploy green → report SHA + the v3 preview URL.
  Do NOT touch the `main`/`v1` deploy blocks. No PNGs in chat — KP tests live.

## Sequencing & tiering
P0 → **P1 (keystone — most leverage)** → P2 (KP live review gate) → P3 (parallel per page)
→ P4 → P5. Commit per phase/page; post-commit hook syncs this header.
Haiku executes; Sonnet escalates only a stalled step; Opus only on KP's call. Plan-tier
sessions end at this doc — execution happens in fresh Haiku sessions pointed here.

## Guardrails
- **Never** reintroduce generative canvas or SVG-as-primary-art. Painted/photographic/
  video only; ink SVGs are accents.
- "All pages" / "every hero" means the full enumerated set — touch all of them.
- Keep V1 dominant; cinematic dark bands are seasoning (≤2 site-wide), not the base.
- Don't touch `main`/`v1` branches or their deploy targets. v3 is its own trunk.
