# 015 — Canva-design audit findings (Verdant)

Status: DONE — findings tracked and resolved; no code changes required
Owner: KP (director) · this doc tracks findings, doesn't action them
Source: Canva-design audit (2026-06-25, `open-my-canva-design-garden-category-2`) covering both
  Garden and Verdant. Garden's findings went into `garden/.claude/plans/056` (already PENDING).
  This doc is the Verdant half. Pricing language and the Grove/sync-promise decision are explicitly
  excluded per KP (pricing: he's doing that later; Grove: not shipping in beta, so its promise
  doesn't need resolving yet either).

## Verdict from the audit
Verdant "feels polished and restrained. The marketing site reads as a real studio site, not a
template." No dead nav links found in the sampled pages. Mobile menu and FAQ accordion both read as
usable and deliberate. No regressions flagged.

## Findings, checked against the live repo

### Already resolved — no action needed
- **"A real beta/waitlist capture path"** — the audit listed this as a missing feature, but
  `src/pages/verdant/beta.astro` already exists and its CTAs (`Hero` cta1, the closing `CTAClose1`)
  link straight to `https://garden.khushinpatel1.workers.dev` — i.e. it sends the visitor directly
  into the live app to create an account, which *is* the capture path. There's no email-only
  waitlist form, but that's a different, narrower thing than what's missing here — nothing to build
  unless KP specifically wants a pre-signup email list (see open question below).

### Already flagged elsewhere, not new
- **"Pricing copy still has an unresolved placeholder and business-term gap"** — confirmed in
  `src/pages/verdant/beta.astro` (the `{/* KP-OWED: define "lifetime free"... */}` comment and the
  `{{KP}}` comment above it) and in `pricing.astro` per that comment's own reference. This is the
  same open item KP already knows about and is handling later — not re-scoping it here.

### Open — needs KP's call before any code gets written
- **"More proof surface: examples, testimonials, sharper differentiation"** — real gap, but Garden
  is still pre-launch (beta), so there are no real testimonials to put up yet, and "examples" /
  "differentiation" both depend on what KP wants to claim about Garden vs. competitors — a
  taste/positioning call, not a mechanical content swap. Plan 012 (`012-product-proof-and-brand-
  anchor.md`, DONE) already did one pass on this exact gap (homepage reordered to lead with product,
  real Garden screenshots pulled onto the homepage) — this audit finding may just be the same gap
  re-surfacing because there's still no third-party proof (no testimonials exist pre-launch by
  definition). Nothing concrete to build until there are beta users to quote, or KP decides on a
  different proof mechanism (e.g. a public changelog, a "build in public" log, founder-credibility
  content).

## Resolved
KP's call (2026-06-25): no standalone email waitlist. The existing `/verdant/beta` → live-app
signup flow already covers lead capture; nothing to build for this finding.

## Status: closed
Every actionable item is either already resolved (beta capture path), already tracked elsewhere
(pricing), or a content/positioning call with no concrete work to scope yet (proof surface —
revisit once there are real beta users to quote). No open work remains from this audit on the
Verdant side.

## Guardrails
- Don't touch `pricing.astro` or the `{{KP}}` "lifetime free" comment — pricing is KP's, later.
- Don't build anything for Grove or the sync-UI promise — out of scope per KP for beta.
- Don't invent testimonials, example content, or competitive-differentiation copy — that's a taste
  call, not something to guess at to make this plan look more "done."
