import { useEffect, useRef } from "react";
import DisplaceImage from "./DisplaceImage";

export interface StackItem { n: string; title: string; body: string; img: string; }

/**
 * L1 technique — sticky panel stack (scrollytelling).
 * Each panel pins, and as the next scrolls up over it the lower one scales and
 * dims, so the chapters physically deck on top of each other. Drives the case
 * studies. Scale/dim come from each panel's own scroll-progress (L0 reused).
 */
export default function StickyStack({ items }: { items: StackItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panels = Array.from(root.current!.querySelectorAll<HTMLElement>(".f-panel"));
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      panels.forEach((p, i) => {
        if (i === panels.length - 1) return;
        const next = panels[i + 1];
        const nr = next.getBoundingClientRect();
        const k = Math.min(1, Math.max(0, (vh - nr.top) / vh)); // 0..1 as next covers
        const card = p.querySelector<HTMLElement>(".f-panel-inner");
        if (card) {
          card.style.transform = `scale(${(1 - k * 0.08).toFixed(3)})`;
          card.style.filter = `brightness(${(1 - k * 0.4).toFixed(3)})`;
        }
      });
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [items.length]);

  return (
    <div ref={root}>
      {items.map((it, i) => (
        <div key={i} className="f-panel" style={{ position: "sticky", top: 0, height: "100svh", display: "grid", placeItems: "center" }}>
          <div className="f-panel-inner" style={{
            width: "min(1320px, 92vw)", height: "82svh", borderRadius: "var(--radius)", overflow: "hidden",
            position: "relative", willChange: "transform, filter", background: "var(--card)", border: "1px solid var(--line)",
          }}>
            <DisplaceImage src={it.img} style={{ position: "absolute", inset: 0 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(16,15,13,.82))" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "clamp(28px,5vw,64px)" }}>
              <p className="f-label" style={{ marginBottom: 18 }}><b>{it.n}</b></p>
              <h3 className="f-display" style={{ fontSize: "clamp(34px,5.5vw,84px)", fontWeight: 380, maxWidth: 900 }}>{it.title}</h3>
              <p style={{ marginTop: 18, maxWidth: 560, color: "var(--fg)", opacity: .82, fontSize: 17, lineHeight: 1.55 }}>{it.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
