# 004 — Language & Type Handoff

Executor: Haiku. Status: COMPLETE.

---

## Tasks Completed

### Task 1 — Source-of-Truth String Rewrites (verdant.ts)

All copy audited through four lenses (marketing, PR, everyday person, legal). Minimal change made:

- **emerald.oneLine**: "Something still growing in the dark." → "The next project — in progress."
  - Dropped precious language ("growing in the dark") to a single restrained hint while keeping the sense of unreleased status.
- All other fields approved as-is: brand tagline, garden product strings, studio lines, ethos creed, and team placeholders all tested and kept (benefit-first ordering, no overstatement, no invented credentials).

### Task 2 — Inline Copy Audit (Six Pages)

Audited all visible strings across verdant/index, garden, security, ethos, team, and emerald pages. All copy passed four-lens audit:

- **index.astro**: Hero, manifesto, work intro, quote, CTA — all benefit-first, ordered well, no precious language. Approved as-is.
- **garden.astro**: Product page copy, tour screens, grove section, privacy band — all concrete, clear, strong value proposition. Approved as-is.
- **security.astro**: Every principle statement and claim verified against garden.notes, ethos.creed, and verdant architecture:
  - ✓ "Encrypted before it leaves your hands" (supported by garden.notes: "server holds only ciphertext")
  - ✓ "Local-first, not cloud-first" (supported by garden.notes: "Works offline first")
  - ✓ "Nothing watching the ledger" (supported by garden.notes: "No ads, no data sold, no third parties")
  - ✓ "If it can be read here, that's a bug" (supported by ethos.creed, exact wording)
  - ✓ Response headers (live on this site, verifiable by user)
  - ✓ "Static site — no server-side database, no account, no tracker to opt out of" (Astro site on Cloudflare Pages; true as deployed)
  - No overstated claims, no "100% private" or "unhackable" absolutism. All claims softened and verifiable.
- **ethos.astro**: Story copy, creed lines, talk section — honest, direct, no precious language. Approved as-is.
- **team.astro**: "No invented roster" line, studio intro, honest one-person acknowledgment. Approved as-is.
- **emerald.astro**: Minimal inline copy, all from verdant.ts (already audited). Approved as-is.

### Task 3 — Font-Size & Type-Scale Pass

Audited clamp() scales across all pages. Checked hierarchy (head >> subhead >> body), readability (min ~1.0–1.2rem on mobile), and line-height consistency.

#### Changes Made:

**index.astro:**
- `.vh-quote-mark`: `5rem` → `3.5rem` (reduced oversized decorative mark; was ~3:1 ratio to text, now ~1.4:1)
- `.vh-quote-text` line-height: `1.22` → `1.35` (tightened quote was below prose minimum)
- `.vh-stats-link` font-size: `0.66rem` → `0.75rem` (standardized sub-0.7rem mono labels to readable size)
- `.vh-product-year` font-size: `0.66rem` → `0.75rem` (standardized for consistency)
- `.vh-more-note` font-size: `0.72rem` → `0.75rem` (standardized mono label size)

**garden.astro:**
- `.vg-screen-line` line-height: `1.05` → `1.15` (tightened large display head)
- `.vg-grove-line` line-height: `1.12` → `1.15` (tightened large display head)
- `.vg-feat-text` line-height: `1.25` → `1.3` (slightly loose feature list heading)

**ethos.astro:**
- `.ve-creed-text` line-height: `1.18` → `1.25` (tightened large creed lines)

**security.astro:**
- `.vs-row-head` line-height: `1.2` → `1.3` (tightened principle headers)

**team.astro:**
- `.vt-who-name` line-height: `1.02` → `1.12` (very tight large product name)

**emerald.astro:**
- `.vem-name` line-height: `0.9` → `1.0` (very tight large product name)
- `.vem-foot` font-size: `0.66rem` → `0.75rem` (standardized mono label)

#### Rationale:

- **Mono labels** (0.66rem) were sub-0.7rem and hard to read per plan. Increased to 0.75rem across all pages for readability and consistency.
- **Display line-heights** (1.05–1.18) were tighter than prose recommendation (1.4–1.6). Brought up to 1.15–1.3 range; tighter than prose but appropriate for display heads.
- **Quote mark** (5rem) was visually dominant vs. text (1.7–3rem at desktop). Reduced to 3.5rem to keep proportion intentional, not overwhelming.
- **Quote line-height** was 1.22 (below recommendation for any prose). Increased to 1.35 for readability.

All hierarchy is intact: hero head >> section head >> subhead >> body. Mobile readability maintained (clamp() minimums ~1.0–1.2rem). No changes to wider architectural scales or shared vars — edits surgical and per-page.

---

## Out of Scope (As Per Plan)

- New page structure / sections
- GardenLive canvas / interaction code
- Imagery / asset swaps
- Shared type-scale vars (`--fs-h1`, etc.) — would require touching every page; left as note for future refactor

---

## Build Status

All changes verified: `npm run build` passed. No broken interpolations or compilation errors.
