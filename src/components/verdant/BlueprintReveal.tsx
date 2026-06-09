import { useEffect, useRef } from "react";

/**
 * HOME hero — watercolor → self-writing blueprint.
 *
 * The metaphor: a studio drawing the very site you're looking at into being. A
 * watercolor wash blooms down the field (on scroll) and follows the cursor (a
 * brush you can move). In the WAKE of that wash, the precise blueprint of this
 * site's own structure WRITES ITSELF — blocks, dimension lines, ticks and labels
 * draw on with a stroke-dashoffset reveal, glowing in line-ink as the brush edge
 * passes, then settling. Organic gesture summoning exact intent, line by line.
 *
 * Compositing: paper → watercolor blooms → `source-atop` blueprint, so linework
 * only exists inside the painted area; the self-writing draw-fraction adds the
 * "being drawn" feel on top of that clip. The static measurement grid is
 * pre-rendered once to an offscreen canvas (one drawImage/frame instead of
 * ~3,500 line ops). Reduced-motion → revealed at a calm fixed coverage.
 */

type Bloom = { x: number; y: number; r: number; target: number; seed: number; tone: number };
type Block = { bx: number; by: number; bw: number; bh: number; ax: number; ay: number; label: string; written: number; glow: number };
type Circle = { cx: number; cy: number; r: number; dir: number; written: number; glow: number };

const PAPER = "#f4efe6";
const WASH = ["#7a9e7e", "#9cb79a", "#6f97a8"];
const LINE = "#2f5d74";
const LINE_SOFT = "#9bbccb";

function makeBlooms(W: number, H: number): Bloom[] {
  const out: Bloom[] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    out.push({
      x: W * (0.32 + Math.sin(i * 1.7) * 0.16 + (Math.random() - 0.5) * 0.06),
      y: H * (0.08 + t * 0.86),
      r: 0,
      target: Math.min(W, H) * (0.16 + Math.random() * 0.12),
      seed: Math.random() * 6.28,
      tone: i % WASH.length,
    });
  }
  return out;
}

function paintBloom(ctx: CanvasRenderingContext2D, b: Bloom, alpha: number) {
  if (b.r < 1) return;
  const layers = 3;
  for (let L = 0; L < layers; L++) {
    const rr = b.r * (1 - L * 0.22);
    const g = ctx.createRadialGradient(b.x, b.y, rr * 0.15, b.x, b.y, rr);
    const col = WASH[(b.tone + L) % WASH.length];
    g.addColorStop(0, col);
    g.addColorStop(1, col + "00");
    ctx.fillStyle = g;
    ctx.globalAlpha = alpha * (0.5 - L * 0.12);
    ctx.beginPath();
    const STEP = 0.3;
    for (let a = 0; a <= Math.PI * 2 + STEP; a += STEP) {
      const k = 1 + Math.sin(a * 3 + b.seed + L) * 0.08 + Math.sin(a * 6 - b.seed) * 0.05;
      const px = b.x + Math.cos(a) * rr * k;
      const py = b.y + Math.sin(a) * rr * k * 0.92;
      a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// stroke a fraction of a rectangle's perimeter (clockwise from top-left) via line-dash
function writeRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frac: number) {
  const perim = 2 * (w + h);
  ctx.setLineDash([perim]);
  ctx.lineDashOffset = perim * (1 - Math.min(1, frac));
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}
function writeLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, frac: number) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  ctx.setLineDash([len]);
  ctx.lineDashOffset = len * (1 - Math.min(1, frac));
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]);
}

