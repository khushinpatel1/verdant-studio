/**
 * VerdantMark — the studio's mark: a clean ensō open-ring (a single
 * brush-gesture circle with one deliberate break) paired with "Verdant" in
 * the display serif. Mirrors Logo.tsx's API (withWordmark, size, className)
 * but is a wholly separate glyph — the sprout (Logo.tsx) now belongs to
 * Garden the product; this ring is Verdant the studio.
 *
 * Derived from ink/Enso.tsx's gesture but simplified to a crisp, static
 * logo glyph: one path, currentColor, no draw-on animation, no wash/dry-
 * brush texture. Reads clean at 16px (favicon scale).
 *
 * The break sits at the lower-left (~225deg), open toward the page —
 * incomplete on purpose, the zen-circle convention.
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
          Single brush-gesture ring, one sweep, one break.
          Starts just past the gap (upper-left), travels clockwise almost
          a full turn, stops short at the lower-left — the break stays open.
          Slightly uneven radius (9.6 in, 10.4 out) so it reads hand-drawn,
          not a perfect circle traced by a tool.
        */}
        <path
          d="M11 6.2
             C 14 4.6 18.4 4.6 21.6 6.6
             C 25.4 9 27.2 13.2 26.4 17.2
             C 25.6 21.2 22.4 24.6 18.4 25.6
             C 14.8 26.5 10.8 25.4 8.2 22.7
             C 6.6 21 5.7 18.7 5.8 16.4"
          stroke="currentColor"
          strokeWidth="2.4"
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
