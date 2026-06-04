import { useEffect, useRef } from "react";

/**
 * L1 technique — velocity-coupled marquee.
 * Always drifts at a base speed; scrolling adds (signed) velocity so the strip
 * surges and even reverses with your scroll, then settles. Scroll-velocity is an
 * L0 idea reused here and in parallax. Track repeats twice for a seamless loop.
 */
export default function VelocityMarquee({
  text, base = 0.6,
}: { text: string; base?: number }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    let x = 0, vel = 0, lastY = window.scrollY, raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      vel += (y - lastY); lastY = y;
    };
    const half = () => el.scrollWidth / 2;
    const tick = () => {
      vel *= 0.9;
      x -= base + vel * 0.25;
      const h = half();
      if (h > 0) { if (x <= -h) x += h; if (x > 0) x -= h; }
      el.style.transform = `translateX(${x.toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [base]);

  const item = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 40, paddingRight: 40 }}>
      <span>{text}</span><span style={{ color: "var(--accent)" }}>／</span>
    </span>
  );

  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "28px 0" }}>
      <div ref={track} style={{
        display: "inline-flex", willChange: "transform",
        fontFamily: "var(--font-display)", fontSize: "clamp(40px,7vw,96px)", fontWeight: 360,
        letterSpacing: "-0.02em",
      }}>
        <span style={{ display: "inline-flex" }}>{item}{item}{item}{item}</span>
        <span style={{ display: "inline-flex" }}>{item}{item}{item}{item}</span>
      </div>
    </div>
  );
}
