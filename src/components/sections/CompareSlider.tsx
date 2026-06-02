import { useCallback, useRef, useState } from "react";

interface Props {
  heading?: string;
  before: { label: string; img: string };
  after: { label: string; img: string };
}

// Apple "closer look" move: drag a handle to wipe between two states.
// Pointer-driven so it works for mouse and touch; clamps 0–100%.
export default function CompareSlider({ heading, before, after }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    if (!frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onUp = () => (dragging.current = false);

  return (
    <section>
      <div className="container">
        {heading && (
          <h2 data-reveal style={{ fontSize: "clamp(28px, 4vw, 52px)", marginBottom: 40, maxWidth: 720 }}>
            {heading}
          </h2>
        )}
        <div
          ref={frame}
          data-reveal
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            cursor: "ew-resize",
            userSelect: "none",
            touchAction: "none",
            border: "1px solid var(--line)",
          }}
        >
          {/* After (full) underneath */}
          <img
            src={after.img}
            alt={after.label}
            draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span style={badge("right")}>{after.label}</span>

          {/* Before (clipped) on top */}
          <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden" }}>
            <img
              src={before.img}
              alt={before.label}
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: `${100 / (pos / 100)}%`,
                maxWidth: "none",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <span style={badge("left")}>{before.label}</span>
          </div>

          {/* Handle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${pos}%`,
              width: 2,
              background: "#fff",
              transform: "translateX(-1px)",
              boxShadow: "0 0 12px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#fff",
                color: "#111",
                display: "grid",
                placeItems: "center",
                fontSize: 18,
                fontWeight: 700,
                boxShadow: "0 2px 14px rgba(0,0,0,0.35)",
              }}
            >
              ⇄
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function badge(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    bottom: 16,
    [side]: 16,
    background: "color-mix(in srgb, var(--bg) 70%, transparent)",
    color: "var(--fg)",
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    backdropFilter: "blur(8px)",
  };
}
