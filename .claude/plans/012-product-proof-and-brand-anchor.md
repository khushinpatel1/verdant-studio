# 012 — Product proof + brand anchor

STATUS: DONE

## Why
Two outside audits agreed on the real gaps after fact-checking against the live repo: homepage
leads with manifesto copy instead of product, real Garden screenshots already exist (used on
`/verdant/garden`) but never reach the homepage, the carousel runs literal placeholder text, no
roadmap exists, and the brand layer ("Verdant Studio") doesn't yet stand on its own — it reads as
a wrapper around Garden. KP's call: Garden carries the business now, but Verdant has to survive
Garden's eventual end, so the studio identity needs one place that's true independent of any
single product.

Visual identity (organic aesthetic, Hero/FeatureRow/CardGrid kit, color system) is NOT in scope —
both audits and studio doctrine agree the look is already above-average. This is copy, content
ordering, and two new content additions only.

## What NOT to touch
- No new component kit, no redesign, no new color/type system.
- Don't rewrite `pricing.astro` — already confident copy, both audits' complaint about it doesn't
  match what's on disk.
- Don't rewrite `security.astro`'s `PrivacySpectrum` tier model — it's more honest than a flat
  diagram. Only ADD a simple architecture visual alongside it.
- Don't merge `team.astro` into anything — it already redirects to `studio.astro`. Leave it.

---

## Step 1 — Homepage hero: product first, not manifesto
**File:** `src/pages/verdant/index.astro` lines 15-23

Replace:
```astro
headline="Most apps work against you. Ours can't."
sub="No ads. No trackers. Your data stays yours — encrypted on your device. Designed so we couldn't betray you even if we tried."
```
With:
```astro
headline="Private personal finance."
sub="Track accounts, budgets, goals, and net worth — without selling your data to do it. Built by Verdant Studio."
```
Keep `cta1`/`cta2` as-is (Explore Garden / Read the ethos) — those already point the right places.

**Verify:** `grep -n "headline=" src/pages/verdant/index.astro | head -1` shows the new line.

---

## Step 2 — Homepage: real screenshots replace decorative cards
**File:** `src/pages/verdant/index.astro` lines 25-44 (the 3-card Garden/Security/Ethos grid)

Replace the `icon=` values on the Garden and Security cards with real app screenshots already
in the repo (no new assets needed):
- Garden card: `icon="/verdant/garden/garden-home.webp"` (was `koi.jpg`)
- Security card: keep `crane.jpg` — it's not a product, leave decorative
- Ethos card: keep `hero-grasses-sun.jpg` — leave decorative

**File:** same file, lines 46-53 (first `FeatureRow`, "Garden: your whole financial life")

Change `mediaSrc={garden.cover}` → `mediaSrc="/verdant/garden/garden-money.webp"` so the first
product row shows the budgeting screen, not the same home screenshot used elsewhere.

**Verify:** `grep -n "garden-home.webp\|garden-money.webp" src/pages/verdant/index.astro` returns 2 matches.

---

## Step 3 — Kill the placeholder carousel
**File:** `src/pages/verdant/index.astro` lines 71-87

The three carousel items are literal placeholder text ("First note about Garden's early access
release...", "Updates on the roadmap...", "Stories from beta testers..." — none of this is real
content). Two options, pick whichever is true:
- If real field notes exist in `src/data/verdant.ts` or `/verdant/notes`, pull 3 real entries in.
- If not, delete the `<Carousel>` block entirely rather than ship fake testimonials/fake notes.

Given no real notes content was found in this repo as of this plan, **delete the Carousel block**
(lines 71-87) and the now-unused `Carousel` import (line 10).

**Verify:** `grep -n "Carousel" src/pages/verdant/index.astro` returns nothing.

---

## Step 4 — Trim the philosophy FeatureRow on the homepage
**File:** `src/pages/verdant/index.astro` lines 55-61 ("Privacy structured, not promised")

Shorten body copy — this is the densest philosophy paragraph above the fold:
```astro
body="Manual entry stays fully local. AI import touches it once. Bank links travel labeled and in the open. You choose the tier; the architecture holds it."
```
→
```astro
body="Manual entry stays fully local. AI import touches your data once. Bank sync travels encrypted. You choose the tier."
```
Minor trim, not a rewrite — same claim, fewer words.

---

## Step 5 — Add a Roadmap page
**New file:** `src/pages/verdant/roadmap.astro`

