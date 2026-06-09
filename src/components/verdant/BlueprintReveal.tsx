import { useEffect, useRef } from "react";

/**
 * HOME hero — watercolor → blueprint reveal.
 *
 * The metaphor: a studio drawing the very site you're looking at into being.
 * As you scroll, an organic watercolor brushstroke blooms down the field; where
 * the wash spreads, it reveals a precise mechanical BLUEPRINT of this site's own
 * structure underneath (hero / manifesto / work / ethos / cta blocks, dimension
 * ticks, annotations). Organic gesture unveiling exact intent — the building
 * process, made literal.
 *
 * Compositing: fill paper → paint watercolor blooms (scroll-driven growth) →
 * `source-atop` draws the blueprint linework, so it appears ONLY inside the
 * painted area. Outside the wash = blank studio paper. No pointer dependency;
 * scroll progress over the hero drives the bloom. Reduced-motion → blueprint
 * revealed at a calm fixed coverage, no animation.
 */

type Bloom = { x: number; y: number; r: number; target: number; seed: number; tone: number };

const PAPER = "#f4efe6";
const WASH = ["#7a9e7e", "#9cb79a", "#6f97a8"]; // sage / soft-green / faded blueprint-teal
const LINE = "#2f5d74"; // blueprint ink (muted cyan-indigo)
const LINE_SOFT = "#9bbccb";

function makeBlooms(W: number, H: number): Bloom[] {
  // a loose vertical chain of wash centers — the stroke travels down the page
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

// one feathered, irregular watercolor blob (layered radial gradient + wobbly edge)
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

// the mechanical blueprint of the site's own layout — drawn full-field; only the
// parts overlapping the wash survive the source-atop composite.
function drawBlueprint(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";

  // faint measurement grid
  ctx.strokeStyle = LINE_SOFT;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 0.5;
  const G = 38;
  for (let x = 0; x <= W; x += G) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += G) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // wireframe blocks = this site's sections, drawn as an architect's elevation
  ctx.strokeStyle = LINE;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 1.3;
  const cx = W * 0.32;
  const blocks = [
    { y: 0.10, h: 0.16, label: "HERO" },
    { y: 0.30, h: 0.12, label: "MANIFESTO" },
    { y: 0.46, h: 0.14, label: "WORK · GARDEN" },
    { y: 0.64, h: 0.10, label: "ETHOS" },
    { y: 0.78, h: 0.12, label: "CTA" },
  ];
  ctx.font = "11px 'FragmentMono', monospace";
  ctx.fillStyle = LINE;
  const bw = W * 0.42;
  for (const blk of blocks) {
    const by = H * blk.y, bh = H * blk.h, bx = cx - bw * 0.18;
    ctx.globalAlpha = 0.85;
    ctx.strokeRect(bx, by, bw, bh);
    // corner ticks
    ctx.beginPath();
    [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(([px, py]) => {
      ctx.moveTo(px - 4, py); ctx.lineTo(px + 4, py); ctx.moveTo(px, py - 4); ctx.lineTo(px, py + 4);
    });
    ctx.stroke();
    // dimension line + label
    ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(bx + bw + 10, by); ctx.lineTo(bx + bw + 10, by + bh); ctx.stroke();
    ctx.fillText(blk.label, bx + 8, by + 16);
  }

  // a couple of construction circles + a slow sweep, to feel "live"
  ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.arc(cx + bw * 0.3, H * 0.4, 60, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + bw * 0.3, H * 0.4);
  ctx.lineTo(cx + bw * 0.3 + Math.cos(t * 0.4) * 60, H * 0.4 + Math.sin(t * 0.4) * 60);
  ctx.stroke();

  // title block, bottom-right (architect's cartouche)
  ctx.globalAlpha = 0.8;
  ctx.strokeRect(W - 220, H - 70, 200, 50);
  ctx.fillText("VERDANT — fig. 01", W - 210, H - 48);
  ctx.fillText("studio drawing — scale 1:1", W - 210, H - 30);

  ctx.restore();
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
    let raf = 0;
    let t0 = 0, lastTs = 0, lastP = -1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      blooms = makeBlooms(W, H);
    };

    // scroll progress over the first viewport — drives the bloom coverage
    const progress = () => {
      if (reduce) return 0.7;
      const y = window.scrollY || 0;
      return Math.max(0, Math.min(1, y / (window.innerHeight * 0.9)));
    };

    const frame = (ts: number) => {
      if (!t0) { t0 = ts; lastTs = ts; }
      const p = progress();
      // throttle to ~30fps when scroll is settled — bloom easing is done, only sweep ticks
      if (Math.abs(p - lastP) < 0.001 && ts - lastTs < 32) { raf = requestAnimationFrame(frame); return; }
      lastTs = ts; lastP = p;
      const t = (ts - t0) / 1000;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);

      // each bloom's revealed radius eases toward (its target × how far it's "due" by scroll)
      blooms.forEach((b, i) => {
        const due = Math.max(0, Math.min(1, (p - i / blooms.length) * 2.2 + 0.15));
        const goal = b.target * due * (reduce ? 1 : 1);
        b.r += (goal - b.r) * 0.08;
        paintBloom(ctx, b, 0.9);
      });

      drawBlueprint(ctx, W, H, t);

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const onHide = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; lastTs = 0; }
      else if (!reduce && !raf) raf = requestAnimationFrame(frame);
    };
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onHide);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}
