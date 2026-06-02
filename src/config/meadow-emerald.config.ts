import type { SiteConfig } from "./types";
import { verdantNav } from "./meadow.config";

// MEADOW skin — Verdant's "Emerald" teaser / easter-egg page. Ported from Emerald.jsx.
// Deliberately sparse: it's a seed, not a product page.
export const meadowEmerald: SiteConfig = {
  skin: "meadow",
  brand: { name: "Verdant", tagline: "Emerald — taking root." },
  nav: verdantNav,
  sections: [
    {
      type: "KineticHero",
      prefix: "Something is",
      words: ["taking root", "germinating", "below the surface", "not ready"],
      sub: "Emerald isn't a product yet. It's a seed in the dark, doing what seeds do. We'll show it when it's grown — not before.",
      // Unsplash: deep dusk forest / emerald-dark mystery
      media: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1920&q=80&auto=format&fit=crop",
    },
    {
      type: "RevealBlock",
      heading: "Germinating — below the surface.",
      body: "Patience is part of the work. The best things in a garden are the ones you can't rush. Check back when the season turns.",
      align: "left",
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Studio", links: [{ label: "Studio home", href: "/meadow" }, { label: "Ethos", href: "/meadow-ethos" }] },
        { title: "Work", links: [{ label: "Garden", href: "/meadow-garden" }, { label: "Team", href: "/meadow-team" }] },
      ],
      legal: "© 2026 Verdant Studio — a Pastures “Meadow” template demo. Imagery is placeholder.",
    },
  ],
};
