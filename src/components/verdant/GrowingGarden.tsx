import { useReactiveField } from "./useReactiveField";
import { makeNoise2D } from "./noise";

/**
 * GARDEN page hero — the growing garden. A still green field of slender stems
 * that all lean together on a shared 2D noise FLOW FIELD, so the field reads as
 * one body of grass moving under wind rather than a grid of independent sines.
 * The pointer is sunlight — where it passes, stems grow taller and unfurl a
 * bloom (over a few frames, never snapping open), then settle back. Fireflies
 * drift and dodge the cursor. Built on useReactiveField so its motion matches
 * the rest of the site's heroes. Reduced-motion → static field, no wake, no bugs.
 */

type Stem = { x: number; rootY: number; h: number; sway: number; phase: number; hue: number; g: number; restG: number; bloom: number };
type Bug = { x: number; y: number; vx: number; vy: number; phase: number };
type State = {
  stems: Stem[]; bugs: Bug[]; blooms: string[];
  cols: { stem: string; leaf: string; gold: string };
  noise: (x: number, y: number) => number;
};

const TRAIL_R = 140; // pointer "sunlight" reach (was 96)

export default function GrowingGarden({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State>({
    trailMax: 20,
    seed: ({ W, H, tok }) => {
      const C_GOLD = tok("--gold", "#c9a24b");
      const blooms = [C_GOLD, tok("--clay", "#b08463"), tok("--sage", "#c8d5b9"), "#e7d9b0"];
      const stems: Stem[] = [];
      const GAP = 40;
      for (let gx = GAP * 0.5; gx < W + GAP; gx += GAP) {
        for (let gy = GAP * 0.6; gy < H + GAP; gy += GAP) {
          const restG = 0.18 + Math.random() * 0.24; // per-stem resting height (0.18–0.42)
          stems.push({
            x: gx + (Math.random() - 0.5) * GAP * 0.8,
            rootY: gy + (Math.random() - 0.5) * GAP * 0.8,
            h: 26 + Math.random() * 40,
            sway: (Math.random() - 0.5) * 12,
            phase: Math.random() * Math.PI * 2,
            hue: Math.floor(Math.random() * blooms.length),
            g: restG,
            restG,
            bloom: 0,
          });
        }
      }
      const bugs: Bug[] = Array.from({ length: 8 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      }));
      return {
        stems, bugs, blooms,
        cols: { stem: tok("--moss", "#7a9e7e"), leaf: tok("--green", "#2d5016"), gold: C_GOLD },
        noise: makeNoise2D(),
      };
    },
    draw: ({ ctx, W, H, t, trail, pointer, reduce }, S) => {
      const { stem: C_STEM, leaf: C_LEAF, gold: C_GOLD } = S.cols;
      const N = S.noise;

      for (const s of S.stems) {
        // --- shared flow field: one wind value sampled per stem position, drifting
        // across the field over time. Neighbours read near-identical values, so the
        // grass leans together in travelling gusts. ---
        const wind = reduce ? 0 : N(s.x * 0.0026, s.rootY * 0.0026 + t * 0.5);
        const gust = reduce ? 0 : N(s.x * 0.004 - t * 0.35, s.rootY * 0.004); // second octave, crossing direction

        // resting growth breathes with the wind (amplitude ~0.12, was 0.03)
        let target = s.restG + wind * 0.12;
        for (const m of trail) {
          const d = Math.hypot(s.x - m.x, s.rootY - m.y);
          if (d < TRAIL_R) { const f = 1 - d / TRAIL_R; target += f * f * 0.9 * m.life; }
        }
        s.g += (Math.min(1, target) - s.g) * (reduce ? 1 : 0.08);

        // coherent horizontal lean from the flow field, on top of the stem's own curve
        const leanPx = (wind * 13 + gust * 6) * s.g;
        const tipX = s.x + s.sway * s.g + leanPx, tipY = s.rootY - s.h * s.g;
        const midX = s.x + (s.sway * s.g + leanPx) * 0.45, midY = s.rootY - s.h * s.g * 0.55;
        ctx.beginPath();
        ctx.moveTo(s.x, s.rootY);
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.strokeStyle = C_STEM;
        ctx.globalAlpha = 0.32 + s.g * 0.4;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        if (s.g > 0.4) {
          const lx = s.x + (s.sway * s.g + leanPx) * 0.5, ly = s.rootY - s.h * s.g * 0.5;
          ctx.globalAlpha = 0.3 + s.g * 0.35;
          ctx.fillStyle = C_LEAF;
          for (const dir of [-1, 1]) {
            ctx.beginPath();
            ctx.ellipse(lx + dir * 4, ly, 5.5 * s.g, 2.4 * s.g, dir * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // bloom unfurls over ~3 frames toward its target openness instead of snapping
        const openTarget = Math.max(0, (s.g - 0.5) / 0.5);
        s.bloom += (openTarget - s.bloom) * (reduce ? 1 : 0.34);
        const open = s.bloom;
        if (open > 0.02) {
          const R = 2 + open * 4.5;
          ctx.globalAlpha = 0.5 + open * 0.45;
          ctx.fillStyle = S.blooms[s.hue];
          for (let p = 0; p < 5; p++) {
            const a = (p / 5) * Math.PI * 2 + s.phase;
            // petals scale in from the centre as the bloom opens
            ctx.beginPath();
            ctx.ellipse(tipX + Math.cos(a) * R * 0.7 * open, tipY + Math.sin(a) * R * 0.7 * open, R * 0.6, R * 0.34, a, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 0.7 + open * 0.3;
          ctx.fillStyle = C_GOLD;
          ctx.beginPath();
          ctx.arc(tipX, tipY, R * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const drawBug = (b: Bug, tt: number) => {
        const flutter = Math.sin(tt * 16 + b.phase) * 0.5 + 0.5;
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        for (const dir of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(b.x + dir * 2.4, b.y - 1, 2.6, 1.1 + flutter * 1.6, dir * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowColor = C_GOLD; ctx.shadowBlur = 6;
        ctx.fillStyle = C_GOLD;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      };

      if (!reduce) {
        for (const b of S.bugs) {
          b.vx += Math.sin(t * 1.3 + b.phase) * 0.012;
          b.vy += Math.cos(t * 1.1 + b.phase * 1.7) * 0.012;
          if (pointer.active) {
            const dx = b.x - pointer.x, dy = b.y - pointer.y, d = Math.hypot(dx, dy);
            if (d < 90 && d > 0.1) { const f = (1 - d / 90) * 0.6; b.vx += (dx / d) * f; b.vy += (dy / d) * f; }
          }
          b.vx *= 0.94; b.vy *= 0.94;
          b.x += b.vx; b.y += b.vy;
          if (b.x < 0) b.x += W; if (b.x > W) b.x -= W;
          if (b.y < 0) b.y += H; if (b.y > H) b.y -= H;
          drawBug(b, t);
        }
      } else {
        for (const b of S.bugs) drawBug(b, 0);
      }
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
