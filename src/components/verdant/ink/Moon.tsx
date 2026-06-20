import { useEffect, useRef } from "react";

/**
 * Moon — sumi-e hanging moon for Verdant dark/night moments.
 *
 * Anatomy:
 *   - Three layered low-opacity ink-wash halos (filled circles, tapered opacity)
 *     give the moon its diffuse glow — not a ring, a wash spreading outward.
 *   - A brushed rim: a crescent-shaped filled path whose width varies (thick
 *     at the base where the ink loaded, thinning toward the top) — the "brush
 *     stroke dried to a rim" effect. No uniform stroke-width.
 *   - An optional cloud wisp: a tapered filled path that drifts across the face.
 *   - Glow "breathing" animation: the outer halos pulse in opacity very slowly
 *     (3–5 s period). Reduced-motion: static, fully visible.
 *
 * Props:
 *   className, style — standard pass-through
 *   showWisp — whether to render the cloud wisp (default true)
 */
export default function Moon({
  className,
  style,
  showWisp = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  showWisp?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // static already visible, nothing to animate

    const svg = svgRef.current;
    if (!svg) return;

    // Glow breathing: the outermost two halos pulse opacity in a slow sine wave
    // Using pure CSS animation injected via a style tag avoids GSAP dependency for this simple case
    // The keyframes are declared in this component's JSX below — we just confirm they run
  }, []);

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      {/* Inline keyframes + reduced-motion guard */}
      <style>{`
        @keyframes moon-breathe {
          0%, 100% { opacity: 0.10; }
          50%       { opacity: 0.20; }
        }
        @keyframes moon-breathe-mid {
          0%, 100% { opacity: 0.22; }
          50%       { opacity: 0.38; }
        }
        @keyframes wisp-drift {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(18px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .moon-halo-outer  { animation: none !important; opacity: 0.13 !important; }
          .moon-halo-mid    { animation: none !important; opacity: 0.28 !important; }
          .moon-wisp        { animation: none !important; }
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 240 260"
        fill="none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/*
          ── Ink-wash halos ──────────────────────────────────────────────────
          Three concentric filled circles with low opacity. They are NOT rings —
          they are filled shapes, layered. The outermost is the lightest wash;
          closer to center the ink darkens. This matches how ink bleeds onto wet
          paper: a diffuse outer wash, a firmer middle zone, a solid core.
        */}
        {/* Outermost wash — barely-there, breathing */}
        <circle
          cx="120"
          cy="128"
          r="106"
          fill="currentColor"
          className="moon-halo-outer"
          style={{ animation: "moon-breathe 5s ease-in-out infinite" }}
        />
        {/* Middle wash — moderately solid, breathes opposite phase */}
        <circle
          cx="120"
          cy="128"
          r="82"
          fill="currentColor"
          className="moon-halo-mid"
          style={{ animation: "moon-breathe-mid 5s ease-in-out infinite 0.5s" }}
        />
        {/* Inner glow core — always solid, the moon's body */}
        <circle
          cx="120"
          cy="128"
          r="56"
          fill="currentColor"
          opacity="0.78"
        />

        {/*
          ── Brushed rim ─────────────────────────────────────────────────────
          A crescent-shaped filled path. The ink loaded heaviest at the bottom-left
          arc, thinning as the brush lifted toward the upper-right. Achieved by
          cutting a slightly off-center smaller circle from a larger one — the
          offset creates variable rim width: thick at ~220°, thin at ~60°.
          This is a FILLED shape (no stroke), width varies naturally.
        */}
        <path
          d={`
            M 120 72
            A 56 56 0 1 1 64.2 158.2
            A 56 56 0 0 1 120 72 Z
            M 120 80
            A 48 48 0 1 0 71.8 152.6
            A 48 48 0 0 0 120 80 Z
          `}
          fill="currentColor"
          fillRule="evenodd"
          opacity="0.85"
        />
        {/* A second, thinner crescent offset further — picks up just the
            "loaded-ink base" at the lower arc, fades naturally to nothing */}
        <path
          d={`
            M 88 160
            C 74 152 66 140 65 126
            C 64 113 70 102 80 96
            C 72 108 70 120 74 132
            C 77 144 84 154 94 160
            Z
          `}
          fill="currentColor"
          opacity="0.55"
        />

        {/*
          ── Cloud wisp ──────────────────────────────────────────────────────
          A tapered filled shape — ink that loaded at the left and dried thin
          toward the right, crossing the lower face of the moon at an angle.
          Very soft opacity. Slow infinite drift to the right.
        */}
        {showWisp && (
          <g
            className="moon-wisp"
            style={{ animation: "wisp-drift 12s ease-in-out infinite alternate" }}
          >
            {/* Upper wisp streak — thicker at left, narrows right */}
            <path
              d="M 56 112 C 68 108 88 106 110 109 C 128 111 150 108 172 112 C 162 116 140 118 118 115 C 96 112 74 114 56 112 Z"
              fill="currentColor"
              opacity="0.12"
            />
            {/* Lower wisp streak — lighter, offset slightly */}
            <path
              d="M 48 126 C 62 122 84 120 108 123 C 130 126 156 122 178 126 C 168 131 142 134 116 131 C 90 128 66 130 48 126 Z"
              fill="currentColor"
              opacity="0.08"
            />
          </g>
        )}

        {/*
          ── Single gold accent — the glint ──────────────────────────────────
          One small filled almond shape at the moon's upper-right, where
          reflected light would catch the rim most brightly. Not a star, not
          a ring — a brush tip's worth of warm gold.
        */}
        <path
          d="M 154 90 C 158 86 162 88 160 93 C 158 97 152 96 150 91 C 149 88 152 93 154 90 Z"
          fill="var(--night-gold, var(--gold, #b88a2e))"
          opacity="0.82"
        />
      </svg>
    </div>
  );
}
