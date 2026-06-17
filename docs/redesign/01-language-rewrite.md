# Verdant Studio — Full Language Rewrite (v2)

**Date:** 2026-06-17 · **Author:** Opus plan session · **Status:** READY TO APPLY.

Source of truth for copy is `src/data/verdant.ts` (+ a few headlines hard-coded in
`src/pages/verdant/index.astro`). This deck rewrites every customer-facing line.

**The diagnosis:** the words aren't weak, they're *over-gardened* — nearly every line is a
botanical pun, which is the loudest "AI given a theme" tell. **Rule for this rewrite:** the
two proper nouns stay (the studio is *Verdant*, the app is *Garden* — those names carry the
image for free). Beyond that, **one** load-bearing metaphor survives (the closing quote).
Everything else goes plain, exact, and conviction-led. The real story isn't "a garden" — it's
*"you pay us, so we're structurally on your side, and here's exactly what that buys you."*

Voice: dry, specific, anti-corporate, no hedging, no engagement-bait, no metaphor for its own
sake. Say the true thing plainly. Let the one image do the lifting.

> Apply note for executor: replace the string values only; keep keys, types, and structure
> identical. Where a line is hard-coded in `index.astro` (hero `<h1>`, sub, quote, CTA title),
> edit it there too — flagged below with `[index.astro]`.

---

## brand

| field | current | NEW |
|---|---|---|
| `tagline` | A studio for software grown for people, not advertisers. | **An independent software studio. We sell software — not you.** |

---

## Hero `[index.astro]`

- **label:** `Verdant Studio — independent software` (keep)
- **h1 (current):** "Software grown / for *people*, / not advertisers."
- **h1 (NEW):** **Software that answers / to *you*, / and no one else.**
- **sub (current):** "Quiet software — tools that do their work and get out of the way. Nothing here watches you back."
- **sub (NEW):** **We make a living the old-fashioned way: you pay us. No ads, no data sold, no third party reading over your shoulder. That one fact decides everything we build.**
- **actions:** "See the work" → **"See Garden"** · "The ethos" → **"What we believe"**

---

## Manifesto / creed (`ethos.creed`, shown on homepage + ethos page)

| # | current | NEW |
|---|---|---|
| 1 | No attention sold. The studio is built so it can't start. | **We never sell your attention. The studio is built so it can't.** |
| 2 | If your data can be read here, that counts as a bug. | **If we can read your data, that's a bug — not a business model.** |
| 3 | Software should feel like a quiet room, not a crowded street. | **Software should feel like a quiet room. Most of it feels like a crowded street.** |
| 4 | Slow is fine. Ship a thing once, well, rather than ten times, anxiously. | **Build one thing well, not ten things anxiously. Slow is allowed here.** |

---

## Garden (the flagship — `garden.*`)

| field | current | NEW |
|---|---|---|
| `oneLine` | Your whole financial life in one calm place — and nobody else's business. | **Every account in one place, encrypted on your device — and nobody's business but yours.** |
| `blurb` | Most money apps make a living by knowing too much about you. Garden makes a living the old way: people pay for it. Your accounts, your numbers, your plans — encrypted, on your device, sold to no one. | **Most money apps make their money by knowing too much about you. Garden makes its money the plain way — you pay for it. Your accounts, your numbers, your plans: encrypted, kept on your device, sold to no one.** *(keep — strongest paragraph on the site; light edit only)* |
| `pricing` | $48/yr at launch — join the waitlist. | **$48 a year at launch. No free tier mining your data to subsidize it — join the waitlist.** |
| `kind` | Personal finance, kept private | **Personal finance that stays private** |

### Garden screens (`garden.screens[]`)

| tab | line — current → NEW | body (NEW) |
|---|---|---|
| Home | "See the whole garden." → **"Everything, at a glance."** | Net worth, every account, and one honest health score — the first thing you see when you open it, and the last thing you have to worry about. *(keep)* |
| Money | "Pull the weeds." → **"See exactly where it goes."** | Spending, totals, and the quiet subscriptions bleeding you every month — all in one place, so you can actually cancel them. Budgets that keep their own score. |
| Plan | "Plant it, and untangle it." → **"A date on every goal. An end to every debt."** | Goals with a real deadline — an emergency fund, a trip to Kyoto — next to the debt that's pulling at you, put in order. One number to pay, the year you'll be free, and the interest you save getting there. |

