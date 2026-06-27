# 016 — Taste de-slop pass + signature-motion elevation

**Status: IN PROGRESS (2026-06-26, phase in progress)** PENDING
**Tier:** Haiku (Phases 1–2, 4). Phase 3 (motion) → Sonnet if Haiku stalls.
**Engine:** Claude Code
**Verify per step:** `npm run check` (astro check) after each phase; `npm run build` before commit; `npm run verify:live` after deploy.
**Source of audit:** Opus review 2026-06-26, taste-skill + verdant-design discipline.

---

## Read first (context, ~3 files)
- `src/styles/verdant.css` — the `.v-*` design system + tokens. Do NOT redesign it. It's good.
- `src/data/verdant.ts` — one source of truth for copy. Most string edits land here, not in pages.
- This plan. Each phase names exact files + the shape of each change.

## Framing — what is and isn't slop here
The site is **not** one-prompt slop. Self-hosted type (Instrument Serif / Young Serif / Schibsted /
Fragment Mono), no AI-purple, no glassmorphism, honest per-tier privacy copy, structural-organic
layout. **Do not touch the color system, the type voices, the `.v-bleed`/print-field treatment, or
the `.v-*` grammar.** The slop is concentrated in four places. Fix those, leave the rest.

The taste-skill's Instrument-Serif ban does **not** apply: it's the brand's named display face
(taste-skill §4.1 override path), and verdant-design names it explicitly. Leave it.

---

## PHASE 1 — Em-dash purge (the #1 tell, 220 instances in shipping copy)

The em-dash (`—`) is the loudest LLM signature (taste-skill §9.G, binary ban). The site leans on it
as its default rhythmic punctuation: **220** in shipping copy (excludes `<title>` tags + the internal
type-specimen page). This is a per-string rewrite, **NOT a blind `sed`** — a global replace produces
ugly ` - ` gaps and wrong punctuation. Each sentence gets restructured.

