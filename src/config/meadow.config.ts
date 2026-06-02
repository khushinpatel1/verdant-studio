import type { SiteConfig } from "./types";

// MEADOW skin — Verdant Studio. A privacy-first software studio whose muse is the
// Japanese garden: moonlight, moss, stillness with life moving slowly underneath.
// Ported from the verdant-site SPA into the config-driven Pastures framework.
// Imagery: curated Unsplash CDN URLs (still water / moss / night blooms / nature).
// Production note: localize assets to your CDN and add attribution per Unsplash license.

// Shared nav across every Meadow/Verdant page.
export const verdantNav = {
  links: [
    { label: "Studio", href: "/meadow" },
    { label: "Garden", href: "/meadow-garden" },
    { label: "Ethos", href: "/meadow-ethos" },
    { label: "Team", href: "/meadow-team" },
  ],
  cta: { label: "Get in touch", href: "/meadow-ethos" },
};

export const meadow: SiteConfig = {
  skin: "meadow",
  brand: { name: "Verdant", tagline: "Software built for people, not advertisers." },
  nav: verdantNav,
  sections: [
    {
      type: "KineticHero",
      prefix: "Software built for",
      words: ["people", "stillness", "privacy", "you"],
      sub: "A small studio making quiet, durable software — no ads, no tracking, nothing extra. Composed like a garden: meticulous, yet effortless.",
      // Unsplash: moonlit still water / serene night garden — moss + moonlight
      media: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1920&q=80&auto=format&fit=crop",
      cta: { label: "See the work", href: "/meadow-garden" },
    },
    {
      type: "RevealBlock",
      heading: "No ads. No tracking. Just software.",
      body: "We don't sell attention and we don't broker data. The product is the product — paid for plainly, owned completely. What you give us stays between us.",
      // Unsplash: moss-covered stone, quiet detail
      media: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "CardGrid",
      heading: "How we tend the work.",
      cards: [
        { icon: "🌱", title: "Plant", body: "Start from the person, not the feature list. One clear intention, nothing extra." },
        { icon: "🪴", title: "Tend", body: "Slow, deliberate iteration. We let ideas root before we build on them." },
        { icon: "✂️", title: "Prune", body: "Cut anything that doesn't serve stillness. Restraint is the design." },
        { icon: "🌳", title: "Grow", body: "Durable software that ages well — composed to outlast the trend that birthed it." },
      ],
    },
    {
      type: "RevealBlock",
      heading: "Stillness, with life moving slowly underneath.",
      body: "A Japanese garden looks effortless because every stone was placed with intent. We build the same way: meticulously composed, quietly efficient, nothing for show.",
      align: "left",
    },
    {
      type: "CardGrid",
      heading: "What's growing.",
      cards: [
        { icon: "🌿", title: "Garden", body: "A privacy-first personal finance app. Your money, your garden, nobody else's. → /meadow-garden" },
        { icon: "💎", title: "Emerald", body: "Something is taking root below the surface. Not ready to be seen yet. → /meadow-emerald" },
      ],
    },
    {
      type: "VideoScene",
      // Free sample MP4 (no key). Production: swap for Coverr/Mixkit ambient nature footage.
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      heading: "Grown, not designed.",
      sub: "We study how the calmest spaces are made, and build software that feels the same way.",
      overlayDir: "bottom",
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Studio", links: [{ label: "Ethos", href: "/meadow-ethos" }, { label: "Team", href: "/meadow-team" }, { label: "Get in touch", href: "/meadow-ethos" }] },
        { title: "Work", links: [{ label: "Garden", href: "/meadow-garden" }, { label: "Emerald", href: "/meadow-emerald" }] },
        { title: "Principles", links: [{ label: "No ads", href: "/meadow-ethos" }, { label: "No trackers", href: "/meadow-ethos" }, { label: "Built slowly", href: "/meadow-ethos" }] },
      ],
      legal: "© 2026 Verdant Studio — a Pastures “Meadow” template demo. Imagery is placeholder.",
    },
  ],
};
