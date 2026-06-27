/**
 * VERDANT logo. an inline, hand-authored sprout glyph (stem + two
 * asymmetric leaves, single path family, currentColor) paired with the
 * "Verdant" wordmark in the display serif. Used in Nav, Footer, and as the
 * source for /favicon.svg (glyph-only).
 *
 * Organic = asymmetric on purpose: the two leaves sit at different heights
 * and sizes, neither mirrored nor centered on the stem.
 */
export default function Logo({
  withWordmark = true,
  size = 22,
  className = "",
}: {
  withWordmark?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`v-logo ${className}`}>
      <svg
        className="v-logo-glyph"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* stem. slightly curved, growing up-right */}
        <path
          d="M16 29 C15.4 22 16.8 15.5 20.5 10.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* lower-left leaf. larger, lower on the stem */}
        <path
          d="M16.5 21 C9 21 4 17 3 10.5 C12 10.5 17.5 14.5 16.5 21 Z"
          fill="currentColor"
        />
        {/* upper-right leaf. smaller, higher, opposite side */}
        <path
          d="M19.5 12 C25 10.5 28.5 6.5 29 3 C22.5 3.5 18 7 19.5 12 Z"
          fill="currentColor"
        />
      </svg>
      {withWordmark && <span className="v-logo-word">Verdant</span>}
    </span>
  );
}
