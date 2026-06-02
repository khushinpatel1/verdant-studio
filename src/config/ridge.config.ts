import type { SiteConfig } from "./types";

// DEMO brand on the RIDGE skin (cinematic dark × kinetic accent).
// Fictional product. Placeholder imagery via picsum — swap for curated free assets later.
export const ridge: SiteConfig = {
  skin: "ridge",
  brand: { name: "Lumen", tagline: "Light, reimagined." },
  nav: {
    links: [
      { label: "Overview", href: "#top" },
      { label: "Design", href: "#design" },
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Buy", href: "#buy" },
  },
  sections: [
    {
      type: "KineticHero",
      prefix: "Light that feels",
      words: ["alive", "yours", "effortless", "human"],
      sub: "The first lamp that understands the room it's in.",
      media: "https://picsum.photos/seed/lumen-hero/1920/1080",
      cta: { label: "Discover Lumen", href: "#design" },
    },
    {
      type: "RevealBlock",
      heading: "Carved from a single curve of light.",
      body: "A seamless anodized body with no visible seams, no buttons, no clutter — just a quiet object that happens to glow.",
      media: "https://picsum.photos/seed/lumen-design/1200/1000",
      align: "left",
    },
    {
      type: "RevealBlock",
      heading: "It knows when to glow.",
      body: "Adaptive sensing reads daylight, presence, and your rhythm — warming at dusk, dimming as you drift off, never asking.",
      media: "https://picsum.photos/seed/lumen-sense/1200/1000",
      align: "right",
    },
    {
      type: "PinnedShowcase",
      heading: "Look closer.",
      media: "https://picsum.photos/seed/lumen-pin/1200/1400",
      steps: [
        { title: "One continuous body.", body: "Machined from a single billet, then anodized — no seams to catch light or dust." },
        { title: "A core that breathes.", body: "Heat dissipates through the form itself, so the surface stays cool to the touch." },
        { title: "Light, from edge to edge.", body: "A diffuser layer turns 320 LEDs into one soft, sourceless glow." },
      ],
    },
    {
      type: "ParallaxLayers",
      heading: "Made for the dark.",
      sub: "Lumen was designed to disappear until the moment you need it.",
      layers: [
        { src: "https://picsum.photos/seed/lumen-px-back/1920/1200", speed: -1 },
        { src: "https://picsum.photos/seed/lumen-px-mid/1920/1200", speed: 1.5 },
      ],
    },
    {
      type: "CompareSlider",
      heading: "Day to dusk, automatically.",
      before: { label: "Daylight", img: "https://picsum.photos/seed/lumen-day/1600/900" },
      after: { label: "Evening", img: "https://picsum.photos/seed/lumen-dusk/1600/900" },
    },
    {
      type: "CardGrid",
      heading: "Everything you'd expect. Nothing you wouldn't.",
      cards: [
        { icon: "✦", title: "Adaptive", body: "Reads the room and tunes itself, all day, automatically." },
        { icon: "◈", title: "Silent", body: "No fans, no hum. Light you feel before you notice." },
        { icon: "❉", title: "Efficient", body: "Sips 4 watts. A year of evenings on a rounding error." },
        { icon: "◐", title: "Yours", body: "Scenes, schedules, and moods — shaped entirely by you." },
      ],
    },
    {
      type: "Accordion",
      heading: "Questions, answered.",
      qa: [
        { q: "When does Lumen ship?", a: "Orders placed today ship within two weeks, carbon-neutral." },
        { q: "What's in the box?", a: "Lumen, a woven USB-C cable, and a single-page hello. That's it." },
        { q: "Is there a warranty?", a: "Two years, no questions. We'd rather fix it than argue about it." },
      ],
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Shop", links: [{ label: "Lumen", href: "#" }, { label: "Accessories", href: "#" }, { label: "Gift cards", href: "#" }] },
        { title: "Learn", links: [{ label: "Design", href: "#" }, { label: "Sustainability", href: "#" }, { label: "Support", href: "#" }] },
        { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
      ],
      legal: "© 2026 Lumen — a Pastures “Ridge” template demo. Imagery is placeholder.",
    },
  ],
};
