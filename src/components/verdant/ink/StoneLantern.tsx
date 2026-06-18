/**
 * StoneLantern — Japanese ishidoro (stone lantern) in sumi-e ink-wash.
 *
 * Anatomy (top to bottom):
 *   cap (hōju):      a slightly convex oval top stone — brush loaded at base,
 *                    dried to an edge near top. Tapered filled shape.
 *   roof (kasa):     wide low pyramid/mushroom cap. The top ridge has a brush
 *                    edge that varies in thickness. Under-side is a lighter wash.
 *                    Overhang ends are slightly drooped (organic sag, not sharp).
 *   fire chamber (hibukuro): the hollow middle piece where light glows.
 *                    Its walls are drawn as separate filled shapes (front face,
 *                    shadow face). The gold glow sits inside it.
 *   middle post (sao): a short cylindrical stone between chamber and base.
 *   base (kidan):    a wide flat plinth, heaviest ink deposit — ground contact.
 *
 * Light:
 *   One warm gold glow inside the chamber (the single gold accent). Two layers:
 *   a diffuse outer glow (low opacity large circle) and a smaller bright core.
 *   A subtle "flicker" animation varies the glow's opacity.
 *
 * Reduced-motion: static, glow fully visible at rest.
 *
 * Props:
 *   className, style — standard pass-through
 *   side — mirrors (default "right" — slight shadow cast right)
 */
