# 002 — The Pastures Autonomous Technique Factory

> Status: **PENDING** (design — not yet wired)
> A self-running multi-agent pipeline that researches premium web architecture,
> builds portable technique modules, tests them, critiques them against *real
> external references*, and files the survivors into a gallery — unsupervised,
> on a schedule, with a human reviewing async.

---

## 0. The one flaw this design exists to defeat

**AI critiquing AI = taste collapse.** An Opus "vibe check" shares the training
distribution that produces generic slop, so "does this look cool?" reliably
returns "yes" to the median. Three structural defenses, baked in below:

1. **External anchoring** — the Critic never scores from its gut. Every run it
   *fetches 2–3 real award-winning references* and scores the new build *relative
   to them* ("is this closer to the reference or to a Bootstrap demo?").
2. **Novelty guard** — before a build is accepted, it's diffed (technique tags +
   embedding-ish description) against the entire existing ledger. Too similar to
   something we already have → rejected as a slot-machine reshuffle, not range.
3. **Human recalibration loop** — you spot-rate ~5 entries/week (one tap:
   🔥/meh/kill). Those ratings are written back into the Critic's rubric as
   few-shot anchors. The machine's taste is *periodically re-pinned to yours*.

Without all three, do not run this unattended. With them, it climbs instead of
relaxing to the mean.

---

## 1. The pipeline (one "tick")

A tick is one full pass. It runs on a cron. Each stage is a **subagent** with a
narrow tool scope, handing a structured artifact to the next:

```
  ┌─ SCOUT (Sonnet) ──────────────────────────────────────────┐
  │ WebSearch/WebFetch premium sites + technique writeups.     │
  │ Output: scout-brief.json — 1 technique to build, the       │
  │ reference URLs, what makes it premium, how it's built.     │
  └───────────────────────────┬────────────────────────────────┘
                              ▼
  ┌─ PLANNER (Opus) ──────────────────────────────────────────┐
  │ Turns the brief into a build spec at the right altitude    │
  │ (L0 primitive / L1 mechanism / L2 art-direction).          │
  │ Runs the NOVELTY GUARD: reject if ~dup of ledger.          │
  │ Output: build-spec.md (folder layout, knobs, accept tests).│
  └───────────────────────────┬────────────────────────────────┘
                              ▼
  ┌─ BUILDER (Sonnet, in a git worktree) ─────────────────────┐
  │ Writes the portable module: core.ts + wrapper + demo +     │
  │ docs, per the spec. Commits to a throwaway branch.         │
  └───────────────────────────┬────────────────────────────────┘
                              ▼
  ┌─ TESTER (Sonnet) ─────────────────────────────────────────┐
  │ npm run build + npm run check. Boots preview, drives the   │
  │ demo, captures console/network/screenshot. Hard gate:      │
  │ build clean, no console errors, demo renders.              │
  │ Fail → bounce back to BUILDER (max 2 retries) → else kill. │
  └───────────────────────────┬────────────────────────────────┘
                              ▼
  ┌─ CRITIC (Opus) ───────────────────────────────────────────┐
  │ Fetches the SCOUT reference sites again. Scores the build  │
  │ 1–10 on: premium-feel, originality-vs-ledger, craft,       │
  │ portability. Uses your latest human ratings as anchors.    │
  │ Verdict: SHIP (→ gallery) / ITERATE (one more pass) / KILL.│
  └───────────────────────────┬────────────────────────────────┘
                              ▼
            ledger.jsonl  +  gallery/  +  push branch
```

### Why these model tiers
- **Opus** only where judgment compounds: Planner (altitude + novelty) and Critic
  (taste). These two are the whole game.
- **Sonnet** for Scout/Builder/Tester — mechanical execution of a clear spec.
- **Haiku** optional for the ledger bookkeeping / git plumbing between stages.

---

## 2. What it physically looks like in this repo

```
pastures/
  factory/
    orchestrator.md        ← the tick prompt the cron fires (the conductor)
    agents/
      scout.md  planner.md  builder.md  tester.md  critic.md   ← role prompts
    ledger.jsonl           ← append-only: every attempt, verdict, score, refs
    rubric.md              ← the Critic's scoring rubric + your human anchors
    references/            ← cached award-site snapshots for anchoring
  techniques/              ← the actual product: shipped portable modules
    <name>/ core.ts wrapper.ts demo.tsx README.md
  gallery/
    index.astro            ← auto-built showcase of every SHIPPED technique
                             (this is what you skim over coffee)
```

State lives **in git**, as files, not in any agent's memory. Any tick can die and
the next reconstructs full context from `ledger.jsonl` + `techniques/`. That's
what makes it survivable unattended.

