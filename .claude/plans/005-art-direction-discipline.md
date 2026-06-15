# 005 — Art-Direction Discipline Pass

Status: DONE (2026-06-14)

Notes:
- All four offenses fixed. Build passes (`npm run build`).
- Type scale: added `--text-2xs..4xl` + `--display-1/2` tokens to
  `src/styles/verdant.css`; replaced all loose font-size literals in
  Nav.tsx/Footer.tsx and pages/verdant/{index,ethos,garden,security,team}.astro
  with scale tokens (GardenLive untouched; the nav-overlay ✕ glyph at 1.1rem
  left as icon sizing, not text rhythm).
- Bands: added `.v-band--paper` + `.v-band-hr` variant; converted index.astro's
  manifesto band from dark forest wash to parchment/paper with a gold hairline
  + "The manifesto" label. ethos/garden/security/team already had only one
  band each (untouched) — index now also has exactly one dark band (the CTA,
  which keeps the moon print).
- Logo: new `src/components/verdant/Logo.tsx` — inline two-leaf sprout glyph
  (asymmetric, currentColor) + "Verdant" wordmark; used in Nav.tsx and
  Footer.tsx; `public/favicon.svg` regenerated from the same glyph.
- Prints: removed index.astro's hero print (koson-songbird-plum — weak
  thematic fit) so the page carries one print (koson-grasses-moon at the CTA,
  which already fit "Grow something quiet"). ethos (lotus + raked sand),
  garden (waterlilies), security (eagle-pine), team (flower) already mapped
  well per-page and were left unchanged.
- Diverged/left for KP: emerald.astro and team/[slug].astro were out of the
  plan's stated verify scope (index/ethos/garden/security/team) and untouched —
  emerald is the intentional "secret" aesthetic; team/[slug] wasn't audited.
  No copy/wording was touched anywhere.

## Why
A marketing reviewer + KP: site reads as "automatic mess." Diagnosis (grounded in
src on 2026-06-14): the design *system* is strong (good fonts, token map, print-field
grammar). What's missing is DISCIPLINE. Four concrete offenses, four concrete fixes.
This is NOT a from-scratch redesign — preserve the existing aesthetic, impose order.

**Out of scope this pass: copy/wording rewrite. KP does voice in a later session. Do
NOT change user-facing prose.** Structure, type, color-rhythm, images, logo only.

## Offense 1 — No type scale → random sizes everywhere
Every component hardcodes font-size (0.62/0.66/0.7/0.74/0.92/1.05/1.45/2rem + ad-hoc
clamps). No rhythm. Fix:
- In `src/styles/verdant.css` `[data-skin="verdant"]` token block, add a modular ramp
  (1.20 ratio, 1rem base):
  ```
  --text-2xs: 0.694rem;  --text-xs: 0.833rem;  --text-sm: 0.926rem;
  --text-base: 1rem;     --text-lg: 1.2rem;    --text-xl: 1.44rem;
  --text-2xl: 1.728rem;  --text-3xl: 2.074rem; --text-4xl: 2.488rem;
  --display-1: clamp(2.8rem, 6vw, 5.6rem);  --display-2: clamp(2rem, 4.5vw, 3.6rem);
  ```
- Replace hardcoded font-sizes across `src/components/verdant/*.{tsx,astro}` and
  `src/pages/verdant/*.astro` with the nearest token. Map: labels/mono → --text-2xs/xs;
  body → --text-base; sub-heads → --text-lg/xl; section heads → --text-2xl/3xl/4xl;
  page-hero heads → --display-1; hero subs → --display-2. Keep GardenLive.astro's tiny
  internal px sizes (it's a faux phone screenshot — intentional miniature).
- Result: at most ~3 type sizes visible per viewport. Verify by grepping that loose
  `font-size: [0-9]` literals in pages/components are gone (except GardenLive).

## Offense 2 — Dominating green bands
`.vh-band/.ve-band/.vg-band/.v-footer` all get the dark forest watercolor wash, applied
many times per page. Fix RESTRAINT:
- Per page, keep ONE dark-green band as the emotional anchor (the privacy/CTA moment).
  Convert the others to a LIGHT treatment: cream/parchment ground with a thin gold or
  moss hairline divider + the v-label, NOT a full forest slab. Add a `.v-band--paper`
  variant in verdant.css (cream bg, --ink text, no forest wash) and apply it to the
  secondary bands in ethos.astro, garden.astro, index/hero page.
- Footer stays dark (it's the ground). Keep one dark band mid-page max.
- Verify: screenshot each page; no more than one dark-green full-bleed block above the footer.

## Offense 3 — No logo
Only favicon + a text wordmark in Nav.tsx. Fix — make a real lockup (no external asset):
- Create `src/components/verdant/Logo.tsx`: inline SVG sprout/leaf glyph (two simple
  leaves on a stem, single path, `currentColor`, ~20px) + "Verdant" in --font-display.
  Organic = asymmetric: the two leaves at different heights/sizes, not mirrored.
- Use it in `Nav.tsx` (replace the bare text wordmark) and `Footer.tsx` (the .v-footer-mark).
- Also regenerate `public/favicon.svg` from the same glyph so favicon == logo.
- Keep it monochrome (--green / --moon on dark). No gradients.
- Verify: glyph renders in nav at 1440 and 390; favicon.svg contains the path.

## Offense 4 — Koson prints feel random / mismatched
Heroes: ethos=dragonfly-lotus+raked-sand, garden=waterlilies (the one that "works"),
others unclear. Fix INTENTIONAL pairing — one strong print per page, themed:
- Audit every `/verdant/art/*.jpg` reference across pages. For each page pick ONE print
  whose subject maps to the page's meaning (garden=waterlilies ✓ keep; ethos=raked sand
  or lotus = stillness/intention; security = something enclosed/still; team = ?). If a
  print doesn't map, REMOVE it rather than keep decoration. Fewer, meaningful > many random.
- Ensure each kept print uses the existing `.v-print-field` grammar consistently
  (same blend/feather), so they read as one family, not scattered images.
- Verify: screenshot each page; every image visibly relates to its page; none float as decor.

## Execution notes
- Build: `npm run build` must pass.
- VERIFY VISUALLY (this is taste work): use the existing Playwright shots setup
  (`shots/`, `@playwright/test`) or `npx playwright` to screenshot index + each
  /verdant/* page at 1440x900 AND 390x844, before and after. Save to `shots/005-*`.
- If any offense's fix can't be done cleanly without touching copy, STOP and report —
  do not rewrite prose to make layout work.
- Commit: `feat: 005 — type scale, band restraint, logo lockup, intentional prints`
- Do NOT push/deploy automatically — KP reviews screenshots first. Report with the
  before/after screenshot paths and a one-line summary per offense.
