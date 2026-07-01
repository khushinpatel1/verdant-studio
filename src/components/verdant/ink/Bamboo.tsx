/**
 * Bamboo. sumi-e bamboo culms with nodes and leaf sprays.
 *
 * Anatomy:
 *   - 3 culms, each composed of segments between nodes. Each segment is a
 *     FILLED tapered shape (not a stroked rectangle): slightly narrower at top
 *     than base, with the ink body having subtle opacity variation. The brush
 *     loaded at the bottom of each segment and lightened as it pulled upward.
 *   - Node rings: where segments meet, a horizontal filled almond-band sits
 *     across the culm. the joint's ink deposit. Each node is slightly wider
 *     than the culm at that point.
 *   - Leaf sprays: 2–3 sprays of leaf blades. Each leaf is an elongated almond
 *     (filled path) that tapers to a sharp point. the brush tip's exit stroke.
 *     Leaf clusters branch from the nodes, angled asymmetrically.
 *   - Sway animation: the leaves on each culm sway gently at different phases
 *     and amplitudes, like a breeze passing through. The culms themselves are
 *     static (bamboo is stiff). Leaves transform around their branch origin.
 *   - Reduced-motion: fully static, leaves at rest.
 *
 * Props:
 *   className, style. standard pass-through
 *   side. mirrors via transform (default "right". culms lean right)
 */
