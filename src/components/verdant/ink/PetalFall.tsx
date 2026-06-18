import React from "react";

/**
 * PetalFall — drifting ink/blush petals falling across the container.
 * A decorative overlay piece (pointer-events: none).
 *
 * 12 petals: each is a filled brushed shape (NOT a circle — tapered oval with
 * a slight curve for the ink-dried-edge look). Varied size, opacity, color
 * (ink vs blush-ink vs paper-soft), delay, duration, drift path.
 *
 * CSS keyframes only (no rAF) — infinite, organic, all different.
 * Reduced-motion → a few static scattered petals at their resting positions.
 *
 * The petals have a blush/pink-ink tone (mixing ink + warm wash) — sumi-e
 * cherry blossom petals aren't flat pink, they're the color of ink on warm paper.
 */

interface Petal {
  id: number;
  /* layout */
  startX: number;   // % of container width
  startY: number;   // % starting above container (negative)
  size: number;     // base radius in px
  rotate: number;   // initial tilt deg
  /* animation */
  duration: number; // s
  delay: number;    // s
  drift: number;    // px horizontal drift during fall
  rotateEnd: number; // deg total rotation by end
  /* color */
  opacity: number;
  hue: "ink" | "blush" | "mist";
}

const PETALS: Petal[] = [
  { id:  1, startX: 12, startY: -8,  size: 14, rotate: -22, duration: 7.2,  delay: 0,    drift: 28,  rotateEnd: 340, opacity: 0.38, hue: "blush" },
  { id:  2, startX: 28, startY: -4,  size: 10, rotate:  15, duration: 9.1,  delay: 1.4,  drift: -22, rotateEnd: -280,opacity: 0.3,  hue: "ink"   },
  { id:  3, startX: 48, startY: -6,  size: 16, rotate: -8,  duration: 8.4,  delay: 2.8,  drift: 18,  rotateEnd: 320, opacity: 0.42, hue: "blush" },
  { id:  4, startX: 68, startY: -3,  size: 12, rotate:  30, duration: 10.2, delay: 0.6,  drift: -30, rotateEnd: -360,opacity: 0.28, hue: "mist"  },
  { id:  5, startX: 82, startY: -9,  size: 9,  rotate: -40, duration: 6.8,  delay: 3.5,  drift: 14,  rotateEnd: 280, opacity: 0.35, hue: "ink"   },
  { id:  6, startX: 22, startY: -5,  size: 13, rotate:  20, duration: 11.0, delay: 4.2,  drift: -18, rotateEnd: -320,opacity: 0.26, hue: "blush" },
  { id:  7, startX: 58, startY: -7,  size: 11, rotate: -12, duration: 7.6,  delay: 1.9,  drift: 24,  rotateEnd: 300, opacity: 0.33, hue: "mist"  },
  { id:  8, startX: 38, startY: -4,  size: 15, rotate:  35, duration: 9.8,  delay: 5.1,  drift: -26, rotateEnd: -360,opacity: 0.4,  hue: "blush" },
  { id:  9, startX: 74, startY: -6,  size: 8,  rotate: -28, duration: 8.0,  delay: 2.3,  drift: 20,  rotateEnd: 260, opacity: 0.29, hue: "ink"   },
  { id: 10, startX: 5,  startY: -10, size: 17, rotate:  10, duration: 12.4, delay: 0.8,  drift: -14, rotateEnd: -280,opacity: 0.22, hue: "mist"  },
  { id: 11, startX: 90, startY: -3,  size: 10, rotate: -50, duration: 7.4,  delay: 6.0,  drift: 16,  rotateEnd: 320, opacity: 0.36, hue: "blush" },
  { id: 12, startX: 44, startY: -8,  size: 12, rotate:  22, duration: 10.6, delay: 3.0,  drift: -20, rotateEnd: -300,opacity: 0.31, hue: "ink"   },
];

// Static positions for reduced-motion (a handful of petals resting on page)
const STATIC_PETALS: Petal[] = PETALS.filter((_, i) => i % 3 === 0).map((p) => ({
  ...p,
  startY: 20 + ((p.startX * 3.7) % 60), // scatter across visible area
}));

