import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { drawGrowth } from "./drawGrowth";

interface VineBorderProps {
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * VineBorder — a reusable vine-drawing SVG border that animates
 * on scroll-reveal. Designed for section frames and component edges.
 * The vine is asymmetric (not uniform) and reads as organic growth.
 */
export default function VineBorder({ position = "top", className = "" }: VineBorderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  useEffect(() => {
    if (!svgRef.current) return;

    // If reduced-motion is on, show the vine fully-drawn
    if (prefersReducedMotion) {
      const paths = svgRef.current.querySelectorAll("path[data-growable]");
      paths.forEach((path) => {
        const el = path as SVGPathElement;
        el.style.strokeDashoffset = "0";
      });
      return;
    }

    // Trigger animation when this element comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !timelineRef.current) {
          const timeline = gsap.timeline();
          timelineRef.current = timeline;
          drawGrowth(timeline, svgRef.current!);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(svgRef.current);

    return () => {
      observer.disconnect();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [prefersReducedMotion]);

  // SVG viewBox and path depend on position
  const getSvgContent = () => {
    switch (position) {
      case "top":
        return (
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path
              d="M 0,30 Q 150,15 300,20 T 600,10 T 900,25 L 1200,20"
              stroke="var(--sage)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              data-growable
              style={{
                strokeDasharray: 1200,
                strokeDashoffset: 1200,
              }}
            />
          </svg>
        );

      case "bottom":
        return (
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path
              d="M 0,10 Q 200,20 400,15 T 800,30 T 1200,15"
              stroke="var(--sage)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              data-growable
              style={{
                strokeDasharray: 1200,
                strokeDashoffset: 1200,
              }}
            />
          </svg>
        );

      case "left":
        return (
          <svg viewBox="0 0 40 800" preserveAspectRatio="none">
            <path
              d="M 30,0 Q 20,150 25,300 T 15,600 T 30,800"
              stroke="var(--sage)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              data-growable
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
              }}
            />
          </svg>
        );

      case "right":
        return (
          <svg viewBox="0 0 40 800" preserveAspectRatio="none">
            <path
              d="M 10,0 Q 20,180 15,350 T 25,650 T 10,800"
              stroke="var(--sage)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              data-growable
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
              }}
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`v-vine-border ${className}`}>
      <svg ref={svgRef} className="vine-svg">
        {getSvgContent()}
      </svg>
    </div>
  );
}
