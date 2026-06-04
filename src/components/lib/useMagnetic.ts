import { useEffect, useRef } from "react";

/**
 * L0 motion primitive — magnetic pull.
 * Returns a ref; the element eases toward the cursor while hovered, springs back
 * on leave. Pure DOM + rAF, no deps beyond React. Portable: the body of `tick`
 * is framework-agnostic. `strength` 0..1, `radius` in px of influence.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength = 0.35,
  radius = 90,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch: skip

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(mx, my);
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        tx = mx * strength;
        ty = my * strength;
      } else {
        tx = 0; ty = 0;
      }
    };
    const onLeave = () => { tx = 0; ty = 0; };

    const tick = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return ref;
}
