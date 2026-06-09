import { useReactiveField } from "./useReactiveField";

/**
 * TEAM / "the gardeners" hero — fireflies gathering. Gold motes drift and
 * twinkle across the field; when the pointer is present they converge toward it
 * (people coming together), then disperse back to their wander when it leaves.
 * Built on useReactiveField. Reduced-motion → a static scatter of motes.
 */

type Mote = { x: number; y: number; vx: number; vy: number; phase: number; sz: number };
type State = { motes: Mote[]; cols: { glow: string } };

export default function TeamFireflies({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State>({
    seed: ({ W, H, tok }) => {
      const motes: Mote[] = Array.from({ length: 24 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        phase: Math.random() * Math.PI * 2, sz: 1.4 + Math.random() * 1.4,
      }));
      return { motes, cols: { glow: tok("--gold", "#c9a24b") } };
    },
    draw: ({ ctx, W, H, t, pointer, reduce }, S) => {
      const drawMote = (m: Mote, twinkle: number) => {
        ctx.shadowColor = S.cols.glow;
        ctx.shadowBlur = 8 + twinkle * 6;
        ctx.fillStyle = S.cols.glow;
        ctx.globalAlpha = 0.5 + twinkle * 0.5;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      };

      for (const m of S.motes) {
        const twinkle = Math.sin(t * 3 + m.phase) * 0.5 + 0.5;
        if (!reduce) {
          // gentle wander
          m.vx += Math.sin(t * 1.2 + m.phase) * 0.01;
          m.vy += Math.cos(t * 1.05 + m.phase * 1.6) * 0.01;
          // gather toward the pointer when present
          if (pointer.active) {
            const dx = pointer.x - m.x, dy = pointer.y - m.y, d = Math.hypot(dx, dy);
            if (d > 1) { const f = Math.min(0.5, 60 / d) * 0.05; m.vx += (dx / d) * f * d * 0.02; m.vy += (dy / d) * f * d * 0.02; }
          }
          m.vx *= 0.95; m.vy *= 0.95;
          m.x += m.vx; m.y += m.vy;
          if (m.x < 0) m.x += W; if (m.x > W) m.x -= W;
          if (m.y < 0) m.y += H; if (m.y > H) m.y -= H;
        }
        drawMote(m, twinkle);
      }
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
