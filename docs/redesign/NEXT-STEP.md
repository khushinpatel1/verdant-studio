# Verdant v2 Redesign — RECOVERY / NEXT STEP

> Historical record. Do not execute from this file. Current state: v3 is production (live on main). See `CLAUDE.md`.

**If you are a fresh session picking this up: read THIS file first. Nothing is lost.**

Target: **v2, `main` branch** → `verdant-studio-v2.pages.dev`. (v1 on `v1` branch is frozen.)

## Where we are (updated 2026-06-17)

- [x] **Diagnosis complete** → `docs/redesign/00-diagnosis.md`
      (verified: 22+ dead CSS vars from incomplete v2 token migration; structural thinness;
      metaphor-saturated copy; suspected perf + asset issues).
- [x] **Full language rewrite written** → `docs/redesign/01-language-rewrite.md`
      (every customer-facing line, current→new, mapped to `src/data/verdant.ts` fields. READY TO APPLY.)
- [ ] **Multi-angle attack — DIED at the 5h session limit (2026-06-17 ~01:40), wrote ZERO files.**
      Workflow `wasyjn1fj` (run id `wf_a8a0bc1f-a43`): all 7 agents (persona-1..5 + perf + asset)
      failed with "session limit · resets 5:30am LA" before writing anything. MUST be re-run.
      Re-run smaller/cheaper next time (the fan-out burned 387k tokens for nothing). Resume the
      same script via: `Workflow({scriptPath: ".../verdant-v2-multiangle-attack-wf_a8a0bc1f-a43.js"})`
      (it lives in the verdant-studio workflows/scripts dir) — or just re-author it leaner.
- [x] **Build plan `008` written** → `.claude/plans/008-v2-depth-and-voice.md`.
      **Tasks 1 (revive 9 dead tokens via aliases) + 2 (apply language rewrite) are fully
      specified and need NO persona input — a Haiku session can execute both immediately.**
      Tasks 3–5 (depth, perf, assets) are BLOCKED on re-running the attack.
- [ ] **Execution** — Haiku session vs plan 008. NOT STARTED. Start with Tasks 1 & 2.

## To resume

1. Check which `docs/redesign/persona-*.md` and `audit-*.md` files exist (`ls docs/redesign/`).
   If the workflow died mid-run, re-run only the missing ones, or synthesize from what's there.
2. Synthesize all of them + the diagnosis + the language rewrite into
   `.claude/plans/008-v2-depth-and-voice.md` — a Haiku-executable build plan, tasks ordered:
   **(1) fix dead tokens FIRST** (cheapest, highest impact — see 00-diagnosis Defect 1),
   (2) apply the language rewrite to `src/data/verdant.ts` + hard-coded heads in
   `src/pages/verdant/index.astro`, (3) page depth/growth passes per persona findings,
   (4) perf fixes per `audit-perf.md`, (5) asset re-encode per `audit-assets.md`.
3. Hand 008 to a fresh **Haiku** session to execute (per tier rules — Opus plans, Haiku builds).

## Hard rules for this work

- Disk-first, commit-first: every chunk committed with a `NNN` tag (`feat: 008-... — ...`).
- Tier: Opus plans only; **Haiku executes**, Sonnet only for a stalled step.
- Verdant taste bar holds: organic = structural asymmetry, NOT cosmetic curves. No AI-slop.
- Keep one load-bearing garden metaphor (the signature quote); everything else plain + exact.
