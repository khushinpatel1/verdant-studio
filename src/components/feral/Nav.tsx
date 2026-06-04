import Magnetic from "./Magnetic";

/**
 * Persistent nav — fixed, blend-mode so it reads over ink or image, magnetic
 * links. Highlights the current page from the path. Lives in the layout, so it
 * survives view transitions (it's outside the swapped content).
 */
export default function Nav({ path = "/feral" }: { path?: string }) {
  const links = [
    { href: "/feral", label: "Index" },
    { href: "/feral/work", label: "Work" },
    { href: "/feral/studio", label: "Studio" },
    { href: "/feral/contact", label: "Contact" },
  ];
  const here = (h: string) => (h === "/feral" ? path === "/feral" : path.startsWith(h));
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "22px clamp(20px,4vw,40px)", mixBlendMode: "difference",
    }}>
      <a href="/feral" data-cursor="Home" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "#fff", letterSpacing: "-0.03em" }}>
        FERAL<span style={{ color: "var(--accent)" }}>.</span>
      </a>
      <div style={{ display: "flex", gap: "clamp(14px,2.4vw,34px)", alignItems: "center" }}>
        {links.map((l) => (
          <Magnetic key={l.href} strength={0.5} radius={70}>
            <a href={l.href} data-cursor=""
              style={{
                fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#fff", opacity: here(l.href) ? 1 : 0.55,
              }}>
              {here(l.href) ? "● " : ""}{l.label}
            </a>
          </Magnetic>
        ))}
      </div>
    </nav>
  );
}
