import { useEffect, useRef, useState } from "react";

/**
 * L1 technique — variable-font kinetics.
 * Fraunces exposes wght + opsz + SOFT + WONK axes. As you scroll the hero, the
 * display lines breathe: weight lifts, optical size opens, WONK skews a touch.
 * On load the lines wipe up. Two L0 ideas (scroll-progress + line-reveal) wearing
 * one art-directed coat. No image, no gradient-over-photo crutch — just type.
 */
export default function VarHero({
  label, lines, sub,
}: { label: string; lines: string[]; sub?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setT(Math.min(1, y / (window.innerHeight * 0.9)));
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(id); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const wght = Math.round(320 + t * 480);      // 320 → 800
  const opsz = Math.round(20 + (1 - t) * 124);  // open at top
  const wonk = (t * 1).toFixed(2);

  return (
    <header ref={wrap} style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 120 }}>
      <div className="f-wrap">
        <p className="f-label" style={{ marginBottom: 40, opacity: shown ? 1 : 0, transition: "opacity 1s .2s var(--ease)" }}>
          <b>◍</b> {label}
        </p>
        <h1 className="f-display" style={{
          fontSize: "clamp(52px, 13vw, 200px)",
          fontVariationSettings: `"wght" ${wght}, "opsz" ${opsz}, "SOFT" 0, "WONK" ${wonk}`,
        }}>
          {lines.map((ln, i) => (
            <span key={i} className={`f-line ${shown ? "is-in" : ""}`} style={{ transitionDelay: `${0.15 + i * 0.12}s` }}>
              <span>{ln}</span>
            </span>
          ))}
        </h1>
        {sub && (
          <p style={{
            marginTop: 48, maxWidth: 520, color: "var(--muted)", fontSize: 18, lineHeight: 1.5,
            opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(20px)",
            transition: "opacity 1s .6s var(--ease), transform 1s .6s var(--ease)",
          }}>{sub}</p>
        )}
      </div>
    </header>
  );
}
