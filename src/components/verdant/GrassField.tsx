import { useEffect, useRef } from "react";

/**
 * VERDANT — the hero's living signature. A procedural field of grass that GROWS
 * up from the baseline on load (eased, staggered left→right), sways in a slow
 * layered wind, and bends away from the pointer. Living greens on paper; a few
 * blades carry a single gold seed-head — the one accent. The cursor stays quiet;
 * the field is what reacts. Reduced-motion → a still, fully-grown field, no loop.
 * Coarse pointer (touch) → grows + sways, no pointer bend.
 *
 * Not an image, not a one-prompt gradient: it's the compositor running, so it
 * scales to any width and is never the same twice.
 */

const C_BACK = [0x4a, 0x7a, 0x28]; // lighter green, far blades
const C_FRONT = [0x16, 0x30, 0x0c]; // near-forest, close blades
const GOLD = "#c2913c";

function mix(a: number[], b: number[], t: number) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Blade = {
  x: number; depth: number; rootY: number; h: number; w: number;
  lean: number; phase: number; speed: number; amp: number;
  delay: number; seed: boolean;
};

export default function GrassField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let blades: Blade[] = [];
    let W = 0, H = 0, dpr = 1;
    let raf = 0;
    const t0 = performance.now();

    // pointer (smoothed), in CSS px
    let px = -9999, py = -9999, sx = -9999, sy = -9999;

    function build() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density scales with width; capped for perf
      const count = Math.max(60, Math.min(240, Math.round(W / 8)));
      const baseBack = H * 0.66;  // far blades root higher (depth illusion)
      const baseFront = H * 1.02; // near blades root just past the bottom edge
      blades = Array.from({ length: count }, (_, i) => {
        const depth = Math.pow(Math.random(), 0.7); // bias toward fewer tall front blades
        const rootY = baseBack + (baseFront - baseBack) * depth;
        const x = Math.random() * W;
        return {
          x, depth, rootY,
          h: (H * 0.16 + H * 0.30 * depth) * (0.7 + Math.random() * 0.6),
          w: 2 + depth * 6,
          lean: (Math.random() - 0.5) * 26,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.5,
          amp: (4 + depth * 14) * (0.6 + Math.random() * 0.8),
          delay: (x / W) * 0.45 + Math.random() * 0.35, // grow left→right, jittered
          seed: Math.random() < 0.05, // ~5% carry a gold seed-head
        };
      });
      blades.sort((a, b) => a.depth - b.depth); // far drawn first
    }

    function drawBlade(b: Blade, grow: number, time: number) {
      const gust = Math.sin(time * 0.0004 + b.x * 0.004) * 0.5 + 0.5;
      const sway = reduce ? 0
        : Math.sin(time * 0.001 * b.speed + b.phase) * b.amp * (0.6 + gust * 0.8);

      // pointer push: blades bend AWAY from the cursor, falloff over a radius
      let push = 0;
      if (!coarse && !reduce && sx > -9000) {
        const dx = b.x - sx;
        const dy = b.rootY - b.h * 0.5 - sy;
        const dist = Math.hypot(dx, dy);
        const R = 150;
        if (dist < R) {
          const f = (1 - dist / R);
          push = (dx >= 0 ? 1 : -1) * f * f * 46;
        }
      }

      const g = easeOut(grow);
      const tipH = b.h * g;
      const bend = b.lean + sway + push;
      const baseY = b.rootY;
      const tipX = b.x + bend;
      const tipY = baseY - tipH;
      const half = (b.w * g) / 2;
      const midY = baseY - tipH * 0.5;

      ctx.beginPath();
      ctx.moveTo(b.x - half, baseY);
      ctx.quadraticCurveTo(b.x - half * 0.4 + bend * 0.45, midY, tipX, tipY);
      ctx.quadraticCurveTo(b.x + half * 0.4 + bend * 0.55, midY, b.x + half, baseY);
      ctx.closePath();
      ctx.fillStyle = mix(C_BACK, C_FRONT, b.depth);
      ctx.globalAlpha = 0.45 + b.depth * 0.5;
      ctx.fill();

      if (b.seed && g > 0.85) {
        ctx.globalAlpha = (g - 0.85) / 0.15;
        ctx.fillStyle = GOLD;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 1.5 + b.depth * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function frame(now: number) {
      // smooth the pointer
      sx += (px - sx) * 0.12;
      sy += (py - sy) * 0.12;
      ctx.clearRect(0, 0, W, H);
      const elapsed = (now - t0) / 1000;
      for (const b of blades) {
        const grow = reduce ? 1 : Math.max(0, Math.min(1, (elapsed - b.delay) / 1.3));
        drawBlade(b, grow, now);
      }
      raf = requestAnimationFrame(frame);
    }

    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      for (const b of blades) drawBlade(b, 1, 0);
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left; py = e.clientY - rect.top;
    };
    const onLeave = () => { px = -9999; py = -9999; };
    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!reduce && !raf) raf = requestAnimationFrame(frame);
    };

    build();
    if (reduce) {
      drawStatic();
    } else {
      if (!coarse) {
        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseleave", onLeave);
      }
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => { build(); if (reduce) drawStatic(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="vh-hero-canvas" aria-hidden="true" />;
}
