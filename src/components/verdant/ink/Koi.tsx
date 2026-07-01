/**
 * Koi. two koi fish in brushed strokes.
 * Bodies are filled tapered-oval shapes layered at multiple opacities
 * (ink-wash depth). Fins and tails are thin swept-path strokes that taper.
 * One fish gets a gold-accent belly wash (the piece's single gold).
 *
 * Motion: a slow swimming drift (translate + slight rotation, CSS keyframes).
 * Both fish drift at different rates/phases so they feel independent.
 * Reduced-motion → fully static.
 *
 * side flips via scaleX(-1).
 */
export default function Koi({
  side = "right",
  className,
  style,
}: {
  side?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}) {
  const flip = side === "left" ? "scale(-1,1) translate(-300,0)" : undefined;

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", overflow: "hidden", ...style }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .vk-fish-a {
            transform-origin: 130px 160px;
            animation: koiSwimA 9s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
          }
          .vk-fish-b {
            transform-origin: 160px 310px;
            animation: koiSwimB 12s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
          }
          @keyframes koiSwimA {
            0%   { transform: translate(0px, 0px) rotate(0deg); }
            30%  { transform: translate(6px, -4px) rotate(2.5deg); }
            65%  { transform: translate(-4px, 5px) rotate(-1.5deg); }
            100% { transform: translate(8px, -2px) rotate(1.8deg); }
          }
          @keyframes koiSwimB {
            0%   { transform: translate(0px, 0px) rotate(0deg); }
            40%  { transform: translate(-8px, 6px) rotate(-3deg); }
            75%  { transform: translate(5px, -4px) rotate(2deg); }
            100% { transform: translate(-6px, 3px) rotate(-1.5deg); }
          }
          /* Tail/fin trails wag slightly offset from body */
          .vk-fin-a {
            transform-origin: 78px 148px;
            animation: koiFinA 9s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
          }
          @keyframes koiFinA {
            0%   { transform: rotate(0deg); }
            40%  { transform: rotate(4deg); }
            100% { transform: rotate(-3deg); }
          }
          .vk-fin-b {
            transform-origin: 196px 308px;
            animation: koiFinB 12s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
          }
          @keyframes koiFinB {
            0%   { transform: rotate(0deg); }
            50%  { transform: rotate(-5deg); }
            100% { transform: rotate(3.5deg); }
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 460"
        fill="none"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Water surface suggestion. very faint horizontal wash */}
        <ellipse cx="150" cy="230" rx="140" ry="12" fill="var(--ink)" opacity="0.04" />
        <path
          d="M 20 228 Q 80 222 150 228 Q 220 234 280 228"
          stroke="var(--ink)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.12"
        />
        <path
          d="M 30 238 Q 90 232 150 238 Q 210 244 270 238"
          stroke="var(--ink)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.07"
        />

        <g transform={flip}>
          {/* ── FISH A. upper fish, swimming right-and-up ── */}
          <g className="vk-fish-a">
            {/* Body wash. outermost halo */}
            <ellipse
              cx="130"
              cy="160"
              rx="60"
              ry="26"
              fill="var(--ink)"
              opacity="0.09"
              transform="rotate(-18 130 160)"
            />
            {/* Mid wash */}
            <ellipse
              cx="130"
              cy="160"
              rx="52"
              ry="21"
              fill="var(--ink)"
              opacity="0.2"
              transform="rotate(-18 130 160)"
            />
            {/* Body core */}
            <ellipse
              cx="130"
              cy="160"
              rx="44"
              ry="17"
              fill="var(--ink)"
              opacity="0.8"
              transform="rotate(-18 130 160)"
            />
            {/* Gold belly. the single gold accent in this piece */}
            <ellipse
              cx="126"
              cy="163"
              rx="30"
              ry="9"
              fill="var(--gold)"
              opacity="0.28"
              transform="rotate(-18 126 163)"
            />
            <ellipse
              cx="126"
              cy="163"
              rx="20"
              ry="5"
              fill="var(--gold)"
              opacity="0.15"
              transform="rotate(-18 126 163)"
            />

            {/* Head. small, rounded. Ink eye. */}
            <ellipse
              cx="168"
              cy="149"
              rx="14"
              ry="10"
              fill="var(--ink)"
              opacity="0.88"
              transform="rotate(-18 168 149)"
            />
            <circle cx="172" cy="144" r="2.2" fill="var(--paper, #fcfdf9)" opacity="0.7" />
            <circle cx="172" cy="144" r="1.2" fill="var(--ink)" opacity="0.9" />

            {/* Dorsal fin. brushed upward spike */}
            <path
              d="M 140 144 C 138 130 134 122 130 114 C 128 120 128 132 130 144"
              fill="var(--ink)"
              opacity="0.55"
            />
            <path
              d="M 132 143 C 130 128 128 120 124 112 C 122 118 122 132 124 143"
              fill="var(--ink)"
              opacity="0.25"
            />

            {/* Pectoral fin. small sweep */}
            <path
              d="M 148 166 C 154 174 158 180 162 190 C 156 182 148 176 144 168 Z"
              fill="var(--ink)"
              opacity="0.45"
            />
          </g>

          {/* Tail fin for fish A. separate for independent wag */}
          <g className="vk-fin-a">
            <path
              d="M 82 150 C 68 140 52 128 40 118 C 50 132 58 148 62 168 C 58 158 62 148 82 150 Z"
              fill="var(--ink)"
              opacity="0.62"
            />
            {/* Tail wash. split fork */}
            <path
              d="M 82 154 C 70 148 54 142 38 138"
              stroke="var(--ink)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 82 166 C 72 170 58 178 44 182"
              stroke="var(--ink)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.28"
            />
          </g>

          {/* ── FISH B. lower fish, swimming left-and-down, slightly smaller ── */}
          <g className="vk-fish-b">
            {/* Body halo */}
            <ellipse
              cx="160"
              cy="310"
              rx="52"
              ry="22"
              fill="var(--ink)"
              opacity="0.08"
              transform="rotate(22 160 310)"
            />
            {/* Mid wash */}
            <ellipse
              cx="160"
              cy="310"
              rx="44"
              ry="18"
              fill="var(--ink)"
              opacity="0.18"
              transform="rotate(22 160 310)"
            />
            {/* Core */}
            <ellipse
              cx="160"
              cy="310"
              rx="36"
              ry="14"
              fill="var(--ink)"
              opacity="0.76"
              transform="rotate(22 160 310)"
            />
            {/* Scale pattern. two faint crescent marks */}
            <path
              d="M 152 305 Q 156 300 162 305"
              stroke="var(--ink)"
              strokeWidth="1"
              fill="none"
              opacity="0.22"
              transform="rotate(22 160 310)"
            />
            <path
              d="M 144 308 Q 150 302 157 308"
              stroke="var(--ink)"
              strokeWidth="0.8"
              fill="none"
              opacity="0.16"
              transform="rotate(22 160 310)"
            />

            {/* Head */}
            <ellipse
              cx="122"
              cy="298"
              rx="12"
              ry="9"
              fill="var(--ink)"
              opacity="0.86"
              transform="rotate(22 122 298)"
            />
            <circle cx="117" cy="294" r="1.8" fill="var(--paper, #fcfdf9)" opacity="0.65" />
            <circle cx="117" cy="294" r="1" fill="var(--ink)" opacity="0.9" />

            {/* Dorsal fin */}
            <path
              d="M 148 300 C 146 286 142 278 140 270 C 138 276 138 290 140 300"
              fill="var(--ink)"
              opacity="0.48"
              transform="rotate(22 150 300)"
            />

            {/* Pectoral fin */}
            <path
              d="M 136 314 C 128 322 124 330 118 340 C 126 330 136 322 140 314 Z"
              fill="var(--ink)"
              opacity="0.4"
            />
          </g>

          {/* Tail fin for fish B */}
          <g className="vk-fin-b">
            <path
              d="M 196 308 C 212 296 228 282 242 272 C 232 286 224 304 222 322 C 218 310 210 302 196 308 Z"
              fill="var(--ink)"
              opacity="0.58"
            />
            <path
              d="M 196 304 C 210 296 226 286 242 278"
              stroke="var(--ink)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.28"
            />
            <path
              d="M 196 318 C 210 322 226 332 238 340"
              stroke="var(--ink)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.25"
            />
          </g>

          {/* Ripple rings around fish B (subtle) */}
          <ellipse
            cx="160"
            cy="316"
            rx="54"
            ry="8"
            stroke="var(--ink)"
            strokeWidth="0.7"
            fill="none"
            opacity="0.1"
          />
          <ellipse
            cx="160"
            cy="316"
            rx="72"
            ry="11"
            stroke="var(--ink)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.06"
          />
        </g>
      </svg>
    </div>
  );
}
