/**
 * Motion primitives for Verdant.
 * Minimal, composable animations respecting prefers-reduced-motion.
 */

export interface MotionOptions {
  duration?: number;
  delay?: number;
  easing?: string;
}

/**
 * Returns true if motion should be reduced.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Card expand: scale + fade entrance.
 * For expandable card rows that open into sheets.
 */
export function animateCardExpand(
  el: HTMLElement,
  options: MotionOptions = {}
): Promise<void> {
  const { duration = 300, delay = 0, easing = "var(--ease-smooth)" } = options;

  if (prefersReducedMotion()) {
    el.style.opacity = "1";
    el.style.transform = "scale(1)";
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    el.style.opacity = "0";
    el.style.transform = "scale(0.95)";
    el.offsetHeight; // Trigger reflow

    setTimeout(() => {
      el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
      el.style.opacity = "1";
      el.style.transform = "scale(1)";

      const onEnd = () => {
        el.style.transition = "";
        el.removeEventListener("transitionend", onEnd);
        resolve();
      };
      el.addEventListener("transitionend", onEnd);
    }, delay);
  });
}

/**
 * Sheet open: slide up + fade from bottom.
 * For modal/overlay sheets that slide in.
 */
export function animateSheetOpen(
  el: HTMLElement,
  options: MotionOptions = {}
): Promise<void> {
  const { duration = 300, delay = 0, easing = "var(--ease-out)" } = options;

  if (prefersReducedMotion()) {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.offsetHeight; // Trigger reflow

    setTimeout(() => {
      el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";

      const onEnd = () => {
        el.style.transition = "";
        el.removeEventListener("transitionend", onEnd);
        resolve();
      };
      el.addEventListener("transitionend", onEnd);
    }, delay);
  });
}

/**
 * Masked reveal: clip-path entrance on scroll.
 * For product screenshots or hero graphics with entrance animation.
 */
export function animateMaskedReveal(
  el: HTMLElement,
  options: MotionOptions = {}
): void {
  const { duration = 500, easing = "var(--ease-standard)" } = options;

  if (prefersReducedMotion()) {
    el.style.clipPath = "inset(0)";
    return;
  }

  el.style.clipPath = "inset(8% 2% 8% 2%)";
  el.style.transition = `clip-path ${duration}ms ${easing}`;
  el.offsetHeight; // Trigger reflow
  el.style.clipPath = "inset(0)";
}

/**
 * Scroll-linked parallax transform.
 * Attach to a scroll listener; returns transform value based on element position.
 */
export function computeScrollTransform(
  el: HTMLElement,
  speed: number = 0.1
): string {
  if (prefersReducedMotion()) return "translateY(0)";

  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
  const offset = progress * speed * vh;

  return `translateY(${offset.toFixed(1)}px)`;
}
