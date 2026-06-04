import { useEffect, useRef } from "react";

/**
 * L1 technique — line-mask reveal.
 * Each line is clipped and slides up when it enters the viewport (Intersection
 * Observer, so it fires once and respects no-JS by being visible-by-default in
 * CSS until JS hides). Pass pre-split lines — honest, robust, no paid SplitText.
 */
export default function TextReveal({
  lines, as = "p", className, style, stagger = 0.08,
}: {
  lines: string[]; as?: "p" | "h2" | "h3"; className?: string;
  style?: React.CSSProperties; stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.querySelectorAll<HTMLElement>(".f-line").forEach((l) => l.classList.add("is-in"));
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as as any;
  return (
    <Tag ref={ref} className={className} style={style}>
      {lines.map((ln, i) => (
        <span key={i} className="f-line" style={{ transitionDelay: `${i * stagger}s` }}>
          <span>{ln}</span>
        </span>
      ))}
    </Tag>
  );
}
