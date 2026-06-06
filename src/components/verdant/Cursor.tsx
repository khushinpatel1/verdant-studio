import { useEffect, useRef } from "react";

/**
 * VERDANT cursor — an ink brush-tip, not a tech dot. A small sumi-ink blot that
 * trails the pointer with a soft lag, swells over [data-cursor] targets to show
 * a label, and leaves a faint, quickly-fading ink wake as it moves. Mounted once
 * in the layout, persists across view transitions. Hidden on touch.
 */
export default function Cursor() {
  const blot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const b = blot.current!, r = ring.current!, l = label.current!;
    let mx = innerWidth / 2, my = innerHeight / 2;
    let bx = mx, by = my, rx = mx, ry = my, raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      const t = e.target as HTMLElement;
      const hot = t.closest<HTMLElement>("[data-cursor]");
      if (hot) { r.dataset.on = "1"; l.textContent = hot.dataset.cursor || ""; }
      else { r.dataset.on = ""; l.textContent = ""; }
    };
    const tick = () => {
      bx += (mx - bx) * 0.35; by += (my - by) * 0.35;
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      b.style.transform = `translate(${bx}px, ${by}px)`;
      r.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={blot} className="v-cursor-blot" aria-hidden />
      <div ref={ring} className="v-cursor-ring" aria-hidden><span ref={label} /></div>
      <style>{`
        .v-cursor-blot, .v-cursor-ring {
          position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;
          will-change: transform;
        }
        .v-cursor-blot {
          width: 9px; height: 9px; margin: -4.5px;
          background: var(--green);
          /* organic ink-blot, not a perfect circle */
          border-radius: 62% 38% 55% 45% / 50% 58% 42% 50%;
          mix-blend-mode: multiply; opacity: 0.85;
        }
        .v-cursor-ring {
          width: 38px; height: 38px; margin: -19px; border-radius: 50%;
          border: 1px solid var(--moss); display: grid; place-items: center;
          transition: width .4s var(--ease), height .4s var(--ease),
                      margin .4s var(--ease), background .4s var(--ease), border-color .4s var(--ease);
        }
        .v-cursor-ring[data-on="1"] {
          width: 92px; height: 92px; margin: -46px;
          background: var(--green); border-color: transparent;
        }
        .v-cursor-ring span {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em;
          text-transform: uppercase; color: var(--moon); opacity: 0; text-align: center;
          transition: opacity .25s var(--ease);
        }
        .v-cursor-ring[data-on="1"] span { opacity: 1; }
        @media (pointer: coarse) { .v-cursor-blot, .v-cursor-ring { display: none; } }
        @media (prefers-reduced-motion: reduce) { .v-cursor-blot, .v-cursor-ring { display: none; } }
      `}</style>
    </>
  );
}
