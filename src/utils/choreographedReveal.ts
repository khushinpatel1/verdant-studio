/**
 * Choreographed scroll reveal. replaces uniform fade for hero moments.
 *
 * Where it elevates a moment, this driver composes a GSAP entrance timeline
 * where elements enter differently: some slide+fade, some scale, some stay still.
 *
 * Integrates with the existing reveal observer. When [data-v-choreograph] elements
 * scroll into view, this driver takes over from the default [data-v-reveal] fade.
 *
 * Respects:
 * - reduced-motion → all visible, no animation
 * - coarse-pointer (touch) → all visible, no animation
 */

import gsap from "gsap";

interface ChoreographyConfig {
  staggerDelay?: number;
  duration?: number;
  ease?: string;
}

const defaultConfig: Required<ChoreographyConfig> = {
  staggerDelay: 0.08,
  duration: 0.9,
  ease: "cubic-bezier(0.22, 1, 0.36, 1)", // --ease from verdant.css
};

/**
 * Compose a staggered entrance timeline for a choreographed section.
 * Elements with [data-v-choreo-*] attributes define their entrance:
 * - [data-v-choreo-slide]: slide in from below + fade
 * - [data-v-choreo-scale]: scale from 0.92 + fade
 * - [data-v-choreo-hold]: no animation, just visible
 *
 * If an element has [data-v-choreo-delay="0.2"], it waits 0.2s before starting.
 */
export function choreographSection(
  section: HTMLElement,
  config: ChoreographyConfig = {}
) {
  const c = { ...defaultConfig, ...config };
  const timeline = gsap.timeline({ paused: true });

  // Collect all choreographed elements in source order
  const elements = Array.from(section.querySelectorAll<HTMLElement>("[data-v-choreo-slide], [data-v-choreo-scale], [data-v-choreo-hold]"));

  elements.forEach((el, idx) => {
    const delay = parseFloat(el.dataset.vChoreodelay || "0");
    const baseDelay = idx * c.staggerDelay + delay;

    // Reset to starting state
    el.style.opacity = "0";
    el.style.transform = "none";

    if (el.hasAttribute("data-v-choreo-slide")) {
      // Slide up + fade in
      timeline.fromTo(
        el,
        { opacity: 0, transform: "translateY(28px)" },
        {
          opacity: 1,
          transform: "translateY(0)",
          duration: c.duration,
          ease: c.ease,
        },
        baseDelay
      );
    } else if (el.hasAttribute("data-v-choreo-scale")) {
      // Scale up from 0.92 + fade in
      timeline.fromTo(
        el,
        { opacity: 0, transform: "scale(0.92)" },
        {
          opacity: 1,
          transform: "scale(1)",
          duration: c.duration,
          ease: c.ease,
        },
        baseDelay
      );
    } else if (el.hasAttribute("data-v-choreo-hold")) {
      // Just fade in, no transform
      timeline.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: c.duration, ease: c.ease },
        baseDelay
      );
    }
  });

  return timeline;
}

/**
 * Arm the choreographed reveal driver on the page.
 * Called from Verdant.astro once on page load, re-armed on view transitions.
 *
 * For each [data-v-choreograph] section:
 * - If reduced-motion or coarse-pointer: show all elements, no animation
 * - Otherwise: create IntersectionObserver that plays the choreography timeline
 *   when the section scrolls into view.
 */
export function armChoreography() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  // If reduced-motion or touch, just make everything visible
  if (prefersReduced || isTouch) {
    document.querySelectorAll<HTMLElement>("[data-v-choreograph]").forEach((section) => {
      section.querySelectorAll("[data-v-choreo-slide], [data-v-choreo-scale], [data-v-choreo-hold]").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    });
    return;
  }

  // Choreographed reveal with IntersectionObserver
  const sections = document.querySelectorAll<HTMLElement>("[data-v-choreograph]");
  const timelines = new WeakMap<HTMLElement, gsap.core.Timeline>();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target as HTMLElement;

          // Build and play the timeline
          if (!timelines.has(section)) {
            const timeline = choreographSection(section);
            timelines.set(section, timeline);
          }
          const timeline = timelines.get(section)!;
          timeline.play();
          io.unobserve(section);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  sections.forEach((section) => io.observe(section));
}