---

## 3. The orchestration substrate (what actually fires it)

Two viable mechanisms, both already in this harness:

**A. CronCreate / scheduled-tasks (remote, true 24/7)** — a scheduled remote
agent runs the orchestrator prompt every N hours on Anthropic's infra, no laptop
needed. Best for genuine "always going." This is the Anthropic-demo path.

**B. `/loop` (local, self-paced)** — runs while your machine + session are up;
cheaper to reason about, dies when you close the lid. Good for the first week of
shakedown before trusting it remote.

Recommended: **shake down on `/loop` locally for ~10 ticks, then graduate to a
cron remote agent** once the ledger shows it's not producing garbage.

**Concurrency:** one tick at a time to start (serial). Each Builder runs in an
isolated **git worktree** so a broken build never touches `main`. Only the Critic's
SHIP verdict merges to the `gallery` branch.

### Constraint already known (from memory)
Background agents can only write inside the session's **root repo**. So the whole
factory must be spawned *from `~/Dev/pastures`* — which it is. Good.

---

## 4. Cost — honest numbers

There is no free 24/7. Pick the substrate with eyes open:

| Item | Per tick (rough) | Notes |
|---|---|---|
| Scout (Sonnet, web-heavy) | ~30–60k tok | several fetches |
| Planner (Opus) | ~20–40k tok | spec + novelty diff |
| Builder (Sonnet) | ~40–80k tok | writes a module |
| Tester (Sonnet) | ~30–60k tok | build + preview drive |
| Critic (Opus) | ~30–50k tok | re-fetches refs |
| **Total / tick** | **~150–350k tok** | call it **~250k avg** |

**On a Claude Code subscription (Max):** a tick is ~250k tokens of mixed model
use. Unattended at, say, one tick/hour, that's ~6M tokens/day — you will hit
subscription rate limits within a few hours and the loop stalls (it won't bill
extra, it just blocks). So subscription = fine for **a few ticks/day**, not true
24/7.

**On API billing (for real 24/7):** ballpark with Opus on ~2 of 5 stages and
Sonnet on 3:
- Opus share (~80k tok/tick, weighted in/out) ≈ **$2–4 / tick**
- Sonnet share (~170k tok/tick) ≈ **$0.50–1 / tick**
- **≈ $3–5 per tick.** At **6 ticks/day ≈ $20–30/day ≈ $600–900/mo.**
  At a calmer **3 ticks/day ≈ $300–450/mo.**

**Cost controls built into the design:** serial (one tick at a time), a hard tick
budget (kill a tick that exceeds N tokens), Sonnet-default with Opus only at the
two judgment chokepoints, and a daily tick cap. Recommendation: **start at 3
ticks/day** (~one good technique candidate per workday), watch the ledger for a
week, then turn the dial.

> Reality check: the value isn't "infinite sites." It's **~1 vetted, portable,
> genuinely-novel technique module per day, reviewed by you in 5 minutes.** In a
> month that's a 20–30 technique library — which is exactly the L0/L1 vocabulary
> that makes bespoke sites fast. *That's* the asset.

---

## 5. Your interface (the 5-min/day human loop)

- `gallery/` page: every SHIPPED technique, live demo + the Critic's score + the
  reference it was measured against.
- A weekly **digest** (the factory writes `factory/digest-YYYY-MM-DD.md`): what it
  built, killed, why.
- You tap 🔥/meh/kill on ~5 entries → those become Critic anchors in `rubric.md`.
  **This is the only required human input, and it's what keeps taste from
  collapsing.**

---

## 6. Build order (how we stand it up)

1. **Skeleton, no agents** — folder layout, `ledger.jsonl` schema, one
   hand-built technique module as the golden template the Builder imitates.
2. **Single-stage proof** — wire just SCOUT→PLANNER, run by hand, read output.
3. **Full serial pipeline, manual trigger** — run one whole tick on command,
   in a worktree, ending in a real SHIP/KILL verdict + ledger row.
4. **`/loop` shakedown** — ~10 local ticks. Read every output. Tune role prompts
   + rubric. This is where we catch taste-collapse early.
5. **Graduate to cron remote agent** — 3 ticks/day, digest on, walk away.
6. **Tune the dial** — raise ticks only once the ledger proves quality holds.

Nothing runs unattended until step 4 proves it doesn't make slop.

---

## 7. Open decisions for the human

- Substrate: subscription (few ticks/day, $0 extra, not true 24/7) vs API (real
  24/7, ~$300–900/mo). 
- Tick cadence to start.
- Whether SHIP auto-merges to `gallery` branch or always waits for your tap.
```
