import type { SiteConfig } from "./types";

// DEMO brand on the MEADOW skin (bright Material warmth × seamless scroll).
// Same components, different skin + content — the whole point of the framework.
// Imagery: curated Unsplash CDN URLs (plants / greenery / bright). Free to use.
// Production note: localize assets to your CDN and add attribution per Unsplash license.
export const meadow: SiteConfig = {
  skin: "meadow",
  brand: { name: "Verda", tagline: "Grow something good." },
  nav: {
    links: [
      { label: "Plants", href: "#top" },
      { label: "Care", href: "#design" },
      { label: "Why Verda", href: "#features" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Start growing", href: "#buy" },
  },
  sections: [
    {
      type: "KineticHero",
      prefix: "Plant care made",
      words: ["simple", "joyful", "foolproof", "yours"],
      sub: "Living plants, matched to your light and your life — delivered ready to thrive.",
      // Unsplash: lush green tropical leaves — bright, airy, Meadow-tone
      media: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1920&q=80&auto=format&fit=crop",
      cta: { label: "Find your plant", href: "#design" },
    },
    {
      type: "RevealBlock",
      heading: "Matched to your space, not a guess.",
      body: "Tell us your light, your room, and your patience. We pick a plant that will actually love living with you.",
      // Unsplash: bright living room with plants on windowsill
      media: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "RevealBlock",
      heading: "It tells you exactly when to water.",
      body: "A tiny soil sensor and a gentle nudge on your phone. No more guessing, no more droopy regret.",
      // Unsplash: hands watering a potted plant, warm light
      media: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80&auto=format&fit=crop",
      align: "left",
    },
    {
      type: "PinnedShowcase",
      heading: "From box to bloom.",
      // Unsplash: beautiful potted houseplant, bright background
      media: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80&auto=format&fit=crop",
      steps: [
        { title: "Arrives ready.", body: "Potted, hydrated, and acclimated — no repotting, no shock, no guesswork." },
        { title: "Settles in.", body: "A two-week check-in tunes watering to your home's actual light and humidity." },
        { title: "Thrives on its own.", body: "Gentle nudges keep it healthy long after the new-plant excitement fades." },
      ],
    },
    {
      type: "ParallaxLayers",
      heading: "Greener, by design.",
      sub: "Every Verda plant is grown in renewable nurseries and shipped carbon-neutral.",
      layers: [
        // Unsplash: dense tropical foliage background
        { src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80&auto=format&fit=crop", speed: -1 },
        // Unsplash: bright botanical close-up foreground
        { src: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=1920&q=80&auto=format&fit=crop", speed: 1.5 },
      ],
    },
    {
      type: "CompareSlider",
      heading: "Watch it come back to life.",
      // Unsplash: before = sparse/neglected plant, after = lush recovered plant
      before: { label: "Week one", img: "https://images.unsplash.com/photo-1632764649697-3efedff54503?w=1600&q=80&auto=format&fit=crop" },
      after: { label: "Week six", img: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=1600&q=80&auto=format&fit=crop" },
    },
    {
      // Full-bleed video scene (Apple). Free sample: Google's public MP4 sample.
      // Production: swap for a Coverr/Mixkit CDN URL with lush nature footage.
      type: "VideoScene",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      heading: "Watch them grow.",
      sub: "Every plant ships ready to thrive — and keeps growing long after.",
      overlayDir: "bottom",
    },
    {
      type: "CardGrid",
      heading: "Made to keep things alive.",
      cards: [
        { icon: "🌱", title: "Matched", body: "Every plant chosen for your real light and routine." },
        { icon: "💧", title: "Guided", body: "Water and feed reminders, timed to the actual plant." },
        { icon: "📦", title: "Protected", body: "Shipped in compostable, plant-safe packaging." },
        { icon: "💚", title: "Guaranteed", body: "If it doesn't thrive in 30 days, we replace it free." },
      ],
    },
    {
      type: "Accordion",
      heading: "Good questions.",
      qa: [
        { q: "What if I kill it?", a: "First one's on us — our 30-day thrive guarantee covers a free replacement." },
        { q: "How does shipping work?", a: "Plants travel in a snug, compostable box and arrive within 3–5 days." },
        { q: "Do I need the sensor?", a: "Nope. It helps, but every plant ships with a simple printed care card too." },
      ],
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Shop", links: [{ label: "Plants", href: "#" }, { label: "Pots", href: "#" }, { label: "Gift sets", href: "#" }] },
        { title: "Learn", links: [{ label: "Care guides", href: "#" }, { label: "Light finder", href: "#" }, { label: "Support", href: "#" }] },
        { title: "Company", links: [{ label: "About", href: "#" }, { label: "Sustainability", href: "#" }, { label: "Careers", href: "#" }] },
      ],
      legal: "© 2026 Verda — a Pastures “Meadow” template demo. Imagery is placeholder.",
    },
  ],
};
