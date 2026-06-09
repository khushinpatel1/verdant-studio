import { useRef, useState } from "react";
import { useReactiveField } from "./useReactiveField";
import { hexToRgb } from "./glow";

/**
 * ETHOS hero — still water, the privacy/honesty metaphor made literal: water you
 * can see straight through, structure revealed only where the light bends.
 *
 * Flagship path is a real-time WebGL water surface — an analytic height field of
 * pointer ripples + ambient drops, from which the shader derives surface normals
 * for light refraction, caustic filaments along the wavefronts, and specular
 * sparkle. Mostly transparent, so the cream page reads through it and body text
 * stays legible; only the caustics and highlights carry colour.
 *
 * If WebGL is unavailable, it falls back gracefully to the hand-thrown organic-
 * ring canvas2d renderer below. Both render an identical <canvas>, so hydration
 * and the fixed-background layer behave the same either way. DPR-capped, paused
 * when the tab is hidden, touch-supported, reduced-motion → a single still frame.
 */

// ── shared: an organic, hand-thrown ring (used by the 2D fallback) ──
function organicRing(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number, squash: number, seed: number,
  stroke: string, alpha: number, lw: number,
) {
  if (r < 0.5) return;
  ctx.beginPath();
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  const STEP = 0.22;
  const tilt = Math.sin(seed) * 0.35;
  const wob = Math.min(1, 26 / (r + 14));
  for (let a = 0; a <= Math.PI * 2 + STEP; a += STEP) {
    const k = 1 + wob * (Math.sin(a * 3 + seed) * 0.05 + Math.sin(a * 5 - seed * 1.7) * 0.03 + Math.sin(a * 2 + seed * 0.5) * 0.04);
    const rr = r * k;
    const px = x + Math.cos(a + tilt) * rr;
    const py = y + Math.sin(a + tilt) * rr * squash;
    a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
}

type Ripple = { x: number; y: number; r: number; life: number; seed: number; squash: number };
type State2D = { lines: number[]; ambient: Ripple[]; cool: number; cols: { line: string; ring: string } };

function EthosWater2D({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useReactiveField<State2D>({
    trailMax: 14,
    trailDecay: 0.94,
    seed: ({ W, H, tok }) => {
      const lines: number[] = [];
      const GAP = 21;
      for (let y = GAP; y < H; y += GAP) lines.push(y);
      return {
        lines,
        ambient: [{ x: W * 0.5, y: H * 0.5, r: 0, life: 1, seed: Math.random() * 6.28, squash: 0.4 + Math.random() * 0.1 }],
        cool: 0,
        cols: { line: tok("--sage", "#c8d5b9"), ring: tok("--moss", "#7a9e7e") },
      };
    },
    draw: ({ ctx, W, H, t, trail, reduce }, S) => {
      ctx.lineWidth = 1;
      for (let i = 0; i < S.lines.length; i++) {
        const baseY = S.lines[i];
        ctx.beginPath();
        ctx.strokeStyle = S.cols.line;
        ctx.globalAlpha = 0.22;
        for (let x = 0; x <= W; x += 8) {
          const y = baseY + Math.sin(x * 0.02 + t * 1.4 + i * 0.5) * 1.8;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (const m of trail) {
        const r = (1 - m.life) * 120 + 6;
        const seed = (m.x + m.y) * 0.01;
        organicRing(ctx, m.x, m.y, r, 0.42, seed, S.cols.ring, m.life * 0.5, 1.4);
        if (r > 26) organicRing(ctx, m.x, m.y, r - 20, 0.42, seed + 1.3, S.cols.ring, m.life * 0.3, 1.1);
      }
      if (!reduce) {
        S.cool -= 1;
        if (S.cool <= 0) { S.ambient.push({ x: Math.random() * W, y: Math.random() * H, r: 0, life: 1, seed: Math.random() * 6.28, squash: 0.4 + Math.random() * 0.1 }); S.cool = 90 + (Math.random() * 90) | 0; }
        for (const a of S.ambient) { a.r += 0.9; a.life *= 0.992; organicRing(ctx, a.x, a.y, a.r, a.squash, a.seed, S.cols.ring, a.life * 0.34, 1.2); }
        S.ambient = S.ambient.filter((a) => a.life > 0.05).slice(-6);
      } else {
        organicRing(ctx, W * 0.5, H * 0.5, 60, 0.42, 1.0, S.cols.ring, 0.2, 1.4);
      }
    },
  });
  return <canvas ref={ref} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}

// ── WebGL water surface ──
const MAXR = 12;

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uRPos[${MAXR}];
uniform float uRAge[${MAXR}];
uniform float uRAmp[${MAXR}];
uniform int uRCount;
uniform vec3 uShallow;
uniform vec3 uHi;

float hRipple(vec2 p, vec2 o, float age, float amp){
  float d = distance(p, o);
  float ring = d - 0.42 * age;                 // expanding wavefront
  float env = exp(-ring*ring*820.0) * exp(-age*1.05);
  return amp * env * sin(ring * 205.0);
}

float heightAt(vec2 p){
  // ambient breathing keeps the pond alive when still
  float h = 0.010 * sin(p.x*22.0 + uTime*0.7) * sin(p.y*19.0 - uTime*0.55);
  h += 0.006 * sin(p.x*9.0 - uTime*0.4 + p.y*7.0);
  float asp = uRes.x / uRes.y;
  for(int i=0;i<${MAXR};i++){
    if(i >= uRCount) break;
    vec2 o = vec2(uRPos[i].x * asp, uRPos[i].y);
    h += hRipple(p, o, uRAge[i], uRAmp[i]);
  }
  return h;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);

  float e = 0.0016;
  float h  = heightAt(p);
  float hx = heightAt(p + vec2(e, 0.0)) - h;
  float hy = heightAt(p + vec2(0.0, e)) - h;
  vec3 n = normalize(vec3(-hx / e, -hy / e, 1.0));
  float slope = length(vec2(hx, hy)) / e;

  float caustic = pow(clamp(slope * 0.85, 0.0, 1.0), 1.6);   // bright filaments on the wavefronts
  vec3 L = normalize(vec3(0.35, 0.55, 0.75));
  float spec = pow(max(dot(n, L), 0.0), 48.0);                // sparkle
  float body = clamp(-h * 40.0, 0.0, 1.0);                    // faint tint pooling in troughs

  vec3 col = mix(uShallow, uHi, caustic * 0.7);
  col = mix(col, vec3(1.0), spec * 0.8);
  float a = clamp(caustic * 0.40 + spec * 0.6 + body * 0.10, 0.0, 0.78);
  gl_FragColor = vec4(col, a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
  return s;
}

function EthosWaterGL({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);

  // ref callback so we can bail to the 2D fallback if GL init fails at runtime
  const run = (canvas: HTMLCanvasElement) => {
    const gl = (canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true }) ||
      canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false })) as WebGLRenderingContext | null;
    if (!gl) return null;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uTime = U("uTime"), uRPos = U("uRPos"), uRAge = U("uRAge"),
      uRAmp = U("uRAmp"), uRCount = U("uRCount"), uShallow = U("uShallow"), uHi = U("uHi");

    const css = getComputedStyle(document.documentElement);
    const tok = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
    const shallow = hexToRgb(tok("--moss", "#7a9e7e"), [122, 158, 126]).map((v) => v / 255) as [number, number, number];
    const hi = hexToRgb(tok("--moss-300", "#9dbfa0"), [157, 191, 160]).map((v) => v / 255) as [number, number, number];
    gl.uniform3fv(uShallow, shallow);
    gl.uniform3fv(uHi, hi);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);

    // ripple pool — pointer wakes + ambient drops. (x,y) in 0..1 uv.
    type R = { x: number; y: number; t0: number; amp: number };
    let ripples: R[] = [];
    let W = 0, H = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let t0 = 0;
    const addRipple = (cx: number, cy: number, amp: number, now: number) => {
      const r = canvas.getBoundingClientRect();
      const x = (cx - r.left) / W, y = 1 - (cy - r.top) / H; // flip: gl_FragCoord origin bottom-left
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      ripples.push({ x, y, t0: now, amp });
      if (ripples.length > MAXR) ripples.shift();
    };

    let lastPx = -1, lastPy = -1, pointerActive = false;
    const onMove = (ev: MouseEvent) => {
      pointerActive = true;
      if (Math.hypot(ev.clientX - lastPx, ev.clientY - lastPy) > 26) {
        addRipple(ev.clientX, ev.clientY, 0.022, (performance.now() - t0) / 1000);
        lastPx = ev.clientX; lastPy = ev.clientY;
      }
    };
    const onLeave = () => { pointerActive = false; };
    const onTouch = (ev: TouchEvent) => { pointerActive = true; for (const tch of Array.from(ev.changedTouches)) { addRipple(tch.clientX, tch.clientY, 0.022, (performance.now() - t0) / 1000); } };
    const onTouchEnd = () => { pointerActive = false; };

    let ambientCool = 30;
    let raf = 0, lastDraw = 0;
    const frame = (ts: number) => {
      if (!t0) t0 = ts;
      const minDelta = pointerActive ? 15 : 31; // 60fps hot, ~30fps idle
      if (ts - lastDraw < minDelta) { raf = requestAnimationFrame(frame); return; }
      lastDraw = ts;
      const now = (ts - t0) / 1000;

      // ambient drops keep the surface alive
      if (--ambientCool <= 0) { ripples.push({ x: Math.random(), y: Math.random(), t0: now, amp: 0.014 }); ambientCool = 70 + ((Math.random() * 80) | 0); if (ripples.length > MAXR) ripples.shift(); }
      ripples = ripples.filter((r) => now - r.t0 < 3.5);

      const pos = new Float32Array(MAXR * 2), age = new Float32Array(MAXR), amp = new Float32Array(MAXR);
      ripples.forEach((r, i) => { pos[i * 2] = r.x; pos[i * 2 + 1] = r.y; age[i] = now - r.t0; amp[i] = r.amp; });
      gl.uniform2fv(uRPos, pos);
      gl.uniform1fv(uRAge, age);
      gl.uniform1fv(uRAmp, amp);
      gl.uniform1i(uRCount, ripples.length);
      gl.uniform1f(uTime, now);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const onResize = () => { resize(); if (reduce) frame(performance.now()); };
    const onHide = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!reduce && !raf) { lastDraw = 0; raf = requestAnimationFrame(frame); }
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onHide);
    if (!reduce) {
      window.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
      canvas.addEventListener("touchstart", onTouch, { passive: true });
      canvas.addEventListener("touchmove", onTouch, { passive: true });
      canvas.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onTouchEnd);
      const ext = gl.getExtension("WEBGL_lose_context"); if (ext) ext.loseContext();
    };
  };

  // imperative attach so we can fall through to 2D if GL fails to init
  const cleanup = useRef<null | (() => void)>(null);
  const [fallback, setFallback] = useState(false);
  const attach = (el: HTMLCanvasElement | null) => {
    if (cleanup.current) { cleanup.current(); cleanup.current = null; }
    (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
    if (!el || fallback) return;
    const c = run(el);
    if (c) cleanup.current = c; else setFallback(true);
  };

  if (fallback) return <EthosWater2D className={className} style={style} />;
  return <canvas ref={attach} aria-hidden className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} />;
}

export default function EthosWater(props: { className?: string; style?: React.CSSProperties }) {
  // synchronous client-side capability check; both branches render an identical
  // <canvas>, so SSR markup (GL branch) hydrates cleanly to either.
  const supported = useRef<boolean | undefined>(undefined);
  if (supported.current === undefined && typeof document !== "undefined") {
    try {
      const c = document.createElement("canvas");
      supported.current = !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch { supported.current = false; }
  }
  return supported.current === false ? <EthosWater2D {...props} /> : <EthosWaterGL {...props} />;
}
