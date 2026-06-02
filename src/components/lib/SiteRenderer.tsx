import { useRef } from "react";
import type { SiteConfig } from "../../config/types";
import { useReveal } from "./useReveal";
import StickyNav from "../sections/StickyNav";
import KineticHero from "../sections/KineticHero";
import RevealBlock from "../sections/RevealBlock";
import CardGrid from "../sections/CardGrid";
import PinnedShowcase from "../sections/PinnedShowcase";
import ParallaxLayers from "../sections/ParallaxLayers";
import CompareSlider from "../sections/CompareSlider";
import Accordion from "../sections/Accordion";
import MegaFooter from "../sections/MegaFooter";

// Maps a config's ordered sections to components. Add a component → add a case.
export default function SiteRenderer({ config }: { config: SiteConfig }) {
  const scope = useRef<HTMLDivElement>(null);
  useReveal(scope);

  return (
    <div ref={scope}>
      <StickyNav brand={config.brand} nav={config.nav} />
      {config.sections.map((s, i) => {
        switch (s.type) {
          case "KineticHero":
            return <KineticHero key={i} {...s} />;
          case "RevealBlock":
            return <RevealBlock key={i} {...s} />;
          case "CardGrid":
            return <CardGrid key={i} {...s} />;
          case "PinnedShowcase":
            return <PinnedShowcase key={i} {...s} />;
          case "ParallaxLayers":
            return <ParallaxLayers key={i} {...s} />;
          case "CompareSlider":
            return <CompareSlider key={i} {...s} />;
          case "Accordion":
            return <Accordion key={i} {...s} />;
          case "MegaFooter":
            return <MegaFooter key={i} {...s} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
