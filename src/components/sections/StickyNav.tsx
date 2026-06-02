import { useEffect, useState } from "react";
import type { Brand, NavConfig } from "../../config/types";

// Sticky / morphing nav (Apple). Transparent at top, frosts + lines on scroll.
export default function StickyNav({ brand, nav }: { brand: Brand; nav: NavConfig }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        insetInline: 0,
        top: 0,
        zIndex: 50,
        backdropFilter: scrolled ? "saturate(160%) blur(14px)" : "none",
        background: scrolled
          ? "color-mix(in srgb, var(--bg) 72%, transparent)"
          : "transparent",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        transition: "all 0.4s var(--ease)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <a href="#top" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20 }}>
          {brand.name}
        </a>
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} style={{ color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>
              {l.label}
            </a>
          ))}
          {nav.cta && (
            <a
              href={nav.cta.href}
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "9px 18px",
                borderRadius: "calc(var(--radius) * 0.6)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {nav.cta.label}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
