import { useState } from "react";

interface Props {
  heading?: string;
  qa: { q: string; a: string }[];
}

export default function Accordion({ heading, qa }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq">
      <div className="container" style={{ maxWidth: 820 }}>
        {heading && (
          <h2 data-reveal style={{ fontSize: "clamp(28px, 4vw, 52px)", marginBottom: 40 }}>
            {heading}
          </h2>
        )}
        {qa.map((item, i) => (
          <div key={i} data-reveal style={{ borderTop: "1px solid var(--line)" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                color: "var(--fg)",
                padding: "22px 0",
                fontSize: 19,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              {item.q}
              <span style={{ color: "var(--accent)" }}>{open === i ? "–" : "+"}</span>
            </button>
            {open === i && (
              <p style={{ color: "var(--muted)", lineHeight: 1.6, padding: "0 0 24px", fontSize: 16 }}>{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
