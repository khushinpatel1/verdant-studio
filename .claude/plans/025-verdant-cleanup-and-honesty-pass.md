# 025 — Verdant cleanup: kill emoji/illustrations, fix scroll-card jank, honest bank-sync copy

Repo: verdant-studio. Executor: haiku. Verify: `npm run build` (astro build) after each section, fix
before moving on. No new dependencies.

## A. Remove emojis

1. `src/components/verdant/StickyProductStory.tsx` lines 36, 44, 52 — `icon: "🏠"`, `"📍"`, `"🔒"`.
   Replace the `icon` field type from emoji string to inline SVG (copy the line-icon style already
   used in `src/components/verdant/GardenTour.tsx` `StopIcon` — 22x22, `stroke="currentColor"`,
   strokeWidth 1.6, round caps). Reuse GardenTour's home/plan icons conceptually (home roofline,
   goal marker) and design one new lock glyph (simple padlock outline) for `protect`. Render as
   `<Icon />` components, not strings — update lines 130-132 (`sps-icon` div) and 149
   (`sps-rail-icon` span) to render the component instead of interpolating a string.
2. `src/components/verdant/Nav.tsx` line 63 — `✕` close glyph. Replace with an inline SVG X (two
   crossed lines, currentColor, matches the rest of the icon system), same visual weight.
3. After the fix, grep to confirm zero emoji remain: `grep -rlP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' src` must return nothing.

## B. Delete illustration assets (unused, unauthorized visual debt)

1. Confirmed dead (zero references anywhere in `src`): delete these files outright:
   - `public/assets/verdant/hero-bg.svg`
   - `public/assets/verdant/logo-mark.svg`
   - `public/assets/verdant/section-divider.svg`
   - `public/assets/verdant/favicon.svg` (dupe of `public/favicon.svg`, confirm the latter is what
     `Verdant.astro` layout actually links before deleting)
   - `public/assets/verdant/subject-koi-red.webp`
