import DisplaceImage from "./DisplaceImage";
import { projects } from "../../data/projects";

/**
 * L1 composition — the work index.
 * Asymmetric on purpose: tiles alternate width and offset so it never reads as a
 * tidy CMS grid. Each tile is a displacement image + a cursor label, linking into
 * the case study that reads the same data. Hover state is the cursor's job.
 */
export default function WorkGrid() {
  return (
    <div className="f-wrap" style={{ paddingTop: 40, paddingBottom: 120 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "clamp(24px,4vw,72px)" }}>
        {projects.map((p, i) => {
          // lopsided rhythm: wide/narrow, pushed down on alternates
          const span = i % 3 === 0 ? "span 8" : i % 3 === 1 ? "span 4" : "span 7";
          const offset = i % 2 === 1 ? "clamp(40px,8vw,140px)" : "0px";
          return (
            <a key={p.slug} href={`/feral/work/${p.slug}`}
              data-cursor="View"
              className="f-link"
              style={{ gridColumn: span, marginTop: offset, textDecoration: "none" }}>
              <DisplaceImage src={p.cover} alt={p.title}
                style={{ aspectRatio: i % 3 === 1 ? "3 / 4" : "16 / 10", borderRadius: "var(--radius)", border: "1px solid var(--line)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16, gap: 16 }}>
                <h3 className="f-display" style={{ fontSize: "clamp(20px,2.2vw,30px)", fontWeight: 400 }}>{p.title}</h3>
                <span className="f-label" style={{ whiteSpace: "nowrap" }}>{p.idx}</span>
              </div>
              <p className="f-label" style={{ marginTop: 8 }}>{p.client} · {p.discipline}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
