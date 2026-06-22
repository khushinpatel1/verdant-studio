# 006 — Verdant site deficiency + taste audit (by Codex)
Status: REPORT (input for the Haiku ship plan — no code changes made)

## 1. Faded assets — app screenshots vs decorative art (file:line, which to un-fade)

### Finding: product screenshots are being treated like paper art

The current media primitive applies the same `.v-bleed` treatment to real Garden screenshots and decorative botanical images:

- `src/components/verdant/kit/Hero.astro:58-73` renders every hero image/video with `.v-bleed`.
- `src/components/verdant/kit/FeatureRow.astro:34-47` renders every feature image/video with `.v-bleed`.
- `src/styles/verdant.css:168-176` defines `.v-bleed` with a tight radial `mask-image` and `mix-blend-mode: multiply`; this is correct for decorative paper art, wrong for app UI.
- `src/styles/verdant.css:179-187` already admits this in a comment and partially overrides `/verdant/garden/*` assets to `mix-blend-mode: normal`, but it still applies a radial mask from `#000 62%` to `transparent 99%`. That means Garden screenshots are less muted than decorative art, but still feathered instead of reading like a crisp phone.

Un-fade these app screenshot placements:

- `src/pages/verdant/index.astro:17-18` uses `/verdant/garden/garden-home.webp` in the home hero. It goes through `Hero.astro` and `.v-bleed`; this should be a full-fidelity product surface, ideally inside a phone/chrome frame or replaced with `GardenLive`.
- `src/pages/verdant/garden.astro:32-38` uses `garden.screens[0].img` in `FeatureRow`; data source is `src/data/verdant.ts:51-57`.
- `src/pages/verdant/garden.astro:40-46` uses `garden.screens[1].img` in `FeatureRow`; data source is `src/data/verdant.ts:58-63`.
- `src/pages/verdant/garden.astro:48-54` uses `garden.screens[2].img` in `FeatureRow`; data source is `src/data/verdant.ts:64-69`.
- `src/components/verdant/GardenTour.tsx:41-55` builds Home/Money/Plan/Grove stops from real screenshots; `src/components/verdant/GardenTour.tsx:223-231` renders them; `src/components/verdant/GardenTour.tsx:355-366` sets each screenshot to `opacity: 0` until active and then applies a radial mask to the screenshot itself. Active images become `opacity: 1` at `src/components/verdant/GardenTour.tsx:368-370`, but the mask still fades the UI edges.
- `src/data/verdant.ts:42` defines `garden.cover` as `/verdant/garden/garden-home.webp`, and `src/pages/verdant/garden.astro:27-29` uses it as the poster for a decorative landscape hero video. If the poster shows during load, it is product imagery being hidden behind a non-product hero treatment.

Target quality already exists but is not mounted:

- `src/components/verdant/GardenLive.astro:3-7` describes the desired treatment: a DOM-rendered phone, no screenshot/video file, scales crisply, no crop.
- `src/components/verdant/GardenLive.astro:87-102` builds the phone bezel and screen with crisp CSS, not paper blending.
- `src/components/verdant/GardenLive.astro:109-115` animates scenes by opacity inside the phone, but the phone surface itself is not globally masked or desaturated.
- `rg -n "GardenLive" src` only finds the component comment, so the crisp phone is currently unused.

### Decorative art that can stay faded

These are atmospheric/illustrative assets, not product evidence:

- `src/styles/verdant.css:350-389` defines `.v-print-field` for Koson-style prints with `mix-blend-mode`, `--pf-opacity`, `--pf-filter`, and radial masks. Current audit search found no active page/component markup using `.v-print-field`, but the system is fine for decorative art only.
- `src/styles/verdant.css:400-418` defines `.v-night-band .v-print-field` with `--pf-opacity: 0.75`, mobile `0.7`, and `--pf-filter: saturate(0.65) contrast(1.06)`. Fine for night/decorative print layers; never use for Garden screenshots.
- `src/pages/verdant/emerald.astro:84-99` fades/masks `emerald.cover`, decorative/unlisted art. Fine.
- `src/components/verdant/ScrollPillars.tsx:313-323` uses a `koi.jpg` backdrop at `opacity: 0.16` behind ink icons. Decorative. Fine, but this component is not mounted anywhere.
- `src/components/verdant/kit/Card.astro:13-16` and `src/styles/verdant.css:191-198` fade icon art. Fine for tiny decorative icons, not app screenshots.

### Mechanical direction

