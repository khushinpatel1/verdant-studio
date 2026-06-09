import { useReactiveField } from "./useReactiveField";

/**
 * ETHOS hero — still water. A calm reflective surface with a faint resting
 * shimmer; the pointer sends out clean concentric ripples, and an occasional
 * ambient drop keeps it alive when still. Honest, transparent, nothing murky —
 * the privacy ethos made visual. Built on useReactiveField. Reduced-motion →
 * the static surface lines only.
 */

type Ripple = { x: number; y: number; r: number; life: number };
type State = { lines: number[]; ambient: Ripple[]; cool: number; cols: { line: string; ring: string } };

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
        ambient: [{ x: W * 0.5, y: H * 0.5, r: 0, life: 1 }],
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

      const drawRing = (x: number, y: number, r: number, alpha: number) => {
        ctx.beginPath();
        ctx.strokeStyle = S.cols.ring;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.4;
        ctx.ellipse(x, y, r, r * 0.42, 0, 0, Math.PI * 2); // perspective squash → a surface
        ctx.stroke();
      };

      // pointer wake → expanding ripples
      for (const m of trail) {
        const r = (1 - m.life) * 120 + 6;
        drawRing(m.x, m.y, r, m.life * 0.5);
        if (r > 26) drawRing(m.x, m.y, r - 20, m.life * 0.3);
      }

      // ambient drops so the pond is never dead
      if (!reduce) {
        S.cool -= 1;
        if (S.cool <= 0) { S.ambient.push({ x: Math.random() * W, y: Math.random() * H, r: 0, life: 1 }); S.cool = 90 + (Math.random() * 90) | 0; }
        for (const a of S.ambient) { a.r += 0.9; a.life *= 0.992; drawRing(a.x, a.y, a.r, a.life * 0.34); }
        S.ambient = S.ambient.filter((a) => a.life > 0.05).slice(-6);
      } else {
        drawRing(W * 0.5, H * 0.5, 60, 0.2);
      }
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