**Rewrite rules (apply per occurrence):**
- Two independent clauses → split into two sentences with a period. ("Security is structural. It's
  architecture, not a promise.")
- Appositive / aside → wrap in commas, or use a colon if it introduces a list/explanation.
  ("encrypted on your device, kept yours" / "the model: you pay for it.")
- Spaceless glue-dash `word—word` (loudest sub-tell, **notes.astro only**) → always a period or
  comma. ("Redesigned the entire site, from tokens to nav.")
- `<title>` tags (e.g. `"Garden — Personal finance, kept private"`) → comma or restructure
  (`"Garden, kept private"`). The en/em dash is also banned as a separator. Do not swap in `·`.

**Target — desired end state: at most ~5 em-dashes site-wide** (allow only where a rewrite genuinely
reads worse, and log each survivor in the commit). Files, in order of density:
1. `src/data/verdant.ts` — the heaviest. Every `blurb`, `oneLine`, `reality`, `body`, `faq.a`,
   `studio.lines`, `ethos.creed`, privacy-tier strings. ~half the total lives here.
2. `src/pages/verdant/notes.astro` — 6 entries + has the spaceless glue-dashes. Also kill the
   sign-off "The garden grows." (performative, taste-skill §4.9 copy self-audit).
3. `src/pages/verdant/{garden,security,pricing,ethos,beta,studio,roadmap,emerald,index}.astro` —
   hero `sub`, FeatureRow `body`, CTA copy, inline law/term strings.
4. `src/pages/{privacy,terms,404}.astro` — body prose.
5. Kit components `src/components/verdant/kit/*.astro` — any hardcoded copy (mostly prop-driven, light).

**Verify:** `grep -rn "—" src/pages src/data src/components | grep -v type-specimen | wc -l` → ≤ 5,
then `npm run check`. Re-read every edited string aloud (taste-skill copy self-audit) — no string left
grammatically broken by the split.

---

## PHASE 2 — CTA intent consolidation (taste-skill "No Duplicate CTA Intent")

The primary action ("open the Garden app / sign up") is fragmented across **6 labels**:
`Try Garden` ×6, `Join the beta` ×6, `Get started` ×2, `Try Garden free`, `Start your garden`,
`See Garden`. Same intent, six wordings = the duplicate-CTA tell.

**Lock the vocabulary to two intents, one label each:**
- **Open the live app** → `Try Garden` (href `garden.khushinpatel1.workers.dev`). This is the single
  primary verb. Retire `Get started`, `Try Garden free`, `Start your garden`, `See Garden`.
- **Beta-list signup** → `Join the beta` (href `/verdant/beta`). Keep only where the action is
  genuinely "sign up for the list," not "open the app."

**Per-page audit — no page may show two CTAs of the same intent:**
- `index.astro`: hero has `Join the beta` (primary) + `See Garden`. Change `See Garden` → keep one
  intent: make hero `Try Garden` (primary) + `Join the beta` (secondary). CTAClose1 currently repeats
  `Join the beta` + `See what's next` — fine (different: roadmap). Just ensure labels match the lock.
- `garden.astro`: hero `Try Garden` + `Security`; CTAClose1 `Try Garden` + `Pricing`. Two `Try Garden`
  on one page = redundant. Make the closer's primary `Join the beta` OR drop the repeat to a single
  primary. One `Try Garden` per page max.
- `pricing.astro`: hero `Join the beta` + closer `Get started` → both signup intent. Collapse to one
  label (`Join the beta` in hero, closer becomes `Try Garden` since it links the app).
- Sweep the rest (`security`, `ethos`, `beta`, `roadmap`, `emerald`) against the lock.

**Verify:** `grep -rohE "Try Garden|Join the beta|Get started|Start your garden|Try Garden free|See Garden" src/pages src/data | sort | uniq -c` → only `Try Garden` and `Join the beta` survive. Then `npm run check`.

---

## PHASE 3 — Wire the signature growth-motion (the elevation lever)  [Sonnet if Haiku stalls]

**Finding:** `src/utils/choreographedReveal.ts` is fully built (slide/scale/hold timeline, GSAP,
reduced-motion + touch guards) but **dead** — `data-v-choreograph` / `data-v-choreo-*` appear in
**zero** pages. The only scroll motion that ships is `[data-v-reveal]` (uniform `translateY(28px)`,
0.9s, identical easing) — and it's wired on **one** page (`notes.astro`). So: the site is essentially
static, and the verdant-design **stated signature** ("growth as the motion primitive, not fade-in-up;
one signature moment per page") is absent while the engine for it sits unused. This is both a slop-tell
(§5 uniform fade) and the single biggest "take it to a new level" opportunity.

**Do exactly one of these (pick A; B only if motion design is deferred):**

**A — Wire choreography into the two product heroes (recommended).**
1. On `index.astro` and `garden.astro` hero `<section>`, add `data-v-choreograph`.
2. Tag the hero children: eyebrow → `data-v-choreo-slide data-v-choreo-delay="0"`, headline →
   `data-v-choreo-slide data-v-choreo-delay="0.08"`, sub → `data-v-choreo-hold data-v-choreo-delay="0.2"`,
   the product shot (`GardenLive`) → `data-v-choreo-scale data-v-choreo-delay="0.15"`. (Scale-from-0.92
   reads as "growing into place," the brand primitive — not a flat fade-up.)
3. The driver already auto-arms via `armChoreography()` in `Verdant.astro` on `astro:page-load`.
   No JS wiring needed beyond the attributes.
4. Confirm `gsap` resolves (it's in package.json deps). Confirm reduced-motion + touch still show
   everything (driver already guards this — re-test both).

**B — If motion is deferred this pass: delete the dead code** (`src/utils/choreographedReveal.ts`
+ its import/call in `Verdant.astro` lines 67 & 127). Don't ship an unused engine.

**Verify (A):** `npm run dev`, load `/verdant` and `/verdant/garden` — hero elements enter staggered,
product shot scales in. Toggle OS reduced-motion → everything visible instantly, no animation. Resize
to mobile (touch) → instant, no animation. `npm run check` clean.

---

## PHASE 4 — Field Notes de-slop + section-number eyebrows + internal page

1. **`notes.astro` "Field Notes" framing** (taste-skill §4.9: "Field notes / From the field"
   performative-craftsman label is banned). Rename the page identity to plain language:
   - Hero `v-label` "Ship once, well" → drop or → "Changelog".
   - Headline "Field Notes." → "What's shipped." (or "Changelog.").
   - `<title>` "Field Notes — Verdant" → "Changelog, Verdant" (also fixes the em-dash).
   - Kill the "The garden grows." sign-off line (already noted in Phase 1).
2. **Section-number eyebrows** — `notes.astro` has `<span class="vh-num">01</span>` / `02`
   (taste-skill §9.F: section-numbering eyebrows banned). Delete both `vh-num` spans + their CSS rule.
3. **Date accuracy** — notes entries are out of order with a duplicate `2026-06-18` and `2026-06-17`.
   Sort descending, dedupe, or merge same-day entries. (Content correctness, not taste.)
4. **`type-specimen.astro`** — a 397-line internal dev artifact (12 eyebrows, references Fraunces/Inter,
   font-swap notes). It's globally `noindex` but still routed at `/verdant/type-specimen`. Move it out
   of `src/pages/` (e.g. to `src/_dev/` or `docs/`) so it stops being a public route, OR leave it (it's
   noindex) — **flag to KP, don't delete**; it carries the type-decision rationale.

**Verify:** `grep -rn "vh-num\|Field Notes\|The garden grows" src/pages` → no matches (except a kept
type-specimen). `npm run check`.

---

## Out of scope (do NOT touch this pass)
- Color tokens, type faces, `.v-bleed` / print-field / night-band treatments, `.v-*` grammar.
- The `{{KP}}` / KP-OWED pricing & terms placeholders (legal/business sign-off, not slop).
- The global `noindex` robots tag (intentional pre-launch).
- The privacy-spectrum copy and 3-tier model (verbatim from garden VISION — accurate, keep).
- Repeated CTAClose1 closing band — it's a consistent system element, not a tell. Leave it.

## Commit cadence (number-tagged, per CLAUDE.md auto-sync)
- `fix: 016-phase1 — em-dash purge across copy (220→≤5)`
- `fix: 016-phase2 — CTA intent locked to Try Garden / Join the beta`
- `feat: 016-phase3 — wire growth-motion choreography on product heroes`
- `fix: 016-phase4 — de-slop Field Notes, drop section-number eyebrows`
- `chore: 016-complete — taste de-slop pass shipped`
Build green → push → confirm CI deploy → `npm run verify:live`. Then flag the type-specimen
routing decision (Phase 4.4) to KP.

## Definition of done
- `grep -rn "—" src/pages src/data src/components | grep -v type-specimen | wc -l` ≤ 5.
- Only `Try Garden` + `Join the beta` as action labels; no page repeats one intent.
- Hero choreography plays (or dead code deleted); reduced-motion + touch fall back clean.
- No "Field Notes" framing, no `vh-num` section numbers.
- `npm run check` + `npm run build` green; live verified.
