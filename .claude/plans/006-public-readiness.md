# 006 — Public-readiness fixes (Codex audit response)

Status: DONE — All 10 steps shipped, built green, pushed 2026-06-20 (873f264..378ea06).
Source: Codex read-only live/source audit of verdant-studio. Every claim re-verified against
disk before writing this plan; file:line references below are confirmed accurate as of writing.

## KP direction-calls already locked (do NOT re-decide these)
- **Grove copy:** honest AI-processor framing, positioned as an **opt-in tier** — the user chooses
  to use Grove; nothing is sent unless they ask it a question; when they do, a financial *summary*
  goes to an AI model (Claude / Anthropic) over HTTPS and is not stored. Mirror the tone of the
  existing `privacySpectrum` tier 2 ("AI import"), which is already honest.
- **Beta / "lifetime free":** DO NOT invent terms. Leave a clearly-marked `KP-OWED` placeholder.
- **Legal pages:** write a full, honest draft covering all missing sections, with a visible banner
  that it is a founder draft pending legal review. Non-lawyer content is acceptable *with* the banner.
- **Homepage:** full restructure is in scope (product proof above fold, kill symmetric 3-card row,
  move Emerald off home).

## Executor rules
- Haiku-first. If any step fails twice or the file doesn't match what's described here, STOP and
  report `BLOCKED: <step> — <reason>`. Do not improvise around a diverged plan.
- Load the `verdant-design` skill BEFORE touching any markup/CSS (steps 3, 7, 8). It is the anti-AI-slop
  discipline; the homepage restructure must obey it (no symmetric card reflex, structural asymmetry).
- Commit after each numbered step with a tagged message: `fix: 006-<n> — <what>`. The post-commit hook
  syncs this plan header. Push when build is green (`npm run build` in verdant-studio).
- Verify command for every code step: `cd ~/Dev/verdant-studio && npm run build` must succeed.

---

## STEP 1 — Rewrite Grove / encryption / privacy copy to match reality (STOP-SHIP)

**Why:** [src/data/verdant.ts](../../src/data/verdant.ts) claims Grove "sends nothing out" (line 76)
and "no API calls to OpenAI or anywhere else" (line 216). Garden actually POSTs `systemContext` to
`https://api.anthropic.com/v1/messages` — verified at
[garden/src/worker.ts:92](../../../garden/src/worker.ts). The file already contradicts itself: its own
`privacySpectrum` tier 2 (lines 100–144) is honest. Make the Grove copy match that honesty, as an
opt-in tier.

Edit `src/data/verdant.ts`:

1. **`garden.grove.line` (line 75)** — remove "never sends them anywhere." New line, e.g.:
   `"Ask anything about your money. Grove is opt-in — when you ask, it reads your numbers on your device and sends a summary to a private AI model to answer."`
2. **`garden.grove.body` (line 76)** — rewrite the "sends nothing out" / "intelligence comes to your
   data" claim. Honest version must state: Grove is opt-in; nothing leaves until you ask; when you
   ask, a *summary* of relevant numbers is sent over HTTPS to an AI model (Claude, run by Anthropic)
   to generate the answer; it is not stored and never sold. Keep the existing voice (quiet, plain).
3. **`garden.groveExample` (line 50)** — drop "sent nowhere." Replace with truthful framing
   ("answered by a private AI model, your summary sent over HTTPS and not stored").
4. **`garden.oneLine` (line 39) & `garden.blurb` (line 41)** — these say "encrypted on your device"
   as a flat guarantee. Garden supports a plaintext skip mode
   ([garden/src/data/store/localFirst.ts:8](../../../garden/src/data/store/localFirst.ts),
   [garden/src/ui/screens/onboarding/PassphraseStep.tsx:96](../../../garden/src/ui/screens/onboarding/PassphraseStep.tsx)).
   Soften to "encrypted on your device when you set a passphrase" — do NOT claim universal encryption.
5. **`garden.notes[0]` (line 79)** — "Your device encrypts everything before it leaves" → qualify
   with the passphrase condition, same as above.