export default function BlueprintReveal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    let blooms: Bloom[] = [];
    let blocks: Block[] = [];
    let circles: Circle[] = [];
    let cartouche = { ax: 0, ay: 0, written: 0, glow: 0 };
    let grid: HTMLCanvasElement | null = null;
    let raf = 0;
    let t0 = 0, lastTs = 0, lastP = -1;

    // pointer-driven brush bloom (a wash you can move) + its target
    const brush = { x: 0, y: 0, r: 0, active: false };

    const buildGrid = () => {
      const g = document.createElement("canvas");
      g.width = Math.max(1, Math.round(W * dpr)); g.height = Math.max(1, Math.round(H * dpr));
      const gc = g.getContext("2d")!;
      gc.scale(dpr, dpr);
      gc.strokeStyle = LINE_SOFT; gc.globalAlpha = 0.35; gc.lineWidth = 0.5;
      const G = 38;
      for (let x = 0; x <= W; x += G) { gc.beginPath(); gc.moveTo(x, 0); gc.lineTo(x, H); gc.stroke(); }
      for (let y = 0; y <= H; y += G) { gc.beginPath(); gc.moveTo(0, y); gc.lineTo(W, y); gc.stroke(); }
      grid = g;
    };

    const layout = () => {
      const cx = W * 0.32, bw = W * 0.42, bx = cx - bw * 0.18;
      const defs = [
        { y: 0.10, h: 0.16, label: "HERO" },
        { y: 0.30, h: 0.12, label: "MANIFESTO" },
        { y: 0.46, h: 0.14, label: "WORK · GARDEN" },
        { y: 0.64, h: 0.10, label: "ETHOS" },
        { y: 0.78, h: 0.12, label: "CTA" },
      ];
      blocks = defs.map((d) => {
        const by = H * d.y, bh = H * d.h;
        return { bx, by, bw, bh, ax: bx + bw * 0.5, ay: by + bh * 0.5, label: d.label, written: 0, glow: 0 };
      });
      circles = [
        { cx: cx + bw * 0.3, cy: H * 0.4, r: 60, dir: 1, written: 0, glow: 0 },
        { cx: cx - bw * 0.05, cy: H * 0.7, r: 44, dir: -1, written: 0, glow: 0 },
      ];
      cartouche = { ax: W - 120, ay: H - 45, written: 0, glow: 0 };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      blooms = makeBlooms(W, H);
      layout();
      buildGrid();
    };

    const progress = () => {
      if (reduce) return 0.7;
      const y = window.scrollY || 0;
      return Math.max(0, Math.min(1, y / (window.innerHeight * 0.9)));
    };

    // is point (x,y) inside the painted wash (scroll blooms or the brush)?
    const inWash = (x: number, y: number) => {
      if (brush.active && brush.r > 4 && Math.hypot(x - brush.x, y - brush.y) < brush.r * 0.92) return true;
      for (const b of blooms) { if (b.r > 4 && Math.hypot(x - b.x, y - b.y) < b.r * 0.9) return true; }
      return false;
    };

    // advance one element's self-writing + glow toward the brush/wash state
    const advance = (e: { ax: number; ay: number; written: number; glow: number }) => {
      const near = brush.active ? Math.hypot(e.ax - brush.x, e.ay - brush.y) < 150 : false;
      const covered = inWash(e.ax, e.ay);
      if (reduce) { e.written = covered ? 1 : 0; e.glow = 0; return; }
      if (covered || near) e.written = Math.min(1, e.written + (near ? 0.06 : 0.03));
      const glowT = near ? 1 : (covered && e.written < 0.98 ? 0.5 : 0);
      e.glow += (glowT - e.glow) * 0.12;
    };

    const drawBlueprint = (t: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";

      // pre-rendered grid (one drawImage instead of ~3,500 line ops/frame)
      if (grid) { ctx.globalAlpha = 1; ctx.drawImage(grid, 0, 0, W, H); }

      ctx.font = "11px 'Fragment Mono', monospace";
      ctx.lineJoin = "miter";

      for (const blk of blocks) {
        advance(blk);
        if (blk.written < 0.01 && blk.glow < 0.01) continue;
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = LINE;
        ctx.shadowColor = LINE; ctx.shadowBlur = blk.glow * 16;
        ctx.globalAlpha = 0.85 * Math.min(1, blk.written * 2);
        writeRect(ctx, blk.bx, blk.by, blk.bw, blk.bh, blk.written);
        ctx.shadowBlur = 0;
        // corner ticks once the outline is mostly written
        if (blk.written > 0.55) {
          const tk = Math.min(1, (blk.written - 0.55) / 0.3);
          ctx.globalAlpha = 0.85 * tk;
          ctx.beginPath();
          ([[blk.bx, blk.by], [blk.bx + blk.bw, blk.by], [blk.bx, blk.by + blk.bh], [blk.bx + blk.bw, blk.by + blk.bh]] as const)
            .forEach(([px, py]) => { ctx.moveTo(px - 4, py); ctx.lineTo(px + 4, py); ctx.moveTo(px, py - 4); ctx.lineTo(px, py + 4); });
          ctx.stroke();
          // dimension line + label, written/faded in behind the brush
          ctx.globalAlpha = 0.7 * tk;
          writeLine(ctx, blk.bx + blk.bw + 10, blk.by, blk.bx + blk.bw + 10, blk.by + blk.bh, tk);
          ctx.fillStyle = LINE; ctx.globalAlpha = 0.85 * tk;
          ctx.fillText(blk.label, blk.bx + 8, blk.by + 16);
        }
      }

      // construction circles, each with its own sweep hand
      ctx.lineWidth = 1;
      for (const c of circles) {
        advance(c);
        if (c.written < 0.01 && c.glow < 0.01) continue;
        ctx.strokeStyle = LINE;
        ctx.shadowColor = LINE; ctx.shadowBlur = c.glow * 14;
        ctx.globalAlpha = 0.5 * Math.min(1, c.written * 2);
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, c.r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, c.written));
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (c.written > 0.9) {
          const ang = t * 0.4 * c.dir;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.moveTo(c.cx, c.cy);
          ctx.lineTo(c.cx + Math.cos(ang) * c.r, c.cy + Math.sin(ang) * c.r);
          ctx.stroke();
        }
      }

      // title block (architect's cartouche), bottom-right
      advance(cartouche);
      if (cartouche.written > 0.01 || cartouche.glow > 0.01) {
        const cw = cartouche.written;
        ctx.strokeStyle = LINE; ctx.lineWidth = 1.3;
        ctx.shadowColor = LINE; ctx.shadowBlur = cartouche.glow * 14;
        ctx.globalAlpha = 0.8 * Math.min(1, cw * 2);
        writeRect(ctx, W - 220, H - 70, 200, 50, cw);
        ctx.shadowBlur = 0;
        if (cw > 0.6) {
          const tk = Math.min(1, (cw - 0.6) / 0.3);
          ctx.fillStyle = LINE; ctx.globalAlpha = 0.85 * tk;
          ctx.fillText("VERDANT — fig. 01", W - 210, H - 48);
          ctx.fillText("studio drawing — scale 1:1", W - 210, H - 30);
        }
      }

      ctx.restore();
    };

    const frame = (ts: number) => {
      if (!t0) { t0 = ts; lastTs = ts; }
      const p = progress();
      const hot = brush.active || Math.abs(p - lastP) >= 0.001;
      if (!hot && ts - lastTs < 32) { raf = requestAnimationFrame(frame); return; }
      lastTs = ts; lastP = p;
      const t = (ts - t0) / 1000;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);

      // scroll-driven blooms travel down the page
      blooms.forEach((b, i) => {
        const due = Math.max(0, Math.min(1, (p - i / blooms.length) * 2.2 + 0.15));
        const goal = b.target * due;
        b.r += (goal - b.r) * 0.08;
        paintBloom(ctx, b, 0.9);
      });

      // pointer brush — a wash blob that follows the cursor and paints
      if (brush.active) { brush.r += (Math.min(W, H) * 0.13 - brush.r) * 0.12; paintBloom(ctx, { x: brush.x, y: brush.y, r: brush.r, target: 0, seed: 2.1, tone: 1 }, 0.85); }
      else if (brush.r > 1) { brush.r *= 0.9; if (brush.r > 1) paintBloom(ctx, { x: brush.x, y: brush.y, r: brush.r, target: 0, seed: 2.1, tone: 1 }, 0.7); }

      drawBlueprint(t);

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const setBrush = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      const x = cx - r.left, y = cy - r.top;
      if (x < 0 || y < 0 || x > W || y > H) { brush.active = false; return; }
      brush.x = x; brush.y = y; brush.active = true;
    };
    const onMove = (e: MouseEvent) => setBrush(e.clientX, e.clientY);
    const onLeave = () => { brush.active = false; };
    const onTouch = (e: TouchEvent) => { const tch = e.changedTouches[0]; if (tch) setBrush(tch.clientX, tch.clientY); };
    const onTouchEnd = () => { brush.active = false; };

    const onHide = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; lastTs = 0; }
      else if (!reduce && !raf) raf = requestAnimationFrame(frame);
    };
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onHide);
    if (!reduce) {
      window.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
      canvas.addEventListener("touchstart", onTouch, { passive: true });
      canvas.addEventListener("touchmove", onTouch, { passive: true });
      canvas.addEventListener("touchend", onTouchEnd);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