Create a product-media path distinct from `.v-bleed`: either `ProductPhone`/`GardenLive` or a `.v-product-shot` class with `opacity: 1`, `filter: none`, `mix-blend-mode: normal`, `mask-image: none`, full saturation, and real phone/device framing. App screenshots should fade only between screens if animated; the visible screen should not be paper-blended or edge-feathered.

## 2. Hollow pages (per-page: what's thin, what to add)

### Home: `src/pages/verdant/index.astro`

Evidence:

- `src/pages/verdant/index.astro:11-19` hero has one product screenshot, but it is routed through the faded `Hero` media path.
- `src/pages/verdant/index.astro:21-27` has one text-only FeatureRow about privacy/security.
- `src/pages/verdant/index.astro:29-34` jumps to a CTA before the studio/product story has enough proof.
- `src/pages/verdant/index.astro:36-42` adds a decorative-art FeatureRow after the CTA, which makes the page order feel accidental.

What to add:

- Lead with crisp Garden product proof: mount `GardenLive` or a proper phone-framed screenshot/video in the first viewport.
- Add one editorial proof section showing what Garden actually does: Home/Money/Plan/Grove, not another abstract privacy paragraph.
- Use the existing but unused `ScrollPillars` concept only if it becomes the page's signature moment; otherwise cut it and ship a shorter, product-led home page.
- Move the CTA after the proof, not before the final explanatory section.

### Garden product page: `src/pages/verdant/garden.astro`

Evidence:

- `src/pages/verdant/garden.astro:22-30` hero uses a decorative landscape video, while the product is the reason the page exists.
- `src/pages/verdant/garden.astro:32-54` repeats three equal FeatureRows with screenshots run through `.v-bleed`.
- `src/pages/verdant/garden.astro:56-58` mounts the stronger product tour, but only after three preceding rows have already spent the product proof.
- `src/pages/verdant/garden.astro:60-64` ends the argument with a generic three-card grid.

What to add:

- Put crisp product proof first: `GardenLive` or a framed screenshot/video in the hero.
- Collapse the three screenshot FeatureRows into one more deliberate product narrative: one large phone plus adjacent tabbed copy, or one scrollytelling tour. Do not show the same screenshot grammar four times.
- Replace the `Built on` cards with proof: "Manual is local", "Import touches parser once", "Grove sends a summary only when asked" mapped to the actual privacy spectrum.

### Roadmap: `src/pages/verdant/roadmap.astro`

Evidence:

- The page is only `src/pages/verdant/roadmap.astro:9-20`: hero, three `CardGrid` sections, footer.
- `src/pages/verdant/roadmap.astro:11-19` uses three separate grids, each containing one card. Visually, that is empty scaffolding.

What to add:

- Replace one-card grids with a real roadmap table/timeline: Shipped, Live beta, Testing, Next, Later.
- Include status labels and dates only where verified from `src/data/verdant.ts:189-198`; do not invent release dates.
- Add direct links: app, security/privacy spectrum, beta signup.

### Beta: `src/pages/verdant/beta.astro`

Evidence:

- `src/pages/verdant/beta.astro:12` contains a KP-owed note that beta terms need business/legal sign-off.
- `src/pages/verdant/beta.astro:19-26` is a three-step join flow.
- `src/pages/verdant/beta.astro:28-32` is a three-card "Ready now" block.
- There is no product image, no term detail, no onboarding expectation beyond "Create an account".

What to add:

- A beta terms box with precise scope after KP sign-off: what "free" covers, account limits, what might change.
- A crisp phone/proof module showing the first thing a beta user will see.
- A small "what to test" checklist tied to actual Garden features, not generic "break it".

### Pricing: `src/pages/verdant/pricing.astro`

Evidence:

- `src/pages/verdant/pricing.astro:13-17` says "Lifetime free beta access" and "it won't be much" without concrete terms.
- `src/pages/verdant/pricing.astro:19-23` uses the same three-card pattern: no ads, no data sold, all features.
- `src/pages/verdant/pricing.astro:30-34` repeats "free" in CTA copy.

What to add:

- A single pricing/terms panel: Beta now, launch later, what is known, what is explicitly undecided.
- Move "no ads/no data sold" into the model explanation, not three equal cards.
- Flag as TASTE-CALL/KP-CALL: public promise language around "lifetime free beta access" should not ship without exact terms.

### Security: `src/pages/verdant/security.astro`

Evidence:

