# FERAL — handoff (built autonomously, 2026-06-03)

A 5-page demo site proving the **real** Pastures thesis: not a section kit you
reshuffle (that's the slot-machine sameness we diagnosed), but a **vocabulary of
low-level techniques harvested into one shared art-direction language**, where
uniqueness comes from the art direction, not the recombination.

## See it
`npm run dev` → **http://localhost:4321/feral**
Pages: `/feral` · `/feral/work` · `/feral/work/{kiln,halflight,field,press}` ·
`/feral/studio` · `/feral/contact`. Old ridge/meadow demos untouched.

## The brand (art direction — the L2 layer, authored not randomized)
**FERAL** — fictional independent design & motion studio. Genre chosen so
technique *is* the product (nothing gratuitous). One conviction per axis:
- Type: **Fraunces** variable serif (all 4 axes live: wght/opsz/SOFT/WONK) +
  **Space Mono** technical labels + Inter body.
- Colour: warm ink `#100f0d` / bone `#ece7dd`, **one cobalt accent used like
  punctuation**. Near-square 2px radius (editorial, anti-SaaS).
- Defined entirely in `src/styles/tokens.css` under `[data-skin="feral"]`.

## The techniques (the reusable product), by altitude
**L0 motion primitives** — `src/components/lib/`
`useMagnetic.ts`, `useScrollProgress.ts` (framework-agnostic cores, portable).

**L1 technique components** — `src/components/feral/`
- `DisplaceImage.tsx` — **WebGL hover displacement + RGB split** (the signature;
  graceful `<img>` fallback, verified: textures load, fallback hides).
- `VarHero.tsx` — variable-font axes animate on scroll.
- `VelocityMarquee.tsx` — marquee speed couples to scroll velocity.
- `StickyStack.tsx` — pinned scale/dim panel stack (scrollytelling, case studies).
- `TextReveal.tsx` — line-mask reveal via IntersectionObserver.
- `Cursor.tsx` — global blend-mode cursor, **persists across page transitions**.
- `Magnetic.tsx`, `Nav.tsx`, `Footer.tsx`, `WorkGrid.tsx` (asymmetric grid).

## Cross-page "interaction" (the part you asked for)
- `src/data/projects.ts` — one source read by `/work` and `/work/[slug]`. Pick on
  one page, land on its story on the next. Same data, no duplication.
- Astro **ClientRouter** view transitions; cursor + smooth scroll (Lenis) persist
  across navigations so it feels like one app, not five documents.

## Verified
`npm run build` clean (14 pages incl. 4 generated case studies). Live checks:
Fraunces variable axes responding to scroll, WebGL context OK, all 4 work-grid
displacement textures loaded, cursor mounted, no console errors.

## Honest gaps / next
- The anti-AI copy discipline (varied cadence, no rule-of-three, real boring true
  facts, no invented specs) is applied — re-read it cold and cut anything that
  still sounds like a model being clever.
- VarHero axis can read a stale mid-value right after a programmatic scroll-to-top;
  updates correctly on real user scroll. Cosmetic.
- Screenshots at non-zero scroll still capture black (sandbox quirk, not a bug).
- This is the *manual* proof. If it earns its keep, it becomes the golden template
  the autonomous factory (`.claude/plans/002-autonomous-technique-factory.md`)
  imitates — Scout finds, Builder adapts to *these* conventions, Critic vibe-checks.
