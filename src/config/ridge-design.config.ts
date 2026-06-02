import type { SiteConfig } from "./types";

// Lumen — Design deep-dive page (Ridge skin).
// Imagery: Unsplash curated — architectural detail, material/form studies, dark backgrounds.
// Production note: localize assets to your CDN; add attribution per Unsplash license.
export const ridgeDesign: SiteConfig = {
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
      prefix: "Design that's",
      words: ["intentional", "minimal", "precise", "yours"],
      sub: "Every angle, every edge, every shadow — considered.",
      // Unsplash: architectural metal / form study, dark mood
      media: "https://images.unsplash.com/photo-1583225214464-9296029427aa?w=1920&q=80&auto=format&fit=crop",
      cta: { label: "Explore the form", href: "#form" },
    },
    {
      type: "RevealBlock",
      heading: "Anodized to last a lifetime.",
      body: "The surface is anodized at 12 microns — twice the industry standard. It ages the way a well-worn tool does: with character, never with rust.",
      // Unsplash: brushed anodized aluminum surface macro
      media: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80&auto=format&fit=crop",
      align: "left",
    },
    {
      type: "RevealBlock",
      heading: "Geometry as function.",
      body: "The tapered arc isn't decoration — it directs heat upward and light forward, eliminating the need for a fan or a visible diffuser.",
      // Unsplash: clean geometric architectural detail
      media: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "PinnedShowcase",
      heading: "Materials.",
      // Unsplash: polished metal + glass product detail
      media: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80&auto=format&fit=crop",
      steps: [
        { title: "6061 aluminium.", body: "The same alloy used in aerospace fixtures — chosen for thermal conductivity, not aesthetics." },
        { title: "Borosilicate glass.", body: "A lens-grade diffuser that turns a point source into pure, even light." },
        { title: "Braided USB-C cable.", body: "Kevlar-reinforced and rated to 30,000 bends. Because the cable shouldn't be the weakest part." },
      ],
    },
    {
      type: "VideoScene",
      // Free sample video — production: swap for a product material/process video
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      heading: "Made with hands.",
      sub: "Every Lumen passes through a human inspection — no automated pass/fail.",
      overlayDir: "bottom",
    },
    {
      type: "CardGrid",
      heading: "The details.",
      cards: [
        { icon: "⬡", title: "12 μm anodize", body: "Hard-coat anodize, class 3 — harder than untreated steel." },
        { icon: "◎", title: "320 LED array", body: "Individually addressable, binned to <2 SDCM for consistent white." },
        { icon: "∿", title: "PWM-free dimming", body: "Eliminates the flicker that causes eye strain, even at 1% brightness." },
        { icon: "❄", title: "Passive thermal", body: "Zero moving parts. The arc shape is the heatsink." },
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
