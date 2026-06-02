import type { SiteConfig } from "./types";

// DEMO brand on the RIDGE skin (cinematic dark × kinetic accent).
// Imagery: curated Unsplash CDN URLs (free, no key needed for direct photo URLs).
// Production note: localize assets to your CDN and add attribution per Unsplash license.
export const ridge: SiteConfig = {
  skin: "ridge",
  brand: { name: "Lumen", tagline: "Light, reimagined." },
  nav: {
    links: [
      { label: "Overview", href: "/" },
      { label: "Design", href: "/ridge-design" },
      { label: "Sustainability", href: "/ridge-sustainability" },
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
      // Unsplash: dramatic dark interior with warm light pool — cinematic, on-brand
      media: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80&auto=format&fit=crop",
      cta: { label: "Discover Lumen", href: "#design" },
    },
    {
      type: "RevealBlock",
      heading: "Carved from a single curve of light.",
      body: "A seamless anodized body with no visible seams, no buttons, no clutter — just a quiet object that happens to glow.",
      // Unsplash: minimalist dark product / aluminum form study
      media: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1200&q=80&auto=format&fit=crop",
      align: "left",
    },
    {
      type: "RevealBlock",
      heading: "It knows when to glow.",
      body: "Adaptive sensing reads daylight, presence, and your rhythm — warming at dusk, dimming as you drift off, never asking.",
      // Unsplash: moody room at dusk, warm lamp glow
      media: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "PinnedShowcase",
      heading: "Look closer.",
      // Unsplash: close macro of brushed metal / product detail
      media: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
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
        // Unsplash: night cityscape / dark architectural backdrop
        { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80&auto=format&fit=crop", speed: -1 },
        // Unsplash: dark architectural foreground element
        { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80&auto=format&fit=crop", speed: 1.5 },
      ],
    },
    {
      type: "CompareSlider",
      heading: "Day to dusk, automatically.",
      // Unsplash: same-style interior in daylight vs warm evening tones
      before: { label: "Daylight", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80&auto=format&fit=crop" },
      after: { label: "Evening", img: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1600&q=80&auto=format&fit=crop" },
    },
    {
      // Full-bleed cinematic video (Apple). Free sample: Google's public MP4 sample.
      // Production: swap for a Coverr/Mixkit CDN URL themed to the brand.
      type: "VideoScene",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      heading: "A light that moves you.",
      sub: "Lumen adapts to every scene, every hour, every mood.",
      overlayDir: "bottom",
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
