import Magnetic from "./Magnetic";

/**
 * Shared footer — a single oversized magnetic mailto, the studio's sign-off, and
 * an honest "this is a Pastures demo" line. Same on every page, so it reads as
 * one site, not five.
 */
export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "clamp(64px,12vw,140px) 0 48px" }}>
      <div className="f-wrap">
        <p className="f-label" style={{ marginBottom: 28 }}><b>◍</b> Start something</p>
        <Magnetic strength={0.25} radius={220}>
          <a href="mailto:studio@feral.example" data-cursor="Email"
            className="f-display f-link"
            style={{ fontSize: "clamp(44px,11vw,170px)", fontWeight: 360, display: "inline-block", letterSpacing: "-0.03em" }}>
            studio@feral
          </a>
        </Magnetic>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24, marginTop: "clamp(48px,9vw,120px)" }}>
          <span className="f-label">FERAL — design & motion, est. 2021</span>
          <span className="f-label">A Pastures demo · imagery via Unsplash</span>
          <span className="f-label">© 2026</span>
        </div>
      </div>
    </footer>
  );
}