6. **`faq` — Grove entry (lines 215–217):** delete "It works on your device only — no API calls to
   OpenAI or anywhere else." Replace with the honest opt-in framing (Grove is optional; using it sends
   a summary to a private AI model; the rest of the app stays local).
7. **`faq` — "Is my data really private?" (lines 203–205):** the flat "Everything is encrypted on
   your device" → align with the passphrase condition + point at the privacy spectrum for the full,
   per-tier truth.

Verify: `npm run build` green. Grep `grep -rn "sends nothing\|no API calls\|never sends\|sent nowhere" src/` returns **zero** hits.

---

## STEP 2 — Lock pre-public discoverability (STOP-SHIP)

**Why:** [public/robots.txt](../../public/robots.txt) is `Allow: /` + advertises a sitemap; no
`noindex`. Site should not be indexed before launch.

1. Replace `public/robots.txt` body with a disallow-all pre-launch block:
   ```
   User-agent: *
   Disallow: /
   ```
   (Remove the `Sitemap:` line while pre-public.)
2. Add a global `noindex` header. In [public/_headers](../../public/_headers), under the `/*` block
   add: `X-Robots-Tag: noindex, nofollow`.
3. Add a belt-and-suspenders meta tag in the layout
   [src/layouts/Verdant.astro](../../src/layouts/Verdant.astro) `<head>`:
   `<meta name="robots" content="noindex, nofollow" />`.
4. Leave a `KP-OWED` comment in all three spots: "REMOVE on public launch — restores indexing."

Verify: `npm run build`; confirm `dist/robots.txt` is the disallow-all version and the meta tag is in built HTML.

---

## STEP 3 — Homepage restructure (product proof first; kill symmetric cards; Emerald off home)

**Why:** [src/pages/verdant/index.astro](../../src/pages/verdant/index.astro) leads with atmosphere,
buries the product screenshot, uses the banned symmetric 3-card row, and puts Emerald on the homepage.
LOAD `verdant-design` skill first.

New section order (replace the body of `index.astro`):

1. **Hero** — keep the `Hero` component but make the product the evidence, not decoration. Use a real
   Garden screenshot as `mediaSrc` (`/verdant/garden/garden-home.webp`) instead of
   `hero-landscape-2.jpg`. Headline stays "Private personal finance." Fix the eyebrow contrast (see
   step 8 — the eyebrow uses `--gold` on cream). Primary CTA → **"Join the beta"** `/verdant/beta`
   (see step 4, single public goal). Secondary → "See Garden" `/verdant/garden`.
2. **Security/trust proof band** — a `FeatureRow` (align left) that states the privacy spectrum plainly
   and links to `/verdant/security`. This is the "why trust it" tier, placed high.
3. **Beta CTA band** — a `CTABand` with the single dominant goal "Join the beta" → `/verdant/beta`.
4. **Ethos** — move the atmospheric/ethos `FeatureRow` (ethos-sand) to AFTER the proof, near the end.
5. **DELETE the `CardGrid cols={3}` symmetric row entirely** (lines 24–43). If a quick-links row is
   wanted, it must be asymmetric per `verdant-design` (varied weight/size, not three equal cards) —
   but default is to remove it; the FeatureRows already carry Garden/Security/Ethos.
6. **REMOVE the Emerald `FeatureRow`** (lines 62–68) from the homepage. Emerald stays reachable only
   via the footer stray-stone egg (its dedicated `/verdant/emerald` page already exists). Drop the
   now-unused `emerald` import.
7. Final `CTABand` — collapse the four-different-CTA problem: make every primary action "Join the beta".

