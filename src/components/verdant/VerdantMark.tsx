/**
 * VerdantMark — the studio's mark.
 *
 * PLACEHOLDER GLYPH (2026-06-19): the previous ensō open-ring read as a
 * "C/O" and was rejected. Replaced with a temporary geometric "V" in the
 * Anthropic register — clean, confident, restrained, not a playful
 * sunburst. One quiet character detail: the right arm tapers into a small
 * leaf-bud terminal instead of a square cut. Monochrome, currentColor, two
 * strokes, reads clean at 16px (favicon scale). This stays in place only
 * until a final mark is commissioned — do not treat as the permanent logo.
 *
 * Mirrors Logo.tsx's API (withWordmark, size, className) but is a wholly
 * separate glyph — the sprout (Logo.tsx) now belongs to Garden the
 * product; this V is Verdant the studio.
 */
export default function VerdantMark({
  withWordmark = true,
  size = 22,
  className = "",
}: {
  withWordmark?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`v-mark ${className}`}>
      <svg
        className="v-mark-glyph"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/*
          Geometric V, two strokes meeting at a rounded vertex.
          Left arm: straight descent then rise to the vertex.
          Right arm: rises from the vertex, then the terminal eases off the
          straight line into a short curl — the one quiet "leaf-bud" detail.
        */}
        <path
          d="M5 5.5
             L15.6 25.5
             C 15.95 26.17 16.93 26.17 17.27 25.5
             L24.2 12.2"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M24.2 12.2
             C 25.4 11.6 26.6 11.85 27.1 10.85
             C 27.5 10.05 27.1 9.1 26.25 8.85"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {withWordmark && <span className="v-mark-word">Verdant</span>}

      <style>{`
        .v-mark { display: inline-flex; align-items: center; gap: 0.55rem; line-height: 1; }
        .v-mark-glyph { display: block; flex: none; }
        .v-mark-word {
          font-family: var(--font-display); font-size: var(--text-2xl);
          letter-spacing: -0.01em; color: currentColor;
        }
      `}</style>
    </span>
  );
}