Three-column status board, same kit components as every other page (Hero, CardGrid, Card,
Footer). Structure:
```astro
---
import Verdant from "../../layouts/Verdant.astro";
import Footer from "../../components/verdant/Footer";
import Hero from "../../components/verdant/kit/Hero.astro";
import CardGrid from "../../components/verdant/kit/CardGrid.astro";
import Card from "../../components/verdant/kit/Card.astro";
---
<Verdant title="Roadmap — Garden" description="What's shipped, what's being tested, what's planned.">
  <Hero headline="Where Garden stands" sub="Built slow, on purpose. Here's exactly what's live, what's being tested, and what's next." />
  <CardGrid cols={3} title="Building">
    <Card headline="Bank sync" blurb="Labeled, encrypted account linking. In active development." />
  </CardGrid>
  <CardGrid cols={3} title="Testing">
    <Card headline="Grove (AI assistant)" blurb="Ask questions about your own numbers, answered locally." />
  </CardGrid>
  <CardGrid cols={3} title="Planned">
    <Card headline="Multi-currency" blurb="Track accounts across currencies in one net worth view." />
  </CardGrid>
  <Footer client:visible />
</Verdant>
```
KP: fill in real Building/Testing/Planned items before this ships — the three above are placeholders
for shape only, don't push fake roadmap claims live.

**File:** `src/data/verdant.ts` nav export (around line where `links:` array is defined)

Add `{ label: "Roadmap", href: "/verdant/roadmap" }` to the `links` array, after Security.

**Verify:** visiting `/verdant/roadmap` renders; `grep -n "Roadmap" src/data/verdant.ts` shows the nav entry.

---

## Step 6 — Security page: add a literal architecture diagram
**File:** `src/pages/verdant/security.astro`, insert after line 26 (`</CardGrid>`), before the
`PrivacySpectrum` div (line 28)

Add a plain 4-box flow, plain HTML/CSS, no new component:
```astro
<div style="padding: clamp(2rem, 6vw, 3rem) clamp(20px, 5vw, 56px); max-width: 600px; margin: 0 auto; text-align: center; font-family: var(--font-mono, monospace); color: var(--fg); line-height: 2;">
  <div>Device</div>
  <div style="color: var(--moss);">↓ encrypt</div>
  <div>Ciphertext</div>
  <div style="color: var(--moss);">↓ sync</div>
  <div>Server (stores ciphertext only — never sees your data)</div>
</div>
```
This sits ABOVE the existing `PrivacySpectrum` (the tiered breakdown) — diagram for the 10-second
read, spectrum for the person who wants the real nuance. Don't replace one with the other.

**Verify:** `grep -n "Ciphertext" src/pages/verdant/security.astro` returns a match.

---

## Step 7 — Anchor Verdant Studio as standalone, not Garden's wrapper
**File:** `src/pages/verdant/studio.astro` lines 13-17 (Hero)

This page is already close — "Small, on purpose. No account managers." is good and already
exists. Add one line of `sub` copy that explicitly names the studio's identity past any single
product:
```astro
sub="A small, independent team building privacy-first software. Garden is the first project. It won't be the last."
```
(was: "A small, independent team building privacy-first software. One project finished. The next one in the soil." — keep the spirit, sharpen the claim to survive past Garden specifically.)

**File:** `src/data/verdant.ts` nav export

Rename the nav label for `/verdant/studio` from `"Studio"` to `"About"` — same href, clearer to
a first-time visitor than "Studio."

**Verify:** `grep -n '"About"' src/data/verdant.ts` shows the renamed nav entry.

---

## Step 8 — Final nav order
**File:** `src/data/verdant.ts` `nav.links` array

End state, in order:
```ts
links: [
  { label: "Garden", href: "/verdant/garden" },
  { label: "Security", href: "/verdant/security" },
  { label: "Roadmap", href: "/verdant/roadmap" },
  { label: "Pricing", href: "/verdant/pricing" },
  { label: "About", href: "/verdant/studio" },
],
cta: { label: "Join the beta", href: "/verdant/beta" },
```
`ethos.astro` and `notes.astro` stay live (linked from Footer + internal CTAs like `/verdant/ethos#talk`)
but drop out of primary nav — philosophy is one click further away, not gone.

**Verify:** `grep -n -A8 "links:" src/data/verdant.ts` shows exactly 5 entries in this order.

---

## Done when
- `npm run build` (or repo's actual build command — check `package.json`) passes clean.
- Homepage hero says "Private personal finance," not "Most apps work against you."
- Homepage shows at least one real Garden screenshot above the fold.
- No placeholder carousel text ships.
- `/verdant/roadmap` exists and is in nav.
- `/verdant/security` shows the 5-line diagram above the spectrum breakdown.
- Nav is exactly: Garden / Security / Roadmap / Pricing / About.
- Build green → push → confirm CI deploy green → report commit SHA. No screenshots as proof.
