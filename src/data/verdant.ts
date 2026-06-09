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
  tagline: "A studio for software grown for people, not advertisers.",
  email: "verdantmail@proton.me",
  // location + founding year intentionally omitted — placeless, timeless, nothing invented.
};

export const nav = {
  links: [
    { label: "Studio", href: "/verdant" },
    { label: "Garden", href: "/verdant/garden" },
    { label: "Ethos", href: "/verdant/ethos" },
    { label: "People", href: "/verdant/team" },
  ],
  cta: { label: "Start a project", href: "/verdant/ethos#talk" },
};

export type Screen = { tab: string; img: string; line: string; body: string };

// GARDEN — the flagship. A real personal-finance app: three beds (Home, Money,
// Plan) with Grove, a private on-device presence, reachable from anywhere.
export const garden = {
  slug: "garden",
  name: "Garden",
  idx: "01",
  kind: "Personal finance, kept private",
  year: "2023",
  status: "Live",
  oneLine: "Your whole financial life in one calm place — and nobody else's business.",
  blurb:
    "Most money apps make a living by knowing too much about you. Garden makes a living the old way: people pay for it. Your accounts, your numbers, your plans — encrypted, on your device, sold to no one.",
  cover: "/verdant/garden/garden-moss-cream.jpg",
  screens: [
    {
      tab: "Home",
      img: "/verdant/garden/garden-moss-cream.jpg",
      line: "See the whole garden.",
      body: "Net worth, every account, and one honest health score — the first thing you see when you open the app, and the last thing you have to worry about.",
    },
    {
      tab: "Money",
      img: "/verdant/garden/grow-pale-sage.jpg",
      line: "Pull the weeds.",
      body: "Where it goes, what it adds up to, and the quiet subscriptions draining you every month — gathered in one place, so you can actually cancel them. Budgets that track themselves.",
    },
    {
      tab: "Plan",
      img: "/verdant/garden/roots-forest-loam.jpg",
      line: "Plant it, and untangle it.",
      body: "Goals with a real date attached — an emergency fund, a trip to Kyoto — beside the debt that's pulling at you, put in order. One number to pay, a year you'll be free, and the interest you'll save getting there.",
    },
  ],
  // Grove — not a tab. A presence reachable from anywhere in the app.
  grove: {
    tab: "Grove",
    img: "/verdant/garden/grove-eucalyptus.jpg",
    line: "A presence that already sees your garden.",
    body: "Ask anything. Grove answers from your real numbers — but it reads them on your device, in private. Nothing about your money leaves to make it work.",
  },
  notes: [
    "Encrypted on your device before it ever syncs. We hold ciphertext and nothing else.",
    "No ads, no data sold, no third parties watching the ledger. You pay for it; that's the whole model.",
    "Works offline first — your garden is yours whether or not there's a signal.",
  ],
};

// the unlisted one — reached only through the stray stone, never in nav
export const emerald = {
  name: "Emerald",
  kind: "Unreleased — project two",
  oneLine: "Something we're still growing in the dark.",
  cover: "/verdant/art/emerald-dusk.jpg",
  blurb:
    "Not ready. We'll show it when it's ready and not a day sooner. If you found this, you went looking — and that's exactly the kind of person it's being built for.",
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
  who: "Verdant is Khushin Patel.",
  lead: "An independent software studio, deliberately small.",
  lines: [
    "One person, building quietly — with modern tools doing the heavy lifting where they earn it.",
    "Small is the point. No growth targets, no investors to answer to, no reason to ever sell you out. The studio is built so it can't.",
    "If that changes — if real hands join — they'll show up here by name. Until then, no inventory of people who don't exist.",
  ],
};

export const ethos = {
  creed: [
    "We don't sell attention. We never have, and the studio is built so we can't start.",
    "If we can read your data, we consider that a bug.",
    "Software should feel like a quiet room, not a crowded street.",
    "Slow is fine. We'd rather ship a thing once, well, than ten times, anxiously.",
  ],
  facts: [
    { value: "0", label: "Trackers shipped" },
    { value: "100%", label: "Encrypted at rest" },
    { value: "1", label: "Project, tended" },
    { value: "1", label: "Studio, independent" },
  ],
};
