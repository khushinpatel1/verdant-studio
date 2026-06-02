import type { NavLink } from "../../config/types";

interface Props {
  columns: { title: string; links: NavLink[] }[];
  legal?: string;
}

export default function MegaFooter({ columns, legal }: Props) {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "72px 0 48px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 32 }}>
          {columns.map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: 14, marginBottom: 14 }}>{col.title}</h4>
              {col.links.map((l, j) => (
                <a key={j} href={l.href} style={{ display: "block", color: "var(--muted)", fontSize: 14, padding: "6px 0" }}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        {legal && <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 48 }}>{legal}</p>}
      </div>
    </footer>
  );
}