- `src/pages/verdant/security.astro:22-26` starts with three generic guarantee cards before the more honest `PrivacySpectrum`.
- `src/pages/verdant/security.astro:28-34` uses a centered text flow diagram made of plain divs and arrows.
- `src/pages/verdant/security.astro:36-38` mounts `PrivacySpectrum`, which is the strongest trust content on the page but is visually buried.
- `src/components/verdant/Footer.tsx:39` links to `/verdant/security#data`, but audit search found no `id="data"` on the security page.

What to add:

- Move `PrivacySpectrum` above generic cards, with an `id="data"` anchor.
- Replace the centered arrow diagram with a compact technical explainer/table: device, passphrase, ciphertext, server, parser/Grove exceptions.
- If a formal audit does not exist, do not imply one. Use "architecture notes" or "privacy spectrum" until verified.

### Studio: `src/pages/verdant/studio.astro`

Evidence:

- `src/pages/verdant/studio.astro:13-17` says "small, independent team".
- `src/data/verdant.ts:166-179` says the studio is deliberately a studio of one and `team` is empty.
- `src/pages/verdant/studio.astro:35-43` renders a "The team" grid by mapping `team`, which is empty.
- `src/pages/verdant/studio.astro:45-49` says "We're always looking for great people to join", contradicting the "studio of one / deliberately small" source of truth.

What to add:

- Rewrite as founder/studio-of-one editorial page.
- Remove empty team grid or replace it with a single biographical/operating-principles section.
- Replace hiring CTA with contact or "follow the work".

### FAQ: `src/pages/verdant/faq.astro`

Evidence:

- `src/pages/verdant/faq.astro:11-14` hero is generic.
- `src/pages/verdant/faq.astro:16-18` accordion is the whole useful body.
- `src/pages/verdant/faq.astro:20-24` CTA copy is generic support-site language.

What to add:

- It can remain a utility page, but should be denser: jump links, grouped privacy/pricing/import sections, and one stronger closing line.
- Pull the highest-risk answers near the top: passphrase, Grove, bank sync, beta pricing.

## 3. The bad bottom CTA ("green ink blobs") — locate + replacement direction

### Location

The active `CTABand` component itself is generic and centered, not an imported ink illustration:

- `src/components/verdant/kit/CTABand.astro:12-28` renders a plain centered CTA section.
- `src/components/verdant/kit/CTABand.astro:37-43` centers the stack.
- `src/components/verdant/kit/CTABand.astro:67-96` uses slabby filled/outlined button styling instead of the cleaner `.v-cta` hairline grammar from `src/styles/verdant.css:228-265`.

The "green ink blobs" are most likely the footer/dark-band pigment system that appears immediately after every bottom CTA:

- `src/styles/verdant.css:291-301` applies layered green radial gradients to `.v-footer::before` as well as `.vh-band`, `.ve-band`, and `.vg-band`.
- `src/components/verdant/Footer.tsx:10` renders every footer with class `v-footer`.
- `src/components/verdant/Footer.tsx:62-68` defines a subtler local footer gradient, but the global `[data-skin="verdant"] :is(... .v-footer)::before` selector has higher specificity for the same pseudo-element and background properties.
- `src/components/verdant/Footer.tsx:83-91` also adds the hidden emerald "stone"; it is intentional, but it can read like a random green dot if the footer already has radial green blooms behind it.

Every main page ends with `CTABand` followed by `Footer`:

- Home: `src/pages/verdant/index.astro:29-44`
- Garden: `src/pages/verdant/garden.astro:66-73`
- Beta: `src/pages/verdant/beta.astro:34-40`
- Pricing: `src/pages/verdant/pricing.astro:30-36`
- Ethos: `src/pages/verdant/ethos.astro:55-61`
- Security: `src/pages/verdant/security.astro:45-51`
- Studio: `src/pages/verdant/studio.astro:45-51`
- FAQ: `src/pages/verdant/faq.astro:20-26`

### Replacement direction

Safe mechanical fix:

- Stop applying the global pigment-bloom pseudo-element to `.v-footer`; keep `.v-footer` on cream/paper with a thin top rule. The footer should feel like product infrastructure, not another emotional art band.

Taste-call replacement:

- Replace bottom `CTABand` with an editorial closer: left-aligned headline, one crisp Garden phone/live UI on the right for product pages, one restrained hairline CTA, no radial green blobs.
- For non-product pages, use a small text-and-link closer instead of a hero-scale CTA. Example structure: label, one sentence, primary hairline link, secondary small link.
- Keep decorative sumi-e art out of the conversion block. Product proof closes Garden; quiet type closes studio/trust pages.

