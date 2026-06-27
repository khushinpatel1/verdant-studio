import { useEffect, useRef } from "react";

/**
 * VERDANT secondary technique. ink growth on scroll (sumi-e).
 * A vine self-draws as its container scrolls through the viewport: the stem's
 * stroke-dashoffset is tied to scroll progress, and leaves fade/scale in as the
 * ink reaches them. Stillness with something always growing underneath.
 *
 * Self-contained botanical path by default; pass `side="left|right"` to mirror.
 * Reduced-motion → fully grown, static. No-JS → SVG renders fully drawn.
 */
export default function InkGrowth({
  side = "right",
  className,
  style,
}: { side?: "left" | "right"; className?: string; style?: React.CSSProperties }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stem = useRef<SVGPathElement>(null);
  const leaves = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = wrap.current!, path = stem.current!;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);

    const leafEls = Array.from(leaves.current?.children ?? []) as SVGElement[];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = (p: number) => {
      path.style.strokeDashoffset = String(len * (1 - p));
      leafEls.forEach((lf, i) => {
        const at = 0.18 + (i / Math.max(1, leafEls.length)) * 0.74;
        const k = Math.max(0, Math.min(1, (p - at) / 0.12));
        lf.style.opacity = String(k);
        lf.style.transform = `scale(${0.6 + k * 0.4})`;
      });
    };

    if (reduce) { apply(1); return; }
    path.style.strokeDashoffset = String(len);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        // progress: 0 when top hits 85% of viewport, 1 when bottom passes 40%
        const start = innerHeight * 0.85, end = innerHeight * 0.4;
        const p = Math.max(0, Math.min(1, (start - r.top) / (start - end + r.height)));
        apply(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const flip = side === "left" ? "scale(-1,1) translate(-220,0)" : undefined;

  return (
    <div ref={wrap} className={className} style={{ pointerEvents: "none", ...style }}>
      <svg viewBox="0 0 220 520" fill="none" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <g transform={flip}>
          {/* main climbing stem */}
          <path
            ref={stem}
            d="M110 512 C 96 440 150 410 120 344 C 92 282 150 256 116 196 C 88 146 140 120 110 64 C 96 38 104 20 110 8"
            stroke="var(--green-600)" strokeWidth="2.4" strokeLinecap="round"
          />
          <g ref={leaves} stroke="none">
            {/* leaves as small ink almonds along the stem */}
            <path d="M120 410 q 34 -8 44 -34 q -30 -2 -44 34 Z" fill="var(--moss)" opacity="0" style={{ transformOrigin: "120px 410px" }} />
            <path d="M118 332 q -36 -6 -48 -32 q 32 -4 48 32 Z" fill="var(--green)" opacity="0" style={{ transformOrigin: "118px 332px" }} />
            <path d="M124 250 q 34 -10 42 -36 q -30 0 -42 36 Z" fill="var(--moss-300)" opacity="0" style={{ transformOrigin: "124px 250px" }} />
            <path d="M112 176 q -34 -8 -46 -32 q 32 -2 46 32 Z" fill="var(--moss)" opacity="0" style={{ transformOrigin: "112px 176px" }} />
            <path d="M116 104 q 30 -10 38 -34 q -28 0 -38 34 Z" fill="var(--green-600)" opacity="0" style={{ transformOrigin: "116px 104px" }} />
            {/* a single gold blossom at the tip. the delicate hand */}
            <circle cx="110" cy="22" r="7" fill="var(--gold)" opacity="0" style={{ transformOrigin: "110px 22px" }} />
          </g>
        </g>
      </svg>
    </div>
  );
}
