interface Props {
  heading: string;
  body?: string;
  media?: string;
  align?: "left" | "right";
}

// Text + media split that rises into focus on scroll (Apple reveal).
export default function RevealBlock({ heading, body, media, align = "left" }: Props) {
  const text = (
    <div data-reveal key="text">
      <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", marginBottom: 20 }}>{heading}</h2>
      {body && (
        <p style={{ color: "var(--muted)", fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, maxWidth: 520 }}>
          {body}
        </p>
      )}
    </div>
  );

  const image = media ? (
    <div data-reveal key="media">
      <img src={media} alt="" style={{ width: "100%", borderRadius: "var(--radius)" }} />
    </div>
  ) : null;

  return (
    <section>
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: media ? "1fr 1fr" : "1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        {align === "right" && image ? [image, text] : [text, image]}
      </div>
    </section>
  );
}