export default function Bamboo({
  className,
  style,
  side = "right",
}: {
  className?: string;
  style?: React.CSSProperties;
  side?: "left" | "right";
}) {

  const flip = side === "left" ? "scale(-1,1) translate(-360,0)" : undefined;

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes bamboo-sway-a {
          0%, 100% { transform: rotate(0deg); }
          35%       { transform: rotate(3.5deg); }
          70%       { transform: rotate(-2deg); }
        }
        @keyframes bamboo-sway-b {
          0%, 100% { transform: rotate(0deg); }
          40%       { transform: rotate(-4deg); }
          75%       { transform: rotate(2.5deg); }
        }
        @keyframes bamboo-sway-c {
          0%, 100% { transform: rotate(0deg); }
          30%       { transform: rotate(2deg); }
          65%       { transform: rotate(-3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bamboo-leaf-group { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 360 580"
        fill="none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        <g transform={flip}>

          {/*
            ══════════════════════════════════════════════════════════════════
            CULM 1. tallest, leftmost, slightly forward-leaning (main trunk)
            ══════════════════════════════════════════════════════════════════
          */}

          {/* Segment 1 (base): brush loaded here. Slightly wider, full opacity. */}
          <path
            d="M 98 578 C 96 560 94 530 95 510 C 100 508 106 508 108 510 C 109 530 107 560 108 578 Z"
            fill="currentColor" opacity="0.82"
          />
          {/* Node 1: horizontal ink deposit */}
          <path
            d="M 91 510 C 96 506 105 504 112 506 C 116 508 116 512 112 514 C 105 516 96 516 91 514 C 88 512 88 511 91 510 Z"
            fill="currentColor" opacity="0.70"
          />
          {/* Segment 2 */}
          <path
            d="M 95 510 C 93 490 92 464 93 446 C 98 444 104 444 106 446 C 107 464 106 490 108 510 Z"
            fill="currentColor" opacity="0.76"
          />
          {/* Node 2 */}
          <path
            d="M 89 446 C 94 442 103 440 110 442 C 114 444 114 448 110 450 C 103 452 94 452 89 450 C 86 448 86 447 89 446 Z"
            fill="currentColor" opacity="0.66"
          />
          {/* Segment 3 */}
          <path
            d="M 92 446 C 91 426 90 400 91 382 C 96 380 103 380 105 382 C 106 400 105 426 107 446 Z"
            fill="currentColor" opacity="0.70"
          />
          {/* Node 3. leaves spray off here */}
          <path
            d="M 87 382 C 92 378 101 376 108 378 C 112 380 112 384 108 386 C 101 388 92 388 87 386 C 84 384 84 383 87 382 Z"
            fill="currentColor" opacity="0.62"
          />
          {/* Segment 4 */}
          <path
            d="M 90 382 C 89 362 89 338 90 320 C 95 318 102 318 104 320 C 105 338 104 362 105 382 Z"
            fill="currentColor" opacity="0.64"
          />
          {/* Node 4 */}
          <path
            d="M 85 320 C 90 316 100 314 107 316 C 111 318 111 322 107 324 C 100 326 90 326 85 324 C 82 322 82 321 85 320 Z"
            fill="currentColor" opacity="0.58"
          />
          {/* Segment 5 (near top. brush drying) */}
          <path
            d="M 89 320 C 88 302 88 280 89 264 C 94 262 101 262 103 264 C 103 280 102 302 104 320 Z"
            fill="currentColor" opacity="0.56"
          />
          {/* Tip (brush lifted off) */}
          <path
            d="M 88 264 C 90 246 93 228 96 216 C 98 212 101 212 102 216 C 103 228 102 246 103 264 Z"
            fill="currentColor" opacity="0.44"
          />

          {/* Leaf spray at node 3 (left) */}
          <g
            className="bamboo-leaf-group"
            style={{ transformOrigin: "88px 382px", animation: "bamboo-sway-a 6s ease-in-out infinite" }}
          >
            <path d="M 87 382 C 64 366 42 348 28 328 C 36 326 52 334 68 346 C 80 356 88 368 87 382 Z" fill="currentColor" opacity="0.62" />
            <path d="M 86 378 C 58 360 38 336 22 312 C 30 308 48 320 65 338 C 76 350 84 366 86 378 Z" fill="currentColor" opacity="0.45" />
            <path d="M 88 374 C 68 362 50 342 40 318 C 48 315 62 328 76 344 C 84 356 88 368 88 374 Z" fill="currentColor" opacity="0.32" />
          </g>

          {/* Leaf spray at node 4 (right) */}
          <g
            className="bamboo-leaf-group"
            style={{ transformOrigin: "106px 320px", animation: "bamboo-sway-b 7.5s ease-in-out infinite 0.8s" }}
          >
            <path d="M 106 320 C 128 302 152 286 174 272 C 175 280 164 294 148 306 C 136 315 120 320 106 320 Z" fill="currentColor" opacity="0.58" />
            <path d="M 108 316 C 132 296 158 276 182 258 C 184 266 172 282 154 296 C 140 307 122 315 108 316 Z" fill="currentColor" opacity="0.40" />
          </g>

          {/*
            ══════════════════════════════════════════════════════════════════
            CULM 2. slightly shorter, offset right, leaning back slightly
            ══════════════════════════════════════════════════════════════════
          */}

          <path d="M 185 578 C 183 554 181 522 182 498 C 187 496 193 496 195 498 C 196 522 195 554 196 578 Z" fill="currentColor" opacity="0.72" />
          <path d="M 178 498 C 183 494 192 492 199 494 C 203 496 203 500 199 502 C 192 504 183 504 178 502 C 175 500 175 499 178 498 Z" fill="currentColor" opacity="0.62" />
          <path d="M 181 498 C 179 474 178 448 179 428 C 184 426 191 426 193 428 C 194 448 193 474 194 498 Z" fill="currentColor" opacity="0.66" />
          <path d="M 175 428 C 180 424 190 422 197 424 C 201 426 201 430 197 432 C 190 434 180 434 175 432 C 172 430 172 429 175 428 Z" fill="currentColor" opacity="0.56" />
          <path d="M 178 428 C 177 408 176 386 177 368 C 182 366 189 366 191 368 C 192 386 191 408 192 428 Z" fill="currentColor" opacity="0.60" />
          <path d="M 173 368 C 178 364 188 362 195 364 C 199 366 199 370 195 372 C 188 374 178 374 173 372 C 170 370 170 369 173 368 Z" fill="currentColor" opacity="0.52" />
          <path d="M 176 368 C 175 348 175 328 176 312 C 181 310 188 310 190 312 C 190 328 189 348 190 368 Z" fill="currentColor" opacity="0.54" />
          {/* Tip */}
          <path d="M 175 312 C 176 292 179 272 182 258 C 184 254 187 254 188 258 C 189 272 188 292 190 312 Z" fill="currentColor" opacity="0.40" />

          {/* Leaf spray. culm 2, mid level, going left */}
          <g
            className="bamboo-leaf-group"
            style={{ transformOrigin: "174px 368px", animation: "bamboo-sway-c 8s ease-in-out infinite 1.6s" }}
          >
            <path d="M 173 368 C 148 354 124 334 106 310 C 114 306 132 318 150 334 C 164 346 172 360 173 368 Z" fill="currentColor" opacity="0.55" />
            <path d="M 172 372 C 144 362 118 344 98 320 C 106 315 126 326 146 342 C 160 354 170 366 172 372 Z" fill="currentColor" opacity="0.38" />
          </g>

          {/*
            ══════════════════════════════════════════════════════════════════
            CULM 3. shortest, leftmost foreground, thick base (closest)
            ══════════════════════════════════════════════════════════════════
          */}

          <path d="M 52 578 C 50 556 49 528 50 510 C 55 508 62 508 64 510 C 65 528 63 556 65 578 Z" fill="currentColor" opacity="0.88" />
          <path d="M 45 510 C 50 506 60 504 68 506 C 72 508 72 512 68 514 C 60 516 50 516 45 514 C 42 512 42 511 45 510 Z" fill="currentColor" opacity="0.76" />
          <path d="M 49 510 C 47 488 46 462 47 444 C 52 442 59 442 61 444 C 62 462 61 488 62 510 Z" fill="currentColor" opacity="0.80" />
          <path d="M 43 444 C 48 440 58 438 65 440 C 69 442 69 446 65 448 C 58 450 48 450 43 448 C 40 446 40 445 43 444 Z" fill="currentColor" opacity="0.68" />
          <path d="M 46 444 C 45 424 44 400 45 382 C 50 380 57 380 59 382 C 60 400 59 424 60 444 Z" fill="currentColor" opacity="0.74" />
          {/* Tip */}
          <path d="M 44 382 C 46 360 49 340 52 328 C 54 324 57 324 58 328 C 59 340 58 360 59 382 Z" fill="currentColor" opacity="0.52" />

          {/* Leaf spray. culm 3, going right */}
          <g
            className="bamboo-leaf-group"
            style={{ transformOrigin: "59px 444px", animation: "bamboo-sway-a 9s ease-in-out infinite 2.4s" }}
          >
            <path d="M 60 444 C 82 428 108 412 132 400 C 133 408 122 422 106 434 C 92 444 74 448 60 444 Z" fill="currentColor" opacity="0.60" />
            <path d="M 62 440 C 86 422 114 404 140 390 C 141 398 130 414 112 428 C 96 440 78 444 62 440 Z" fill="currentColor" opacity="0.42" />
            <path d="M 58 436 C 78 422 100 406 120 396 C 121 404 112 416 97 428 C 84 438 68 442 58 436 Z" fill="currentColor" opacity="0.28" />
          </g>

        </g>
      </svg>
    </div>
  );
}
