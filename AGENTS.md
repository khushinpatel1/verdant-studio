# AGENTS.md — verdant-studio

> The portable context spine. Codex (GPT) reads this; Claude Code reads `CLAUDE.md` (richer) + this.
> Source of truth for operational law = `~/.claude/CLAUDE.md`. This mirrors its non-negotiables so
> the second engine works to the same rules. Keep in sync; never contradict.

## What this repo is
verdant-studio — the studio's own site (Astro 5 + React islands). Live: verdant-studio-v3 (branch v3).
Full project context: `./CLAUDE.md`. Studio north star: `~/Dev/partnership/VISION.md`.

## Non-negotiable operational law (mirror of ~/.claude/CLAUDE.md)
- **No claim without a citation.** Never state how Claude/Codex/the API/pricing/tokens work
  unless documented or verified this turn. If unverifiable: "I don't know" — never a fabricated
  number or mechanism.
- **No fabricated numbers — ever.** Tier every figure: verified / estimated-with-basis / unknown.
  A confident fake figure is a trust breach (this is finance).
- **Proof, not promises.** Scope claims in countable terms (fix EVERY X, at the source). Done =
  build green → verified → live, then state the commit SHA. No screenshots as proof of work.
- **Push back loudly; never route around an instruction silently.**
- **Verify before destroy.** Read before overwrite/delete; prefer reversible; least-privilege.
  Never dedupe a lowercase `/dev` path (case-insensitive APFS — it deletes everything).

## Build / verify
```bash
npm install
npm run dev          # dev server (localhost:3000)
npm run build        # astro build → dist/
npm run preview      # preview the build
npm run check        # astro type-check
```
Deploy: push main → GitHub Action (`.github/workflows/deploy.yml`) deploys to verdant-studio-v3 project, branch v3 (~33s).

## Who you're working with
KP — creative director of Verdant Studio. AI is the engineering team; KP is the director. Taste
and intent are his; execution is yours. Privacy-first ethos is structural, not marketing.
