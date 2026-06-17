# 008 — Verdant v2: depth + voice rebuild

**Status: IN PROGRESS** (Tasks 1–2 fully specified & ready; Tasks 3–5 await the attack re-run)
**Target:** v2, `main` branch → `verdant-studio-v2.pages.dev`
**Source docs:** `docs/redesign/00-diagnosis.md`, `01-language-rewrite.md`, `NEXT-STEP.md`
**Tier:** Opus authored this plan; **Haiku executes**. Sonnet only for a step Haiku stalls on twice.

---

## Task 1 — Revive the dead design tokens (DO FIRST; cheapest, highest impact)

**Why:** `docs/redesign/00-diagnosis.md` Defect 1 — 22+ refs to v1 token names that don't
exist in v2, silently killing CTAs, labels, `::selection`, body wash, and the green-band
pigment. Fix at the source with aliases instead of hunting 22 usages.

**File:** `src/styles/verdant.css`. Inside the `[data-skin="verdant"]{ ... }` map (after the
existing `--gold` / contract block, before the font vars), ADD these alias lines:

```css
  /* v1→v2 token aliases — revive code still referencing retired names.
     (verify rendered; nudge a shade if any band reads wrong.) */
  --cream:      var(--paper);       /* body bg */
  --parchment:  var(--paper-soft);  /* .v-band--paper bg */
  --forest:     var(--ink);         /* .v-cta resting color, dark text on gold */
  --clay:       var(--moss);        /* .v-label kicker color */
  --moon:       var(--paper);       /* ::selection text, .v-cta--light */
  --moss-300:   var(--sage);        /* .v-label--light on dark */
  --green:      var(--leaf);        /* band pigment bloom */
  --green-600:  var(--leaf-deep);   /* band pigment bloom */
  --forest-900: var(--ink);         /* band pigment bloom (deepest) */
```

**Verify (per step):**
- `grep -rEo "var\(--(cream|forest|clay|parchment|moon|green|green-600|forest-900|moss-300)\b" src/ | wc -l` → still >0 (expected; they now resolve).
- Confirm each name is now DEFINED: `grep -E "\-\-(cream|forest|clay|parchment|moon|green|green-600|forest-900|moss-300):" src/styles/verdant.css` → 9 hits.
- `npm run build` → green.
- Eyeball: CTAs now have ink color + gold hover; labels are moss; selection visible; any
  `.v-band`/`.vh-band` shows green pigment. **Check whether v2 pages even USE `.vh-band`/
  `.ve-band`/`.vg-band`** (`grep -rl "vh-band\|ve-band\|vg-band" src/pages src/components`) —
  if unused in v2, the pigment treatment is vestigial; leave the alias but note for cleanup.

**Commit:** `fix: 008 — revive 9 dead v2 design tokens via aliases (CTAs/labels/pigment)`

---

## Task 2 — Apply the language rewrite (persona-independent; ready now)

**Why:** copy is metaphor-saturated (Defect 3). Full replacement deck already written.

**Files & changes:** apply `docs/redesign/01-language-rewrite.md` verbatim.
- `src/data/verdant.ts` — replace string values for: `brand.tagline`; `garden.oneLine`,
  `.blurb`, `.pricing`, `.kind`, each `screens[].line`/`.body`, `grove.line`/`.body`,
  `notes[]`; `emerald.oneLine`/`.blurb`; `studio.who`/`.lead`/`.lines[]`; `ethos.creed[]`.
  **Keep keys, types, structure identical — values only.**
- `src/pages/verdant/index.astro` — hard-coded heads flagged `[index.astro]` in the deck:
  hero `<h1>` + sub + the two action labels; quote text + attribution; CTA-band title + link.

**Verify:**
- `npm run build` → green; `npm run check` → no type errors (string-only edits).
- `grep -n "Pull the weeds\|Grow something quiet\|grown for people\|already sees your garden" src/`
  → 0 hits (old corny lines gone).
- Eyeball homepage: new hero, plain creed, the ONE surviving garden metaphor (the quote).

**Commit:** `feat: 008 — apply full language rewrite (over-gardened → plain + conviction-led)`

---

## Task 3 — Page depth + growth  *(BLOCKED: needs attack re-run)*

The multi-angle attack (5 personas + audits) died at the 5h limit before writing. **Re-run it
LEANER** — the 7-agent Sonnet fan-out burned 387k tokens for nothing. Options: (a) one Sonnet
pass covering all 5 lenses inline, or (b) 5 Haiku persona agents. Then synthesize the
per-page depth/growth tasks HERE. Diagnosis Defect 2: homepage is 5 thin sections; subpages
need the same audit. Add depth that earns each scroll (proof, a real "how Garden works" beat,
richer media, Emerald intrigue) without breaking serene → busy.

## Task 4 — Perf fixes  *(BLOCKED: needs `audit-perf.md` from the re-run)*
Suspected: too many always-on `mix-blend-mode` layers + canvases not paused off-viewport.
Garden's recent perf work is the bar. Quantify, then fix the top offenders.

## Task 5 — Asset re-encode  *(BLOCKED: needs `audit-assets.md` from the re-run)*
Suspected oversized jpgs (Koson art, `tx-*.jpg`), no webp/srcset. Re-encode + add dimensions.

---

## Order of operations for the fresh session
1. Tasks 1 & 2 immediately (Haiku) — visible wins, no dependencies.
2. Re-run the attack LEANER → write `persona-*.md` + `audit-*.md`.
3. Fill Tasks 3–5 from those, then execute (Haiku).
