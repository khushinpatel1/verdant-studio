import type { SiteConfig } from "./types";

// Lumen — Sustainability page (Ridge skin).
// Imagery: Unsplash curated — nature, light, minimal environmental themes, dark mood.
// Production note: localize assets to your CDN; add attribution per Unsplash license.
export const ridgeSustainability: SiteConfig = {
  skin: "ridge",
  brand: { name: "Lumen", tagline: "Light, reimagined." },
  nav: {
    links: [
      { label: "Overview", href: "/" },
      { label: "Design", href: "/ridge-design" },
      { label: "Sustainability", href: "/ridge-sustainability" },
      { label: "FAQ", href: "/#faq" },
    ],
    cta: { label: "Buy", href: "/#buy" },
  },
  sections: [
    {
      type: "KineticHero",
      prefix: "Built to be",
      words: ["lasting", "repairable", "carbon-light", "honest"],
      sub: "We measured everything. Then we cut it down.",
      // Unsplash: dark forest / nature at night — moody environmental
      media: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80&auto=format&fit=crop",
      cta: { label: "See our commitments", href: "#commitments" },
    },
    {
      type: "RevealBlock",
      heading: "4 watts. All day.",
      body: "Lumen uses less power than a phone charger on standby. Over a year of evening use, that's about $1.80 on your energy bill.",
      // Unsplash: single glowing light in dark environment
      media: "https://images.unsplash.com/photo-1518478040698-a85ebba9e680?w=1200&q=80&auto=format&fit=crop",
      align: "left",
    },
    {
      type: "RevealBlock",
      heading: "No packaging waste.",
      body: "The box is mushroom mycelium. The insert is compressed grass-paper. Everything that ships with Lumen can go back to the ground.",
      // Unsplash: minimal clean packaging, earthy tones
      media: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "ParallaxLayers",
      heading: "Designed to be repaired.",
      sub: "Every component is user-replaceable. We sell parts, not planned obsolescence.",
      layers: [
        // Dark forest canopy background
        { src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80&auto=format&fit=crop", speed: -1 },
        // Soft light through trees foreground
        { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&auto=format&fit=crop", speed: 1.5 },
      ],
    },
    {
      type: "CardGrid",
      heading: "The numbers.",
      cards: [
        { icon: "↓", title: "−88% CO₂", body: "vs. a comparable LED lamp over its full lifecycle, including shipping." },
        { icon: "∞", title: "Lifetime warranty", body: "We repair or replace — for as long as you own it." },
        { icon: "⊕", title: "100% renewable", body: "Our factory runs on wind and solar. Zero fossil offsets." },
        { icon: "♻", title: "Take-back program", body: "Return Lumen at end of life. We reclaim the aluminium." },
      ],
    },
    {
      type: "Accordion",
      heading: "Sustainability questions.",
      qa: [
        { q: "What's Lumen's carbon footprint?", a: "0.8 kg CO₂e cradle-to-gate, independently audited by ClimatePartner." },
        { q: "Can I actually repair it?", a: "Yes. The LED module, diffuser, and power supply are each sold separately and snap-replace in under 5 minutes." },
        { q: "What happens to the packaging?", a: "The mycelium insert is compostable in any home bin within 30 days. The outer sleeve is recycled kraft board." },
      ],
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Shop", links: [{ label: "Lumen", href: "/" }, { label: "Accessories", href: "#" }, { label: "Gift cards", href: "#" }] },
        { title: "Learn", links: [{ label: "Design", href: "/ridge-design" }, { label: "Sustainability", href: "/ridge-sustainability" }, { label: "Support", href: "#" }] },
        { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
      ],
      legal: "© 2026 Lumen — a Pastures 'Ridge' template demo.",
    },
  ],
};
