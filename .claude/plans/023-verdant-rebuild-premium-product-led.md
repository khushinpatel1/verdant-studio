# 023 — Verdant rebuild: Premium product-led site with native motion

## Goal

Rebuild Verdant from a sparse botanical brochure into a premium, product-led site with native-feeling motion, interactive cards/sheets, strong heroes, and brand-neutral visual foundations. Do not update outdated Garden screenshots. Do not invent claims, people, or metrics.

## Phase 1 — Fix the foundation

### Remove Lenis and the accumulating animation-frame loop

- Remove Lenis scroll library entirely
- Use native browser scrolling
- Eliminate global `requestAnimationFrame` loops

### Replace universal fade/parallax with a small motion system

- **Card expand/collapse** — local state toggle
- **Sheet open/close** — overlay modal with entrance
- **Masked product reveals** — clip-path or mask-image on scroll entry
- **Scroll-linked transforms** — one signature sequence (hero or key section only)

### Support touch, keyboard, reduced motion

- All interactive elements clickable and keyboard-navigable
- `prefers-reduced-motion: reduce` disables animations, keeps layout intact
- Touch targets ≥44×44px

### Consolidate design tokens

- **Spacing:** xs, sm, md, lg, xl, 2xl
- **Typography:** heading sizes, body styles, mono
- **Radii:** none, sm, md, lg, full
- **Shadows:** elevation 0–3
- **Easing:** standard, in, out, in-out (matching Anthropic/Apple conventions)

### Remove decorative elements from primary surfaces

- Global decorative grain → optional local texture only
- Watercolor masks → replaced by crisp reveal animations
- Generic botanical imagery → reserve for secondary surfaces or remove entirely

## Phase 2 — Rebuild the homepage

### Hero section

- Asymmetric, nearly full-viewport composition
- Large **live Garden interface** (not a screenshot—real HTML product UI or tight browser recording)
- Pointer/touch subtly changes displayed account, chart, or card depth
- Cards clickable to open product-style sheets

### Sticky product story

- One stable product canvas
- Three short chapters: **Understand money**, **Plan forward**, **Protect data**
- UI changes state as each chapter enters viewport
- Cards detach, enlarge, become sheets; avoid simple fade-ins

### Interactive privacy model

- Three selectable privacy levels
- Selecting one redraws lightweight SVG data path + updates details sheet
- Privacy understandable visually in seconds

### Studio conviction section

- Compact, dense—not another oversized void
- Real founder statement + optional authentic portrait/workspace photograph

### Closing CTA

- Product visible
- One primary action + one secondary text link

## Phase 3 — Give every page one signature interaction

- **Garden:** Interactive dashboard with expandable cards and working sheets
- **Security:** Animated device-to-service data-flow explorer (SVG)
- **Pricing:** Plans transform into detailed comparison sheet
- **Roadmap:** Horizontal/stacked timeline whose items open into drawers
- **Studio:** Restrained editorial layout with authentic photography or process artifacts
- **FAQ:** Polished accordion (no extra visual stunt)

**Rule:** One memorable moment per page, not blanket interactions everywhere.

## Asset recommendations

**Prioritize:**
- Live HTML product UI (strongest credibility)
- Browser-recorded product motion (short, tightly cropped loops)
- Custom SVG diagrams (privacy, encryption, imports, data ownership)
- Real macro photography (paper, glass, metal, workspace, hands, textures—consistent)
- Rive: one custom interactive hero object if identity needs it
- GSAP: homepage product narrative + orchestrated transitions only
- CSS 3D transforms: layered product cards/sheets (no heavy 3D engine)
- Canvas: optional restrained field behind hero

**Avoid:**
- Generic AI watercolor landscapes
- Stock "zen" imagery
- Decorative blobs and gradients
- Spline objects added merely because they rotate
- Lottie packs or premade illustrations
- AI imagery as final customer-facing centerpiece

AI imagery can help with moodboards, but shipped assets = product UI, custom diagrams, or authentic photography.

## Acceptance criteria

- Native scrolling feels immediate on trackpad/mouse
- Every interactive element works on touch and keyboard
- `prefers-reduced-motion` remains coherent
- No repeated equal-card grids or uniform section spacing
- No major section exists solely to hold decorative art
- Homepage has one cohesive product-led scroll narrative
- Each interior page has exactly one signature interaction
- Mobile receives composed layouts, not compressed desktop
- Build and visual checks pass across: homepage, Garden, Security, Pricing, Roadmap, Studio
- Design target: Anthropic editorial confidence + Apple product choreography (not copies)

## Execution plan

**Phase 1 (this session):**
- Remove Lenis, fix native scrolling
- Audit and remove global animation loops
- Build motion system (card/sheet/reveal/scroll-linked)
- Create design token module
- Remove decorative elements from Kit components
- Verify build and test on homepage

**Phase 2 (next session):**
- Rebuild homepage hero with live product UI
- Implement sticky product story with state-linked transitions
- Build interactive privacy model (SVG + sheets)
- Add studio section with authentic photography
- Implement closing CTA
- Verify homepage end-to-end

**Phase 3 (following session):**
- Garden: expandable cards + working sheets
- Security: SVG data-flow explorer
- Pricing: plan-to-sheet transform
- Roadmap: timeline with drawer items
- Studio: editorial layout
- FAQ: accordion (no extra stunt)
- Verify all pages and interactions

## Metrics for success

- Build completes with no `console.warn` or `console.error`
- Lighthouse performance ≥90 (Core Web Vitals)
- All interactions work on Safari iOS + Chrome Android + desktop Firefox
- `npm run check` passes (TypeScript, Astro)
- Visual regression test baseline established and clean
