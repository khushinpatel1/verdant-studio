import { useEffect, useRef, createElement } from "react";

/**
 * VERDANT — line-mask reveal. Each line sits in an overflow-hidden row; the
 * inner span lifts from translateY(110%) to 0 with a per-line stagger when the
 * block enters view. Emphasis: wrap a phrase in %…% to render it as a gold em.
 * Reduced-motion / no-JS → fully shown.
 */
function parseLine(line: string, key: number) {
  // split on %...% pairs → em
  const parts = line.split(/(%[^%]+%)/g).filter(Boolean);
  return parts.map((p, i) =>
    p.startsWith("%") && p.endsWith("%")
      ? <em key={i}>{p.slice(1, -1)}</em>
      : <span key={i}>{p}</span>
  );
}

export default function TextReveal({
  as = "h2", lines, className, style,
}: { as?: any; lines: string[]; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".v-tr-line"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rows.forEach((r) => (r.style.transform = "none"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => entries.forEach((e) => {
        if (e.isIntersecting) {
          rows.forEach((r, i) => {
            r.style.transitionDelay = `${i * 0.09}s`;
            r.style.transform = "translateY(0)";
          });
          obs.disconnect();
        }
      }),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lines]);

  const children = (
    <>
      {lines.map((line, i) => (
        <span key={i} className="v-tr-row" style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}>
          <span
            className="v-tr-line"
            style={{ display: "block", transform: "translateY(110%)", transition: "transform 0.95s var(--ease)", willChange: "transform" }}
          >
            {parseLine(line, i)}
          </span>
        </span>
      ))}
    </>
  );

  return createElement(as as any, { ref, className, style }, children);
}
