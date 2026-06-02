interface Props {
  heading?: string;
  cards: { icon?: string; title: string; body: string }[];
}

// Material card grid (Google), themed by --card / --radius / --line.
export default function CardGrid({ heading, cards }: Props) {
  return (
    <section>
      <div className="container">
        {heading && (
          <h2 data-reveal style={{ fontSize: "clamp(28px, 4vw, 52px)", marginBottom: 48, maxWidth: 720 }}>
            {heading}
          </h2>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {cards.map((c, i) => (
            <div
              key={i}
              data-reveal
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                padding: 28,
              }}
            >
              {c.icon && <div style={{ fontSize: 28, marginBottom: 14, color: "var(--accent)" }}>{c.icon}</div>}
              <h3 style={{ fontSize: 21, marginBottom: 10 }}>{c.title}</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.55, fontSize: 15 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