## 4. AI-slop patterns (three-card/three-bullet/templated) — where + how to elevate

### Structural primitives causing the pattern

- `src/components/verdant/kit/CardGrid.astro:33-60` defines equal-card grids and forces `repeat(3, 1fr)` at `min-width: 768px` for `cols={3}`.
- `src/components/verdant/kit/Card.astro:28-36` gives every card equal padding/background/radius/hover behavior.
- `src/components/verdant/kit/Steps.astro:46-56` uses an auto-fit grid, then forces exactly three columns at `min-width: 768px`.
- `src/components/verdant/kit/CTABand.astro:37-43` centers every closing CTA in the same stack.
- `src/components/verdant/kit/FeatureRow.astro:53-75` alternates a basic 1/1 two-column row. Repetition is fine once; repeated across pages it becomes template rhythm.

### Page instances

- `src/pages/verdant/garden.astro:60-64`: "Built on" is three equal cards with abstract claims. Replace with proof tied to the privacy tiers or product surfaces.
- `src/pages/verdant/beta.astro:19-32`: three-step flow immediately followed by three-card "Ready now". Replace with a beta onboarding/proof panel.
- `src/pages/verdant/pricing.astro:19-23`: three cards restating the business model. Replace with one pricing terms panel.
- `src/pages/verdant/security.astro:22-26`: three guarantee cards before the actual privacy spectrum. Promote the spectrum and cut/rewrite cards.
- `src/pages/verdant/ethos.astro:46-53`: "Our Three Laws" literalizes the three-bullet pattern. Could work if treated as editorial manifesto typography; current `Steps` makes it look generated.
- `src/pages/verdant/roadmap.astro:11-19`: three one-card grids. This is the clearest "template shell" offender.
- `src/pages/verdant/studio.astro:35-43`: empty three-column team grid because the source `team` array is empty.

### Elevation pattern

- Replace equal card grids with editorial layouts: one dominant proof block plus two secondary details, timeline rows, comparison tables, or a split page with live product on one side and dense copy on the other.
- Reserve cards for repeated items that truly need scanning. The core sales story needs scenes, not tiles.
- Use one signature product interaction per high-value page. Current local candidates: `GardenLive` for home/hero, `GardenTour` for Garden product proof, `PrivacySpectrum` for security.

## 5. Responsive/mobile issues (file:line)

### Footer can overflow on narrow screens

- `src/components/verdant/Footer.tsx:69-80` lays out footer content with flex rows.
- `src/components/verdant/Footer.tsx:74` sets `.v-footer-cols { display: flex; gap: clamp(2.5rem,6vw,5rem); }` but has no `flex-wrap` or mobile breakpoint.
- No `@media` block exists in `Footer.tsx`. On small screens, three footer columns plus wide gaps can overflow or compress badly.

Safe fix: add a mobile breakpoint: stack footer brand/nav, make `.v-footer-cols` grid or wrap, reduce gaps, and make legal text stack.

### Card and step grids switch too early into equal columns

- `src/components/verdant/kit/CardGrid.astro:50-60` forces 2/3/5 columns at `min-width: 768px`.
- `src/components/verdant/kit/Steps.astro:53-56` forces three columns at `min-width: 768px`.
- `src/components/verdant/kit/Steps.astro:87-95` positions connectors at 50% of each step; with unequal copy heights, the connector can visually cross the wrong vertical point.

Safe fix: use `auto-fit` longer, raise the fixed-column breakpoint, and remove/replace connector lines on tablet widths.

### Mobile product tour is functional but not premium

- `src/components/verdant/GardenTour.tsx:376-381` stacks copy under the phone at `max-width: 860px`.
- `src/components/verdant/GardenTour.tsx:280-310` uses wrapping rail buttons with icon+text; no mobile-specific compact treatment exists.
- `src/components/verdant/GardenTour.tsx:321` keeps phone width at `clamp(240px, 27vw, 320px)`. On phones this bottoms out at 240px, which is safe, but it can make the hero feel small unless paired with better surrounding rhythm.

Safe fix: mobile rail becomes a segmented horizontal scroller or icon-only control with visible labels elsewhere. Keep the phone crisp and prominent.

### Unused ScrollPillars has narrow-desktop risk if mounted

