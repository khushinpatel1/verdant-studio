import { useReactiveField } from "./useReactiveField";
import { hexToRgb, makeGlowSprite, rgba } from "./glow";

/**
 * TEAM / "the gardeners" hero — fireflies gathering, in three depth tiers. A deep
 * field of small dim slow motes, a mid layer, and a few large bright ones up
 * front, so the swarm reads with real depth. Gold motes drift and twinkle; when
 * the pointer is present they converge toward it (people coming together), then
 * disperse. A soft repulsion keeps them from knotting into one blob, and each
 * carries a short ghost-trail of its last positions. Glow is additive ('screen'
 * sprites), not shadowBlur — faster and more luminous. Reduced-motion → a static
 * scatter. Built on useReactiveField.
 */

type Mote = {
  x: number; y: number; vx: number; vy: number; phase: number;
  sz: number; bright: number; speed: number;
  ghost: { x: number; y: number }[];
};
type State = { motes: Mote[]; sprite: HTMLCanvasElement; col: string };

// three tiers: [count, size-min, size-range, brightness, speed]
const TIERS: [number, number, number, number, number][] = [
  [36, 1.0, 0.7, 0.42, 0.45], // background — small, dim, slow
  [24, 1.6, 0.9, 0.72, 0.85], // mid
  [12, 2.6, 1.1, 1.0, 1.15],  // foreground — large, bright, lively
];
const REPULSE = 30; // px — soft personal space so the swarm never knots
const GHOST = 4;    // trail positions per mote

export default function TeamFireflies({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State>({
    seed: ({ W, H, tok }) => {
      const col = tok("--gold", "#c9a24b");
      const rgb = hexToRgb(col, [201, 162, 75]);
      const motes: Mote[] = [];
      for (const [count, szMin, szRange, bright, speed] of TIERS) {
        for (let i = 0; i < count; i++) {
          const x = Math.random() * W, y = Math.random() * H;
          motes.push({
            x, y,
            vx: (Math.random() - 0.5) * 0.5 * speed, vy: (Math.random() - 0.5) * 0.5 * speed,
            phase: Math.random() * Math.PI * 2,
            sz: szMin + Math.random() * szRange, bright, speed,
            ghost: Array.from({ length: GHOST }, () => ({ x, y })),
          });
        }
      }
      // dim tiers behind, bright tiers in front
      motes.sort((a, b) => a.bright - b.bright);
      return { motes, sprite: makeGlowSprite(rgb, 64), col: rgba(rgb, 1) };
    },
    draw: ({ ctx, W, H, t, pointer, reduce }, S) => {
      const motes = S.motes;

      if (!reduce) {
        // soft pairwise repulsion — keep motes from clustering into one knot
        for (let i = 0; i < motes.length; i++) {
          const a = motes[i];
          for (let j = i + 1; j < motes.length; j++) {
            const b = motes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < REPULSE * REPULSE && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = (1 - d / REPULSE) * 0.06;
              const ux = dx / d, uy = dy / d;
              a.vx += ux * f; a.vy += uy * f;
              b.vx -= ux * f; b.vy -= uy * f;
            }
          }
        }
        for (const m of motes) {
          // gentle wander, scaled by tier speed
          m.vx += Math.sin(t * 1.2 + m.phase) * 0.01 * m.speed;
          m.vy += Math.cos(t * 1.05 + m.phase * 1.6) * 0.01 * m.speed;
          // gather toward the pointer when present (foreground reacts most)
          if (pointer.active) {
            const dx = pointer.x - m.x, dy = pointer.y - m.y, d = Math.hypot(dx, dy);
            if (d > 1) { const f = Math.min(0.5, 60 / d) * 0.05 * m.speed; m.vx += (dx / d) * f * d * 0.02; m.vy += (dy / d) * f * d * 0.02; }
          }
          m.vx *= 0.95; m.vy *= 0.95;
          m.x += m.vx; m.y += m.vy;
          if (m.x < 0) m.x += W; if (m.x > W) m.x -= W;
          if (m.y < 0) m.y += H; if (m.y > H) m.y -= H;
          // shift ghost trail (skip wrap jumps so trails don't streak across the field)
          const last = m.ghost[m.ghost.length - 1];
          if (Math.hypot(m.x - last.x, m.y - last.y) < 20) { m.ghost.push({ x: m.x, y: m.y }); if (m.ghost.length > GHOST) m.ghost.shift(); }
          else m.ghost = Array.from({ length: GHOST }, () => ({ x: m.x, y: m.y }));
        }
      }

      // --- additive luminous pass ---
      ctx.globalCompositeOperation = "screen";
      for (const m of motes) {
        const twinkle = Math.sin(t * 3 + m.phase) * 0.5 + 0.5;
        const lum = m.bright * (0.55 + twinkle * 0.45);
        // ghost trail — fading echoes of recent positions
        for (let k = 0; k < m.ghost.length - 1; k++) {
          const gp = m.ghost[k];
          const fade = (k / GHOST) * 0.35 * lum;
          const r = m.sz * (2.2 + k * 0.3);
          ctx.globalAlpha = fade;
          ctx.drawImage(S.sprite, gp.x - r, gp.y - r, r * 2, r * 2);
        }
        // glow halo (screen layer ~60%)
        const R = m.sz * 7;
        ctx.globalAlpha = 0.6 * lum;
        ctx.drawImage(S.sprite, m.x - R, m.y - R, R * 2, R * 2);
      }
      // crisp cores (base layer ~30%, source-over)
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = S.col;
      for (const m of motes) {
        const twinkle = Math.sin(t * 3 + m.phase) * 0.5 + 0.5;
        ctx.globalAlpha = 0.3 * m.bright * (0.6 + twinkle * 0.4);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
