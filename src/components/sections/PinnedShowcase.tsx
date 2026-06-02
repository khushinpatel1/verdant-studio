import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  media: string;
  heading?: string;
  steps: { title: string; body: string }[];
}

// Apple design-deep-dive move: the media pins to the viewport while the steps
// scroll past, each lighting up as it reaches center. Scales the media subtly
// per step to keep the eye moving.
export default function PinnedShowcase({ media, heading, steps }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      const stepEls = gsap.utils.toArray<HTMLElement>("[data-step]");
      stepEls.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, scope);
    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section style={{ padding: 0 }}>
      <div
        ref={scope}
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "start",
        }}
      >
        {/* Pinned media column */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100svh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <img
            src={media}
            alt=""
            style={{
              width: "100%",
              borderRadius: "var(--radius)",
              transform: `scale(${1 + active * 0.04})`,
              transition: "transform 0.7s var(--ease)",
            }}
          />
        </div>

        {/* Scrolling steps */}
        <div style={{ paddingBlock: "30vh" }}>
          {heading && (
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", marginBottom: "20vh", maxWidth: 480 }}>
              {heading}
            </h2>
          )}
          {steps.map((s, i) => (
            <div
              key={i}
              data-step
              style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                opacity: active === i ? 1 : 0.32,
                transition: "opacity 0.5s var(--ease)",
              }}
            >
              <div
                style={{
                  color: "var(--accent)",
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 14,
                  letterSpacing: "0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontSize: "clamp(24px, 3vw, 38px)", marginBottom: 16 }}>{s.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, maxWidth: 440 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
