import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { drawGrowth } from "./drawGrowth";

interface HeroGardenProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroGarden({ className = "", style = {} }: HeroGardenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const isTouch = typeof window !== "undefined"
    ? window.matchMedia("(pointer: coarse)").matches
    : false;

  // Pointer tracking for subtle parallax
  useEffect(() => {
    if (isTouch || !containerRef.current) return;

    const container = containerRef.current;
    let pointerX = 0.5;
    let pointerY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = (e.clientX - rect.left) / rect.width;
      pointerY = (e.clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = () => {
      // Return to center
      gsap.to(
        { x: pointerX, y: pointerY },
        {
          x: 0.5,
          y: 0.5,
          duration: 0.6,
          onUpdate() {
            if (svgRef.current) {
              // Subtle parallax effect — very gentle
              const translateX = (this.targets()[0].x - 0.5) * 10;
              const translateY = (this.targets()[0].y - 0.5) * 10;
              svgRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
            }
          },
        }
      );
    };

    let rafId = 0;
    const updateParallax = () => {
      if (svgRef.current) {
        const translateX = (pointerX - 0.5) * 10;
        const translateY = (pointerY - 0.5) * 10;
        svgRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
      rafId = requestAnimationFrame(updateParallax);
    };
    rafId = requestAnimationFrame(updateParallax);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouch]);

  // Vine growth animation on mount
  useEffect(() => {
    if (!svgRef.current) return;

    // If reduced-motion is on, show the full vine instantly
    if (prefersReducedMotion) {
      const paths = svgRef.current.querySelectorAll("path[data-growable]");
      paths.forEach((path) => {
        const el = path as SVGPathElement;
        if (el.style.strokeDashoffset) {
          el.style.strokeDashoffset = "0";
        }
      });
      return;
    }

    // Clear any existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    // Draw the vine — SVG stroke animation
    drawGrowth(timeline, svgRef.current);

    // Add blooms/leaves spawning after the vine is mostly drawn
    const blooms = svgRef.current.querySelectorAll("circle[data-bloom], ellipse[data-leaf]");
    blooms.forEach((bloom, idx) => {
      timeline.fromTo(
        bloom,
        { r: 0, opacity: 0 },
        {
          r: (bloom as any).getAttribute("data-r") || 3,
          opacity: 0.8,
          duration: 0.4,
          ease: "back.out",
        },
        `+=0.${idx % 3}` // stagger blooms
      );
    });
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
      >
        {/* Define vine path — a growing organic curve with blooms */}

        {/* Main vine — draws itself on load */}
        <path
          d="M 100,600 Q 300,400 400,300 T 700,100 Q 900,50 1100,150"
          stroke="var(--leaf)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.7"
          data-growable
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
          }}
        />

        {/* Secondary vine branch */}
        <path
          d="M 400,300 Q 450,250 500,280 T 650,200"
          stroke="var(--leaf)"
          strokeWidth="1.8"
          fill="none"
          opacity="0.5"
          data-growable
          style={{
            strokeDasharray: 500,
            strokeDashoffset: 500,
          }}
        />

        {/* Blooms along the vine */}
        <circle cx="450" cy="280" data-bloom data-r="4" fill="var(--leaf)" opacity="0" />
        <circle cx="600" cy="200" data-bloom data-r="3.5" fill="var(--leaf)" opacity="0" />
        <circle cx="800" cy="120" data-bloom data-r="5" fill="var(--leaf)" opacity="0" />
        <circle cx="950" cy="180" data-bloom data-r="3" fill="var(--leaf)" opacity="0" />

        {/* Leaves — ellipses along the vine */}
        <ellipse cx="350" cy="350" rx="3" ry="6" fill="var(--moss)" opacity="0" data-leaf transform="rotate(45 350 350)" />
        <ellipse cx="550" cy="250" rx="2.5" ry="5" fill="var(--moss)" opacity="0" data-leaf transform="rotate(-30 550 250)" />
        <ellipse cx="750" cy="150" rx="3" ry="6" fill="var(--moss)" opacity="0" data-leaf transform="rotate(60 750 150)" />
      </svg>
    </div>
  );
}
