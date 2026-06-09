import { brand, nav } from "../../data/verdant";

/**
 * VERDANT footer — a forest band that rises out of the cream page on a soft
 * inverted-ellipse edge. Hidden in it: one stray jade stone (the only path to
 * /verdant/emerald), never labelled.
 */
export default function Footer({ tone = "forest" }: { tone?: "forest" | "cream" }) {
  return (
    <footer className={`v-footer v-footer--${tone}`} data-v-reveal>
      <div className="v-footer-edge" aria-hidden />
      <div className="v-wrap v-footer-inner">
        <div className="v-footer-brand">
          <span className="v-footer-mark">
            {brand.wordmark}
            {/* the stray stone → /verdant/emerald */}
            <a href="/verdant/emerald" className="v-footer-egg" aria-label="·" data-cursor=" "><span /></a>
          </span>
          <p className="v-footer-tag">{brand.tagline}</p>
        </div>

        <nav className="v-footer-cols">
          <div className="v-footer-col">
            <p className="v-label v-label--light v-label--bare">Pages</p>
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className="v-footer-link" data-cursor="Go">{l.label}</a>
            ))}
          </div>
          <div className="v-footer-col">
            <p className="v-label v-label--light v-label--bare">Studio</p>
            <a href={`mailto:${brand.email}`} className="v-footer-link" data-cursor="Write">{brand.email}</a>
            <span className="v-footer-meta">Independent</span>
            <span className="v-footer-meta">Privacy-first by design</span>
          </div>
        </nav>
      </div>

      <div className="v-wrap v-footer-legal">
        <span>© 2026 Verdant Studio</span>
        <span>Software grown for people, not advertisers.</span>
      </div>

      <style>{`
        .v-footer { position: relative; margin-top: clamp(4rem,10vh,9rem);
          padding: clamp(6rem,12vh,9rem) 0 3rem; overflow: hidden;
          background: linear-gradient(155deg, var(--forest-900) 0%, var(--forest) 48%, var(--green-600) 100%); }
        .v-footer-edge { position: absolute; top: -1px; left: 0; right: 0; height: 110px;
          background: var(--cream); clip-path: ellipse(72% 100% at 30% 0%); }
        .v-footer--cream .v-footer-edge { background: var(--cream); }
        .v-footer-inner { position: relative; z-index: 1; display: flex; flex-wrap: wrap;
          gap: 2.5rem 4rem; justify-content: space-between; align-items: flex-start; }
        .v-footer-mark { position: relative; font-family: var(--font-display); font-size: 2rem; color: var(--moon); }
        .v-footer-tag { font-family: var(--font-display); font-size: 1.05rem; color: var(--moss-300); margin-top: 0.4rem; }
        .v-footer-cols { display: flex; gap: clamp(2.5rem,6vw,5rem); }
        .v-footer-col { display: flex; flex-direction: column; gap: 0.7rem; }
        .v-footer-col .v-label { margin-bottom: 0.4rem; }
        .v-footer-link { font-family: var(--font-body); font-size: 0.92rem; color: var(--sage); transition: color .25s; }
        .v-footer-link:hover { color: var(--gold); }
        .v-footer-meta { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(200,213,185,0.55); }
        .v-footer-legal { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 0.6rem 2rem; justify-content: space-between;
          margin-top: clamp(3rem,7vh,5rem); padding-top: 1.6rem; border-top: 1px solid rgba(200,213,185,0.14);
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(200,213,185,0.5); }

        /* the stray stone */
        .v-footer-egg { display: inline-block; width: 11px; height: 11px; margin-left: 8px; vertical-align: 3px;
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; rotate: -8deg; }
        .v-footer-egg span { display: block; width: 100%; height: 100%; border-radius: inherit;
          background: radial-gradient(circle at 35% 30%, #5fae7e, #1f6b3a 70%, #123f23); opacity: 0.4;
          box-shadow: inset 0 0 2px rgba(255,255,255,0.4);
          transition: opacity .5s var(--ease), box-shadow .5s var(--ease), scale .5s var(--ease); }
        .v-footer-egg:hover span, .v-footer-egg:focus-visible span {
          opacity: 1; scale: 1.3; box-shadow: inset 0 0 2px rgba(255,255,255,0.6), 0 0 12px rgba(95,174,126,0.75); }
      `}</style>
    </footer>
  );
}
