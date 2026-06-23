# 014 — FAQ visible+clickable, kill ink blobs, fix edge bleed

Status: PENDING — Haiku exec. Three surgical edits. No exploration needed; exact lines below.
Root causes diagnosed by Opus. Do NOT freelance. Verify build green, push, confirm live.

---

## Fix 1 — FAQ questions invisible but clickable (THE main bug)

**Why (root cause):** `src/styles/verdant.css:283` sets `[data-v-reveal] { opacity: 0 }`.
Only the `.in` class reveals it. The reveal observer in `src/layouts/Verdant.astro:84` does
`.filter(el => !el.closest("astro-island"))` — it deliberately SKIPS every element inside a
React island. The FAQ items live inside an astro-island, so they keep `data-v-reveal`'s
`opacity:0` forever → invisible, but still in the DOM → cursor still clicks them. That is the
"haiku said it fixed it" lie.

**The fix:** the FAQ items don't need scroll-reveal — they're an accordion. Remove the attribute
so they render visible immediately.

File: `src/components/verdant/FAQAccordion.tsx`, line 63.
- Find:  `className={\`vfaq-item${isOpen ? " is-open" : ""}\`} data-v-reveal style=`
- Change to: `className={\`vfaq-item${isOpen ? " is-open" : ""}\`} style=`
  (delete only ` data-v-reveal`. Leave everything else on the line untouched.)

Do NOT touch Verdant.astro:84 or the global `[data-v-reveal]` rule — other pages rely on them.

**Verify:** load /verdant/faq → all questions visible immediately → click each → answer expands.

---

## Fix 2 — little ink blobs that weren't there yesterday

**Why:** commit d70bf77 added low-opacity ink accents to three pages. KP doesn't want them. Remove
each accent `<div>` AND its now-unused import. Remove ONLY these blocks, nothing else.

### faq.astro (`src/pages/verdant/faq.astro`)
- Delete the import line: `import MistLayer from "../../components/verdant/ink/MistLayer";`
- Delete this block (lines ~18-20):
```
    <div style="position: absolute; top: -3rem; left: 0; width: 200px; height: 200px; opacity: 0.08; pointer-events: none; z-index: 0;">
      <MistLayer client:load />
    </div>
```

### roadmap.astro (`src/pages/verdant/roadmap.astro`)
- Delete the import line: `import MountainRidge from "../../components/verdant/ink/MountainRidge";`
- Delete the accent div:
```
        <div style="position: absolute; top: -2rem; right: -4rem; width: 280px; height: 180px; opacity: 0.1; pointer-events: none; z-index: 0;">
          <MountainRidge client:load />
        </div>
```
(Keep the status-legend column — only the ink div goes. If the surrounding `position: relative`
wrapper now wraps nothing but the timeline, leave it; harmless.)

### studio.astro (`src/pages/verdant/studio.astro`)
- Delete the import line: `import Enso from "../../components/verdant/ink/Enso";`
- Delete the accent div:
```
    <div style="position: absolute; top: 50%; right: 5%; width: 250px; height: 250px; opacity: 0.12; pointer-events: none; z-index: 0;">
      <Enso client:load />
    </div>
```

**Verify:** /verdant/faq, /verdant/roadmap, /verdant/studio — no faint ink shapes in the gutters.

---

## Fix 3 — bleed: fade assets into the background at the edges, no vignette, no hard lines

**What KP wants:** image edges should feather softly into the cream page so the clean rectangular
("clear linear") borders don't show. NOT a circular/oval vignette (that was already rejected in
1e0c35f). The current radial-ellipse mask reads as an oval vignette, not an even edge fade.

**The fix:** replace the radial mask with TWO composited linear-gradient masks (horizontal +
vertical) that feather only a thin band at each of the four edges and keep the center fully opaque.
This gives an even edge dissolve with no vignette and no hard line.

File: `src/styles/verdant.css`.

### `.v-bleed` (lines 169-170) — replace the two radial mask lines with:
```css
  -webkit-mask-image:
    linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%),
    linear-gradient(to bottom, transparent 0, #000 7%, #000 93%, transparent 100%);
  mask-image:
    linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%),
    linear-gradient(to bottom, transparent 0, #000 7%, #000 93%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
```
Keep the existing `mask-repeat`, `mask-size`, `mix-blend-mode: multiply`, `border-radius: 0` lines
that follow — do not remove them.

### `.v-bleed--icon` (lines 203-204) — replace the two radial mask lines the SAME way (same two
linear-gradient + composite block). Keep its repeat/blend/radius lines.

### `.v-img-soft` (lines 213-219) — replace its radial `mask-image`/`-webkit-mask-image` block with
the SAME linear-gradient + composite block, then add (if not present):
`-webkit-mask-composite: source-in; mask-composite: intersect;`

Do NOT touch the `/verdant/garden/*` screenshot rule (181-186) or `.v-product-shot` (191-199) —
those are meant to be crisp.

**Verify:** any paper/botanical asset (home hero, studio, etc.) — edges dissolve evenly into the
cream on all four sides; no oval darkening, no sharp rectangle line.

---

## Close-out (Haiku, do all of it — no questions back to KP)
1. `npm run build` → must be green.
2. Commit: `fix: 014 — FAQ reveal (visible+clickable), remove ink blobs, linear edge bleed`
3. Push; confirm CI/deploy green.
4. Report: commit SHA + "live". If any step fails twice: `BLOCKED: <step> — <reason>` and stop.
