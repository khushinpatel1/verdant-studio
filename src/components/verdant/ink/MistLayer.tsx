/**
 * MistLayer. horizontal drifting mist bands in sumi-e ink-wash style.
 *
 * Anatomy:
 *   Three bands, each a FILLED tapered shape. not a rectangle, not a line.
 *   Each band is an ink-wash streak: the leading edge (left) is rounded where
 *   the ink loaded, and the trailing edge (right) tapers to nearly nothing as
 *   the brush dried. Bands sit at different vertical positions and have
 *   different widths and opacities to create atmospheric depth.
 *
 *   Band 1 (upper): thinnest, lightest. highest altitude mist
 *   Band 2 (middle): widest, moderate opacity. the dominant layer
 *   Band 3 (lower): medium width, slightly warmer. ground fog
 *
 * Motion:
 *   Slow infinite horizontal drift per band, staggered start delays and
 *   slightly different durations so they never lock in sync. The drift is
 *   subtle. the mist barely moves, as morning mist over still water.
 *   `prefers-reduced-motion`: static, fully visible at rest position.
 *
 * Props:
 *   className, style. standard pass-through
 *   side. mirrors drift direction (default "right")
 */
export default function MistLayer({
  className,
  style,
  side = "right",
}: {
  className?: string;
  style?: React.CSSProperties;
  side?: "left" | "right";
}) {
  const driftDir = side === "left" ? "-1" : "1";

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", overflow: "hidden", ...style }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes mist-drift-a {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(calc(${driftDir} * 28px)); }
        }
        @keyframes mist-drift-b {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(calc(${driftDir} * 18px)); }
        }
        @keyframes mist-drift-c {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(calc(${driftDir} * 22px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mist-band { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 900 280"
        fill="none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >

        {/*
          ── Band 1: Upper mist. thinest streak, high altitude ─────────────
          Ink barely loaded here. The brush was nearly dry. Very low opacity,
          very tapered. The left edge has a slight round-in, the right dissolves.
          Drifts slowest.
        */}
        <g
          className="mist-band"
          style={{ animation: "mist-drift-a 18s ease-in-out infinite alternate" }}
        >
          {/* Primary upper streak. tapers left to right */}
          <path
            d="M -20 68 C 10 58 60 52 120 56 C 200 61 320 58 460 62 C 580 66 700 60 800 64 C 860 66 900 68 920 70 C 900 78 860 82 800 80 C 700 76 580 80 460 76 C 320 72 200 74 120 70 C 60 67 10 70 -20 68 Z"
            fill="currentColor"
            opacity="0.09"
          />
          {/* Ink density variation. slightly more opaque toward the loaded end */}
          <path
            d="M -20 66 C 20 60 80 56 160 59 C 240 62 300 60 340 63 C 310 69 250 70 160 67 C 80 64 20 66 -20 66 Z"
            fill="currentColor"
            opacity="0.06"
          />
        </g>

        {/*
          ── Band 2: Middle mist. dominant layer, most atmospheric weight ──
          Brush loaded well here. This band has the most width variation along
          its length. bulging where the ink flooded, thinning where it dried.
          Two overlapping passes create the layered wash depth.
        */}
        <g
          className="mist-band"
          style={{ animation: "mist-drift-b 24s ease-in-out infinite alternate" }}
        >
          {/* Main wash. wide at center, tapers both ends */}
          <path
            d="M -30 132 C 0 118 50 108 120 112 C 200 117 320 110 440 116 C 540 121 640 112 740 118 C 810 122 870 128 920 132 C 900 148 860 154 800 150 C 700 144 580 152 460 148 C 340 144 230 150 140 146 C 80 143 20 148 -30 146 Z"
            fill="currentColor"
            opacity="0.18"
          />
          {/* Second pass. slightly offset, adds the layered wash depth */}
          <path
            d="M -20 122 C 20 114 80 108 160 113 C 260 119 380 114 480 119 C 560 123 630 116 700 120 C 750 123 790 128 820 130 C 790 138 740 141 680 138 C 600 134 510 140 420 137 C 320 134 220 140 140 137 C 80 135 20 138 -20 136 Z"
            fill="currentColor"
            opacity="0.12"
          />
          {/* Ink pooling at the bulge center. slightly denser core */}
          <path
            d="M 300 112 C 360 106 420 108 480 112 C 520 115 540 120 520 124 C 480 128 400 126 340 122 C 305 118 295 115 300 112 Z"
            fill="currentColor"
            opacity="0.10"
          />
        </g>

        {/*
          ── Band 3: Lower mist. ground fog, slightly warmer register ──────
          Heaviest brush pass of the three. This mist hugs the ground.
          Broader vertical range, more translucent body. The leading edge
          has a slight upward bow where the brush lifted off the paper.
        */}
        <g
          className="mist-band"
          style={{ animation: "mist-drift-c 20s ease-in-out infinite alternate-reverse" }}
        >
          {/* Ground fog body. */}
          <path
            d="M -40 208 C 0 195 60 186 140 190 C 240 196 380 188 500 194 C 600 199 700 190 800 196 C 860 200 900 205 930 208 C 910 224 870 230 810 226 C 720 220 620 228 520 224 C 420 220 320 228 220 224 C 150 221 70 226 -40 222 Z"
            fill="currentColor"
            opacity="0.22"
          />
          {/* A second fog streak slightly below. the very base of the bank */}
          <path
            d="M -20 222 C 30 216 100 212 200 215 C 320 219 460 213 580 217 C 680 220 760 215 840 218 C 880 220 910 222 930 224 C 910 232 876 236 830 234 C 750 230 640 236 530 232 C 400 228 280 234 180 231 C 100 228 30 232 -20 230 Z"
            fill="currentColor"
            opacity="0.13"
          />
          {/* Ink thickness variation. the brush caught the paper tooth here */}
          <path
            d="M 80 190 C 120 182 180 178 250 183 C 310 187 350 186 370 190 C 340 196 290 197 230 194 C 170 191 115 192 80 190 Z"
            fill="currentColor"
            opacity="0.10"
          />
        </g>

      </svg>
    </div>
  );
}
