import { useEffect, useRef, useState } from "react";

/**
 * L0 motion primitive — element scroll progress.
 * Returns [ref, progress] where progress is 0 when the element's top hits the
 * bottom of the viewport and 1 when its bottom passes the top. Drives reveals,
 * variable-font axes, parallax — anything that wants "how far through am I".
 */
export function useScrollProgress<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const seen = vh - r.top;
      setP(Math.min(1, Math.max(0, seen / total)));
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return [ref, p] as const;
}
