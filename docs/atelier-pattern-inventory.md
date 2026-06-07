# Atelier — Pattern Inventory (Phase 0)

**Status:** DRAFT — awaiting Khushin's approval
**Source pages studied:** Apple iPhone 17 Pro, Apple AirPods Pro, Google Chrome
(+ known Google hardware/store patterns)
**Date:** 2026-06-01

The spine of the product. Every distinct interaction observed → mapped to ONE
reusable section component. The component reads everything from the per-client
config file. Build these once; assemble pages forever.

---

## The Apple toolkit (cinematic, dark, seamless, subtle)

| # | Pattern (where seen) | What it does | → Component | Key config knobs |
|---|---|---|---|---|
| 1 | **Image-sequence scrub hero** (AirPods/iPhone hero) | Pinned canvas; frames scrub with scroll = "filmed" product reveal | `SequenceScene` | frames[], pinDuration, captions[] |
| 2 | **Pinned showcase** (Noise Control, design deep-dive) | Element pins to viewport; content animates as you scroll past | `PinnedShowcase` | media, steps[], pinHeight |
| 3 | **Parallax layers** (design sections) | Foreground/background move at different speeds = depth | `ParallaxLayers` | layers[{src, speed}] |
| 4 | **Scroll-reveal block** (everywhere) | Text + media fade/translate in on entering focus | `RevealBlock` | heading, body, media, anim |
| 5 | **Interactive product viewer** (Take a closer look) | Rotatable 3D / color switcher | `ProductViewer` *(advanced/optional)* | views[], colors[] |
| 6 | **Compare slider** (camera focal 0.5x–8x) | Drag slider → image/state changes | `CompareSlider` | stops[{label, img}] |
| 7 | **Spec / benchmark compare** (battery, CPU charts) | Dynamic spec table, model-filtered | `SpecCompare` | rows[], columns[] |
| 8 | **Full-bleed video scene** (.m3u8 embeds) | Autoplay or scroll-scrubbed video | `VideoScene` | src, scrub?, poster |
| 9 | **Highlights grid** (6-capability grid) | Thumbnail cards w/ animated transitions | `HighlightGrid` | items[{icon, title, media}] |
| 10 | **Horizontal comparison carousel** (vs Air/17) | Side-scroll product/feature compare | `HCarousel` | slides[] |
| 11 | **Accordion FAQ** | Expand/collapse Q&A | `Accordion` | qa[] |
| 12 | **Mega footer** | Multi-column links + region/legal | `MegaFooter` | columns[], legal |
| 13 | **Sticky / morphing nav** | Persists + restyles on scroll | `StickyNav` | links[], cta |

## The Google toolkit (bright, Material, overt motion, denser)

| # | Pattern (where seen) | What it does | → Component | Key config knobs |
|---|---|---|---|---|
| 14 | **Kinetic text hero** (Chrome "fast/safe/yours" + play/pause) | Headline cycles words; user motion control | `KineticHero` | words[], media, controls |
| 15 | **Color-block section** (Google scroll color shifts) | Full sections in bold bg colors; transition between | `ColorBlock` | bg token, content |
| 16 | **Rounded card grid** (Safety, By Google) | Material cards, generous padding, icons/illustration | `CardGrid` | cards[], radius, columns |
| 17 | **Tab / accordion switcher** (Personalization — image swaps on select) | Pick a feature → media changes | `TabSwitcher` | tabs[{label, media, body}] |
| 18 | **Icon cloud / circle grid** (Web Store) | Circular icon constellation | `IconCloud` | icons[] |
| 19 | **Sticky section sub-nav** (jump links) | In-page anchor nav that tracks scroll | `SectionNav` | sections[] |

---

## The two skins = presets over the same components

| | **Apple-ish** | **Google-ish** |
|---|---|---|
| Color | Dark, saturated, high contrast | Light/neutral + bright accents |
| Motion | Subtle, refined, seamless section blends | Overt, playful, with play/pause controls |
| Density | Lots of breathing room, one idea/viewport | Information-rich, modular cards |
| Type | Large, tight, SF-like (Inter/Manrope) | Rounded, friendly (Roboto/Inter) |
| Shape | Seamless full-bleed | Rounded padded cards |

Same component library. Skin = theme tokens (palette, font, radius, motion
intensity) + which section variants are used.

---

## The one file (the product)

```ts
// client.config.ts — swap this, the whole site re-skins + re-fills
brand: { name, logo, font, palette: { bg, fg, accent, muted } , radius, motion }
pages: {
  home: [
    { type: "SequenceScene", frames: [...], caption: "..." },
    { type: "RevealBlock", heading: "...", media: "...", anim: "rise" },
    { type: "HighlightGrid", items: [...] },
    ...
  ],
  // more pages, each an ordered list of section components
}
```

Foundation + walls = the 19 components. Decorating = this file. Occupant = the
client's content. Reproduce by copying the file; sell by swapping it.

---

## Recommended first build set (Phase 2 priority)
Ship these 8 first — they cover ~90% of both skins:
`StickyNav`, `SequenceScene` (or simpler `VideoScene` to start), `RevealBlock`,
`PinnedShowcase`, `HighlightGrid`/`CardGrid`, `CompareSlider`, `Accordion`,
`MegaFooter`. Add `ParallaxLayers`, `KineticHero`, `TabSwitcher` next. Defer the
heavy `ProductViewer` (3D) until a client needs it.
```
