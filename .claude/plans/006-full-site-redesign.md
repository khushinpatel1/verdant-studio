# 006 — Full-site redesign campaign

Status: **IN PROGRESS** (2026-06-19) — handoff doc for Haiku execution sessions.

Branch: `v1`. Live: verdant-1wg.pages.dev. Build: `npm run build` (must be green before push).

## The brief (locked, from KP 2026-06-19)
1. **Kill the uniform page skeleton.** Every page currently runs the SAME rhythm
   (hero → manifesto/body → quote → terminal CTA closing) and EVERY page ends in the
   same thick-green CTA/closing band. That sameness is the AI tell (structure is uniform —
   see `organic-is-structural`). **Homepage MAY keep its format** (hero→manifesto→work→quote→CTA)
   with a bespoke-night touch. **Every OTHER page must break it** — different terminal section,
   different vertical rhythm, asymmetric placement. Make it organic = structural variation, not curves.
2. **Bespoke-night theme** — KP picked it. Use the night-garden board as a dark contrast accent,
   but **NOT on every page and not on every artifact** (his words). Selective dark interludes.
3. **Get the new assets in.** They live in `~/Dev/assests` (misspelled folder — see inventory).
4. Vine (InkGrowth) — already on home, mobile-visible, SELECTIVE. Propagate to ≤1 more page max.
5. Safari smoothness — DONE (32c5e6d, translate3d).

## Asset inventory — `~/Dev/assests` (VERIFIED 2026-06-19)
Raw generator dumps with junk filenames + duplicate `" copy"` / `" 2"` siblings (ignore the dupes).
NOT yet cropped / WebP'd / in-repo — an asset-prep pass must triage → crop → WebP → clean-name →
drop into `verdant-studio/src/assets/` (or `public/`) before page work consumes them.

- **Bespoke-night source (the board):** `ChatGPT Image Jun 17, 2026 at 10_31_33 PM.png` and the
  `enhanced_…10_31_33 PM.png` (4.4 MB upscaled) — moonlit bridge / gnarled bonsai / bamboo / wisteria
  panels. The `10_36_37 PM` pair is a second board. These are SHEETS — crop single panels out.
- **Hero landscapes (wide):** `lucid-origin_…Hero_landscape…-0.jpg` (+`-0-2`), and the
  `specs__…hero…landscape…` set: `jltcc…0`, `nabof…3`, `uj3yudhi…1`, `vtieu…2`, plus the
  `same_spec_and_style…` set: `0k66…2`, `g2hk…0`, `u7yh…1`. ~9 wide candidates — pick the best 2–3.
- **Square subjects (on off-white):** `lucid-origin_Specs_Icons_square…-0.jpg` (+`-0-2`, `-0-3`).
  Subject-on-cream → blend naturally as accents in whitespace.
- **Video:** `hailuo…sculptural_clay_art…mp4`, `specs__…a0eqhpi3…_1.mp4` — hero/ambient motion (optional, heavy).
- **Misc:** `Gemini_Generated_Image_lau2…png`, `Generated Image May 30…png`.
- **Ignore:** `.dmg` installers (Blender, Comfy Desktop), `.DS_Store`.
- Already-in-repo darks (fallback if board crops are fiddly): `koson-eagle-pine.jpg`,
  `emerald-dusk.jpg`, `team-flower.jpg`, `garden/seeds-midnight-forest.jpg`.

## Ground truth (verified)
- **Pages:** `index` (home), `garden`, `ethos`, `security`, `team`, `emerald` (hidden), 404.
- **Terminal-section uniformity (confirmed by grep):** index → `.vh-cta-band` (dark Koson moon);
  garden → `.vg-end-inner` CLOSING; team → `.vt-end-inner` closing; all share `.v-cta` vocabulary.
  THIS is the sameness to break.
- **Scroll engine:** `layouts/Verdant.astro` — Lenis (desktop only), parallax writes `--vp`,
  IntersectionObserver reveals. Parallax GPU-composited (translate3d). If Safari still janks → next
  lever is gate Lenis off on desktop.
- **Vine:** `components/verdant/InkGrowth.tsx` — `side="left|right"`, `className` for absolute pos.
- **Print-field infra:** `.v-print-field` + `--pf-*` vars (w/right/y/mask/blend/opacity/filter) —
  the masked parallax image system. Reuse for every new asset placement. The home CTA moon
  (`.vh-cta-moon`) is the reference implementation of a dark band.
- **Preview can't hydrate** (memory): headless browser runs no reveal/parallax — verify composition
  by force-reveal + build-green + code reasoning; KP confirms feel live.

## Done this session
- [x] Safari scroll jank — translate3d (32c5e6d)
- [x] Home growing-vine, mobile-visible (8dbdbc0, 5cf8b1a)
- [x] Found real asset folder `~/Dev/assests`; inventoried; bespoke-night confirmed by KP
- [x] Confirmed the per-page terminal-CTA uniformity against disk

## HAIKU EXECUTION SESSIONS (sequential — each is one focused Haiku session)

### Session A — `verdant · design · asset-prep + night-band`  (GATING — run first)
Goal: get clean assets in-repo + build ONE reusable bespoke-night band that varies by page.
1. View candidates in `~/Dev/assests` (skip ` copy`/` 2` dupes). Pick: 1 night-board panel for the
   bespoke-night band, 2–3 best hero landscapes, 1–2 square subjects.
2. Crop the chosen night-board panel out of the sheet; export all picks as WebP (~1600px wide max,
   quality ~80), clean kebab-case names, into `src/assets/`.
3. Add a reusable night band built on `.v-print-field`/`--pf-*` (model on `.vh-cta-moon`) — but
   parameterized so each page can place it differently (left/right, height, which asset).
4. `npm run build` green → commit `feat: 006A — verdant night-band asset + cropped art in-repo`.
Verify: build green; `ls src/assets/*.webp` shows the new clean-named files.

### Session B — `verdant · design · de-uniform-pages`  (run after A)
Goal: break the identical page skeleton + thick-green terminal slab. Touch ethos, security, team,
garden `.astro` only (home stays — it keeps its format). ONE page per commit.
- **Per page:** replace the carbon-copy closing CTA with a DIFFERENT terminal treatment (vary which
  of: asymmetric image+text, a quiet single-line sign-off, a full-bleed asset, an offset two-column).
  No two pages end the same way. Vary section vertical padding/heights so the rhythm isn't even.
- **Bespoke-night:** place the night band on AT MOST 2 of these pages (KP: not everywhere). Security
  (eagle-pine already dark) + one other are the natural homes.
- **Vine:** add to ≤1 page (ethos already has a sand-print vine slot).
- Build green after EACH page → commit `feat: 006B-<page> — de-uniform <page> + …`.
Verify per page: build green; grep shows the closing section differs from the others.

## Open / deferred
- Bespoke-night on home: light touch only (home already has the Koson moon CTA). Optional in a later pass.
- Clay-art video heroes: heavy, optional — only if a page wants ambient motion and the weight is OK.
