/**
 * Animates SVG paths with the [data-growable] attribute,
 * drawing them in via stroke-dashoffset. Reusable primitive
 * for vine-draw choreography across pages.
 *
 * @param timeline - GSAP timeline to add animations to
 * @param container - SVG element or parent containing growable paths
 */
export function drawGrowth(timeline: any, container: SVGSVGElement | Element) {
  const paths = container.querySelectorAll<SVGPathElement>("path[data-growable]");

  if (paths.length === 0) return;

  paths.forEach((path, idx) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // Stagger the start of each vine branch slightly
    const startTime = idx * 0.15;
    timeline.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "sine.inOut",
      },
      startTime
    );
  });
}