function petalPath(size: number): string {
  // A brushed petal: tapered oval with a slight asymmetric curve.
  // Drawn as a closed path around center (0,0) — parent <g> positions it.
  const w = size;
  const h = size * 1.7;
  return `
    M 0 ${-h}
    C ${w * 0.6} ${-h * 0.8}   ${w * 0.9} ${-h * 0.3}   ${w * 0.4} 0
    C ${w * 0.8} ${h * 0.4}    ${w * 0.3} ${h * 0.85}    0 ${h}
    C ${-w * 0.4} ${h * 0.85}  ${-w * 0.7} ${h * 0.4}    ${-w * 0.3} 0
    C ${-w * 0.85} ${-h * 0.3} ${-w * 0.55} ${-h * 0.8}  0 ${-h}
    Z
  `;
}

function petalColor(hue: Petal["hue"]): string {
  switch (hue) {
    case "blush": return "color-mix(in srgb, var(--ink) 55%, #e8c4bb 45%)";
    case "mist":  return "color-mix(in srgb, var(--ink) 40%, var(--sage) 60%)";
    case "ink":   return "var(--ink)";
  }
}

export default function PetalFall({
  side,
  className,
  style,
}: {
  side?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}) {
  // Build all @keyframes for each petal as a single <style> block
  const keyframes = PETALS.map((p) => `
    @keyframes petalFall${p.id} {
      0% {
        transform: translate(0, 0) rotate(${p.rotate}deg);
        opacity: 0;
      }
      6% {
        opacity: ${p.opacity};
      }
      85% {
        opacity: ${p.opacity};
      }
      100% {
        transform: translate(${p.drift}px, 110vh) rotate(${p.rotate + p.rotateEnd}deg);
        opacity: 0;
      }
    }
  `).join("\n");

  const animStyles = PETALS.map((p) => `
    .vp-petal-${p.id} {
      animation: petalFall${p.id} ${p.duration}s ${p.delay}s ease-in infinite;
    }
  `).join("\n");

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        ...style,
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          ${keyframes}
          ${animStyles}
        }
      `}</style>

      {/* Animated version — hidden when prefers-reduced-motion */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          /* We use a CSS custom property trick: show/hide based on motion pref */
        }}
        className="vp-animated-layer"
        aria-hidden="true"
      >
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .vp-animated-layer { display: none; }
            .vp-static-layer   { display: block; }
          }
          @media (prefers-reduced-motion: no-preference) {
            .vp-animated-layer { display: block; }
            .vp-static-layer   { display: none; }
          }
        `}</style>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {PETALS.map((p) => (
            <g
              key={p.id}
              className={`vp-petal-${p.id}`}
              style={{
                /* position in % units of the svg viewBox */
                transform: `translate(${p.startX}%, ${p.startY}%) rotate(${p.rotate}deg)`,
              }}
            >
              {/* outer wash */}
              <path
                d={petalPath(p.size * 0.028 + 0.01)}
                fill={petalColor(p.hue)}
                opacity={0.12}
              />
              {/* main petal */}
              <path
                d={petalPath(p.size * 0.022)}
                fill={petalColor(p.hue)}
                opacity={0.85}
              />
              {/* vein — a single brushed line through the petal */}
              <line
                x1="0"
                y1={-(p.size * 0.022 * 1.7 * 0.8)}
                x2="0"
                y2={p.size * 0.022 * 1.7 * 0.6}
                stroke={petalColor(p.hue)}
                strokeWidth={p.size * 0.002}
                opacity={0.2}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Static version for reduced-motion */}
      <div
        className="vp-static-layer"
        style={{ position: "absolute", inset: 0, display: "none" }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0 }}
        >
          {STATIC_PETALS.map((p) => (
            <g
              key={p.id}
              style={{
                transform: `translate(${p.startX}%, ${p.startY}%) rotate(${p.rotate}deg)`,
              }}
            >
              <path
                d={petalPath(p.size * 0.028 + 0.01)}
                fill={petalColor(p.hue)}
                opacity={0.1}
              />
              <path
                d={petalPath(p.size * 0.022)}
                fill={petalColor(p.hue)}
                opacity={p.opacity * 0.7}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
