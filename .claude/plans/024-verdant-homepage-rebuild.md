# 024 — Verdant homepage rebuild: Product-led narrative

**Continuation of 023.** Phase 1 complete; foundation is clean, motion system ready, design tokens consolidated.

## Goal

Rebuild the homepage into a premium, product-led scroll narrative. Replace generic botanical layout with:
- Live product UI in the hero (Garden interface, not a screenshot)
- Sticky product story with state-linked transitions (three chapters)
- Interactive privacy model (selectable levels → redrawn SVG data path)
- Studio conviction section (founder + authentic photography)
- Strong closing CTA

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

## Acceptance criteria

- Hero loads live product UI (not screenshot)
- Sticky story responds to scroll position with state-linked UI transitions
- Privacy selector is fully interactive and accessible (keyboard, touch)
- Studio section is concise and authentic (no generic imagery)
- Closing CTA is clear and product-focused
- Build passes with no warnings
- Lighthouse ≥90 (Core Web Vitals)
- All interactions work on Safari iOS + Chrome Android + Firefox desktop
- `npm run check` passes

## Notes

- Reuse choreography from Phase 1 where it fits (entrance stagger for multi-element sections)
- Use GSAP for orchestrated product story transitions (state machine: scroll position → UI state)
- CSS 3D transforms for card/sheet transforms (no heavy engine)
- Keep SVG privacy diagram lightweight and accessible
- Authentic photography > AI imagery or stock photos
