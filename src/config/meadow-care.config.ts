import type { SiteConfig } from "./types";

// Verda — Care Guide page (Meadow skin).
// Imagery: Unsplash curated — close-up plants, hands, soil, watering, bright & warm.
// Production note: localize assets to your CDN; add attribution per Unsplash license.
export const meadowCare: SiteConfig = {
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
      prefix: "Caring for plants made",
      words: ["easy", "clear", "joyful", "second nature"],
      sub: "Everything you need to keep your plants thriving — no green thumb required.",
      // Unsplash: bright close-up of a lush houseplant being tended
      media: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1920&q=80&auto=format&fit=crop",
      cta: { label: "Read the guide", href: "#water" },
    },
    {
      type: "RevealBlock",
      heading: "Water when the soil says so.",
      body: "Stick your finger an inch into the soil. If it's damp, wait. If it's dry, water until it runs out the bottom. That's it.",
      // Unsplash: hands testing soil moisture in a bright pot
      media: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "RevealBlock",
      heading: "Light is the whole game.",
      body: "Most houseplants die from the wrong light, not the wrong owner. We pick plants for your actual window — north, south, east, or west.",
      // Unsplash: plant in a window with dappled light
      media: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80&auto=format&fit=crop",
      align: "left",
    },
    {
      type: "PinnedShowcase",
      heading: "The care cycle.",
      // Unsplash: thriving potted plants on a shelf
      media: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80&auto=format&fit=crop",
      steps: [
        { title: "Weekly: check the soil.", body: "Two minutes with a finger-check beats any watering schedule. Plants don't follow calendars." },
        { title: "Monthly: feed lightly.", body: "A quarter-strength balanced liquid fertilizer during the growing season. Skip winter entirely." },
        { title: "Seasonally: rotate and wipe.", body: "Quarter-turn every few weeks for even growth. Wipe leaves with a damp cloth so they can breathe." },
      ],
    },
    {
      type: "CardGrid",
      heading: "Quick-reference rules.",
      cards: [
        { icon: "💧", title: "Underwater beats overwater", body: "More plants die from kindness than neglect. When in doubt, wait a day." },
        { icon: "🌤", title: "Bright indirect is universal", body: "Most popular houseplants were understory plants — they hate direct sun." },
        { icon: "🌡", title: "Room temp is fine", body: "If you're comfortable, your plant is comfortable. Avoid vents and drafts." },
        { icon: "🪴", title: "Repot slowly", body: "Only go one pot size up when you see roots escaping. More soil = more moisture = more risk." },
      ],
    },
    {
      type: "Accordion",
      heading: "Common questions.",
      qa: [
        { q: "My leaves are yellowing — what's wrong?", a: "Yellow leaves usually mean overwatering or too little light. Let the soil dry fully, then move closer to a window." },
        { q: "Should I mist my plants?", a: "Mostly no — misting creates humidity for about 10 minutes and can encourage fungal spots. A pebble tray with water under the pot works better." },
        { q: "When do I know a plant needs repotting?", a: "When roots are circling the bottom of the pot or escaping the drainage hole. Spring is the best time to repot." },
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
