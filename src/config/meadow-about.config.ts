import type { SiteConfig } from "./types";

// Verda — About page (Meadow skin).
// Imagery: Unsplash curated — people, nursery, greenhouses, bright warmth.
// Production note: localize assets to your CDN; add attribution per Unsplash license.
export const meadowAbout: SiteConfig = {
  skin: "meadow",
  brand: { name: "Verda", tagline: "Grow something good." },
  nav: {
    links: [
      { label: "Plants", href: "/meadow" },
      { label: "Care Guide", href: "/meadow-care" },
      { label: "About", href: "/meadow-about" },
      { label: "FAQ", href: "/meadow#faq" },
    ],
    cta: { label: "Start growing", href: "/meadow#buy" },
  },
  sections: [
    {
      type: "KineticHero",
      prefix: "We believe plants are",
      words: ["for everyone", "not complicated", "worth it", "alive"],
      sub: "Verda started because we kept killing plants too — and we wanted to fix that.",
      // Unsplash: bright greenhouse aisle, warm and inviting
      media: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format&fit=crop",
    },
    {
      type: "RevealBlock",
      heading: "Started in a rented greenhouse.",
      body: "In 2021, two plant-obsessed friends and a rented greenhouse in Portland. The idea was simple: what if someone matched you to a plant the way a tailor matches you to a suit?",
      // Unsplash: two people in a greenhouse tending plants
      media: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=1200&q=80&auto=format&fit=crop",
      align: "left",
    },
    {
      type: "RevealBlock",
      heading: "Grown with renewable energy.",
      body: "Our partner nurseries run on solar and collect rainwater. The packaging composts. The carbon we can't eliminate yet, we offset honestly — with verified soil sequestration, not forests we don't own.",
      // Unsplash: bright sunny nursery rows of plants
      media: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "PinnedShowcase",
      heading: "How we work.",
      // Unsplash: lush plant nursery shelves
      media: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=1200&q=80&auto=format&fit=crop",
      steps: [
        { title: "We match, not guess.", body: "A short quiz + your photo tells us your light, space, and lifestyle. We pick the plant, not an algorithm." },
        { title: "Partners, not factories.", body: "Every nursery partner is family-run and has worked with us from the start." },
        { title: "30-day promise.", body: "If your plant doesn't thrive, we replace it — no hoops, no fine print." },
      ],
    },
    {
      type: "CardGrid",
      heading: "By the numbers.",
      cards: [
        { icon: "🌱", title: "40,000+ plants", body: "Matched and delivered since 2021." },
        { icon: "🏡", title: "12 nursery partners", body: "All family-run, all within 300 miles of our distribution hubs." },
        { icon: "♻", title: "100% compostable packaging", body: "Every box, insert, and wrap — gone in 45 days." },
        { icon: "💚", title: "98% thrive rate", body: "Of plants shipped, 98% are still alive and growing at 6 months." },
      ],
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Shop", links: [{ label: "Plants", href: "/meadow" }, { label: "Pots", href: "#" }, { label: "Gift sets", href: "#" }] },
        { title: "Learn", links: [{ label: "Care guides", href: "/meadow-care" }, { label: "Light finder", href: "#" }, { label: "Support", href: "#" }] },
        { title: "Company", links: [{ label: "About", href: "/meadow-about" }, { label: "Sustainability", href: "#" }, { label: "Careers", href: "#" }] },
      ],
      legal: "© 2026 Verda — a Pastures 'Meadow' template demo.",
    },
  ],
};
