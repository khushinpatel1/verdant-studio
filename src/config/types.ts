// The one-file contract. A client's whole site = a SiteConfig.
// Swap the config, the site re-skins (theme) and re-fills (content). That's the product.

export type Skin = "ridge" | "meadow";

export interface Brand {
  name: string;
  logo?: string;
  tagline?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavConfig {
  links: NavLink[];
  cta?: NavLink;
}

// Each section is a discriminated union member. Add a component → add a member.
export type Section =
  | {
      type: "KineticHero";
      prefix?: string;
      words: string[];
      sub?: string;
      media?: string;
      cta?: NavLink;
    }
  | {
      type: "RevealBlock";
      heading: string;
      body?: string;
      media?: string;
      align?: "left" | "right";
    }
  | {
      type: "CardGrid";
      heading?: string;
      cards: { icon?: string; title: string; body: string }[];
    }
  | {
      type: "Accordion";
      heading?: string;
      qa: { q: string; a: string }[];
    }
  | {
      type: "PinnedShowcase";
      media: string;
      heading?: string;
      steps: { title: string; body: string }[];
    }
  | {
      type: "ParallaxLayers";
      heading?: string;
      sub?: string;
      layers: { src: string; speed: number }[];
    }
  | {
      type: "CompareSlider";
      heading?: string;
      before: { label: string; img: string };
      after: { label: string; img: string };
    }
  | {
      type: "VideoScene";
      src: string;
      poster?: string;
      heading?: string;
      sub?: string;
      overlayDir?: "bottom" | "top" | "none";
    }
  | {
      type: "MegaFooter";
      columns: { title: string; links: NavLink[] }[];
      legal?: string;
    };

export interface SiteConfig {
  skin: Skin;
  brand: Brand;
  nav: NavConfig;
  sections: Section[];
}
