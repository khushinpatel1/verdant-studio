# Sunk-Cost Audit — Garden + Verdant Studio (2026-06-12)

Continuation of the prior-chat handoff. Standing rules: no flattery, every
claim sourced or flagged as inferred, concise.

## 0. What this session could and couldn't reach

- **Verdant Studio repo**: full access (this repo, all history, CI runs).
- **Garden repo**: **no access**. This session's GitHub scope is
  `khushinpatel1/verdant-studio` only, and no repo-listing tool was available
  to add Garden. Everything below about Garden is inferred from how it's
  *referenced* inside verdant-studio (screenshots, copy) — not its own repo.
- **Posthog / analytics**: none found. Confirmed by grep — no
  posthog/analytics/gtag/plausible/fathom/umami in source or deps.
- **Cloudflare Pages dashboard** (request counts — the one traction signal
  that wouldn't violate the "no tracker" claim): not reachable from this
  session.

This audit is therefore **complete for Verdant Studio, incomplete for
Garden**. Don't treat the Garden-side gaps below as "no activity" — they're
"no visibility."

## 1. Traction/usage data

**There is none, and it's architectural, not an oversight.**

`src/pages/verdant/security.astro:32` states as a standing principle: *"No
ads, no analytics SDKs, no third parties in the data path."* This is the
literal site copy, audited and confirmed-true in `docs/004-language-type-handoff.md`.
package.json has zero analytics dependencies. There is no Posthog, no GA, no
Plausible anywhere in this repo.

One commit (`0809a25`) explicitly **removed a "KPI-styled stats grid"** from
the home page and ethos page — fabricated metrics that were built, then cut
in a "truth pass" for being unverifiable.

The only traction-adjacent fact available: **the Cloudflare Pages deploy
pipeline is live and working** — 9/9 recent CI runs succeeded, including the
latest (`6f31297`, 2026-06-12), deploying to the `verdant` Pages project. So
the site is reachable. Whether anyone is reaching it: unknown from here.

For Garden: unknown. No repo access, no analytics found referenced anywhere.

## 2. Hours/features invested, last 60 days

**The entire verdant-studio repo is 10 days old** (first commit
2026-06-02T00:35). "Last 60 days" = the project's entire life. 49 commits,
clustered into ~7 active days:

| Date | Commits | Net lines | Theme |
|---|---|---|---|
| 06-02 (00:35–00:46) | 6 | +7,759 | "Overnight session": baseline `pastures` multi-skin scaffold (Ridge/Meadow), VideoScene, Cloudflare runbook |
| 06-03 | 1 | +1,364 | FERAL demo skin (3rd skin, technique vocabulary) |
| 06-06 | 1 | +1,836 | Verdant skin built (Japanese-garden studio site) |
| 06-07 | 1 | +269 | Verdant handoff doc, reorg |
| **06-09 (06:38–22:13)** | **16** | **net ≈ −1,400** | **The pivot day**: studio reset (rename pastures→verdant-studio), retire Ridge/Meadow/FERAL (**−2,722 lines**, `04bee0a`), build full canvas-hero pipeline (EthosWater WebGL "flagship", BlueprintReveal, flow-field grass — **+820 lines**), security page, mobile-Safari fixes, CI deploy setup |
| 06-10 | 4 | +236 | Brand assets, OG images, 404 page, truth-pass copy edit |
| **06-11 (08:28–16:41)** | **8** | **net ≈ −1,000** | **Second pivot day**: art-led pass — 5 Koson prints replace **4 canvas heroes built 2 days earlier** (**−1,342 lines**, `99f87e8`), tranquil-state polish plan + execution, dead-code cleanup |
| 06-12 | 1 | +302 | Typography refinements |

Two of seven active days (06-09, 06-11) are **build-then-discard pivots**:
~2,700 lines of multi-skin framework built and killed within a week; ~1,300
lines of WebGL canvas work ("flagship") built and killed within **2 days**.

For Garden: unknown effort. The one visible cross-reference is `fc0a02f`
(06-09) — Verdant Studio swapped its Garden screenshots from a 5-tab UI
(Garden/Grow/Seeds/Roots/Grove) to a current 3-tab UI, meaning Garden itself
shipped a UI consolidation in this window. No further detail available.

## 3. Keep / Kill / Pause — would we start this today?

| Workstream | Start today, knowing what we know? | Verdict | Evidence |
|---|---|---|---|
| Single verdant skin (retired ridge/meadow/feral) | Yes | **KEEP** | Converged state; `npm run build` clean, 9/9 recent CI deploys green |
| GrowingGarden canvas signature (`/verdant/garden` only) | Marginal yes, but no *more* | **KEEP, freeze further canvas R&D** | Only surviving canvas after the EthosWater cull; carries real perf-hardening (30fps idle-throttle, `visibilitychange` pause, iOS viewport re-measure, touch handlers — `0809a25`, `5434824`, `61c989b`). Working and paid-for. But zero visitor data exists to justify *another* canvas investment. |
| EthosWater (WebGL water, "flagship") / BlueprintReveal / flow-field grass / StudioInk / SandGarden / TeamFireflies / EmeraldNight | No | **Already KILLED (06-11)** — correctly | Built 06-09 (`5eb84e2`, `f629d92`, `a93df1d`, `6e338a1`, +820 lines), removed 06-11 (`99f87e8`, −1,342 lines). ~1 day of "flagship" WebGL work had a ~2-day shelf life. This is sunk-cost *discipline done right* — cut fast, not nursed. |
| Ridge/Meadow/Feral multi-skin template framework | No | **Already KILLED (06-09)** — correctly | Built 06-02/06-03 (+9,000 lines incl. baseline), removed 06-09 (`04bee0a`, −2,722 lines). ~1 week of "which brand skin" exploration discarded once "verdant only" was decided. |
| Fake-KPI stat blocks / fabricated attributions ("Mira" pull-quote, invented team headline) | No | **Already KILLED** — correctly | Removed in truth-pass commits `2d61223`, `7dbbcf7`, `0809a25`. Built once, never shipped to a real visitor (presumably), cut on review. |
| `.claude/plans/002-autonomous-technique-factory.md` + `.claude/loop/` scaffolding (ralph.sh, role prompts, ledger design) | **No** | **PAUSE / shelve** | `progress.md` → `STATUS: NOT_STARTED`, empty PLAN. The plan's own cost table: ~$300–900/mo for a pipeline whose output is *more candidate aesthetic techniques*. But the last 10 days show the bottleneck isn't a shortage of techniques — it's that **2 of 3 major builds (multi-skin framework, canvas-hero pipeline) got discarded within days of being built**. Spending money to generate more candidates feeds the same loop, before any visitor evidence exists to anchor taste. The plan even self-gates: *"Nothing runs unattended until step 4 proves it doesn't make slop."* Honor that gate — don't start step 1 yet. |
| `004-language-and-type-rehaul` (Haiku-executed copy/type audit) | Yes, and it's done | **KEEP / done — don't repeat yet** | Cheap (Haiku-tier), scoped, concrete diffs (line-heights, one copy line). Good ROI for a one-time pass. Repeating a full 6-page copy audit again before any reader feedback exists would be polishing for nobody. |
| Security/proof page (`/verdant/security`) | Yes | **KEEP** | 174 lines, every claim sourced to `garden.notes`/`ethos.creed` or literally-true response headers (`public/_headers`); explicitly gates unconfirmed claims ("harder specifics... NOT asserted yet"). Cheap trust-building, no overreach. |
| Cloudflare deploy pipeline (`.github/workflows/deploy.yml`) | Yes, but resolve the name drift | **KEEP, fix naming loose end** | 9/9 recent runs green. But it deploys to Cloudflare project `verdant` (`--project-name=verdant`), while CLAUDE.md describes a rename to `verdant-studio` and points to `_archive/MANIFEST.md` "in partnership" (a repo this session can't see) for "CF rename status." Small, unresolved — not a kill, just close the loop so the docs match the actual deploy target. |
| Beta-launch new pages (next planned workstream — explicitly deferred in `003-tranquil-pass.md`) | **Insufficient evidence either way** | **PAUSE** | No traffic/lead signal for Verdant Studio exists (by design — no analytics). No Garden traction data is visible to this session. Adding more pages to the marketing site before either product has *any* measured audience repeats the exact "build wide, narrow later" shape that killed the multi-skin framework and the canvas pipeline. |
| Garden 5-tab → 3-tab redesign | Cannot assess | **OUT OF SCOPE for this session** | Only visible as a screenshot swap on the verdant-studio side (`fc0a02f`). Needs the Garden repo to evaluate. |
| Two-product split (Garden + Verdant Studio) | Cannot settle here | **OPEN — see below** | |

## 4. The open question: does the two-product split survive zero-based review?

**Still can't be settled — but this session adds one data point that
sharpens it.** The original audit's flag #3 worried about *vision* sustaining
two products without evidence. What this audit found is a **process** pattern
that would make that worse either way: in 10 days, Verdant Studio alone ran
two full build→discard cycles (multi-skin framework, then canvas-hero
pipeline), each one 1–7 days of work thrown away within days of completion.
That's not wasted *because* it's two products — but it means the studio side
is currently consuming real time on aesthetic exploration with **zero
external feedback loop** (no analytics, no users, by design).

If the next move is "build beta-launch pages" or "stand up the technique
factory," that's a *third* round of build-before-evidence on the studio side
— while Garden (the actual revenue-bearing product) has its own undocumented
redesign churn (5-tab → 3-tab) happening in parallel, invisible to this
session.

**Recommendation, not a vision statement:** before any new Verdant Studio
workstream (beta pages or the technique factory), get **one piece of real
evidence** that doesn't require new analytics infrastructure — e.g., a manual
Cloudflare Pages request-count check (dashboard, not a client SDK — doesn't
violate the "no tracker" claim), or one usage metric from Garden itself. If
that evidence doesn't exist after 10 days live, the question isn't "which
page next" — it's whether studio-site iteration should continue at all before
Garden has the same kind of check.

## Known prior flags (from earlier audit, unchanged)

- Serialize-sessions rule: corrected.
- Link-infrastructure loop: corrected.
