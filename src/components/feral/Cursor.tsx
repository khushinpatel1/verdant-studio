import { useEffect, useRef } from "react";

/**
 * Global custom cursor — mounted once in the layout, persists across page
 * transitions. A bone dot that lerps toward the pointer, swells over anything
 * tagged [data-cursor] and shows that element's label. mix-blend-mode:difference
 * makes it invert whatever it's over, so it reads on both ink and image.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const d = dot.current!, r = ring.current!, l = label.current!;
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      d.style.transform = `translate(${mx}px, ${my}px)`;
      const t = e.target as HTMLElement;
      const hot = t.closest<HTMLElement>("[data-cursor]");
      if (hot) {
        r.dataset.on = "1";
        l.textContent = hot.dataset.cursor || "";
      } else {
        r.dataset.on = "";
        l.textContent = "";
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      r.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dot} className="f-cursor-dot" aria-hidden />
      <div ref={ring} className="f-cursor-ring" aria-hidden>
        <span ref={label} />
      </div>
      <style>{`
        .f-cursor-dot, .f-cursor-ring {
          position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;
          mix-blend-mode: difference; will-change: transform;
        }
        .f-cursor-dot {
          width: 7px; height: 7px; margin: -3.5px; border-radius: 50%;
          background: var(--paper);
        }
        .f-cursor-ring {
          width: 40px; height: 40px; margin: -20px; border-radius: 50%;
          border: 1px solid var(--paper);
          display: grid; place-items: center;
          transition: width .35s var(--ease), height .35s var(--ease), margin .35s var(--ease), background .35s var(--ease);
        }
        .f-cursor-ring[data-on="1"] {
          width: 84px; height: 84px; margin: -42px; background: var(--paper); border-color: transparent;
        }
        .f-cursor-ring span {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em;
          text-transform: uppercase; color: var(--ink); opacity: 0;
          transition: opacity .25s var(--ease);
        }
        .f-cursor-ring[data-on="1"] span { opacity: 1; }
        @media (pointer: coarse) { .f-cursor-dot, .f-cursor-ring { display: none; } }
      `}</style>
    </>
  );
}
