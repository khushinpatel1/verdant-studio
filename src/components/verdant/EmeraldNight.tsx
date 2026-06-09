import { useReactiveField } from "./useReactiveField";
import { hexToRgb, makeGlowSprite, rgba } from "./glow";

/**
 * EMERALD hero — the unreleased one, "growing in the dark." A near-black field of
 * dim emerald botanicals that are almost invisible at rest and glow up to life as
 * the cursor passes near, then sink back into shadow. Each frond carries a couple
 * of side-branches; drifting spore-glows wander and rise through. Glow is additive
 * ('screen' sprites), not shadowBlur — faster and more luminous. Built on
 * useReactiveField. Reduced-motion → a faint static frond field.
 */

type Branch = { f: number; dir: number; len: number };
type Frond = { x: number; rootY: number; h: number; lean: number; tips: number; glow: number; branches: Branch[] };
type Mote = { x: number; y: number; vx: number; vy: number; phase: number };
type State = { fronds: Frond[]; motes: Mote[]; stem: string; sprite: HTMLCanvasElement };

export default function EmeraldNight({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State>({
    trailMax: 18,
    seed: ({ W, H, tok }) => {
      const fronds: Frond[] = [];
      const GAP = 50;
      for (let x = GAP * 0.5; x < W; x += GAP) {
        const h = 60 + Math.random() * 90;
        const branches: Branch[] = Array.from({ length: 1 + ((Math.random() * 2) | 0) }, () => ({
          f: 0.32 + Math.random() * 0.5,            // fraction up the stem
          dir: Math.random() < 0.5 ? -1 : 1,
          len: 14 + Math.random() * 22,
        }));
        fronds.push({
          x: x + (Math.random() - 0.5) * GAP * 0.6,
          rootY: H * (0.6 + Math.random() * 0.45),
          h,
          lean: (Math.random() - 0.5) * 30,
          tips: 3 + ((Math.random() * 3) | 0),
          glow: 0,
          branches,
        });
      }
      const motes: Mote[] = Array.from({ length: 25 + ((Math.random() * 6) | 0) }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
      const glowRgb = hexToRgb(tok("--moss-300", "#9dbfa0"), [157, 191, 160]);
      return { fronds, motes, stem: tok("--ac", "#5fa777"), sprite: makeGlowSprite(glowRgb, 64) };
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
        // main stem
        ctx.beginPath();
        ctx.moveTo(fr.x, fr.rootY);
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.strokeStyle = S.stem;
        ctx.globalAlpha = 0.08 + fr.glow * 0.5;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        // side-branches off the main stem
        ctx.lineWidth = 1;
        for (const br of fr.branches) {
          const bx = fr.x + fr.lean * br.f, by = fr.rootY - fr.h * br.f;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(
            bx + br.dir * br.len * 0.5, by - br.len * 0.3,
            bx + br.dir * br.len, by - br.len * 0.7,
          );
          ctx.globalAlpha = 0.06 + fr.glow * 0.4;
          ctx.stroke();
        }
      }

      // --- additive luminous pass: glowing frond-tips + drifting spore-glows ---
      ctx.globalCompositeOperation = "screen";
      for (const fr of S.fronds) {
        for (let i = 1; i <= fr.tips; i++) {
          const f = i / (fr.tips + 1);
          const x = fr.x + fr.lean * f, y = fr.rootY - fr.h * f + Math.sin(t + i) * 2;
          const R = (3 + fr.glow * 9) * 1.6;
          ctx.globalAlpha = (0.1 + fr.glow * 0.75) * 0.6;
          ctx.drawImage(S.sprite, x - R, y - R, R * 2, R * 2);
        }
      }
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
        const R = 11;
        ctx.globalAlpha = (0.25 + tw * 0.5) * 0.6;
        ctx.drawImage(S.sprite, m.x - R, m.y - R, R * 2, R * 2);
      }
      // crisp mote cores
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = rgba(hexToRgb("#9dbfa0", [157, 191, 160]), 1);
      for (const m of S.motes) {
        const tw = Math.sin(t * 2.5 + m.phase) * 0.5 + 0.5;
        ctx.globalAlpha = 0.3 * (0.5 + tw * 0.5);
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
