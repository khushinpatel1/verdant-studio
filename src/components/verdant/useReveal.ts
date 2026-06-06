import { useEffect } from "react";

/**
 * VERDANT reveal — adds `.in` to any [data-v-reveal] as it enters view.
 * Elements are hidden by CSS only once JS confirms support, so no-JS / failed
 * hydration leaves everything visible. Stagger via inline `--d` on the element.
 * Re-runs on Astro view transitions so freshly-swapped pages reveal too.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-v-reveal]"));
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