Verify: `npm run build`; `grep -n "emerald\|CardGrid" src/pages/verdant/index.astro` returns nothing
(or CardGrid only if an intentional asymmetric variant was kept). Use Claude Preview to screenshot
desktop + mobile (note: verdant preview can't hydrate — verify structure/SSR, not scroll reveals).

---

## STEP 4 — One public funnel goal + beta-terms placeholder

**Why:** CTAs conflict ("Explore Garden" / "Join the beta" / "Start a conversation" / "Try Garden").
Pre-beta the dominant goal is **Join the beta**.

1. Across homepage (step 3) and `nav.cta` (already "Join the beta", line 25 of verdant.ts — keep),
   make "Join the beta" → `/verdant/beta` the single primary CTA. Demote others to secondary text links.
2. **"Lifetime free beta access" — DO NOT define terms.** In
   [src/pages/verdant/beta.astro](../../src/pages/verdant/beta.astro) and the FAQ entry
   (verdant.ts lines 219–220), wrap the lifetime-free claim in a visible `KP-OWED` placeholder:
   insert an HTML comment `<!-- KP-OWED: define "lifetime free" — beta-only? Garden core web app? future paid tiers? one account? Needs KP business/legal sign-off before public. -->`
   and soften the visible copy to a non-binding "Beta testers keep free access — full terms before
   launch." Do not invent scope.

Verify: `npm run build`; grep `KP-OWED` shows the two new placeholders.

---

## STEP 5 — Move Logo CSS out of accessible/rendered content

**Why:** [src/components/verdant/Logo.tsx:51](../../src/components/verdant/Logo.tsx) injects a
`<style>{...}</style>` INSIDE the logo `<span>`. That CSS text leaks into the accessible name / DOM
text of the logo (confirmed in live DOM by the audit).

Move the three `.v-logo*` rules out of the component into the global stylesheet
[src/styles/verdant.css](../../src/styles/verdant.css) (append a `/* Logo */` block with the exact
same rules), and delete the inline `<style>{...}</style>` from `Logo.tsx`. The component then renders
only the `<span><svg/><span>Verdant</span></span>`.

Verify: `npm run build`; `grep -n "<style>" src/components/verdant/Logo.tsx` returns nothing;
`grep -n "v-logo-word" src/styles/verdant.css` returns the moved rule.

---

## STEP 6 — Waitlist function must not silently succeed when KV is missing

**Why:** [functions/api/waitlist.ts:35](../../functions/api/waitlist.ts) returns 200 even when the
`WAITLIST` KV binding is absent — signups are logged to console and lost. Silent data loss on the one
conversion action.

Change the unbound-KV branch (lines 42–46): instead of returning success, return a 503 with an honest
message ("Signups aren't wired up yet — email us at verdantmail@proton.me"). Keep the console.log for
debugging. Only return "You're on the list." (200) when `env.WAITLIST.put` actually succeeds; if the
`put` throws (line 38 catch), also return 503 rather than 200. The visitor must never be told they're
on a list that doesn't exist.

Verify: `npm run build`; read the function and confirm no code path returns 200 without a successful KV write.

---

## STEP 7 — Full honest legal pages (privacy + terms)

**Why:** [src/pages/privacy.astro](../../src/pages/privacy.astro) and
[src/pages/terms.astro](../../src/pages/terms.astro) exist but are far too thin for a finance app.
KP-locked: write a FULL honest draft + a visible "founder draft, pending legal review" banner.

Both pages share the layout already used (`Verdant` + `Footer`, max-width 48rem). Add at the top of
each `<main>` a banner box (muted background, small text):
"This is a founder's draft, written in plain language and pending formal legal review. Email
verdantmail@proton.me with questions."

**privacy.astro must cover (new `<section>` per item):**
- Effective date (use `2026-06-20`; make it a clearly-editable constant/comment).
- Data categories collected (account structure, encrypted transaction data, anonymized crash/usage).
- **AI processing disclosure** — Grove and AI-import send data to a third-party AI provider
  (Anthropic / Claude) over HTTPS to generate answers / parse statements; not stored by Verdant, not
  used to train models, not sold. This is THE missing clause; pull facts from `privacySpectrum`.
- **Encryption is conditional** — encrypted on-device when a passphrase is set; if the user skips the
  passphrase, data is stored in plaintext locally. State this plainly (matches Garden's own privacy sheet).
- Retention & deletion mechanics (export/delete/reset any time; no recovery; what server ciphertext
  exists and how it's purged).
- User rights (access, export as JSON, deletion).
- Minors (not directed at under-13 / under-16; no knowing collection).
- Sync-provider future state (bank link via SnapTrade/SimpleFIN/Plaid is architecture-only, not live;
  when live it is labeled plaintext transit through the provider — mirror tier 3 of `privacySpectrum`).
- Contact (verdantmail@proton.me).

**terms.astro must add to the existing thin set:**
- Effective date + "beta software, may change/break" with honesty about data-loss risk.
- Beta access scope — reference the `KP-OWED` lifetime-free placeholder from step 4; do NOT invent
  binding terms (e.g. "free during beta; full pricing terms published before public launch").
- No-warranty / not financial advice (already partly present — keep, expand).
- Limitation of liability, governing-law placeholder (`KP-OWED: jurisdiction`).
- User responsibilities (passphrase = unrecoverable), acceptable use, termination, changes-to-terms.
- Contact.

Keep the existing inline-style approach for consistency with the current pages (no new component
needed). Plain language over legalese is fine given the banner.

Verify: `npm run build`; both pages render; grep confirms "Anthropic" / "AI" appears in privacy.astro
and "founder" banner appears in both.

---

## STEP 8 — Contrast + mobile nav fixes

**Why (contrast):** hero eyebrow uses `--gold` (`#c2913c`) on `--cream` (`#faf6ec`) ≈ 2.63:1 — fails
WCAG AA for small text. Tokens confirmed in [src/styles/verdant.css](../../src/styles/verdant.css)
lines 67/72.

1. Add a darker gold token for small text in `verdant.css` (e.g. `--gold-ink: #7a5a1e;` — aim ≥4.5:1
   on cream; pick the exact hex by checking contrast, don't guess-and-ship). Apply it to:
   - `.v-hero__eyebrow` (currently `color: var(--gold)` in
     [Hero.astro](../../src/components/verdant/kit/Hero.astro)).
   - Any small uppercase mono label that sits on the cream/body bg at < ~16px. The audit also flagged
     a pale menu label sample ≈1.87:1 — check `.v-label--light` and `.v-nav-link` (`--ink` on cream);
     darken label text used on light backgrounds to ≥4.5:1. Body copy is fine — leave it.
   Do NOT change the decorative large-gold accents (em emphasis, CTA hover, band rules) — only small text.

**Why (mobile nav):** [Nav.tsx](../../src/components/verdant/Nav.tsx) — (a) the fixed header overlaps
the hero eyebrow at the top on mobile; (b) when the overlay menu opens, underlying page links remain
in the accessibility tree / visible list — no `inert`, no focus management.

2. **Overlap:** add top padding/scroll-margin so the hero's first element clears the fixed nav on
   mobile. Cleanest: give the page content a top offset equal to nav height on `max-width: 820px`
   (the breakpoint already used at Nav.tsx:144), or add `scroll-margin-top`/`padding-top` to `.v-hero`
   on mobile. Verify the eyebrow is fully visible below the bar.
3. **Overlay isolation + focus:**
   - When `open`, set `inert` on the `<header>` and main page content (or wrap and toggle) so
     underlying links are not focusable/visible to AT. Simplest within this component: add `inert`
     attribute to the `.v-nav` header and rely on the overlay being `position: fixed; inset: 0` above
     it (it already is, z-index 300 vs 200). Ensure the overlay fully occludes (it uses a gradient
     that may be translucent at edges — make the overlay background opaque).
   - Move focus into the overlay on open (focus the close button via a ref + `useEffect` on `open`),
     and restore focus to the burger on close. Escape-to-close already exists (lines 24–26) — keep it.
   - Add `aria-hidden` is already toggled; also toggle `inert` on the overlay when closed so its links
     aren't focusable while hidden.

Verify: `npm run build`; Claude Preview at mobile width (`preview_resize`) — snapshot shows eyebrow not
clipped; with menu open, `preview_snapshot` shows only overlay links focusable. (Preview can't hydrate
verdant reveals, but nav is `client:load` so the menu DOES mount — interaction is testable.)

---

## STEP 9 — Image performance (lazy-load + WebP heavy JPGs)

**Why:** confirmed live payloads include `ethos-sand.jpg` 509KB, `hero-landscape-2.jpg` 292KB,
`koi.jpg` 274KB; none of the homepage primitives lazy-load. The `Hero`, `FeatureRow`, `Card` `<img>`
tags have no `loading`/`decoding` attributes.

1. In [Hero.astro](../../src/components/verdant/kit/Hero.astro),
   [FeatureRow.astro](../../src/components/verdant/kit/FeatureRow.astro),
   [Card.astro](../../src/components/verdant/kit/Card.astro): add `loading="lazy"` + `decoding="async"`
   to the `<img>` — EXCEPT the hero image, which is above the fold: give Hero's `<img>`
   `loading="eager"` + `fetchpriority="high"` (it's the LCP candidate). FeatureRow/Card images → lazy.
2. Convert the heavy JPGs used on the homepage to WebP and update references:
   `ethos-sand.jpg`, `hero-landscape-2.jpg` (if still referenced after step 3), `koi.jpg`. Use a local
   conversion (`cwebp -q 82 in.jpg -o out.webp` if available, else `sips`/`magick`). Place alongside
   originals in `public/verdant/...`, update the `mediaSrc`/`cover` references in `verdant.ts` and the
   homepage. Keep originals on disk (don't delete) until KP confirms the WebPs look right.
   - If no converter binary is available in the environment: STOP this sub-step and report
     `BLOCKED: 006-9 — no webp encoder (cwebp/magick/sips) available`; still ship the lazy-load attrs.

Verify: `npm run build`; `grep -rn 'loading="lazy"' src/components/verdant/kit/` shows the three
primitives; `preview_network` confirms below-fold images are lazy and webp payloads are smaller.

---

## STEP 10 — Add CSP + refresh stale deploy docs

**Why:** [public/_headers](../../public/_headers) has good basics but no Content-Security-Policy.
Deploy docs describe retired v1/v2 shape; reality is `verdant-studio-v3` `--branch=v3` (confirmed in
[.github/workflows/deploy.yml](../../.github/workflows/deploy.yml) and memory `verdant-v1-v2-deploy-fork`).

1. Add a CSP to the `/*` block in `_headers`. Start strict-but-working for a static Astro site, e.g.:
   `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'`
   — then `npm run build` + Claude Preview and check the console for CSP violations; loosen ONLY what
   the site actually needs (Astro inlines some styles → `'unsafe-inline'` for style-src is included;
   if any inline script is hashed/needed, prefer a hash over `'unsafe-inline'` for script-src). Do not
   ship a CSP that breaks the page — verify zero console CSP errors before committing.
2. Update any verdant deploy/README docs that still reference v1/v2 to the v3 reality
   (`wrangler pages deploy --project-name=verdant-studio-v3 --branch=v3`, deployed by the GH Action,
   CF projects are not git-connected). Search: `grep -rn "verdant-studio-v2\|verdant-studio-v1\|--branch=v2\|--branch=production" --include=*.md ~/Dev/verdant-studio`.

Verify: `npm run build`; Claude Preview console shows no CSP violations; doc grep for v1/v2 is clean.

---

## Close-out
- Update `verdant-studio/TODO.md` and this header to DONE when all steps land + build green + pushed.
- Steps that ship copy/legal claims (1, 4, 7) are the trust-critical ones — re-read them against
  `privacySpectrum` before committing; a wrong privacy claim is the one thing Verdant cannot ship.
- Items genuinely needing KP after this pass: the `KP-OWED` beta/lifetime-free definition (step 4),
  legal review of the drafts (step 7), governing-law jurisdiction (step 7), and the
  REMOVE-on-launch noindex/robots reversal (step 2).
```
