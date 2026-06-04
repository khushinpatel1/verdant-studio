import type { ReactNode } from "react";
import { useMagnetic } from "../lib/useMagnetic";

/**
 * Thin wrapper that gives any child the magnetic primitive. The inner span gets
 * the transform so the outer hit-area stays put (bigger felt target, no layout
 * jump). This is the L0→usable bridge — same pattern every technique follows.
 */
export default function Magnetic({
  children, strength = 0.4, radius = 100, className, as = "div",
}: {
  children: ReactNode; strength?: number; radius?: number; className?: string;
  as?: "div" | "span";
}) {
  const ref = useMagnetic<HTMLElement>(strength, radius);
  const Tag = as as any;
  return (
    <Tag className={className} style={{ display: "inline-block" }}>
      <span ref={ref as any} style={{ display: "inline-block", willChange: "transform" }}>
        {children}
      </span>
    </Tag>
  );
}
