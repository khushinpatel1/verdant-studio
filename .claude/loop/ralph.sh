#!/usr/bin/env bash
# ralph.sh — autonomous build loop for Pastures.
# Planner (Opus) → Builder (Sonnet) ×N → Verify → Reviewer (Opus) → gate.
# Ralph-style: each phase is a stateless `claude -p` call; the spec.md +
# progress.md files are the shared blackboard that carries state across turns.
#
# SAFETY: runs only inside a git worktree branch. Never touches main, never
# pushes, never auto-merges. Hard caps on iterations AND wall-clock so an
# overnight run cannot silently rack up Agent-SDK / API charges.
set -euo pipefail

# ── config (override via env) ────────────────────────────────────────────────
PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
LOOP_DIR="$PROJECT_DIR/.claude/loop"
WORKTREE="${WORKTREE:-$PROJECT_DIR/.loop-worktree}"
BRANCH="${BRANCH:-loop/$(date +%Y%m%d-%H%M%S)}"

MAX_ITERS="${MAX_ITERS:-12}"            # hard stop: build/review cycles
MAX_WALL_SECONDS="${MAX_WALL_SECONDS:-7200}"   # hard stop: 2h wall clock
VERIFY_CMD="${VERIFY_CMD:-npm run build && npm run check}"

MODEL_PLAN="${MODEL_PLAN:-claude-opus-4-8}"
MODEL_BUILD="${MODEL_BUILD:-claude-sonnet-4-6}"
MODEL_REVIEW="${MODEL_REVIEW:-claude-opus-4-8}"

# Full autonomy needs unattended permissions. Opt in explicitly.
PERM_FLAG="${PERM_FLAG:---permission-mode acceptEdits}"
#   For a true hands-off overnight run, set:
#   export PERM_FLAG="--dangerously-skip-permissions"
#   (only inside the isolated worktree — understand the risk first).

# ── locate the claude CLI ────────────────────────────────────────────────────
CLAUDE_BIN="${CLAUDE_BIN:-$(command -v claude || true)}"
if [[ -z "$CLAUDE_BIN" ]]; then
  echo "FATAL: 'claude' CLI not found on PATH." >&2
  echo "Install it:  npm i -g @anthropic-ai/claude-code   (or set CLAUDE_BIN=)" >&2
  exit 127
fi

# ── helpers ──────────────────────────────────────────────────────────────────
log() { printf '\n\033[1;36m[ralph %s]\033[0m %s\n' "$(date +%H:%M:%S)" "$*"; }

run_phase() { # $1=model  $2=role-prompt-file  $3=extra context string
  local model="$1" rolefile="$2" extra="${3:-}"
  local sys; sys="$(cat "$LOOP_DIR/$rolefile")"
  ( cd "$WORKTREE" && "$CLAUDE_BIN" -p "Begin your role. ${extra}" \
      --model "$model" \
      --append-system-prompt "$sys" \
      $PERM_FLAG \
      --add-dir "$WORKTREE" \
      --output-format text )
}

complete() { grep -q '^LOOP_COMPLETE$' "$WORKTREE/.claude/loop/progress.md" 2>/dev/null; }

# ── preflight ────────────────────────────────────────────────────────────────
cd "$PROJECT_DIR"
git rev-parse --is-inside-work-tree >/dev/null
if grep -q '^(YOU FILL THIS)$' "$LOOP_DIR/spec.md"; then
  echo "FATAL: spec.md GOAL is still the placeholder. Fill it before launching." >&2
  exit 1
fi

# fresh worktree off main
git worktree remove --force "$WORKTREE" 2>/dev/null || true
git worktree add -b "$BRANCH" "$WORKTREE" main
log "worktree $WORKTREE on branch $BRANCH"

START=$(date +%s)

# ── PLAN (once) ──────────────────────────────────────────────────────────────
log "PLAN  (Opus)"
run_phase "$MODEL_PLAN" roles/plan.md
if grep -q 'BLOCKED' "$WORKTREE/.claude/loop/progress.md"; then
  log "Planner reported BLOCKED — fix spec.md and relaunch. Stopping."; exit 2
fi

# ── BUILD / VERIFY / REVIEW loop ─────────────────────────────────────────────
for ((i=1; i<=MAX_ITERS; i++)); do
  elapsed=$(( $(date +%s) - START ))
  if (( elapsed > MAX_WALL_SECONDS )); then
    log "Wall-clock cap (${MAX_WALL_SECONDS}s) hit. Stopping at iter $i."; break
  fi
  printf '\n## Iteration %d (%s)\n' "$i" "$(date)" >> "$WORKTREE/.claude/loop/progress.md"

  log "BUILD  iter $i/$MAX_ITERS  (Sonnet)"
  run_phase "$MODEL_BUILD" roles/build.md

  log "VERIFY iter $i  ($VERIFY_CMD)"
  if ( cd "$WORKTREE" && eval "$VERIFY_CMD" ) >/"$WORKTREE/.claude/loop/verify.log" 2>&1; then
    VERDICT="VERIFY: PASS"
  else
    VERDICT="VERIFY: FAIL (see verify.log tail below)"
    tail -n 30 "$WORKTREE/.claude/loop/verify.log" >> "$WORKTREE/.claude/loop/progress.md" || true
  fi
  log "$VERDICT"

  log "REVIEW iter $i  (Opus)"
  run_phase "$MODEL_REVIEW" roles/review.md "$VERDICT"

  if complete; then
    log "✅ LOOP_COMPLETE — all acceptance criteria met on branch $BRANCH"
    git -C "$WORKTREE" add -A && git -C "$WORKTREE" commit -q -m "loop: $BRANCH complete" || true
    echo
    echo "Review and merge when ready:"
    echo "  git -C \"$PROJECT_DIR\" diff main...$BRANCH"
    echo "  git -C \"$PROJECT_DIR\" merge --no-ff $BRANCH   # on main, your call"
    exit 0
  fi
done

git -C "$WORKTREE" add -A && git -C "$WORKTREE" commit -q -m "loop: $BRANCH checkpoint (not complete)" || true
log "Stopped without completion. State preserved on branch $BRANCH (progress.md)."
exit 3
