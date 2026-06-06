import { useEffect, useRef } from "react";

/**
 * VERDANT signature interaction — the raked sand garden (karesansui).
 *
 * A full-bleed canvas of parallel "rake" lines that bow into concentric rings
 * around a few fixed mossy stones — the dry-landscape garden. The pointer drags
 * a rake through the sand: a wake of recent positions each carves a lens into
 * the lines, then slowly fills back in. Still by default, alive under the hand.
 *
 * Token-driven (reads --moss/--sage/--cream off :root), honours reduced-motion
 * (renders the static field once, no wake), and if 2D canvas is unavailable it
 * simply draws nothing so the parent's background shows through. Never breaks a
 * page. This is the "how did they do that" moment, harvested into one component.
 */

type Stone = { x: number; y: number; r: number };

// fixed stones in normalized [0..1] space — an asymmetric, hand-placed cluster
const STONES: Stone[] = [
  { x: 0.74, y: 0.38, r: 0.072 },
  { x: 0.83, y: 0.52, r: 0.044 },
  { x: 0.22, y: 0.66, r: 0.058 },
  { x: 0.31, y: 0.74, r: 0.03 },
];

export default function SandGarden({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return; // no 2D context → parent background shows through

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const tok = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
    const C_LINE = tok("--moss", "#7a9e7e");
    const C_LINE2 = tok("--sage", "#c8d5b9");
    const C_STONE = tok("--green", "#2d5016");
    const C_STONE_HI = tok("--moss-300", "#9dbfa0");

    let W = 0, H = 0, dpr = 1;
    const GAP = 17;            // px between rake lines at dpr 1
    const STEP = 7;            // px between sampled points along a line
    let lines: number[] = [];  // base y of each rake line

    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lines = [];
      for (let y = GAP * 0.5; y < H; y += GAP) lines.push(y);
    };

    // pointer rake trail: recent positions, each ages out
    type Mark = { x: number; y: number; life: number };
    const trail: Mark[] = [];
    let px = -1, py = -1, hasPointer = false;
    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > W || y > H) { hasPointer = false; return; }
      // seed a mark only when the rake has travelled enough — carves a groove
      if (!hasPointer || Math.hypot(x - px, y - py) > 9) {
        trail.push({ x, y, life: 1 });
        if (trail.length > 22) trail.shift();
      }
      px = x; py = y; hasPointer = true;
    };
    const onLeave = () => { hasPointer = false; };

    // vertical displacement of a line-point from the fixed stones (concentric rings)
    const stoneField = (x: number, y: number) => {
      let off = 0;
      for (const s of stonesPx) {
        const dx = x - s.x, dy = y - s.y;
        const d = Math.hypot(dx, dy);
        if (d < s.r) return null; // inside a stone — skip the point
        const infl = s.r * 4.2;
        if (d < infl) {
          const f = (s.r * s.r) / (d * d + 40);
          off += Math.sign(dy || 1) * f * 26; // push line away → rings
        }
      }
      return off;
    };

    let stonesPx: Stone[] = [];
    const recomputeStones = () => {
      stonesPx = STONES.map((s) => ({ x: s.x * W, y: s.y * H, r: s.r * Math.min(W, H) }));
    };

    let t = 0, raf = 0;
    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, W, H);

      // age the rake wake
      for (const m of trail) m.life *= 0.965;
      while (trail.length && trail[0].life < 0.04) trail.shift();

      // draw rake lines
      for (let li = 0; li < lines.length; li++) {
        const baseY = lines[li];
        ctx.beginPath();
        let started = false;
        // alternate line weight/tone subtly for hand-raked texture
        const pale = li % 2 === 0;
        ctx.strokeStyle = pale ? C_LINE2 : C_LINE;
        ctx.globalAlpha = pale ? 0.28 : 0.4;
        ctx.lineWidth = 1;

        for (let x = 0; x <= W; x += STEP) {
          // ambient breathing — life moving slowly underneath
          let y = baseY + Math.sin(x * 0.012 + t + li * 0.35) * 1.6;
          const sf = stoneField(x, y);
          if (sf === null) { started = false; continue; } // hole where a stone sits
          y += sf;
          // pointer rake wake — each recent mark carves a soft lens
          for (const m of trail) {
            const dx = x - m.x, dy = baseY - m.y;
            const d2 = dx * dx + dy * dy;
            const R = 78;
            if (d2 < R * R) {
              const f = (1 - Math.sqrt(d2) / R);
              y += Math.sign(dy || 1) * f * f * 22 * m.life;
            }
          }
          if (!started) { ctx.moveTo(x, y); started = true; }
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // draw stones — soft mossy river stones with a moonlit highlight
      ctx.globalAlpha = 1;
      for (const s of stonesPx) {
        const g = ctx.createRadialGradient(
          s.x - s.r * 0.35, s.y - s.r * 0.4, s.r * 0.1,
          s.x, s.y, s.r
        );
        g.addColorStop(0, C_STONE_HI);
        g.addColorStop(0.55, C_STONE);
        g.addColorStop(1, "#142b0c");
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.shadowColor = "rgba(13,31,7,0.35)";
        ctx.shadowBlur = s.r * 0.6; ctx.shadowOffsetY = s.r * 0.18;
        ctx.fill();
        ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const boot = () => { resize(); recomputeStones(); draw(); };
    boot();
    const onResize = () => { resize(); recomputeStones(); if (reduce) draw(); };
    window.addEventListener("resize", onResize);
    if (!reduce) {
      window.addEventListener("mousemove", onMove);
      cv.addEventListener("mouseleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      cv.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
