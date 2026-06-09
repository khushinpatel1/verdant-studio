import { useReactiveField } from "./useReactiveField";

/**
 * EMERALD hero — the unreleased one, "growing in the dark." A near-black field
 * of dim emerald botanicals that are almost invisible at rest and glow up to
 * life as the cursor passes near, then sink back into shadow. Drifting spore-
 * glows wander through. Built on useReactiveField. Reduced-motion → a faint
 * static frond field.
 */

type Frond = { x: number; rootY: number; h: number; lean: number; tips: number; glow: number };
type Mote = { x: number; y: number; vx: number; vy: number; phase: number };
type State = { fronds: Frond[]; motes: Mote[]; cols: { stem: string; glow: string } };

export default function EmeraldNight({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State>({
    trailMax: 18,
    seed: ({ W, H, tok }) => {
      const fronds: Frond[] = [];
      const GAP = 50;
      for (let x = GAP * 0.5; x < W; x += GAP) {
        fronds.push({
          x: x + (Math.random() - 0.5) * GAP * 0.6,
          rootY: H * (0.6 + Math.random() * 0.45),
          h: 60 + Math.random() * 90,
          lean: (Math.random() - 0.5) * 30,
          tips: 3 + ((Math.random() * 3) | 0),
          glow: 0,
        });
      }
      const motes: Mote[] = Array.from({ length: 11 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
      return { fronds, motes, cols: { stem: tok("--ac", "#5fa777"), glow: tok("--moss-300", "#9dbfa0") } };
    },
    draw: ({ ctx, W, H, t, trail, pointer, reduce }, S) => {
      for (const fr of S.fronds) {
        // target glow from pointer + recent wake proximity
        let target = 0.06;
        if (pointer.active) {
          const d = Math.hypot(fr.x - pointer.x, fr.rootY - fr.h * 0.5 - pointer.y);
          if (d < 160) target += (1 - d / 160) * 0.9;
        }
        for (const m of trail) {
          const d = Math.hypot(fr.x - m.x, fr.rootY - fr.h * 0.5 - m.y);
          if (d < 140) target += (1 - d / 140) * 0.5 * m.life;
        }
        fr.glow += (Math.min(1, target) - fr.glow) * (reduce ? 1 : 0.09);

        const tipX = fr.x + fr.lean, tipY = fr.rootY - fr.h;
        const midX = fr.x + fr.lean * 0.4, midY = fr.rootY - fr.h * 0.55;
        // stem
        ctx.beginPath();
        ctx.moveTo(fr.x, fr.rootY);
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.strokeStyle = S.cols.stem;
        ctx.globalAlpha = 0.08 + fr.glow * 0.5;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        // glowing tips
        ctx.shadowColor = S.cols.glow;
        ctx.shadowBlur = 4 + fr.glow * 16;
        for (let i = 1; i <= fr.tips; i++) {
          const f = i / (fr.tips + 1);
          const x = fr.x + fr.lean * f, y = fr.rootY - fr.h * f + Math.sin(t + i) * 2;
          ctx.beginPath();
          ctx.fillStyle = S.cols.glow;
          ctx.globalAlpha = 0.1 + fr.glow * 0.8;
          ctx.arc(x, y, 1.6 + fr.glow * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // drifting spore-glows
      for (const m of S.motes) {
        if (!reduce) {
          m.vx += Math.sin(t * 1.1 + m.phase) * 0.008;
          m.vy += Math.cos(t * 0.9 + m.phase) * 0.008 - 0.004; // slight rise
          m.vx *= 0.96; m.vy *= 0.96;
          m.x += m.vx; m.y += m.vy;
          if (m.x < 0) m.x += W; if (m.x > W) m.x -= W;
          if (m.y < 0) m.y += H; if (m.y > H) m.y -= H;
        }
        const tw = Math.sin(t * 2.5 + m.phase) * 0.5 + 0.5;
        ctx.shadowColor = S.cols.glow; ctx.shadowBlur = 10;
        ctx.fillStyle = S.cols.glow;
        ctx.globalAlpha = 0.25 + tw * 0.5;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
