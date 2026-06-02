import type { SiteConfig } from "./types";
import { verdantNav } from "./meadow.config";

// MEADOW skin — Verdant's "Team" page. Ported from verdant-site Team.jsx.
// Note: verdant-site's per-member /team/:slug profile pages need dynamic routing and
// were intentionally left out of this MPA port (see verdant-to-meadow-mapping.md).
export const meadowTeam: SiteConfig = {
  skin: "meadow",
  brand: { name: "Verdant", tagline: "Team — the people behind the work." },
  nav: verdantNav,
  sections: [
    {
      type: "KineticHero",
      prefix: "The people behind",
      words: ["the work", "the garden", "the stillness", "Verdant"],
      sub: "A small studio, on purpose. Few hands, deep care — everyone here touches the things we make.",
      // Unsplash: hands tending soil / planting — craft, care
      media: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80&auto=format&fit=crop",
    },
    {
      type: "RevealBlock",
      heading: "Founder & gardener-in-chief.",
      body: "Verdant began as one person's refusal to build software that spies on the people using it. The studio is still run hands-on — every product decision, every line of the ethos, tended directly rather than delegated away.",
      // Unsplash: quiet portrait-adjacent / soft natural light workspace
      media: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "CardGrid",
      heading: "Open plots — seasons ahead.",
      cards: [
        { icon: "🎨", title: "Design", body: "For someone who believes restraint is the craft, and that the calmest interface is the hardest to make." },
        { icon: "⚙️", title: "Engineering", body: "For someone who builds durable, local-first software and treats privacy as an architecture, not a feature." },
      ],
    },
    {
      type: "RevealBlock",
      heading: "Not hiring loudly. Growing slowly.",
      body: "We don't post sprawling job ladders. If the work resonates and you'd tend it the way we do, write to us — we read every note ourselves.",
      align: "left",
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Studio", links: [{ label: "Studio home", href: "/meadow" }, { label: "Ethos", href: "/meadow-ethos" }] },
        { title: "Work", links: [{ label: "Garden", href: "/meadow-garden" }, { label: "Emerald", href: "/meadow-emerald" }] },
        { title: "Join", links: [{ label: "Design", href: "/meadow-ethos" }, { label: "Engineering", href: "/meadow-ethos" }] },
      ],
      legal: "© 2026 Verdant Studio — a Pastures “Meadow” template demo. Imagery is placeholder.",
    },
  ],
};
