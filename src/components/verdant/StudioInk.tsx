import { useReactiveField } from "./useReactiveField";

/**
 * HOME / studio hero — living ink (sumi-e). The studio as a place where things
 * are drawn into being: the cursor lays down ink that grows branching tendrils,
 * which mature and slowly fade. A few faint resting strokes keep the field alive
 * when still. Built on useReactiveField. Reduced-motion → the resting strokes
 * only, no growth.
 */

type Stroke = { pts: { x: number; y: number }[]; ang: number; len: number; maxLen: number; w: number; life: number; growing: boolean };
type State = { rest: Stroke[]; live: Stroke[]; cool: number; cols: { ink: string; soft: string; gold: string } };

function grownStroke(x: number, y: number, ang: number, steps: number, w: number): Stroke {
  const pts = [{ x, y }];
  let a = ang;
  for (let i = 0; i < steps; i++) {
    a += Math.sin(i * 0.5) * 0.18;
    const p = pts[pts.length - 1];
    pts.push({ x: p.x + Math.cos(a) * 6, y: p.y + Math.sin(a) * 6 });
  }
  return { pts, ang: a, len: steps, maxLen: steps, w, life: 1, growing: false };
}

export default function StudioInk({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State>({
    trailMax: 20,
    seed: ({ W, H, tok }) => {
      const rest: Stroke[] = [];
      for (let i = 0; i < 9; i++) {
        rest.push(grownStroke(W * (0.12 + Math.random() * 0.76), H * (0.15 + Math.random() * 0.7),
          Math.random() * Math.PI * 2, 8 + (Math.random() * 10) | 0, 1.1 + Math.random()));
      }
      return { rest, live: [], cool: 0, cols: { ink: tok("--green", "#2d5016"), soft: tok("--moss", "#7a9e7e"), gold: tok("--gold", "#c9a24b") } };
    },
    draw: ({ ctx, t, trail, pointer, reduce }, S) => {
      const renderStroke = (s: Stroke, baseAlpha: number) => {
        if (s.pts.length < 2) return;
        for (let i = 1; i < s.pts.length; i++) {
          const taper = 1 - i / s.pts.length;
          ctx.beginPath();
          ctx.moveTo(s.pts[i - 1].x, s.pts[i - 1].y);
          ctx.lineTo(s.pts[i].x, s.pts[i].y);
          ctx.strokeStyle = S.cols.ink;
          ctx.globalAlpha = baseAlpha * s.life * (0.4 + taper * 0.6);
          ctx.lineWidth = s.w * (0.4 + taper);
          ctx.lineCap = "round";
          ctx.stroke();
        }
        // a small wet-ink bud at the growing tip
        const tip = s.pts[s.pts.length - 1];
        ctx.globalAlpha = baseAlpha * s.life * 0.7;
        ctx.fillStyle = s.growing ? S.cols.gold : S.cols.soft;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, s.w * 0.9, 0, Math.PI * 2);
        ctx.fill();
      };

      // resting strokes — faint, always present
      for (const s of S.rest) renderStroke(s, 0.22);

      if (!reduce) {
        // spawn from the pointer wake
        S.cool -= 1;
        if (pointer.active && S.cool <= 0 && S.live.length < 46) {
          const seed = trail[trail.length - 1] || { x: pointer.x, y: pointer.y };
          S.live.push({ pts: [{ x: seed.x, y: seed.y }], ang: Math.random() * Math.PI * 2, len: 0, maxLen: 18 + (Math.random() * 26) | 0, w: 1.3 + Math.random() * 1.2, life: 1, growing: true });
          S.cool = 3;
        }
        // grow / age live strokes
        for (const s of S.live) {
          if (s.growing && s.len < s.maxLen) {
            s.ang += Math.sin(s.len * 0.5 + t) * 0.2;
            const p = s.pts[s.pts.length - 1];
            s.pts.push({ x: p.x + Math.cos(s.ang) * 6, y: p.y + Math.sin(s.ang) * 6 });
            s.len++;
            // occasional branch
            if (s.len > 4 && Math.random() < 0.06 && S.live.length < 46) {
              S.live.push({ pts: [{ x: p.x, y: p.y }], ang: s.ang + (Math.random() < 0.5 ? 0.7 : -0.7), len: 0, maxLen: (s.maxLen * 0.6) | 0, w: s.w * 0.8, life: 1, growing: true });
            }
          } else {
            s.growing = false;
            s.life *= 0.985;
          }
          renderStroke(s, 0.5);
        }
        S.live = S.live.filter((s) => s.life > 0.05);
      }
    },
  });

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
