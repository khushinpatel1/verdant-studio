import { useEffect, useRef } from "react";

/**
 * Ensō — a single sumi-e brushed circle with a deliberate gap.
 * The stroke is not uniform: it uses a filled, tapered shape at start and end
 * to simulate ink-loaded brush dragging dry at the tail. The circle is not
 * mathematically perfect — it has a slight spiral quality (one confident sweep).
 *
 * On scroll-reveal it draws itself once (stroke-dashoffset animation, 1.8s).
 * Reduced-motion → fully drawn, static.
 *
 * This is a signature mark — no busy decoration, just the circle and the gap.
 */
export default function Enso({
  side,
  className,
  style,
}: {
  side?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const ringPath = useRef<SVGPathElement>(null);
  const dryBrush = useRef<SVGGElement>(null);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = wrap.current!;
    const ring = ringPath.current!;
    const len = ring.getTotalLength();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dry = Array.from(dryBrush.current?.children ?? []) as SVGGraphicsElement[];

    if (reduce) {
      ring.style.strokeDasharray = String(len);
      ring.style.strokeDashoffset = "0";
      dry.forEach((d) => (d.style.opacity = "1"));
      return;
    }

    ring.style.strokeDasharray = String(len);
    ring.style.strokeDashoffset = String(len);
    dry.forEach((d) => (d.style.opacity = "0"));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRevealed.current) return;
        hasRevealed.current = true;
        observer.disconnect();

        const start = performance.now();
        const duration = 1800;

        const raf = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // ease in-out: slow start (loaded brush), accelerate mid, slow at tail (drying)
          const e = t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;

          ring.style.strokeDashoffset = String(len * (1 - e));

          // dry-brush texture fades in as the stroke nears its end
          const dryProgress = Math.max(0, (e - 0.75) / 0.25);
          dry.forEach((d) => (d.style.opacity = String(dryProgress)));

          if (t < 1) requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // side prop: ensō is symmetric, but honour it for page layout mirroring
  const flip = side === "left" ? "scale(-1,1) translate(-280,0)" : undefined;

  return (
    <div
      ref={wrap}
      className={className}
      style={{ pointerEvents: "none", ...style }}
    >
      <svg
        viewBox="0 0 280 280"
        fill="none"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g transform={flip}>
          {/*
            Wash shadow — the ink bleeds into the paper.
            Slightly offset ellipse, very low opacity.
          */}
          <ellipse
            cx="142"
            cy="143"
            rx="98"
            ry="96"
            stroke="var(--ink)"
            strokeWidth="18"
            fill="none"
            opacity="0.07"
          />

          {/*
            The ensō ring itself.
            Path: an arc that travels almost full circle but stops with a gap
            at ~320° (gap at the lower-left, classic orientation).
            Starts thick (ink loaded) and thins at the end (dry brush).
            We use a single arc path so getTotalLength + dashoffset works.

            The path is a subtle spiral: start radius 92, end radius 94 — not
            mathematically perfect, giving the hand-drawn quality.
          */}
          <path
            ref={ringPath}
            d="
              M 140 46
              C 176 46 207 62 222 88
              C 237 114 237 148 222 174
              C 207 200 180 216 152 220
              C 124 224 96 214 78 196
              C 60 178 52 152 56 128
              C 60 104 74 82 96 68
              C 110 59 126 52 140 46
            "
            stroke="var(--ink)"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
            opacity="0.88"
          />

          {/*
            Inner wash — a second translucent stroke slightly inside,
            simulating the depth of ink-soaked paper.
          */}
          <path
            d="
              M 140 60
              C 170 60 197 74 210 96
              C 223 118 223 148 210 170
              C 197 192 174 206 150 209
              C 126 212 102 204 86 188
              C 70 172 64 148 68 126
              C 72 104 84 86 102 74
              C 115 64 128 60 140 60
            "
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.12"
          />

          {/*
            DRY-BRUSH TAIL — fragmented short strokes that appear near the gap,
            simulating the ink running out at the end of the sweep.
            These fade in as the ring completes.
          */}
          <g ref={dryBrush}>
            <path
              d="M 100 66 C 97 63 94 61 90 60"
              stroke="var(--ink)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M 95 70 C 91 68 87 67 83 68"
              stroke="var(--ink)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 92 75 C 88 73 84 74 80 76"
              stroke="var(--ink)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.18"
            />
            <path
              d="M 88 80 C 84 79 80 81 77 84"
              stroke="var(--ink)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              opacity="0.1"
            />
            {/* loaded-brush start: a small filled blob where the brush first touched */}
            <ellipse
              cx="142"
              cy="47"
              rx="7"
              ry="5"
              fill="var(--ink)"
              opacity="0.15"
              transform="rotate(-10 142 47)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
