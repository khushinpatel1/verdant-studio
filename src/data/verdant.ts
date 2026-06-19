// VERDANT — one source of truth, read across every page.
//
// Verdant is the STUDIO: a small, privacy-first software studio. Its first
// official project is GARDEN, a personal-finance app that keeps your numbers to
// itself. EMERALD is the secret one, still grown in the dark (reached only via
// the stray stone in the footer). The muse threaded through all of it is the
// Japanese garden: composed, unhurried, alive underneath.

export const brand = {
  name: "Verdant",
  wordmark: "Verdant",
  tagline: "An independent software studio. We sell software — not you.",
  email: "verdantmail@proton.me",
  // location + founding year intentionally omitted — placeless, timeless, nothing invented.
};

export const nav = {
  links: [
    { label: "Garden", href: "/verdant/garden" },
    { label: "Security", href: "/verdant/security" },
    { label: "Pricing", href: "/verdant/pricing" },
    { label: "Studio", href: "/verdant/studio" },
  ],
  cta: { label: "Join the beta", href: "/verdant/beta" },
};

export type Screen = { tab: string; img: string; line: string; body: string };

// GARDEN — the flagship. A real personal-finance app: three beds (Home, Money,
// Plan) with Grove, a private on-device presence, reachable from anywhere.
export const garden = {
  slug: "garden",
  name: "Garden",
  idx: "01",
  kind: "Personal finance that stays private",
  year: "2026",
  status: "Early Access",
  oneLine: "Every account in one place, encrypted on your device — and nobody's business but yours.",
  blurb:
    "Most money apps make their money by knowing too much about you. Garden makes its money the plain way — you pay for it. Your accounts, your numbers, your plans: encrypted, kept on your device, sold to no one.",
  cover: "/verdant/garden/garden-home.webp",
  // vault-lock.jpg — used as back-phone teaser on homepage (intriguing encrypted-garden hint)
  vaultScreen: "/verdant/garden/vault-lock.jpg",
  url: "https://garden.khushinpatel1.workers.dev",
  // Pricing signal — copy only, no payment system yet. People pay for it; that's the model.
  pricing: "Free during the beta. No ads, no data sold — that doesn't change.",
  onboarding: "Start fresh or import a CSV — your data, your device.",
  accountConnection: "Manual CSV import for now. Bank sync coming.",
  groveExample: "Ask 'How long until I pay off my Amex?' — Grove answers with the month and year, from your actual balances, sent nowhere.",
  screens: [
    {
      tab: "Home",
      img: "/verdant/garden/garden-home.webp",
      line: "Everything, at a glance.",
      body: "Net worth, every account, and one honest health score — the first thing you see when you open it, and the last thing you have to worry about.",
    },
    {
      tab: "Money",
      img: "/verdant/garden/garden-money.webp",
      line: "See exactly where it goes.",
      body: "Spending, totals, and the quiet subscriptions bleeding you every month — all in one place, so you can actually cancel them. Budgets that keep their own score.",
    },
    {
      tab: "Plan",
      img: "/verdant/garden/garden-plan.webp",
      line: "A date on every goal. An end to every debt.",
      body: "Goals with a real deadline — an emergency fund, a trip to Kyoto — next to the debt that's pulling at you, put in order. One number to pay, the year you'll be free, and the interest you save getting there.",
    },
  ],
  // Grove — not a tab. A presence reachable from anywhere in the app.
  grove: {
    tab: "Grove",
    img: "/verdant/garden/garden-grove.webp",
    line: "An assistant that reads your real numbers — and never sends them anywhere.",
    body: "Ask anything about your money. Ask 'How long until I pay off my Amex?' and Grove answers with the month and year, pulled from your actual balances and payment history. It reads your accounts on your device and sends nothing out to do it. The intelligence comes to your data — not the other way around.",
  },
  notes: [
    "The server only ever holds ciphertext. Your device encrypts everything before it leaves.",
    "No ads. No data sold. No third party in your ledger. You pay for it — that's the entire model.",
    "Offline first. It's yours whether or not there's a signal.",
  ],
};

// the unlisted one — reached only through the stray stone, never in nav
export const emerald = {
  name: "Emerald",
  kind: "Project two — focused ambition",
  oneLine: "Growing in the soil. Ships when it's ready.",
  cover: "/verdant/art/emerald-dusk.jpg",
  blurb:
    "Not a distraction, not a roadmap item. A real project, built with the same quiet conviction as Garden — finished when it's finished, not a day sooner. You only found this because you went looking. That's who it's for.",
};

export type Person = {
  slug: string;
  name: string;
  role: string;
  since: string;
  short: string;
  bio: string[];
  cares: string;
};

// No invented people. Verdant is independent and deliberately small.
// (Empty so the per-person route generates nothing; real bios can be added later.)
export const team: Person[] = [];

// The honest "People" page — a studio of one, kept small on purpose.
// NOTE: name inferred from your account (khushinpatel1@gmail.com) — confirm spelling/title.
export const studio = {
  who: "Verdant is one person: Khushin Patel.",
  lead: "An independent software studio, deliberately small — and built to stay that way.",
  lines: [
    "One person, building quietly, with modern tools doing the heavy lifting where they earn it.",
    "Small is the point. No growth targets, no investors to please, no reason to ever sell you out — and the structure makes sure it can't.",
    "If that ever changes — if real hands join — they show up here by name. Until then, no roster of people who don't exist.",
  ],
};

export const ethos = {
  creed: [
    "We never sell your attention. The studio is built so it can't.",
    "If we can read your data, that's a bug — not a business model.",
    "Software should feel like a quiet room. Most of it feels like a crowded street.",
    "Build one thing well, not ten things anxiously. Slow is allowed here.",
  ],
  shipping: [
    { feature: "Garden — Early Access launch", date: "2026-06-17" },
    { feature: "Export as JSON — any time, no account needed", date: "2026-06" },
    { feature: "Grove — on-device financial assistant", date: "2026-06" },
    { feature: "Bank sync via Plaid", date: "In progress" },
  ],
  dataPortability: "Export all your data as JSON at any time. No account lock-in. No permissions needed.",
  version: "001",
  launched: "2026-06-17",
};
