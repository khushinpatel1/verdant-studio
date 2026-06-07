# 001 — Pastures: cinematic website template framework

**Status:** IN PROGRESS (scaffold + 6/19 components live, both skins verified — 2026-06-02)
**Owner:** Khushin + Claude
**Created:** 2026-06-01

---

## The one-line vision
We pour the foundation and raise the walls — a library of cinematic scroll
sections plus an interaction toolkit. The **client is the occupant** who tells us
what they want. We do the interior/exterior design: palette, copy, assets. And
**every swappable thing — names, images, colors, logo — lives in ONE file that
drops into the template instantly.** That single config file *is* the product.
Easy to reproduce, easy to sell.

We study how Apple and Google *architect* the look-and-feel of their marketing
pages and replicate the techniques in original components. We do **not** copy
their logos, products, photos, copy, or licensed fonts.

## What we're really building
Not 12 hand-built pages. Three layers:
1. **Section component library** — the reusable building blocks (hero, pinned
   showcase, parallax split, scroll-reveal feature, image-sequence scrub, spec
   grid, CTA, footer…). The foundation + walls.
2. **One-file content/theme config** — per client, a single typed file holding
   logo, copy, images, palette, fonts, section order. Swap it → the whole site
   re-skins and re-fills instantly. The decorating layer.
3. **Two original blended skins** — NOT "Apple" and "Google" clones. Each blends
   both toolkits into a new concept:
   - **Ridge** — Apple's cinematic dark depth × Google's kinetic text & color blocks.
   - **Meadow** — Google's bright Material warmth × Apple's seamless pinned scroll.
   Each = a theme preset + section variants, shown as 5–6 demo pages to sell from.

## Stack (decided)
- **Astro + React islands** — content-swappable, SEO-strong, fast; cinematic JS
  runs in islands. Best fit for sellable marketing templates.
- **GSAP + ScrollTrigger** — pinning, scrubbing, parallax, on-focus reveals
  (fully free since 2024).
- **Lenis** — smooth scroll.
- **Free assets only:** Unsplash, Pexels (imagery), Coverr/Mixkit (video),
  Lucide/Heroicons (icons), unDraw (illustration), Google Fonts
  (Inter/Manrope as SF stand-ins; a Roboto/Inter pairing for the Google skin).
- **Deploy:** Cloudflare Pages (matches garden).

## Legal guardrail (protects the business)
Mimic the *look and feel* — uncopyrightable and fair. Never ship Apple/Google
trademarks, logos, product imagery, marketing copy, or licensed fonts (SF Pro,
Product Sans). Everything original or free-licensed. "Inspired by," never
"copied from."

## Phases
- **Phase 0 — Pattern study.** Tear down a *variety* of pages (not just two):
  - Apple: iPhone 17 Pro, AirPods Pro, Apple Watch Ultra, MacBook Pro, Vision Pro.
  - Google: Chrome, Pixel, Pixel Buds, Google Store shell.
  - Output: a **pattern inventory** mapping each distinct interaction to a
    reusable section component. → `docs/pattern-inventory.md` once scaffolded.
  - **Gate:** Khushin approves the inventory before the library is built.
- **Phase 1 — Scaffold.** Astro project, GSAP/Lenis, typed content schema, theme
  tokens, the one-file config contract.
- **Phase 2 — Section library.** Build each component from the inventory, each
  reading purely from config.
- **Phase 3 — Assemble both skins.** 5–6 pages per skin from sections, filled
  with free assets.
  - **Gate:** approve the first hero before building all pages.
- **Phase 4 — Sales proof.** Generate a *third* dummy brand from the same
  components in minutes — the live demo for clients.
- **Phase 5 — Deploy** to Cloudflare Pages.

## Success criteria
- A new brand can be stood up by editing one config file — no component edits.
- Both skins feel unmistakably "Apple-grade" / "Google-grade" on scroll.
- Lighthouse perf/SEO strong enough to sell as a quality signal.

## Open questions
- ~~Final project name~~ → **blessed: `pastures`** (2026-06-01).
- Where the build lives: own `~/Dev/atelier` repo (likely) — new session or add `~/Dev`.
- How clients hand us their content (form? shared doc? we transcribe into config).
