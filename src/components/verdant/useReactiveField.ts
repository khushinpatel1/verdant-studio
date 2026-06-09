import { useEffect, useRef } from "react";

/**
 * VERDANT reactive-field base — the shared skeleton behind every page's hero
 * canvas. Owns the parts that must feel identical across the site (so the
 * "interaction, movement and flow" reads as one language): DPR/resize, the
 * pointer-wake `trail` of aging marks, token reads off :root, reduced-motion +
 * coarse-pointer guards, the rAF loop, and teardown. Each hero supplies only a
 * `seed` (build motif state on boot/resize) and a `draw` (paint one frame).
 *
 * Extracted from SandGarden/GrowingGarden, which shared this exact structure.
 */

export type Mark = { x: number; y: number; life: number };
export type Pointer = { x: number; y: number; active: boolean };
export type Tok = (name: string, fallback: string) => string;

export type SeedEnv = { W: number; H: number; tok: Tok; reduce: boolean };
export type DrawEnv = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  t: number;
  trail: Mark[];
  pointer: Pointer;
  tok: Tok;
  reduce: boolean;
};

export function useReactiveField<S>(opts: {
  seed: (env: SeedEnv) => S;
  draw: (env: DrawEnv, state: S) => void;
  trailMax?: number;
  trailDecay?: number;
  trailMinDist?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // keep latest callbacks without re-running the effect
  const ref = useRef(opts);
  ref.current = opts;

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return; // no 2D context → parent background shows through

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const tok: Tok = (n, f) => css.getPropertyValue(n).trim() || f;

    const trailMax = ref.current.trailMax ?? 20;
    const trailDecay = ref.current.trailDecay ?? 0.96;
    const trailMinDist = ref.current.trailMinDist ?? 10;

    let W = 0, H = 0, dpr = 1;
    let state: S;
    const trail: Mark[] = [];
    const pointer: Pointer = { x: -1, y: -1, active: false };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = ref.current.seed({ W, H, tok, reduce });
    };

    let px = -1, py = -1;
    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > W || y > H) { pointer.active = false; return; }
      if (!pointer.active || Math.hypot(x - px, y - py) > trailMinDist) {
        trail.push({ x, y, life: 1 });
        if (trail.length > trailMax) trail.shift();
      }
      px = x; py = y; pointer.x = x; pointer.y = y; pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };

    let t = 0, raf = 0;
    const frame = () => {
      t += 0.006;
      for (const m of trail) m.life *= trailDecay;
      while (trail.length && trail[0].life < 0.04) trail.shift();
      ctx.clearRect(0, 0, W, H);
      ref.current.draw({ ctx, W, H, t, trail, pointer, tok, reduce }, state);
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    resize();
    frame();

    const onResize = () => { resize(); if (reduce) frame(); };
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

  return canvas;
}
