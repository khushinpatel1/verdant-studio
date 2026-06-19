# 007 — Verdant public-beta redesign (the company is different now)

> Status: **APPROVED — IN PROGRESS** (KP go 2026-06-19; pricing + logo decided; run fully autonomous to live).

## ⛑ RECOVERY / CHECKPOINT (read FIRST if resuming after a crash or usage-limit)
- **Background build workflow run ID:** `wf_cd6594e0-35b` (task `wbqyug20t`).
- **Resume command:** `Workflow({scriptPath: "/Users/khushinpatel/.claude/projects/-Users-khushinpatel-Dev-garden/14dce605-141c-4c46-ba5c-7c1b93847cac/workflows/scripts/verdant-007-redesign-wf_cd6594e0-35b.js", resumeFromRunId: "wf_cd6594e0-35b"})` — completed agents return cached, only unfinished/changed re-run. Same-session only; if a fresh session, re-fire the script (commits below show what's already done).
- **Branches (work is HERE, not on main):** verdant-studio `redesign/007`; garden `redesign/007-onboarding`.
- **Checkpointing:** workflow commits **per phase** (P1→P4) on those branches — each phase is saved before the next starts. Check progress: `git -C ~/Dev/verdant-studio log --oneline redesign/007` and the garden branch.
- **NOT yet done (manual, post-build):** (1) swap `VerdantMark` enso→**temp V** glyph + regen favicon; (2) Opus rendered review + slop fixes on signature moments; (3) merge `redesign/007`→main (=deploy), confirm CI, redirect v1; (4) append the loop efficiency audit's real token numbers. See `partnership/docs/reference/ultracode-loop-audit.md`.
> Tier: Opus authored (taste/architecture). Execution: 1–2 Haiku sessions via `ultracode-loop`.
> Repos touched: **verdant-studio** (site, primary) + **garden** (in-app onboarding, Phase 4).
> Foundation: **v2 architecture, fresh design.** Keep the GSAP/Lenis/ink-library/choreography
> engine on `main`; gut and rebuild every page, layout, and visual. v1 retires at the end.

---

## 0. Why this exists (the brief, distilled)

The current site (both branches) is **all atmosphere, no product**. Koson prints + manifesto
creed + a static phone mock. Anthropic's pages are minimal *but demonstrate the product* — the
cowork place-card executing a task, the design page's scroll-driven icons + embedded video. KP's
verdict on v2: right engine, hated execution (fonts blend into the bg, square cutoffs, zero
interactivity). The company has changed: Garden is near public beta, sold by subscription, and the
site must do what a real product company's site does the day it starts selling.

**Aesthetic stance (locked):** keep the Japanese-garden identity + our assets (KP: "minimal but
with OUR aesthetics and assets"). Change the *structure*, not the paint — product-forward narrative,
one signature interactive moment per page, Anthropic-grade restraint and confidence.

**Truth correction (NON-NEGOTIABLE):** the live hero claims *"No data to sell — because it never
leaves your device."* Garden's own VISION forbids that flat claim — privacy is a **user-controlled
3-tier spectrum** (manual = fully local · AI import = touched once by the parser · bank link =
labeled plaintext transit). Every page must tell the honest spectrum. Handled well, the spectrum is
*more* trustworthy than the overclaim, and it's the structural moat. No "never leaves your device"
anywhere.

---

## 1. Information architecture — "if we started selling Garden tomorrow"

### Primary nav (product-forward, 4 + CTA)
`Garden` · `Security` · `Pricing` · `Studio`  →  **CTA: "Join the beta"** (gold seed-button)

- **Garden** — the product. The page that sells it.
- **Security** — its own page (KP's call). The honest spectrum, E2E, threat model. Trust spine for finance.
- **Pricing** — the honest model: you pay, we don't sell you. Beta terms.
- **Studio** — who Verdant is. **Ethos + People fold in here** (People is bare — a studio of one).

### Footer (the deep / niche-interest links — "for those who'd only care about that subject")
Two-tier footer. Column 1 product (Garden, Pricing, Join the beta, Status/Roadmap). Column 2 trust
(Security, Privacy policy, Terms, Your data rights). Column 3 studio (Studio, Ethos, Field Notes,
Contact). Plus the **stray stone → Emerald** easter egg, logo mark, "Independent · privacy-first."

### Full page set
| Route | Page | New? | Signature moment |
|---|---|---|---|
| `/verdant` | **Home** | rebuild | Growing-garden hero + scroll-driven icon/text pillars |
| `/verdant/garden` | **Garden (product)** | rebuild | **Interactive place-card product tour** (video-ready) |
| `/verdant/security` | **Security & privacy** | rebuild | The 3-tier spectrum, interactive tier toggle |
| `/verdant/pricing` | **Pricing** | **NEW** | Honest model card; beta = free early access |
| `/verdant/beta` | **Join the beta** | **NEW** | The "ascent" — what's ready, what's coming, how to get in, expectations |
| `/verdant/studio` | **Studio (about)** | rebuild | KP, the philosophy; ethos + people folded |
| `/verdant/ethos` | **Ethos (deep)** | keep, light | Manifesto, founding belief (Anthropic register, honest) |
| `/verdant/notes` | **Field Notes / changelog** | **NEW** | "Ship once, well" — momentum + honesty signal |
| `/verdant/faq` | **FAQ** | **NEW** | Privacy/data/pricing/platform Qs for the curious |
| `/privacy` | **Privacy policy** | keep (v2 has it) | Legal |
| `/terms` | **Terms** | **NEW** | Legal — required to sell |
| `/verdant/emerald` | **Emerald** | keep | Hidden; reached via footer stone |
| 404 | rebuild | keep | On-aesthetic |

> Contact = `mailto:verdantmail@proton.me` + FAQ, no separate page for beta. Status/Roadmap can be
> a section of Field Notes for beta, split later.

---

## 2. The two signature interactions (the "premium Anthropic stuff")

### A. Interactive place-card product tour — `<GardenTour>` (Garden page centerpiece, echoed on Home)
The cowork place-card, our way. A framed device/card pinned center-stage. As the user scrolls (or
taps the rail), the **screen inside swaps** through Garden's real screens (Home → Money → Plan →
Grove) while the **surrounding copy + a sculptural clay icon change** to narrate each.
- **Video-ready by construction:** the framed slot is a `<video>`-shaped container. For beta it
  renders the existing Garden screenshots as an auto/scroll-advanced tour (honest — real screens,
  not a fake video). Dropping the real demo video later = swap the inner source, zero layout change.
- Built on v2's `HeroGarden`/choreography primitives + GSAP ScrollTrigger pin. Touch: tappable
  segmented rail (no hover-only). Reduced-motion: static card + stacked captions.
- **Do NOT shoot new screenshots** (KP: Garden changed too much). Use current
  `/verdant/garden/*.webp` as clearly-temporary placeholders; mark in code `// PLACEHOLDER — replace at beta`.

### B. Scroll-driven icon + text pillars — `<ScrollPillars>` (Home centerpiece)
Anthropic design-page move. A pinned section; as you scroll, the **sculptural clay icon
crossfades** and the **headline + line swap** through Garden's four pillars:
1. **Private by structure** — not by promise. The 3-tier spectrum, you in control.
2. **Grows with you** — net worth grows, debts are weeds, goals are seeds.
3. **Honest by model** — you pay, so you're the customer, not the product.
4. **Yours offline** — local-first; works with no signal, no account required to start.

Icons come from the clay-art set (§4). GSAP ScrollTrigger pin + crossfade; reduced-motion = a
static stacked list. This is the page's one signature moment; everything else stays restrained.

---

## 3. Per-page build specs (what each page actually is)

**Home** — Growing-garden hero (redesigned `HeroGarden`, reactive field, KP hated v2's so rebuild
the visual: asymmetric split, type pinned to a column, NOT centered, NOT square-cropped) → one-line
studio promise → `<ScrollPillars>` (signature) → Garden teaser card linking to product → honest
one-line privacy nod linking to Security → pull-quote → CTA band "Join the beta." Logo in nav,
hero lockup, footer.

**Garden (product)** — Hero: what Garden is in one confident line + Join CTA → `<GardenTour>`
(signature) → the three beds (Home/Money/Plan) + Grove, each with its real screen + honest copy
from `data/verdant.ts` → the privacy spectrum strip (links to Security) → pricing nod → CTA.

**Security & privacy** — The spine. Interactive **3-tier spectrum** component (toggle a tier, see
exactly what's private and what touches a server). E2E-at-rest explainer (AES-GCM, ciphertext-only
relay). What we can and can't see. Threat model in plain words. Dark "night-band" register here
(use the dark asset-pack crops — fits the serious tone). Link to Privacy policy + Terms.

**Pricing** — One honest model card. **Beta testers get Garden lifetime free** (friends-and-family
beta; donations considered once we go beyond it — mention donations lightly, not a price). Present
the *model philosophy*, **no public $ numbers**: "You pay for the app — that's the whole business.
No ads, no data sold, ever. When bank sync arrives, it's billed at what it costs us, not marked up."
KP's working numbers (~$4/mo for server/hosting; bank-sync passthrough ≈ provider cost) stay
INTERNAL until his full business-mode revamp pre-ship — do NOT carve them into the public page.

**Join the beta (the ascent)** — What the beta is, what's ready today vs in-soil, the privacy
posture *during* beta, what we ask of testers, and a clean handoff to the app (deep link to
`garden.khushinpatel1.workers.dev`). Sets expectations so the in-app first-run (Phase 4) lands.

**Studio** — KP as a studio of one (honest, no invented people/year/location). Philosophy. Ethos
woven in with a link to the deep Ethos page. Emerald hinted.

**Ethos (deep)** — The manifesto/creed, founding-belief register. Anthropic's mission tone adapted
honestly: built so it *can't* betray you, structurally on your side.

**Field Notes** — Simple reverse-chron list of what shipped (seed from git history + plan
closeouts). Trust through visible, honest momentum. Beta: hand-authored entries.

**FAQ** — Accordion. Seed Qs: Is my money data really private? What touches a server? Do I need a
bank login? What does it cost? iOS/Android? What happens to my data if Verdant shuts down? Who's
behind it?

**Terms / Privacy** — Privacy: keep/refresh v2's `privacy.astro`, align to the spectrum. Terms:
standard SaaS terms scaffold, flag any clause needing KP/legal review (no invented legal promises).

**404 / Emerald** — keep, restyle to new system.

---

## 4. Asset pipeline (placeholders, on-aesthetic, beta-grade)

Source: `~/Dev/assests/` (note misspelling). **Usable now (clean singles → just crop/convert/place):**
- `lucid-origin_..._clean_cut-0.jpg` — **orange koi on cream.** → koi accent (Garden "weeds", footer, Money pillar).
- `lucid-origin_..._Hero_landscape_-0.jpg` — **misty green reed Sumi-e on cream.** → a hero/section bg on paper.
- `specs_..._jltcc..._0.png` — **vertical glowing-lantern garden strips.** → ScrollPillars card art / gallery.
- Existing `public/verdant/art/*` (Koson, already cropped) — keep using.
- `*.mp4` clay-art clips — ambient texture only, NOT as the product demo.

**Crop-from-contact-sheet (the two big ChatGPT PNGs are libraries, dark register):**
- `enhanced_ChatGPT..._10_31_33`/`10_36_37` — moonlit bridge, torii, stone lanterns, bamboo, koi,
  cranes, borders, a color palette strip. Crop only what Security's dark band + CTA bands need.

**Pipeline task (mechanical → Haiku, exact instructions in §7):** copy usable singles into
`public/verdant/art/` (or `/icons/`), convert PNG→WebP (`cwebp -q 82`), name semantically
(`koi-cream.webp`, `reeds-mist.webp`, `lantern-strip-*.webp`). For the clay icons used in
ScrollPillars, extract 4 square subjects on off-white → `public/verdant/icons/pillar-{private,grow,honest,offline}.webp`.
Every web asset gets a one-line provenance comment. **All placeholder — replaced when Garden's beta video/shots are shot.**

---

## 5. Logo work (DECIDED — KP 2026-06-19)

**The sprout becomes GARDEN's mark.** KP's call — the sprout *is* Garden (things grow). Move the
existing `Logo.tsx` sprout glyph to be Garden's official mark: Garden site page, **garden app shell
+ onboarding** (elevate the existing `GrowSprout`), Garden OG. New Garden wordmark = sprout +
display serif.

**Verdant gets a NEW mark — TEMP "V", simple + iconic (KP 2026-06-19, REVISED — enso rejected).**
The enso open-ring read as a "C/O" — awful. Replace with a **temporary geometric "V" with subtle
character** in the **Anthropic register** (clean, confident, restrained — NOT Claude's playful
sunburst). "Slight visual": e.g. the V's right arm tapering into a small leaf-bud terminal, or an
asymmetric stroke weight — one quiet detail, monochrome, `currentColor`, reads at 16px. Clearly a
**placeholder** until a final mark is commissioned. `VerdantMark` keeps its component name/API so
the new glyph propagates everywhere automatically. **Opus implements the SVG in the post-build fix
pass** (tier: glyph = taste; delegate the file write to Sonnet or use the 5-min override).

**Verdant mark goes everywhere:** nav, footer, hero lockup, OG images, favicon (regenerate from the
**V** glyph), 404, loading/empty states, beta→app handoff. Audit every page for logo presence.

---

## 6. Copy voice (Anthropic register, our honesty)

Confident, benefit-first, plainspoken; mission-forward but never overclaiming. Rewrite the core
strings in `src/data/verdant.ts` and page copy. Principles:
- Lead with what it does *for you*, then how it's built.
- Mission tone like early Anthropic ("for the benefit of…") adapted: *software that answers to you,
  not advertisers* — but every privacy line maps to the true spectrum.
- Kill: "never leaves your device" (flat), any invented number/person/date, manifesto-only filler.
- Keep our calligraphic `<em>`→gold emphasis as the one delicate hand.

---

## 7. Phasing for the loop (Haiku-executable, 2-at-a-time, commit per repo)

> Each task names files, shows the change shape, gives a verify command. Executors read
> `.codesight/CODESIGHT.md` + the v2 primitives (`HeroGarden`, `VineBorder`, `ink/*`,
> `utils/choreographedReveal.ts`, `useReactiveField.ts`) before editing. Work on branch
> `redesign/007` off `main`; merge to `main` (= deploy) only when Phase 5 is green.

- **P1 — Foundation:** branch off main; refine design tokens (kill v2's "square cutoff" / low-
  contrast type issues — raise contrast, asymmetric crops, masks not hard boxes); rebuild
  Nav + Footer to the new IA; Logo placement audit; asset pipeline (§4). Verify: `npm run build` + `npm run check`.
- **P2 — Core pages + signature interactions:** `<ScrollPillars>`, `<GardenTour>`, Home, Garden,
  Security (spectrum toggle), Pricing, Beta. Verify: build green + reduced-motion + touch rail works.
- **P3 — Supporting pages:** Studio (ethos+people folded), Ethos deep, FAQ, Field Notes, Terms,
  Privacy align, Emerald + 404 restyle. Verify: build green, all routes resolve, sitemap updated.
- **P4 — Garden app onboarding (garden repo):** richer `WelcomeStep` (what Garden is + what you can
  do); a **"What you can do / make it yours" surface** after `DoneStep` (Grove, plain↔garden voice,
  privacy tiers, budgets/goals — so testers know what to play with); expand `useFirstRunTour`
  (TOUR_LENGTH) to point at the real affordances; align all onboarding copy to the honest spectrum;
  honest beta expectations. Verify: `npm run build`/test in garden.
- **P5 — Verify + ship:** full build, Lenis/preview spot-checks, responsive + dark + reduced-motion,
  OG images, then merge `redesign/007`→`main` (deploys), confirm CI green + live SHA, redirect v1
  (`verdant-1wg`) → canonical. Report live SHA, stop.

---

## 8. Checkpoints — RESOLVED (run autonomous to live)
1. **Pricing** — RESOLVED: beta lifetime-free; model-philosophy on site, numbers internal (§3 Pricing).
2. **Logos** — RESOLVED: sprout→Garden; new enso open-ring for Verdant (§5).
3. KP wants zero interaction until the live site. Build green → merge to main → confirm CI → report live SHA.

## 9. Deferred (NOT this build — KP's explicit asks)
- **Business-mode scrutiny of Garden's pricing model** before ship (lifetime-free beta → low flat
  price + ~$4/mo server + bank-sync-at-cost passthrough). KP wants this scrutinized exclusively by
  Claude in business mode as a standalone task. Logged in TODO; do not pre-commit numbers on the site.