export default function StoneLantern({
  className,
  style,
  side = "right",
}: {
  className?: string;
  style?: React.CSSProperties;
  side?: "left" | "right";
}) {
  const flip = side === "left" ? "scale(-1,1) translate(-240,0)" : undefined;

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes lantern-flicker {
          0%, 100% { opacity: 0.78; }
          20%       { opacity: 0.90; }
          45%       { opacity: 0.68; }
          60%       { opacity: 0.85; }
          80%       { opacity: 0.72; }
        }
        @keyframes lantern-glow-breathe {
          0%, 100% { opacity: 0.28; }
          50%       { opacity: 0.42; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lantern-glow       { animation: none !important; opacity: 0.82 !important; }
          .lantern-glow-outer { animation: none !important; opacity: 0.35 !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 240 420"
        fill="none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={flip}>

          {/*
            ── BASE (kidan) — heaviest stone, most ink ─────────────────────
            Three stacked flat platforms. Brush fully loaded; ink pooled at
            each layer's top edge.
          */}
          {/* Bottom plinth — widest */}
          <path
            d="M 48 400 C 50 394 52 390 54 388 L 186 388 C 188 390 190 394 192 400 Z"
            fill="currentColor" opacity="0.86"
          />
          {/* Middle plinth */}
          <path
            d="M 58 388 C 60 382 62 378 64 376 L 176 376 C 178 378 180 382 182 388 Z"
            fill="currentColor" opacity="0.80"
          />
          {/* Top base step — narrower */}
          <path
            d="M 72 376 C 73 370 74 366 76 364 L 164 364 C 166 366 167 370 168 376 Z"
            fill="currentColor" opacity="0.74"
          />
          {/* Ink wash on top face — brush dragged across */}
          <path
            d="M 76 364 C 86 360 104 357 120 358 C 136 359 154 360 164 364 C 154 368 136 369 120 369 C 104 369 86 368 76 364 Z"
            fill="currentColor" opacity="0.22"
          />

          {/*
            ── MIDDLE POST (sao) ────────────────────────────────────────────
            Cylindrical stone — sides are parallel but the brush edge at top
            and bottom is slightly tapered (not perfectly flat).
          */}
          <path
            d="M 96 364 C 95 340 94 318 94 300 C 100 298 120 296 126 300 C 146 296 145 298 146 300 C 146 318 145 340 144 364 Z"
            fill="currentColor" opacity="0.68"
          />
          {/* Shadow side */}
          <path
            d="M 128 364 C 130 340 132 318 132 300 C 136 298 142 296 146 300 C 145 318 144 340 143 364 Z"
            fill="currentColor" opacity="0.22"
          />
          {/* Top of post — brush edge */}
          <path
            d="M 92 300 C 96 294 108 290 120 290 C 132 290 144 294 148 300 C 140 304 132 306 120 306 C 108 306 100 304 92 300 Z"
            fill="currentColor" opacity="0.60"
          />

          {/*
            ── FIRE CHAMBER (hibukuro) ──────────────────────────────────────
            The hollow middle piece. Drawn as three faces:
            front (slightly transparent so gold shows through), left/shadow face,
            and top cap edge. The gold glow sits inside.
          */}

          {/* Gold glow — outer diffuse */}
          <ellipse
            cx="120"
            cy="240"
            rx="40"
            ry="36"
            fill="var(--night-gold, var(--gold, #b88a2e))"
            className="lantern-glow-outer"
            style={{ animation: "lantern-glow-breathe 3s ease-in-out infinite" }}
          />
          {/* Gold glow — inner bright core */}
          <ellipse
            cx="120"
            cy="240"
            rx="24"
            ry="20"
            fill="var(--night-gold, var(--gold, #b88a2e))"
            className="lantern-glow"
            style={{ animation: "lantern-flicker 4s ease-in-out infinite" }}
          />

          {/* Chamber front face — light ink, so gold glows through */}
          <path
            d="M 82 290 C 82 268 84 248 86 228 C 88 222 92 218 100 216 C 110 214 120 213 130 214 C 140 215 148 218 152 224 C 155 230 156 248 156 268 C 156 280 155 288 154 290 Z"
            fill="currentColor" opacity="0.38"
          />
          {/* Chamber side/shadow face — right side */}
          <path
            d="M 154 290 C 155 280 156 268 156 252 C 158 250 162 250 164 253 C 165 260 165 275 164 290 Z"
            fill="currentColor" opacity="0.52"
          />
          {/* Chamber top edge — stone rim */}
          <path
            d="M 80 228 C 84 218 94 210 108 207 C 120 205 132 206 142 210 C 152 214 158 220 160 228 C 150 232 136 234 120 234 C 104 234 90 232 80 228 Z"
            fill="currentColor" opacity="0.64"
          />
          {/* Chamber bottom edge — stone base of chamber */}
          <path
            d="M 80 290 C 84 296 94 300 108 301 C 120 302 132 301 142 298 C 152 295 158 290 160 288 L 154 290 L 82 290 Z"
            fill="currentColor" opacity="0.58"
          />

          {/*
            ── ROOF (kasa) ──────────────────────────────────────────────────
            Wide mushroom cap. The top ridge is the thickest ink. Under-eave
            (bottom) is lighter wash. The overhang droops slightly at the ends
            — a stone roof slightly sagging under weight, not a sharp angle.
          */}
          {/* Roof body — upper surface */}
          <path
            d="M 58 206 C 60 198 68 186 80 178 C 92 171 104 168 120 167 C 136 167 150 170 162 178 C 174 186 180 198 182 206 Z"
            fill="currentColor" opacity="0.78"
          />
          {/* Roof top ridge — heaviest ink deposit, brush loaded here */}
          <path
            d="M 88 175 C 96 166 108 161 120 160 C 132 160 144 164 152 172 C 144 174 132 176 120 176 C 108 176 96 175 88 175 Z"
            fill="currentColor" opacity="0.88"
          />
          {/* Under-eave wash — lighter ink, reflected sky light */}
          <path
            d="M 58 206 C 68 210 82 213 100 214 C 110 215 120 215 130 215 C 148 214 164 212 182 208 C 172 214 154 218 138 219 C 128 220 120 220 112 220 C 96 219 78 216 62 210 C 60 209 58 207 58 206 Z"
            fill="currentColor" opacity="0.28"
          />
          {/* Left overhang droop */}
          <path
            d="M 58 206 C 54 210 50 213 48 216 C 52 216 58 214 62 212 Z"
            fill="currentColor" opacity="0.48"
          />
          {/* Right overhang droop */}
          <path
            d="M 182 206 C 186 210 190 213 192 216 C 188 216 182 214 178 212 Z"
            fill="currentColor" opacity="0.48"
          />

          {/*
            ── TOP STONE (hōju) ─────────────────────────────────────────────
            The jewel-shaped capstone. An oval with a slight pointed top —
            the finial. Brush dragged upward, thinning to a tip.
          */}
          <path
            d="M 108 160 C 106 152 106 140 108 130 C 110 122 114 116 120 112 C 126 116 130 122 132 130 C 134 140 134 152 132 160 Z"
            fill="currentColor" opacity="0.76"
          />
          {/* Shadow side of finial */}
          <path
            d="M 120 112 C 124 116 128 122 130 130 C 132 138 132 148 130 158 C 125 158 122 156 120 154 C 122 148 122 138 120 130 Z"
            fill="currentColor" opacity="0.26"
          />
          {/* Tip — brush exit */}
          <path
            d="M 116 116 C 118 108 120 102 120 98 C 120 102 122 108 124 116 C 122 118 118 118 116 116 Z"
            fill="currentColor" opacity="0.58"
          />

          {/*
            ── Ground shadow — ink wash ────────────────────────────────────
            A soft elliptical ink wash below the base, as if the stone casts
            a shadow on the ground. Very low opacity, tapered.
          */}
          <ellipse
            cx="120"
            cy="404"
            rx="72"
            ry="8"
            fill="currentColor"
            opacity="0.12"
          />

        </g>
      </svg>
    </div>
  );
}
