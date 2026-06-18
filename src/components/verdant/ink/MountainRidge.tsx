/**
 * MountainRidge — sumi-e layered mountain ridges (atmospheric perspective).
 *
 * Anatomy — three receding ink layers, each a FILLED shape:
 *   Layer 1 (foreground): dark, full opacity, brushed top edge with visible
 *     pressure variation — peaks where the brush tip caught, flattening in
 *     the valleys. The top contour is a complex path; the bottom is cut off
 *     by the viewBox (implied ground). Ink body is solid.
 *   Layer 2 (middle): lighter fill, slightly higher in the composition.
 *     Top edge is softer — as if a drier brush pass.
 *   Layer 3 (background/sky): nearly transparent, highest up. The farthest
 *     ridge dissolves into mist. Top edge is very gentle.
 *
 * No internal animation (designed to be parallax-driven by parent's --vp;
 * each layer has a data-layer attribute for external parallax wiring).
 * Reduced-motion: static at rest position.
 *
 * Props:
 *   className, style — standard pass-through
 *   side — mirrors the composition (default "right" — peaks lean right)
 */
export default function MountainRidge({
  className,
  style,
  side = "right",
}: {
  className?: string;
  style?: React.CSSProperties;
  side?: "left" | "right";
}) {
  const flip = side === "left" ? "scale(-1,1) translate(-800,0)" : undefined;

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 400"
        fill="none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        <g transform={flip}>

          {/*
            ── Layer 3: Background ridge — farthest, palest, near mist ────
            Ink thins as the brush lifted. Atmospheric distance = opacity ≈ 0.12.
            Form: gentle dome shapes, long low profile. Peaks sit at ~y=80.
          */}
          <path
            data-layer="far"
            d={`
              M 0 200
              C 40 195 80 175 130 160
              C 180 145 220 138 270 128
              C 310 120 340 115 380 110
              C 420 106 460 114 500 120
              C 545 127 590 140 640 152
              C 690 164 740 178 800 188
              L 800 400 L 0 400 Z
            `}
            fill="currentColor"
            opacity="0.10"
          />
          {/* Dry brush tip catches on the peak — slightly denser there */}
          <path
            d={`
              M 350 110 C 365 100 378 98 390 103 C 400 107 408 112 395 115 C 382 117 365 114 350 110 Z
            `}
            fill="currentColor"
            opacity="0.08"
          />

          {/*
            ── Layer 2: Middle ridge — softer pressure, drier brush ─────────
            Ink weight: opacity ≈ 0.28. Distinct silhouette — sharper than
            the background but not as weighted as the foreground. The right
            peak is taller; the profile is asymmetric.
          */}
          <path
            data-layer="mid"
            d={`
              M 0 300
              C 30 285 70 268 120 250
              C 170 232 210 220 260 205
              C 300 192 330 182 360 168
              C 382 158 398 148 418 144
              C 438 140 456 145 474 154
              C 500 166 530 185 570 200
              C 610 215 660 232 720 250
              C 760 262 784 272 800 280
              L 800 400 L 0 400 Z
            `}
            fill="currentColor"
            opacity="0.24"
          />
          {/* Extra ink deposit at the dominant peak — brush loaded here */}
          <path
            d={`
              M 400 144 C 412 134 428 128 440 132
              C 452 136 460 143 455 150
              C 449 157 434 158 420 154
              C 408 150 396 147 400 144 Z
            `}
            fill="currentColor"
            opacity="0.18"
          />
          {/* Ink wash bleeds into the body — a few dark patches below peak */}
          <path
            d={`
              M 380 168 C 390 162 408 158 418 165 C 424 170 418 178 404 178 C 392 178 380 172 380 168 Z
            `}
            fill="currentColor"
            opacity="0.14"
          />

          {/*
            ── Layer 1: Foreground ridge — most ink, heaviest brush ──────────
            This is where the brush loaded fully. The top contour has the most
            character: steep cliffs, a dominant high peak at ~x=280, smaller
            secondary peak at right. Ink pools at base of peaks (extra fill shapes).
            opacity near 1 on main body; 0.85 on wash overlays.
          */}
          <path
            data-layer="near"
            d={`
              M 0 400
              L 0 355
              C 20 340 50 318 88 296
              C 120 276 150 262 185 245
              C 215 230 238 218 262 200
              C 280 187 292 172 306 158
              C 318 146 328 136 336 128
              C 344 120 350 116 355 115
              C 358 114 362 116 364 120
              C 368 128 368 140 365 154
              C 361 170 354 188 350 204
              C 346 218 344 230 346 240
              C 348 250 354 256 364 264
              C 380 276 400 286 424 294
              C 452 304 482 312 516 320
              C 552 328 590 336 630 344
              C 668 352 710 360 760 370
              C 780 374 792 378 800 381
              L 800 400 Z
            `}
            fill="currentColor"
            opacity="0.82"
          />

          {/* Heavy ink deposit at the dominant peak — this is where the
              brush tip pressed hardest before lifting. A tapered almond shape
              slightly darker than the body. */}
          <path
            d={`
              M 336 128 C 340 116 348 108 355 112 C 362 116 362 128 358 140
              C 354 150 345 155 338 148 C 332 141 333 132 336 128 Z
            `}
            fill="currentColor"
            opacity="0.90"
          />

          {/* Ink pooling on the steep face below the main peak — a wash
              that flooded when the brush tip dragged down the cliff face */}
          <path
            d={`
              M 306 158 C 316 148 328 140 338 148 C 344 154 342 168 332 178
              C 322 188 308 192 302 182 C 297 173 300 163 306 158 Z
            `}
            fill="currentColor"
            opacity="0.35"
          />

          {/* A secondary smaller peak at far right — the brush's tail stroke */}
          <path
            d={`
              M 580 316 C 596 296 618 280 640 282 C 658 284 668 298 660 312
              C 652 326 630 334 610 328 C 592 322 578 326 580 316 Z
            `}
            fill="currentColor"
            opacity="0.60"
          />

        </g>
      </svg>
    </div>
  );
}