- `src/components/verdant/ScrollPillars.tsx:100-108` chooses pinned vs touch by pointer type, not viewport width.
- `src/components/verdant/ScrollPillars.tsx:332-423` has a 100svh pinned desktop layout and only rearranges columns at `max-width: 860px`.

If this component is mounted on home, add a width check so narrow fine-pointer viewports do not get the pinned scrollytelling layout.

### Notes page carries old-grid scar tissue

- `src/pages/verdant/notes.astro:86-94` comments that the page predates v3 kit and had dead `grid-column` behavior.
- `src/pages/verdant/notes.astro:110-115` still contains responsive rules targeting grid columns even though the page now uses flex/max-width wrappers.

Safe fix: clean this page into kit-compatible wrappers or leave it out of the ship-critical path. It is not the highest-impact public route, but it signals maintenance residue.

### Security footer anchor is broken

- `src/components/verdant/Footer.tsx:39` links to `/verdant/security#data`.
- `src/pages/verdant/security.astro` has no `id="data"`; audit search found only the footer link.

Safe fix: add `id="data"` to the privacy spectrum wrapper at `src/pages/verdant/security.astro:36`.

## 6. Competitor-benchmarked taste upgrades (specific, ranked)

Benchmarks verified from current public pages on 2026-06-22:

- Linear: https://linear.app/ leads with product UI and dense real workflows, then uses section modules like intake/plan/build/diffs/monitor instead of generic feature cards.
- Stripe: https://stripe.com/ uses product/system surfaces as the page structure: payment UI, billing meters, commerce examples, and dense capability sections.
- Arc: https://arc.net/ keeps the page short, product-shot-led, and plain about privacy/security.
- Things: https://culturedcode.com/things/ shows the actual app across devices early, then uses credibility/editorial proof rather than hiding behind abstract claims.
- Family: https://family.co/ repeatedly shows phone UI, demos, and concrete flows; it makes the app itself the brand.
- Retool: https://retool.com/ uses dense app examples and builder surfaces immediately; the product work is the visual system.
- Vercel: https://vercel.com/ organizes a broad platform into crisp categories, live-looking surfaces, and specific proof sections.

Ranked moves:

1. Product proof first, decorative art second. Garden is the flagship; the hero should show crisp Garden UI. Use `GardenLive` or real phone-framed screenshots before cranes/koi/sand. Safe mechanical for home/Garden; exact hero composition is a TASTE-CALL.
2. Kill screenshot fading at the source. Product media gets a separate class/component, not `.v-bleed`. Safe mechanical.
3. Replace generic CTAs with editorial closers. Linear/Vercel-style closers are functional and quiet; Family/Things-style closers show the product. Verdant should not end pages with centered button stacks plus green pigment blooms. TASTE-CALL.
4. Turn the roadmap into an artifact. Premium sites make progress legible. Use a dated/statused timeline or changelog-like table, not three one-card grids. Safe mechanical if using only verified dates from `src/data/verdant.ts`.
5. Promote the privacy spectrum above slogans. The spectrum is the differentiated trust move. It should sit above guarantee cards on Security and be linked correctly from footer. Safe mechanical.
6. Rewrite Studio around the true studio-of-one story. The current "small team" copy contradicts the source data. This should become an editorial page about taste, privacy, and ownership, with no fake hiring energy. TASTE-CALL for voice, mechanical to remove contradictions.
7. Vary density deliberately. Use one dense technical section after one generous emotional section. Current sections reuse the same `padding clamp + centered title + equal cards` rhythm. Safe mechanical for layout; TASTE-CALL for exact pacing.
8. Make mobile a first-class product story. On mobile, product screenshots should be larger, crisp, and swipe/tap native. Avoid tiny phone plus wrapped controls. Safe mechanical for overflow/breakpoints; TASTE-CALL for mobile interaction style.
9. Use fewer decorative motifs, harder. Keep sumi-e/botanical as a signature accent, not a generic background treatment everywhere. The product is a finance app; trust comes from clarity and crispness. TASTE-CALL.

## 7. Prioritized ship punch-list — ranked by (ship-impact × low-effort), each with file paths so a Haiku executor can act without re-discovery, flag which items are TASTE-CALLS that need KP sign-off vs safe mechanical fixes

