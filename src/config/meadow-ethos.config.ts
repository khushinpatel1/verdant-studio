import type { SiteConfig } from "./types";
import { verdantNav } from "./meadow.config";

// MEADOW skin — Verdant's "Ethos" / about page. Ported from verdant-site Ethos.jsx.
export const meadowEthos: SiteConfig = {
  skin: "meadow",
  brand: { name: "Verdant", tagline: "Ethos — what we believe." },
  nav: verdantNav,
  sections: [
    {
      type: "KineticHero",
      prefix: "What you give us",
      words: ["stays", "between", "us", "always"],
      sub: "We started Verdant because software stopped being made for the people using it. This is the line we won't cross — and the way we'd rather work.",
      // Unsplash: misty forest / moonlight — contemplative
      media: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&auto=format&fit=crop",
    },
    {
      type: "CardGrid",
      heading: "Four things we hold.",
      cards: [
        { icon: "🚫", title: "No ads", body: "We will never sell your attention. The product is paid for plainly, by the people who use it." },
        { icon: "👁️", title: "No trackers", body: "No data brokering, no surveillance, no quiet collection. Privacy by construction, not by promise." },
        { icon: "🐌", title: "Built slowly", body: "We ship when it's right, not when it's due. Slowness is how we keep the quality high." },
        { icon: "🌿", title: "One studio", body: "Small on purpose. We'd rather make a few things well than many things fast." },
      ],
    },
    {
      type: "RevealBlock",
      heading: "How we actually work.",
      body: "We take one thing at a time and finish it before starting the next. We compose like a garden — every element intentional, nothing extra, imperfection left where it serves the whole. We study how the calmest, most durable spaces are made, then build software that feels the same. The world should feel grown, not designed.",
      // Unsplash: zen stone arrangement / raked detail
      media: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80&auto=format&fit=crop",
      align: "right",
    },
    {
      type: "Accordion",
      heading: "In case you're wondering.",
      qa: [
        { q: "How do you make money if there are no ads?", a: "People pay us for the software. That's the entire model — no second customer hiding behind you." },
        { q: "Can I host or export my own data?", a: "Yes. Local-first means your data lives with you first. Export and portability are first-class, not afterthoughts." },
        { q: "Are you taking on new work?", a: "Occasionally, and slowly. Reach out and tell us what you're building — we answer every note ourselves." },
      ],
    },
    {
      type: "MegaFooter",
      columns: [
        { title: "Studio", links: [{ label: "Studio home", href: "/meadow" }, { label: "Team", href: "/meadow-team" }] },
        { title: "Work", links: [{ label: "Garden", href: "/meadow-garden" }, { label: "Emerald", href: "/meadow-emerald" }] },
        { title: "Principles", links: [{ label: "No ads", href: "#" }, { label: "No trackers", href: "#" }, { label: "Built slowly", href: "#" }] },
      ],
      legal: "© 2026 Verdant Studio — a Pastures “Meadow” template demo. Imagery is placeholder.",
    },
  ],
};
