interface Props {
  src: string;
  poster?: string;
  heading?: string;
  sub?: string;
  // Optional gradient overlay direction — default is bottom (Apple: fade content out to bg)
  overlayDir?: "bottom" | "top" | "none";
}

// Full-bleed video scene (Apple). Autoplay muted loop playsinline.
// A gradient overlay fades the video into --bg so the next section merges seamlessly.
// Optional headline and sub text sit centered on top.
export default function VideoScene({ src, poster, heading, sub, overlayDir = "bottom" }: Props) {
  const gradientMap: Record<string, string> = {
    bottom: "linear-gradient(to bottom, transparent 50%, var(--bg) 100%)",
    top: "linear-gradient(to top, transparent 50%, var(--bg) 100%)",
    none: "none",
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        // Height: tall enough to feel cinematic but doesn't require scroll
        height: "clamp(420px, 72vh, 860px)",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Full-bleed video */}
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // Slightly dimmed so overlay text stays legible
          opacity: 0.72,
        }}
      />

      {/* Gradient overlay fades into --bg (matches Apple seamless section blends) */}
      {overlayDir !== "none" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: gradientMap[overlayDir],
            // Also a thin top fade so it merges with the section above
            backgroundImage: `linear-gradient(to bottom,
              color-mix(in srgb, var(--bg) 30%, transparent) 0%,
              transparent 30%,
              transparent 55%,
              var(--bg) 100%)`,
          }}
        />
      )}

      {/* Optional centered copy */}
      {(heading || sub) && (
        <div
          className="container"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 18,
          }}
        >
          {heading && (
            <h2
              data-reveal
              style={{
                fontSize: "clamp(36px, 6vw, 88px)",
                color: "var(--fg)",
                // Subtle shadow so text reads over any video content
                textShadow: "0 2px 24px color-mix(in srgb, var(--bg) 55%, transparent)",
                margin: 0,
              }}
            >
              {heading}
            </h2>
          )}
          {sub && (
            <p
              data-reveal
              style={{
                fontSize: "clamp(16px, 2vw, 22px)",
                color: "var(--muted)",
                maxWidth: 560,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {sub}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