1. SAFE MECHANICAL — make Garden screenshots/product media crisp everywhere.
   - Files: `src/styles/verdant.css`, `src/components/verdant/kit/Hero.astro`, `src/components/verdant/kit/FeatureRow.astro`, `src/components/verdant/GardenTour.tsx`.
   - Shape: add product-specific prop/class or source detection that removes `mix-blend-mode`, `filter`, and all screenshot `mask-image`; keep decorative `.v-bleed` for art only.
   - Verify: inspect `/verdant`, `/verdant/garden`; Garden screenshots should read full opacity/full saturation with no feathered UI content.

2. SAFE MECHANICAL with TASTE-CALL composition — mount `GardenLive` or equivalent crisp phone in the home/Garden hero.
   - Files: `src/pages/verdant/index.astro`, `src/pages/verdant/garden.astro`, `src/components/verdant/GardenLive.astro`.
   - Shape: import and place `GardenLive` where the current home hero screenshot and/or Garden landscape hero sits.
   - KP sign-off: whether home hero uses `GardenLive`, static phone screenshots, or a short product video.

3. SAFE MECHANICAL — remove footer pigment blobs.
   - Files: `src/styles/verdant.css`, `src/components/verdant/Footer.tsx`.
   - Shape: remove `.v-footer` from the global pigment selector at `src/styles/verdant.css:291-310`, or override `.v-footer::before` to no radial blooms. Keep footer cream, ruled, and quiet.
   - Verify: every page bottom has no green radial bloom field behind footer.

4. TASTE-CALL — replace `CTABand` with a quieter editorial closer.
   - Files: `src/components/verdant/kit/CTABand.astro`, page instances in `src/pages/verdant/*.astro`.
   - Shape: left-aligned closing section, hairline CTA grammar from `.v-cta`, optional crisp product phone only on Garden/product pages.
   - KP sign-off: exact visual language for final CTA.

5. SAFE MECHANICAL — fix Studio truth mismatch.
   - Files: `src/pages/verdant/studio.astro`, `src/data/verdant.ts`.
   - Shape: change "small team" to studio-of-one language, remove empty team grid, remove hiring CTA.
   - KP sign-off: final founder/studio copy tone.

6. SAFE MECHANICAL — rebuild Roadmap from three one-card grids into a real status artifact.
   - Files: `src/pages/verdant/roadmap.astro`, optionally `src/data/verdant.ts`.
   - Shape: one table/timeline using verified status/date data only. Do not invent dates.

7. SAFE MECHANICAL — promote/fix Security content.
   - Files: `src/pages/verdant/security.astro`, `src/components/verdant/PrivacySpectrum.tsx`, `src/components/verdant/Footer.tsx`.
   - Shape: add `id="data"` to the spectrum wrapper, move `PrivacySpectrum` above generic guarantees, replace plain arrow divs with a compact architecture explainer.

8. SAFE MECHANICAL with KP-CALL on terms — harden Beta/Pricing promise language.
   - Files: `src/pages/verdant/beta.astro`, `src/pages/verdant/pricing.astro`, `src/data/verdant.ts`.
   - Shape: replace vague "lifetime free"/"won't be much" with exact known/unknown terms.
   - KP sign-off: public beta-free promise scope.

9. SAFE MECHANICAL — fix footer mobile layout.
   - Files: `src/components/verdant/Footer.tsx`.
   - Shape: add mobile breakpoint for `.v-footer-cols`, legal row, and brand/nav stacking.

10. SAFE MECHANICAL — reduce repeated three-card/three-step sections.
    - Files: `src/pages/verdant/garden.astro`, `src/pages/verdant/beta.astro`, `src/pages/verdant/pricing.astro`, `src/pages/verdant/security.astro`, `src/pages/verdant/ethos.astro`, `src/components/verdant/kit/CardGrid.astro`, `src/components/verdant/kit/Steps.astro`.
    - Shape: keep primitives available, but replace high-visibility instances with editorial layouts, proof panels, timelines, or comparison tables.

11. SAFE MECHANICAL — clean responsive breakpoints.
    - Files: `src/components/verdant/kit/CardGrid.astro`, `src/components/verdant/kit/Steps.astro`, `src/components/verdant/GardenTour.tsx`, `src/components/verdant/ScrollPillars.tsx` if mounted.
    - Shape: delay forced multi-column layouts, compact mobile rails, gate pinned scrollytelling by viewport width as well as pointer type.

12. LOW PRIORITY SAFE CLEANUP — modernize Notes page wrappers.
    - Files: `src/pages/verdant/notes.astro`.
    - Shape: remove stale grid-column responsive rules and normalize to kit wrapper rhythm. Not ship-blocking unless Field Notes is in the primary nav path.
