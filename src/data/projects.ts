// One source of truth, read by /work (index) and /work/[slug] (case study).
// That shared read is the "pages interact" wiring — pick a project on one page,
// land on its story on the next, same data, no duplication.

export interface Chapter { n: string; title: string; body: string; img: string; }
export interface Project {
  slug: string;
  idx: string;
  title: string;
  client: string;
  year: string;
  discipline: string;
  summary: string;
  cover: string;
  chapters: Chapter[];
}

const u = (id: string) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

export const projects: Project[] = [
  {
    slug: "kiln",
    idx: "01",
    title: "A foundry that remembers its hands",
    client: "Kiln Ceramics",
    year: "2025",
    discipline: "Identity · Web · Motion",
    summary:
      "Kiln had been selling online for six years and still photographed everything on a kitchen table. We rebuilt the whole front of house around the kiln itself.",
    cover: u("photo-1610701596007-11502861dcfa"),
    chapters: [
      { n: "01 / Brief", title: "Sell the wait, not the mug", body: "Kiln's pieces take eleven days to fire. The old site hid that. We made the eleven days the product.", img: u("photo-1565193566173-7a0ee3dbe261") },
      { n: "02 / System", title: "A grid that cracks like glaze", body: "The layout breaks its own columns on the case studies, the way a glaze crazes. Deliberate, never twice the same.", img: u("photo-1493106641515-6b5631de4bb9") },
      { n: "03 / Result", title: "Pre-orders up, returns down", body: "People who understood the eleven days stopped asking where their order was. Support tickets fell by about a third.", img: u("photo-1578749556568-bc2c40e68b61") },
    ],
  },
  {
    slug: "halflight",
    idx: "02",
    title: "Scoring a record label after dark",
    client: "Halflight Records",
    year: "2025",
    discipline: "Art Direction · Web · WebGL",
    summary:
      "An independent label that releases almost everything at midnight wanted a site that felt like the room those records get made in. Low, warm, a little broken.",
    cover: u("photo-1493225457124-a3eb161ffa5f"),
    chapters: [
      { n: "01 / Tone", title: "Build for the 1am scroll", body: "Nobody browses a label at noon. We tuned contrast and motion for tired eyes in dark rooms.", img: u("photo-1470225620780-dba8ba36b745") },
      { n: "02 / Craft", title: "Cover art that warps to the cursor", body: "Each release cover distorts under the pointer, so flipping through the catalogue feels like handling vinyl.", img: u("photo-1511671782779-c97d3d27a1d4") },
      { n: "03 / Launch", title: "A drop people stayed up for", body: "The midnight release page held three thousand people at once on a Worker. It did not flinch.", img: u("photo-1459749411175-04bf5292ceea") },
    ],
  },
  {
    slug: "field",
    idx: "03",
    title: "Mapping a thousand acres you can walk",
    client: "Field Trust",
    year: "2024",
    discipline: "Web · Data · Cartography",
    summary:
      "A small land trust manages reserves across three counties and wanted people to actually visit them, not just donate and forget.",
    cover: u("photo-1500382017468-9049fed747ef"),
    chapters: [
      { n: "01 / Problem", title: "Donors who'd never seen the land", body: "Giving was steady. Footfall was almost nothing. The site treated the reserves like a balance sheet.", img: u("photo-1441974231531-c6227db76b6e") },
      { n: "02 / Approach", title: "Every reserve, one honest map", body: "We drew each site by hand, marked where the mud is, where the bench is, what's flowering this week.", img: u("photo-1418065460487-3e41a6c84dc5") },
      { n: "03 / Outcome", title: "Car parks that filled up", body: "Two reserves had to add parking the following spring. That's the metric the trust actually cared about.", img: u("photo-1472214103451-9374bd1c798e") },
    ],
  },
  {
    slug: "press",
    idx: "04",
    title: "A type foundry that ships its mistakes",
    client: "Press Type",
    year: "2024",
    discipline: "Identity · Specimen · Variable Fonts",
    summary:
      "Press releases fonts with the rough edges left in. They wanted a specimen site honest enough to show the wonk, not airbrush it.",
    cover: u("photo-1457369804613-52c61a468e7d"),
    chapters: [
      { n: "01 / Voice", title: "Let the letters misbehave", body: "Every heading on the site runs the live variable axes, including the WONK one most foundries hide.", img: u("photo-1467232004584-a241de8bcf5d") },
      { n: "02 / Tooling", title: "A tester you can't put down", body: "Type your name, drag the weight, watch it warp. Most visits start here and don't leave for minutes.", img: u("photo-1519682337058-a94d519337bc") },
      { n: "03 / Sales", title: "Trial-to-licence, doubled", body: "Giving people the real, slightly-broken font in the browser sold more than any clean PDF ever did.", img: u("photo-1453928582365-b6ad33cbcf64") },
    ],
  },
];

export const bySlug = (s: string) => projects.find((p) => p.slug === s);
