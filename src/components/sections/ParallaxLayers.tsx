import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  heading?: string;
  sub?: string;
  layers: { src: string; speed: number }[];
}

// Apple depth move: stacked layers translate at different rates as the section
// scrolls through the viewport. Higher speed = moves more = reads as closer.
export default function ParallaxLayers({ heading, sub, layers }: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      const layerEls = gsap.utils.toArray<HTMLElement>("[data-layer]");
      layerEls.forEach((el) => {
        const speed = Number(el.dataset.speed) || 0;
        gsap.fromTo(
          el,
          { yPercent: -speed * 12 },
          {
            yPercent: speed * 12,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, scope);
    return () => ctx.revert();
  }, [layers.length]);

  return (
    <section style={{ padding: 0 }}>
      <div
        ref={scope}
        style={{
          position: "relative",
          height: "90svh",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        {layers.map((l, i) => (
          <img
            key={i}
            data-layer
            data-speed={l.speed}
            src={l.src}
            alt=""
            style={{
              position: "absolute",
              inset: "-20% 0",
              width: "100%",
              height: "140%",
              objectFit: "cover",
              willChange: "transform",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 30%, color-mix(in srgb, var(--bg) 78%, transparent) 100%)",
          }}
        />
        {(heading || sub) && (
          <div className="container" style={{ position: "relative", textAlign: "center" }}>
            {heading && (
              <h2 style={{ fontSize: "clamp(36px, 7vw, 88px)", color: "var(--fg)" }}>{heading}</h2>
            )}
            {sub && (
              <p
                style={{
                  color: "var(--fg)",
                  opacity: 0.86,
                  fontSize: "clamp(17px, 2.4vw, 22px)",
                  marginTop: 18,
                  maxWidth: 560,
                  marginInline: "auto",
                }}
              >
                {sub}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
