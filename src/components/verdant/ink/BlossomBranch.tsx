import { useEffect, useRef } from "react";

/**
 * BlossomBranch. sumi-e plum/cherry branch entering from one side.
 * Brushed bark is a filled tapered shape (thick-to-thin), not a uniform stroke.
 * 5–8 ink blossoms with gold-centered accents fade/scale in on scroll-reveal
 * (IntersectionObserver, same pattern as InkGrowth).
 *
 * Reduced-motion → fully drawn, static.
 * side="left" enters from left; side="right" (default) mirrors via scaleX(-1).
 */
export default function BlossomBranch({
  side = "right",
  className,
  style,
}: {
  side?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const branchRef = useRef<SVGPathElement>(null);
  const blossomGroup = useRef<SVGGElement>(null);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = wrap.current!;
    const branch = branchRef.current!;
    const len = branch.getTotalLength();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blossoms = Array.from(blossomGroup.current?.children ?? []) as SVGGraphicsElement[];

    if (reduce) {
      // Fully drawn immediately
      branch.style.strokeDasharray = String(len);
      branch.style.strokeDashoffset = "0";
      blossoms.forEach((b) => {
        b.style.opacity = "1";
        b.style.transform = "scale(1)";
      });
      return;
    }

    // Initial hidden state
    branch.style.strokeDasharray = String(len);
    branch.style.strokeDashoffset = String(len);
    blossoms.forEach((b) => {
      b.style.opacity = "0";
      b.style.transform = "scale(0.5)";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRevealed.current) return;
        hasRevealed.current = true;
        observer.disconnect();

        // Animate branch draw over 1.6s
        const start = performance.now();
        const duration = 1600;
        const raf = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // ease-out cubic
          const e = 1 - Math.pow(1 - t, 3);
          branch.style.strokeDashoffset = String(len * (1 - e));

          // stagger blossoms as branch draws past their position
          blossoms.forEach((b, i) => {
            const threshold = 0.25 + (i / Math.max(1, blossoms.length - 1)) * 0.6;
            const k = Math.max(0, Math.min(1, (e - threshold) / 0.15));
            b.style.opacity = String(k);
            b.style.transform = `scale(${0.5 + k * 0.5})`;
          });

          if (t < 1) requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mirror: left side enters naturally, right side flips
  const flip = side === "right" ? "scale(-1,1) translate(-340,0)" : undefined;

  return (
    <div
      ref={wrap}
      className={className}
      style={{ pointerEvents: "none", overflow: "visible", ...style }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .vb-blossom { transition: opacity 0.4s var(--ease, ease), transform 0.4s var(--ease, ease); }
        }
      `}</style>
      <svg
        viewBox="0 0 340 480"
        fill="none"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g transform={flip}>
          {/*
            BARK. two filled tapered shapes layered for ink-wash depth.
            Thick near the root, tapering to thin tips. NOT uniform stroke.
          */}

          {/* Wash layer: translucent underpaint */}
          <path
            d="
              M 12 478
              C 16 440 22 400 35 370
              C 50 335 68 318 80 296
              C 95 270 98 248 102 222
              L 100 220
              C 96 246 94 268 79 294
              C 67 316 50 333 34 368
              C 21 398 15 438 11 476
              Z
            "
            fill="var(--ink)"
            opacity="0.12"
          />

          {/* Main branch body. tapered filled shape, bark texture */}
          <path
            ref={branchRef}
            d="M 20 478 C 24 430 36 390 58 352 C 78 318 100 298 110 268 C 120 238 116 208 112 182 C 108 158 118 130 134 106 C 148 84 166 68 178 48"
            stroke="var(--ink)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ fill: "none" }}
          />

          {/* Secondary branch. thinner, breaking left */}
          <path
            d="M 85 310 C 72 288 56 276 40 252 C 28 234 22 218 16 198"
            stroke="var(--ink)"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />

          {/* Tertiary twig up-right */}
          <path
            d="M 118 234 C 132 218 148 210 162 194 C 172 182 178 168 184 154"
            stroke="var(--ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />

          {/* Dry-brush texture: a few broken strokes along main bark */}
          <path
            d="M 46 372 C 52 368 60 366 58 360"
            stroke="var(--ink)"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
          <path
            d="M 72 330 C 80 324 88 322 84 314"
            stroke="var(--ink)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.28"
          />

          {/* BLOSSOMS. filled tapered petal shapes, layered washes */}
          <g ref={blossomGroup}>
            {/* Blossom 1. large, near branch tip of secondary */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "32px 240px" }}
            >
              <circle cx="32" cy="240" r="16" fill="var(--ink)" opacity="0.08" />
              {/* 5 petals as filled tapered ovals */}
              <ellipse cx="32" cy="228" rx="5" ry="9" fill="var(--ink)" opacity="0.28" transform="rotate(-10 32 240)" />
              <ellipse cx="42" cy="234" rx="5" ry="9" fill="var(--ink)" opacity="0.3" transform="rotate(22 32 240)" />
              <ellipse cx="40" cy="248" rx="5" ry="9" fill="var(--ink)" opacity="0.25" transform="rotate(54 32 240)" />
              <ellipse cx="24" cy="250" rx="5" ry="9" fill="var(--ink)" opacity="0.27" transform="rotate(-40 32 240)" />
              <ellipse cx="20" cy="234" rx="5" ry="9" fill="var(--ink)" opacity="0.22" transform="rotate(-72 32 240)" />
              {/* gold center. */}
              <circle cx="32" cy="240" r="3.5" fill="var(--gold)" opacity="0.9" />
            </g>

            {/* Blossom 2. smaller, tip of main branch */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "174px 52px" }}
            >
              <circle cx="174" cy="52" r="12" fill="var(--ink)" opacity="0.07" />
              <ellipse cx="174" cy="42" rx="4" ry="7.5" fill="var(--ink)" opacity="0.32" transform="rotate(-8 174 52)" />
              <ellipse cx="182" cy="47" rx="4" ry="7.5" fill="var(--ink)" opacity="0.29" transform="rotate(20 174 52)" />
              <ellipse cx="181" cy="59" rx="4" ry="7.5" fill="var(--ink)" opacity="0.26" transform="rotate(52 174 52)" />
              <ellipse cx="168" cy="61" rx="4" ry="7.5" fill="var(--ink)" opacity="0.28" transform="rotate(-38 174 52)" />
              <ellipse cx="165" cy="48" rx="4" ry="7.5" fill="var(--ink)" opacity="0.23" transform="rotate(-68 174 52)" />
              {/* gold center. second gold, subtle */}
              <circle cx="174" cy="52" r="2.8" fill="var(--gold)" opacity="0.85" />
            </g>

            {/* Blossom 3. medium, mid tertiary twig */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "162px 196px" }}
            >
              <circle cx="162" cy="196" r="10" fill="var(--ink)" opacity="0.06" />
              <ellipse cx="162" cy="188" rx="3.5" ry="6.5" fill="var(--ink)" opacity="0.3" transform="rotate(-5 162 196)" />
              <ellipse cx="169" cy="192" rx="3.5" ry="6.5" fill="var(--ink)" opacity="0.27" transform="rotate(24 162 196)" />
              <ellipse cx="168" cy="202" rx="3.5" ry="6.5" fill="var(--ink)" opacity="0.24" transform="rotate(55 162 196)" />
              <ellipse cx="157" cy="204" rx="3.5" ry="6.5" fill="var(--ink)" opacity="0.26" transform="rotate(-35 162 196)" />
              <ellipse cx="154" cy="191" rx="3.5" ry="6.5" fill="var(--ink)" opacity="0.21" transform="rotate(-65 162 196)" />
              <circle cx="162" cy="196" r="2.2" fill="var(--ink)" opacity="0.5" />
            </g>

            {/* Blossom 4. small bud pair, upper twig */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "148px 154px" }}
            >
              <ellipse cx="148" cy="154" rx="3" ry="5" fill="var(--ink)" opacity="0.35" />
              <ellipse cx="155" cy="150" rx="2.5" ry="4.5" fill="var(--ink)" opacity="0.28" transform="rotate(20 155 150)" />
              <circle cx="148" cy="154" r="1.8" fill="var(--ink)" opacity="0.45" />
            </g>

            {/* Blossom 5. mid branch, facing out */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "110px 268px" }}
            >
              <circle cx="110" cy="268" r="9" fill="var(--ink)" opacity="0.06" />
              <ellipse cx="110" cy="260" rx="3" ry="5.5" fill="var(--ink)" opacity="0.29" transform="rotate(-12 110 268)" />
              <ellipse cx="117" cy="264" rx="3" ry="5.5" fill="var(--ink)" opacity="0.26" transform="rotate(18 110 268)" />
              <ellipse cx="116" cy="274" rx="3" ry="5.5" fill="var(--ink)" opacity="0.23" transform="rotate(48 110 268)" />
              <ellipse cx="104" cy="276" rx="3" ry="5.5" fill="var(--ink)" opacity="0.25" transform="rotate(-42 110 268)" />
              <ellipse cx="102" cy="263" rx="3" ry="5.5" fill="var(--ink)" opacity="0.2" transform="rotate(-72 110 268)" />
              <circle cx="110" cy="268" r="2" fill="var(--ink)" opacity="0.4" />
            </g>

            {/* Blossom 6. scattered half-open, secondary branch tip */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "20px 202px" }}
            >
              <ellipse cx="20" cy="202" rx="4" ry="7" fill="var(--ink)" opacity="0.22" transform="rotate(-20 20 202)" />
              <ellipse cx="26" cy="196" rx="3.5" ry="6" fill="var(--ink)" opacity="0.25" transform="rotate(10 20 202)" />
              <ellipse cx="14" cy="196" rx="3.5" ry="6" fill="var(--ink)" opacity="0.2" transform="rotate(-50 20 202)" />
              <circle cx="20" cy="202" r="2" fill="var(--ink)" opacity="0.38" />
            </g>

            {/* Blossom 7. tiny floating petals near tip */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "135px 112px" }}
            >
              <ellipse cx="135" cy="112" rx="2.8" ry="5" fill="var(--ink)" opacity="0.3" />
              <ellipse cx="142" cy="108" rx="2.5" ry="4.5" fill="var(--ink)" opacity="0.24" transform="rotate(25 142 108)" />
              <circle cx="135" cy="112" r="1.5" fill="var(--ink)" opacity="0.42" />
            </g>

            {/* Blossom 8. near mid-trunk break */}
            <g
              className="vb-blossom"
              style={{ transformOrigin: "66px 354px" }}
            >
              <circle cx="66" cy="354" r="8" fill="var(--ink)" opacity="0.05" />
              <ellipse cx="66" cy="347" rx="2.8" ry="5" fill="var(--ink)" opacity="0.28" transform="rotate(-8 66 354)" />
              <ellipse cx="72" cy="351" rx="2.8" ry="5" fill="var(--ink)" opacity="0.25" transform="rotate(22 66 354)" />
              <ellipse cx="70" cy="360" rx="2.8" ry="5" fill="var(--ink)" opacity="0.22" transform="rotate(52 66 354)" />
              <ellipse cx="61" cy="361" rx="2.8" ry="5" fill="var(--ink)" opacity="0.24" transform="rotate(-38 66 354)" />
              <ellipse cx="59" cy="350" rx="2.8" ry="5" fill="var(--ink)" opacity="0.2" transform="rotate(-68 66 354)" />
              <circle cx="66" cy="354" r="1.8" fill="var(--ink)" opacity="0.35" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