### Grove (`garden.grove`)

| field | current | NEW |
|---|---|---|
| `line` | A presence that already sees your garden. | **An assistant that reads your real numbers — and never sends them anywhere.** |
| `body` | Ask anything. Grove answers from your real numbers — but it reads them on your device, in private. Nothing about your money leaves to make it work. | **Ask anything about your money. Grove answers from your actual accounts, reads them on your device, and sends nothing out to do it. The intelligence comes to your data — not the other way around.** |

### Garden notes (`garden.notes[]`)

1. current: "Built so the server holds only ciphertext — your device encrypts before anything leaves." → **"The server only ever holds ciphertext. Your device encrypts everything before it leaves."**
2. current: "No ads, no data sold, no third parties watching the ledger. You pay for it; that's the whole model." → **"No ads. No data sold. No third party in your ledger. You pay for it — that's the entire model."** *(keep — core)*
3. current: "Works offline first — your garden is yours whether or not there's a signal." → **"Offline first. It's yours whether or not there's a signal."**

---

## Emerald (the unlisted one — `emerald.*`)

| field | current | NEW |
|---|---|---|
| `oneLine` | The next project — in progress. | **Project two. Still in the dark.** |
| `blurb` | Not ready. It ships when it's ready, not a day sooner. If you found this, you went looking — and that's exactly the kind of person it's being built for. | **Not ready, and it ships when it is — not a day sooner. You only found this because you went looking. That's exactly who it's being built for.** *(keep — the intrigue is the point)* |

---

## Studio / People (`studio.*`)

| field | current | NEW |
|---|---|---|
| `who` | Verdant is Khushin Patel. | **Verdant is one person: Khushin Patel.** |
| `lead` | An independent software studio, deliberately small. | **An independent software studio, deliberately small — and built to stay that way.** |

`studio.lines[]`:
1. "One person, building quietly — with modern tools doing the heavy lifting where they earn it." → **"One person, building quietly, with modern tools doing the heavy lifting where they earn it."** *(keep)*
2. "Small is the point. No growth targets, no investors to answer to, no reason to ever sell you out. The studio is built so it can't." → **"Small is the point. No growth targets, no investors to please, no reason to ever sell you out — and the structure makes sure it can't."** *(keep — core)*
3. "If that changes — if real hands join — they'll show up here by name. Until then, no inventory of people who don't exist." → **"If that ever changes — if real hands join — they show up here by name. Until then, no roster of people who don't exist."** *(keep — great line)*

---

## Signature quote `[index.astro]` — THE ONE METAPHOR THAT STAYS

> **"The best software is like a good garden: you can tell it was tended, but you never catch it *trying*."**
> — Khushin Patel, Verdant

*(Light edit of current. This is the single load-bearing garden image — earned because it's a
framed pull-quote, not a headline. Everything else having gone plain is what lets this one land.)*

---

## CTA band `[index.astro]`

- **title (current):** "Grow something *quiet*."
- **title (NEW):** **Software that's on *your* side, for once.**
- **link (current):** "Start a conversation" → **"Try Garden"** (→ `#waitlist`)

---

## Page-level heads (subpages — apply during their depth pass)

- **/garden** hero: keep product framing; lead with the new `oneLine`.
- **/ethos** title candidate: **"What we believe, and what we built to prove it."**
- **/security** title candidate: **"Privacy isn't a setting here. It's the architecture."**
- **/team** (People) title candidate: **"A studio of one. On purpose."**

> Subpage body copy gets rewritten in the same voice during build plan 008's per-page passes;
> the persona docs (`persona-1..5.md`) will flag which page each visitor lands on and what
> specific words they need to see. This deck covers the spine; pages inherit the voice.
