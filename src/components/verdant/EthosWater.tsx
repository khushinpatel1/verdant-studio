import { useReactiveField } from "./useReactiveField";

/**
 * ETHOS hero — still water. A calm reflective surface with a faint resting
 * shimmer; the pointer sends out clean concentric ripples, and an occasional
 * ambient drop keeps it alive when still. Honest, transparent, nothing murky —
 * the privacy ethos made visual. Built on useReactiveField. Reduced-motion →
 * the static surface lines only.
 */

type Ripple = { x: number; y: number; r: number; life: number; seed: number; squash: number };
type State = { lines: number[]; ambient: Ripple[]; cool: number; cols: { line: string; ring: string } };

// an organic, hand-thrown ring: radius wanders by angle (layered sines + per-ripple
// phase seed), the surface-squash is slightly off-axis, so no two rings are alike and
// none is a perfect ellipse. Replaces the old ctx.ellipse() concentric-perfect look.
function organicRing(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number, squash: number, seed: number,
  stroke: string, alpha: number, lw: number,
) {
  if (r < 0.5) return;
  ctx.beginPath();
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  const STEP = 0.22;
  const tilt = Math.sin(seed) * 0.35; // gentle off-axis tilt per ripple
  // wobble shrinks as the ring grows (surface tension settles) → big rings calmer
  const wob = Math.min(1, 26 / (r + 14));
  for (let a = 0; a <= Math.PI * 2 + STEP; a += STEP) {
    const k =
      1 +
      wob * (Math.sin(a * 3 + seed) * 0.05 +
             Math.sin(a * 5 - seed * 1.7) * 0.03 +
             Math.sin(a * 2 + seed * 0.5) * 0.04);
    const rr = r * k;
    const px = x + Math.cos(a + tilt) * rr;
    const py = y + Math.sin(a + tilt) * rr * squash;
    a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
}

export default function EthosWater({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State>({
    trailMax: 14,
    trailDecay: 0.94,
    seed: ({ W, H, tok }) => {
      const lines: number[] = [];
      const GAP = 21;
      for (let y = GAP; y < H; y += GAP) lines.push(y);
      return {
        lines,
        ambient: [{ x: W * 0.5, y: H * 0.5, r: 0, life: 1, seed: Math.random() * 6.28, squash: 0.4 + Math.random() * 0.1 }],
        cool: 0,
        cols: { line: tok("--sage", "#c8d5b9"), ring: tok("--moss", "#7a9e7e") },
      };
    },
    draw: ({ ctx, W, H, t, trail, reduce }, S) => {
      // resting surface — faint horizontal caustics that breathe
      ctx.lineWidth = 1;
      for (let i = 0; i < S.lines.length; i++) {
        const baseY = S.lines[i];
        ctx.beginPath();
        ctx.strokeStyle = S.cols.line;
        ctx.globalAlpha = 0.22;
        for (let x = 0; x <= W; x += 8) {
          const y = baseY + Math.sin(x * 0.02 + t * 1.4 + i * 0.5) * 1.8;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // pointer wake → expanding organic ripples (phase seeded off position so each wobbles uniquely)
      for (const m of trail) {
        const r = (1 - m.life) * 120 + 6;
        const seed = (m.x + m.y) * 0.01;
        organicRing(ctx, m.x, m.y, r, 0.42, seed, S.cols.ring, m.life * 0.5, 1.4);
        if (r > 26) organicRing(ctx, m.x, m.y, r - 20, 0.42, seed + 1.3, S.cols.ring, m.life * 0.3, 1.1);
      }

      // ambient drops so the pond is never dead
      if (!reduce) {
        S.cool -= 1;
        if (S.cool <= 0) { S.ambient.push({ x: Math.random() * W, y: Math.random() * H, r: 0, life: 1, seed: Math.random() * 6.28, squash: 0.4 + Math.random() * 0.1 }); S.cool = 90 + (Math.random() * 90) | 0; }
        for (const a of S.ambient) { a.r += 0.9; a.life *= 0.992; organicRing(ctx, a.x, a.y, a.r, a.squash, a.seed, S.cols.ring, a.life * 0.34, 1.2); }
        S.ambient = S.ambient.filter((a) => a.life > 0.05).slice(-6);
      } else {
        organicRing(ctx, W * 0.5, H * 0.5, 60, 0.42, 1.0, S.cols.ring, 0.2, 1.4);
      }
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
