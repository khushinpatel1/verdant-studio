import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Apple-toolkit move: anything marked [data-reveal] rises + fades in on scroll.
// Initial hidden state is set in JS (not CSS) so content stays visible without JS.
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      els.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 36 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, [scope]);
}
