import { useEffect, useRef } from "react";

/**
 * VERDANT cursor — a single small sumi-ink blot that trails the pointer with a
 * soft lag. Deliberately simple: no swelling ring, no labels. The page elements
 * react to the pointer (the growing-garden field, magnetic targets) — the cursor
 * itself stays quiet. Mounted once in the layout, persists across view
 * transitions. Hidden on touch and under reduced-motion.
 */
export default function Cursor() {
  const blot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const b = blot.current!;
    let mx = innerWidth / 2, my = innerHeight / 2;
    let bx = mx, by = my, raf = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      bx += (mx - bx) * 0.32; by += (my - by) * 0.32;
      b.style.transform = `translate(${bx}px, ${by}px)`;
      raf = requestAnimationFrame(tick);
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("visibilitychange", onVisibilityChange);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={blot} className="v-cursor-blot" aria-hidden />
      <style>{`
        .v-cursor-blot {
          position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;
          will-change: transform;
          width: 10px; height: 10px; margin: -5px;
          background: var(--green);
          /* organic ink-blot, not a perfect circle */
          border-radius: 62% 38% 55% 45% / 50% 58% 42% 50%;
          mix-blend-mode: multiply; opacity: 0.8;
        }
        @media (pointer: coarse) { .v-cursor-blot { display: none; } }
        @media (prefers-reduced-motion: reduce) { .v-cursor-blot { display: none; } }
      `}</style>
    </>
  );
}
