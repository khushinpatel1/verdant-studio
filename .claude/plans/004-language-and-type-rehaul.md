# 004 — Language & Type Rehaul (full copy audit + font-size pass)

Status: DONE
Executor: Haiku. Escalate a single step to Sonnet only if it fails twice. Copy rewrites: stay inside
the voice rules below — do NOT freelance a new brand voice.

Context: Astro site. **Copy lives in two places:**
1. `src/data/verdant.ts` (123 lines) — the single source of truth: brand, nav, garden/emerald
   product objects, screen captions, creed lines, etc. **Most strings live here.**
2. Inline in the page files: `src/pages/verdant/{index,garden,security,ethos,team,emerald}.astro`
   and `src/pages/index.astro` (redirect, ignore).
Type scale = per-page `<style>` blocks using `clamp()` (e.g. `index.astro` lines ~116–202) and
`src/styles/verdant.css` / `src/styles/global.css`.

Verify after each page: `npm run build` (Astro build must pass). Visual: `npm run dev`.

---

## The brief (KP's framing — four lenses on every word)

Audit ALL wording through four readers, then rewrite:
- **Marketing** — is it doing work, or just sounding nice? Cut the corny. Lead with the benefit.
- **PR** — is any claim overstated or unprovable? (Privacy/security claims especially — say only
  what's true. No fabricated stats, no "bank-grade," no invented credentials.)
- **Everyday person** — would a non-technical friend understand this in one read? Kill jargon.
- **Legal** — no promises we can't keep, no implied guarantees ("unhackable", "100% private",
  "we will never…" → soften to what's architecturally true: "encrypted on your device", "sold to no one").

**Voice to keep:** calm, plain, confident, a little dry. Japanese-garden restraint — unhurried, alive
underneath. The current text leans precious/corny ("grown in the dark", overwrought metaphors) — keep
ONE light botanical thread, cut the rest. Answer-first sentences. No bowtie closers.

**Hard rule:** no fabricated numbers, dates, locations, or credentials. `verdant.ts` already omits
founding year + location on purpose — keep them omitted.

---

## Task 1 — Rewrite the source-of-truth strings: `src/data/verdant.ts`

Go field by field. Rewrite for the four lenses. Specifically:
- `brand.tagline` — "A studio for software grown for people, not advertisers." → test it; keep if it
  still lands, tighten if corny.
- `garden.oneLine`, `garden.blurb`, `garden.kind`, `garden.status` — make the privacy claim concrete
  and defensible. "sold to no one" / "encrypted, on your device" are good; trim metaphor.
- All `screens[].line` / `screens[].body` captions — short, concrete, benefit-first.
- `emerald` strings — drop the "grown in the dark / secret" preciousness to a single restrained hint.
- Creed/manifesto lines if defined here.
Keep keys + types identical; only string values change.

Verify: `npm run build` passes (no broken interpolations).

---

## Task 2 — Audit + rewrite inline copy, page by page

For EACH page below: read it, list every visible string, rewrite through the four lenses, and also
**audit word PRIORITY / ordering** (KP's explicit ask: what should the eye hit first — is the strongest
message buried below a weak one? Reorder headline → subhead → body so the benefit leads).

- `src/pages/verdant/index.astro` (206 lines) — hero head/sub, manifesto, creed items, work intro,
  product line, quote, CTA band. This is the front door; spend the most care here.
- `src/pages/verdant/garden.astro` (201) — product page.
- `src/pages/verdant/security.astro` (176) — **highest legal sensitivity.** Every claim must be true
  and softened from absolutes. Flag anything you're unsure is accurate in the handoff rather than
  asserting it.
- `src/pages/verdant/ethos.astro` (128).
- `src/pages/verdant/team.astro` (102) + `team/[slug].astro` — no invented bios/credentials.
- `src/pages/verdant/emerald.astro` (46).

Verify per page: `npm run build`; spot-check in `npm run dev`.

---

## Task 3 — Font-size / type-scale pass (do alongside the copy on each page)

KP feels "some things are off." While rewriting each page's copy, evaluate its `clamp()` type scale:
- **Hierarchy:** is the head clearly bigger than subhead bigger than body? On `index.astro`,
  `--vh-hero-head` is `clamp(3rem,7vw,6.4rem)` and hero-sub `clamp(1.2rem,1.8vw,1.5rem)` — check the
  jump to body feels intentional, not random.
- **Readability:** body copy should land ~1.0–1.2rem min on mobile; line-height 1.4–1.6 for prose.
- **Consistency:** the same role (e.g. section heading) should use the same clamp across pages. If
  pages drift, align them. Consider promoting shared scales into `src/styles/verdant.css` as vars
  (`--fs-h1`, `--fs-h2`, `--fs-body`, …) ONLY if it doesn't require touching every page — otherwise
  just normalize in place and note the refactor for later.
- Fix obvious offenders: oversized decorative marks crowding text, sub-0.7rem mono labels that are
  hard to read, heads that wrap awkwardly (`max-width` in ch).

Make minimal, surgical CSS edits — don't restyle the site, just correct the scale where it's off.
Note every size you changed in the handoff so KP can eyeball them.

Verify: `npm run build`; `npm run dev`; check index + garden + security at mobile and desktop widths.

---

## Deliverable
- All copy rewritten across `verdant.ts` + 6 pages.
- Type scale corrected where off, changes listed.
- Handoff at `docs/004-language-type-handoff.md`: list of every claim on the security page with a
  true/uncertain flag, and the list of font-size changes. Flag anything needing KP's factual confirm.

## Out of scope
- New page structure / new sections (copy + type only).
- The GardenLive canvas / interaction code.
- Imagery / asset swaps.
