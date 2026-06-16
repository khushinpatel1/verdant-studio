import { brand, nav } from "../../data/verdant";
import Logo from "./Logo";

/**
 * VERDANT footer — a light band on luminous gradient. Hidden in it: one stray
 * jade stone (the only path to /verdant/emerald), never labelled.
 */
export default function Footer({ tone = "light" }: { tone?: "light" | "cream" }) {
  return (
    <footer className={`v-footer v-footer--${tone}`} data-v-reveal>
      <div className="v-wrap v-footer-inner">
        <div className="v-footer-brand">
          <span className="v-footer-mark">
            <Logo size={26} />
            {/* the stray stone → /verdant/emerald */}
            <a href="/verdant/emerald" className="v-footer-egg" aria-label="·"><span /></a>
          </span>
          <p className="v-footer-tag">{brand.tagline}</p>
        </div>

        <nav className="v-footer-cols">
          <div className="v-footer-col">
            <p className="v-label v-label--bare">Pages</p>
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className="v-footer-link">{l.label}</a>
            ))}
          </div>
          <div className="v-footer-col">
            <p className="v-label v-label--bare">Studio</p>
            <a href={`mailto:${brand.email}`} className="v-footer-link">{brand.email}</a>
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
          background: linear-gradient(135deg, var(--mist), var(--dawn)); }
        .v-footer-inner { position: relative; z-index: 1; display: flex; flex-wrap: wrap;
          gap: 2.5rem 4rem; justify-content: space-between; align-items: flex-start; }
        .v-footer-mark { position: relative; display: inline-flex; align-items: center; font-size: var(--text-xl); color: var(--leaf); }
        .v-footer-tag { font-family: var(--font-display); font-size: var(--text-lg); color: var(--ink-soft); margin-top: 0.4rem; }
        .v-footer-cols { display: flex; gap: clamp(2.5rem,6vw,5rem); }
        .v-footer-col { display: flex; flex-direction: column; gap: 0.7rem; }
        .v-footer-col .v-label { margin-bottom: 0.4rem; color: var(--ink); }
        .v-footer-link { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); transition: color .25s; }
        .v-footer-link:hover { color: var(--leaf); }
        .v-footer-meta { font-family: var(--font-mono); font-size: var(--text-2xs); letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); }
        .v-footer-legal { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 0.6rem 2rem; justify-content: space-between;
          margin-top: clamp(3rem,7vh,5rem); padding-top: 1.6rem; border-top: 1px solid rgba(22, 36, 27, 0.1);
          font-family: var(--font-mono); font-size: var(--text-2xs); letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }

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
