# The Loop — autonomous headless build machinery

A Ralph-style loop: separate, model-tiered Claude instances plan, build, verify,
and review your spec until the acceptance criteria pass — unattended.

```
PLAN (Opus)  ──▶  BUILD (Sonnet)  ──▶  VERIFY (npm run build && check)  ──▶  REVIEW (Opus)
                       ▲                                                          │
                       └──────────────  not done: log + loop  ◀──────────────────┘
                                          done: LOOP_COMPLETE → commit branch → human merges
```

The three Claudes never share memory. They pass state through two files on disk
(`spec.md` = the contract, `progress.md` = the checkpoint), which is what makes the
loop resumable and the reviewer a genuine fresh skeptic.

## Prerequisites
- **Standalone Claude Code CLI** on PATH: `npm i -g @anthropic-ai/claude-code`.
  (The desktop app you chat in cannot spawn a detached overnight `-p` process.)
- Clean `main` (the loop branches off it).

## Cost reality (Pro plan, after June 15 2026)
Headless `claude -p` draws on a **separate ~$20/mo Agent SDK credit**, not your
interactive Pro pool; past that it bills at **API per-token rates**. The driver
caps both iterations (`MAX_ITERS=12`) and wall-clock (`MAX_WALL_SECONDS=7200`)
so a run can't silently run away. Start with small caps and watch the first run.

## Use it
1. **Write the spec.** Edit `spec.md` — fill GOAL and ACCEPTANCE CRITERIA. The
   criteria ARE the gate; prefer ones a script can check.
2. **Launch:**
   ```bash
   cd ~/Dev/pastures
   ./.claude/loop/ralph.sh
   ```
   Overnight / hands-off (understand the risk — runs in the isolated worktree only):
   ```bash
   PERM_FLAG="--dangerously-skip-permissions" MAX_ITERS=20 \
     nohup ./.claude/loop/ralph.sh > .claude/loop/run.log 2>&1 &
   ```
3. **Merge on your word.** On success the work sits on branch `loop/<timestamp>`.
   The loop never touches `main`. Review and merge yourself:
   ```bash
   git diff main...loop/<timestamp>
   git merge --no-ff loop/<timestamp>
   ```

## Knobs (env vars)
| var | default | meaning |
|---|---|---|
| `MAX_ITERS` | 12 | build/review cycles before forced stop |
| `MAX_WALL_SECONDS` | 7200 | wall-clock cap (2h) |
| `VERIFY_CMD` | `npm run build && npm run check` | the completion gate command |
| `MODEL_PLAN/BUILD/REVIEW` | opus / sonnet / opus | per-phase model tier |
| `PERM_FLAG` | `--permission-mode acceptEdits` | set to `--dangerously-skip-permissions` for true hands-off |
| `CLAUDE_BIN` | autodetected | path to the claude CLI |

## Why it stops (and doesn't spin forever)
- **Completion** = reviewer writes the token `LOOP_COMPLETE` into progress.md,
  which only happens when VERIFY passed AND every criterion is met.
- **Caps** = iteration + wall-clock hard stops.
- **BLOCKED** = planner bails if the spec is empty/contradictory.

## Honest limits
- It's only as good as your acceptance criteria. Vague spec → vague "done."
- Visual/aesthetic polish is hard to gate objectively; encode what you can as
  greppable checks, and treat the human merge step as the taste gate.
- This is *headless overnight* per your choice. The cheaper Pro-friendly variant
  is the same role split run inside one interactive session with subagents —
  no SDK credit burned. Ask and I'll add a `loop-interactive` variant.
