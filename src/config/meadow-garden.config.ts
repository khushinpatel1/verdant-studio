import type { SiteConfig } from "./types";
import { verdantNav } from "./meadow.config";

// MEADOW skin — Verdant's "Garden" product page (privacy-first personal finance app).
// Ported from verdant-site Garden.jsx into the Pastures config framework.
export const meadowGarden: SiteConfig = {
  skin: "meadow",
  brand: { name: "Verdant", tagline: "Garden — your money, your garden." },
  nav: verdantNav,
  sections: [
    {
      type: "KineticHero",
      prefix: "Your money. Your garden.",
      words: ["nobody else's", "private", "yours", "rooted"],
      sub: "A personal finance app that lives on your device. Net worth grows, debts are weeds, goals are seeds — and nothing ever leaves the garden.",
      // Unsplash: lush moss garden / tended greenery — growth metaphor
      media: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=1920&q=80&auto=format&fit=crop",
      cta: { label: "Join the waitlist", href: "#waitlist" },
    },
    {
      type: "PinnedShowcase",
      heading: "A whole financial life, tended quietly.",
      // Unsplash: serene plant in soft light — calm, premium
      media: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80&auto=format&fit=crop",
      steps: [
        { title: "Plant your seeds.", body: "Set goals as seeds. Watch them sprout as you fund them — progress you can feel, not just numbers." },
        { title: "Pull the weeds.", body: "Debts surface as weeds. Garden shows you the fastest, calmest path to clearing them." },
        { title: "Watch it grow.", body: "Net worth is your garden's canopy. It fills in slowly, season over season, entirely on your device." },
      ],
    },
    {
      type: "CardGrid",
      heading: "Privacy isn't a setting. It's the foundation.",
      cards: [
        { icon: "🔒", title: "End-to-end encrypted", body: "Your data is sealed before it ever syncs. We couldn't read it if we tried." },
        { icon: "🚫", title: "Zero trackers", body: "No analytics SDKs, no ad pixels, no third-party eyes. None." },
        { icon: "📱", title: "Local-first", body: "Everything works offline, on your device. The cloud is optional, never required." },
      ],
    },
    {
      type: "RevealBlock",
      heading: "The best financial advisor is one paid by you.",
      body: "Every other money app answers to advertisers or data brokers. Garden answers to you, because you're the only one who pays us. That's the whole business model.",
      // Unsplash: quiet water / reflection — trust, calm
      media: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "RevealBlock",
      heading: "Be first in the garden.",
      body: "Garden is growing toward an open beta. Leave a note and we'll reach out when there's room — no spam, no list-selling, just one quiet email when it's ready.",
      align: "left",
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Garden", links: [{ label: "Waitlist", href: "#waitlist" }, { label: "Privacy", href: "/meadow-ethos" }] },
        { title: "Studio", links: [{ label: "Ethos", href: "/meadow-ethos" }, { label: "Team", href: "/meadow-team" }] },
        { title: "More", links: [{ label: "Studio home", href: "/meadow" }, { label: "Emerald", href: "/meadow-emerald" }] },
      ],
      legal: "© 2026 Verdant Studio — a Pastures “Meadow” template demo. Imagery is placeholder.",
    },
  ],
};
