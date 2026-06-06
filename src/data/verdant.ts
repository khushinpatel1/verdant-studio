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
  email: "hello@verdant.studio",
  location: "Kyoto · Lisbon",
  est: "Est. 2019",
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

// GARDEN — the flagship. A real, five-screen personal-finance app.
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
      tab: "Garden",
      img: "/verdant/garden/garden-moss-cream.jpg",
      line: "See the whole garden.",
      body: "Net worth, every account, and one honest health score — the first thing you see when you open the app, and the last thing you have to worry about.",
    },
    {
      tab: "Grow",
      img: "/verdant/garden/grow-pale-sage.jpg",
      line: "Pull the weeds.",
      body: "Budgets that track themselves, and the quiet subscriptions draining you every month, gathered in one place so you can actually cancel them.",
    },
    {
      tab: "Seeds",
      img: "/verdant/garden/seeds-midnight-forest.jpg",
      line: "Plant it. Watch it grow.",
      body: "Savings goals with a real date attached. An emergency fund, a trip to Kyoto — Garden tells you what to set aside and when you'll get there.",
    },
    {
      tab: "Roots",
      img: "/verdant/garden/roots-forest-loam.jpg",
      line: "Untangle what's pulling at you.",
      body: "Debt, put in order. Avalanche or snowball, the real payoff date, the interest you'll save. One number to pay each month, and a year you'll be free.",
    },
    {
      tab: "Grove",
      img: "/verdant/garden/grove-eucalyptus.jpg",
      line: "A presence that already sees your garden.",
      body: "Ask anything. Grove answers from your real numbers — but it reads them on your device, in private. Nothing about your money leaves to make it work.",
    },
  ],
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

export const team: Person[] = [
  {
    slug: "mira-tanaka",
    name: "Mira Tanaka",
    role: "Founder, systems",
    since: "2019",
    short: "Started Verdant after a decade building things that watched people.",
    bio: [
      "Mira spent ten years inside ad-tech, building the machinery that follows people around the web. She left the week she realised she could no longer explain her job to her grandmother without flinching.",
      "She designs Garden's encryption and sync from the protocol up. Her rule: if we can read it, we built it wrong.",
    ],
    cares: "Cold tea, old compilers, the gravel garden at Ryōan-ji.",
  },
  {
    slug: "sol-prieto",
    name: "Sol Prieto",
    role: "Design",
    since: "2020",
    short: "Draws the calm. Removes more than they add.",
    bio: [
      "Sol came from print — books, mostly — and still treats a screen like a page that happens to glow. They are responsible for the white space you don't notice and would miss.",
      "Every screen of Garden ships past Sol twice: once to add what it needs, once to take away what it doesn't.",
    ],
    cares: "Letterpress, moss, the exact grey of rain on slate.",
  },
  {
    slug: "ade-okafor",
    name: "Ade Okafor",
    role: "Engineering",
    since: "2021",
    short: "Makes the offline-first thing actually work offline.",
    bio: [
      "Ade builds the parts that have to be invisible: sync that never loses a number, encryption that never gets in the way, an app that behaves the same on a train as in an office.",
      "He believes a tool earns trust by being boring in all the right places.",
    ],
    cares: "Bicycles, conflict-free replicated data types, bonsai he keeps almost alive.",
  },
];

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
    { value: "9", label: "People, no more" },
  ],
};
