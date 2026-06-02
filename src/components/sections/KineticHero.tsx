import { useEffect, useState } from "react";
import type { NavLink } from "../../config/types";

interface Props {
  prefix?: string;
  words: string[];
  sub?: string;
  media?: string;
  cta?: NavLink;
}

// Kinetic hero (Google) over a full-bleed cinematic backdrop (Apple).
// The accent word cycles; the media sits under a gradient that fades to --bg.
export default function KineticHero({ prefix, words, sub, media, cta }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {media && (
        <img
          src={media}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--bg) 35%, transparent) 0%, var(--bg) 100%)",
        }}
      />
      <div className="container" style={{ position: "relative" }}>
        {prefix && (
          <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: "clamp(15px, 2.4vw, 22px)", marginBottom: 6 }}>
            {prefix}
          </p>
        )}
        <h1 style={{ fontSize: "clamp(52px, 11vw, 150px)" }}>
          <span
            key={i}
            style={{ display: "inline-block", color: "var(--accent)", animation: "pasture-kin 2.2s var(--ease)" }}
          >
            {words[i]}
          </span>
        </h1>
        {sub && (
          <p style={{ color: "var(--fg)", opacity: 0.86, fontSize: "clamp(17px, 2.4vw, 22px)", marginTop: 22, maxWidth: 560, marginInline: "auto" }}>
            {sub}
          </p>
        )}
        {cta && (
          <a
            href={cta.href}
            style={{
              display: "inline-block",
              marginTop: 36,
              background: "var(--accent)",
              color: "#fff",
              padding: "14px 30px",
              borderRadius: "calc(var(--radius) * 0.7)",
              fontWeight: 700,
            }}
          >
            {cta.label}
          </a>
        )}
      </div>
      <style>{`@keyframes pasture-kin {
        0% { opacity: 0; transform: translateY(20px); }
        16%, 84% { opacity: 1; transform: none; }
        100% { opacity: 0; transform: translateY(-20px); }
      }`}</style>
    </section>
  );
}