2. The sumi-e ink illustration set (`src/components/verdant/ink/Enso.tsx`,
   `MountainRidge.tsx`, `BlossomBranch.tsx`, `Koi.tsx`, `MistLayer.tsx`, `Moon.tsx`, `Bamboo.tsx`,
   plus `src/components/verdant/InkGrowth.tsx`) is only imported by `src/pages/404.astro` and
   `src/pages/verdant/team/[slug].astro`. Remove the imports and rendered instances from both
   pages (replace with plain typographic treatment — headline + body copy, no illustration, matches
   the rest of the site's restraint), then delete the whole `src/components/verdant/ink/` directory
   and `InkGrowth.tsx`.
3. Leave `public/verdant/art/koi.jpg`, `public/verdant/media/koi.jpg`,
   `public/verdant/garden/*.webp` and `*.jpg` alone — those are real product screenshots and the
   Emerald teaser image (`src/data/verdant.ts` `emerald.cover`), not illustrations.
4. Verify: `grep -rln "ink/Enso\|ink/MountainRidge\|ink/BlossomBranch\|ink/Koi\|ink/Moon\|ink/MistLayer\|ink/Bamboo\|InkGrowth" src` returns nothing.

## C. Fix the laggy scrolling-card sections

Root cause in both components: the GSAP `ScrollTrigger.onUpdate` callback fires on every scroll
frame (not just when the active index changes), and `StickyProductStory` additionally spawns a
*new* `gsap.to()` tween per card on every single one of those frames — hundreds of competing tweens
per scroll gesture. That's the jank.

1. `src/components/verdant/StickyProductStory.tsx` (index page section) — inside the `onUpdate`
   handler (lines 81-105): guard the whole body behind an index-changed check. Track the last index
   in a ref (e.g. `const lastIdx = useRef(-1)`) and only call `setActiveChapter(idx)` and run the
   card animation when `idx !== lastIdx.current`, then update the ref. Delete the manual
   `cards.forEach(...) gsap.to(...)` block entirely — the component already re-renders the
   `.sps-card` elements with the correct `transform`/`opacity` inline styles (lines 162-165) driven
   by `activeChapter` state, and CSS already has `transition: all 0.6s var(--ease-soft)` on
   `.sps-card` (line 267). The inline-style + CSS-transition path is sufficient; the imperative GSAP
   tweening was fighting it. Result: state updates (and re-renders) only happen on chapter change,
   not every scroll pixel.
2. `src/components/verdant/GardenTour.tsx` (garden page section) — same fix pattern in `onUpdate`
   (lines 148-150): add a `lastIdx` ref, only call `setActive(idx)` when it actually changed.
3. Test manually after the fix: `npm run dev`, scroll through both sections on desktop at normal
   speed — no stutter, no dropped frames, chapter/stop text and card swap should feel instant and
   smooth, not sticky or delayed.

## D. Bank-sync / privacy copy — pivot per KP's ruling (2026-07-01)

KP's ruling, verbatim intent: garden pursues whatever automation and sync options get customers the
most convenience — no more "manual-first, Plaid-is-someday-maybe" purism. But the copy must be
brutally honest about the tradeoff: the moment data leaves the device to a bank-sync provider, it is
in that provider's hands, not Garden's. Garden protects what it holds; it cannot protect what it
never touches once it's out. Drop the "architecture-only, three-named-providers" framing — it reads
as indecisive and is stale.

Edit `src/data/verdant.ts`:
1. `garden.accountConnection` (line 49) — currently "Manual CSV import for now. Bank sync coming."
   Rewrite to something like: "Manual entry and CSV import today. Bank sync is coming — Garden will
   support whatever connection gets you the most automation. Once your data reaches that connection,
   it's in the provider's hands, not ours. We'll always tell you exactly where the line is."
2. `privacySpectrum[2]` (the `bank-link` tier, lines 131-143) — rewrite `what`, `status`, and
   `reality` to drop the "SnapTrade, SimpleFIN, Plaid — architecture only" specifics (that
   provider list is stale/undecided) and state the honest tradeoff plainly: bank sync means
   real-time convenience in exchange for your data transiting a third party; Garden relays it but
   cannot protect it once it's with that provider; no E2E claim for this tier, same as today's
   copy, just without the named-providers commitment.
3. `ethos.shipping` (line 193) — `"Bank sync (SnapTrade, SimpleFIN)"` → drop the provider names,
   e.g. `"Bank sync (in progress — provider TBD)"`.
4. `ethos.dataPortability` (line 195) and `faq[1]` answer (lines 207-208) — same edit: remove named
   providers, state the "once it leaves your device it's out of our hands" line plainly.
5. Search for any other "SnapTrade|SimpleFIN|Plaid" mentions across `src/pages/verdant/*.astro`
   (check `security.astro`, `roadmap.astro`, `faq.astro`, `ethos.astro`) and apply the same edit —
   provider names are being genericized to "a bank-sync provider" everywhere.

## E. Remove pricing info

KP's ruling: strip pricing claims/pages — Garden's pricing isn't decided, don't commit to public
numbers or "free during beta forever" language that could be wrong later.

1. Delete `src/pages/verdant/pricing.astro`.
2. Remove the `{ label: "Pricing", href: "/verdant/pricing" }` entry from `src/data/verdant.ts`
   `nav.links` (line 22).
3. Remove or reword `garden.pricing` field (`src/data/verdant.ts` line 47 — currently `"Free during
   the beta. No ads, no data sold. That doesn't change."`). Keep the "no ads, no data sold" part if
   used elsewhere as an ethos claim, but drop the pricing-specific field/usage.
4. Grep every consumer of the removed page and field before deleting: `grep -rln "pricing\|Pricing"
   src` currently hits `Footer.tsx`, `data/verdant.ts`, `pages/verdant/pricing.astro`,
   `pages/verdant/notes.astro`, `pages/verdant/beta.astro`. Fix each: remove the nav/footer link to
   `/verdant/pricing`, remove any dollar/tier promises in `notes.astro` and `beta.astro` copy,
   replace with the existing "Join the beta" framing (no price mentioned at all).
5. Verify: `grep -rln "pricing\|Pricing\|\\$[0-9]" src` returns nothing (excluding this plan file).

## F. Verify

Run `npm run build` after each section (A–E), not just at the end — catch breakage early since this
is a lot of small edits across shared data. Fix any TS/astro errors before moving to the next
section. Final check: `npm run dev`, visually confirm index page and garden page scroll sections are
smooth, no emoji/illustration remnants, nav has no pricing link, 404 and team pages still render
without the ink components.

---

## Asset advice for KP (not for haiku to execute — read this, don't build it)

The site doesn't need more decorative illustration (that's what's being deleted in section B) — the
"hollow" feeling is more likely the missing human/brand layer than missing screenshots (the four
real Garden screenshots in `public/verdant/garden/*.webp` are legitimate and current, keep using
them). To close the gap cheaply:

1. **Founder presence** — `src/pages/verdant/team/[slug].astro` and `studio.astro` currently have no
   real photo (per the file 006 plan, `team` array is empty). A single real photo of you (workspace,
   headshot, whatever you're comfortable with) does more for "hollow" than any illustration. Doesn't
   need to be professional — an iPhone photo with decent light beats a stock illustration.
2. **OG/social preview image** — check if `public/` has an `og-image` for link previews; if not,
   that's a real, cheap, high-leverage asset (one static 1200x630 image, canva or a screenshot
   composite of the app).
3. **Skip stock illustration entirely.** Sites in this "quiet, honest, small studio" register (which
   is explicitly Verdant's brand voice per `data/verdant.ts`) read as more credible with *zero*
   decorative art than with generic line-art — the ink assets being deleted were doing the opposite
   of what the brand wants. If you want texture later, real photography (workspace, hands, paper) >
   any generated/stock illustration for this brand.
4. If you do want AI-generated imagery later (e.g. for an OG image or a texture background), the
   `imagegen-frontend-web` skill is built for exactly this and is already available in this
   environment — invoke it fresh per asset rather than reusing old ink-set output.

### Asset priority (KP's ruling, 2026-07-01)

Prioritize, in this order:
1. **Live HTML product UI** — strongest, most credible asset. The four real `garden-*.webp`
   screenshots already qualify; keep leaning on real UI over anything illustrated.
2. **Browser-recorded product motion** — short, tightly cropped loops for complex flows (e.g. the
   `GardenTour` device frame is the natural slot for this per its existing "VIDEO-READY SLOT" note
   in `GardenTour.tsx`).
3. **Custom SVG diagrams** — for privacy, encryption, imports, and data ownership concepts (the
   privacy-spectrum section is a strong candidate: a small custom diagram beats a wall of text).
4. **Real macro photography** — paper, glass, metal, workspace, hands, or natural textures,
   photographed consistently (same light/style across shots, not a stock grab-bag).
5. **Rive** — at most one custom interactive hero object, only if the brand identity genuinely
   needs an illustrated signature moment. Not a default.
6. **GSAP** — reserved for the homepage product narrative and orchestrated transitions (i.e. what
   section C of this plan is fixing), not for decorative motion elsewhere.
7. **CSS 3D transforms** — for layered product cards/sheets, no heavyweight 3D library needed.
8. **Canvas** — only for a restrained, responsive field behind the hero, if used at all.

Avoid entirely: generic AI watercolor/landscape art, stock "zen" imagery, decorative blobs and
gradients, Spline objects added just because they rotate, Lottie packs or premade illustration
packs, and AI-generated imagery as the final shipped hero centerpiece. AI imagery is fine for
internal moodboarding only — shipped assets must be real product UI, custom diagrams, or authentic
photography. This is the standard the section B illustration deletions are enforcing: the ink set
was exactly the kind of decorative-illustration-as-hero-art this ruling now explicitly rules out.
