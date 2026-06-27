import { brand, ethos } from "../../data/verdant";
import Logo from "./Logo";

/**
 * VERDANT footer. three-column structure: Product, Trust, Studio.
 * Hidden: one stray jade stone (the only path to /verdant/emerald), never labelled.
 */
export default function Footer({ tone = "light" }: { tone?: "light" | "cream" }) {
  return (
    <footer className={`v-footer v-footer--${tone}`}>
      <div className="v-wrap v-footer-inner">
        {/* Brand + mark + stone */}
        <div className="v-footer-brand">
          <span className="v-footer-mark">
            <Logo size={26} />
            {/* the stray stone → /verdant/emerald */}
            <a href="/verdant/emerald" className="v-footer-egg" aria-label="·"><span /></a>
          </span>
          <p className="v-footer-tag">Independent · Privacy-first</p>
        </div>

        {/* Three-column nav */}
        <nav className="v-footer-cols">
          {/* Product column */}
          <div className="v-footer-col">
            <p className="v-label v-label--bare">Product</p>
            <a href="/verdant/garden" className="v-footer-link">Garden</a>
            <a href="/verdant/pricing" className="v-footer-link">Pricing</a>
            <a href="/verdant/beta" className="v-footer-link">Join the beta</a>
            <a href="/verdant/notes" className="v-footer-link">Changelog</a>
          </div>

          {/* Trust column */}
          <div className="v-footer-col">
            <p className="v-label v-label--bare">Trust</p>
            <a href="/verdant/security" className="v-footer-link">Security</a>
            <a href="/privacy" className="v-footer-link">Privacy</a>
            <a href="/terms" className="v-footer-link">Terms</a>
            <a href="/verdant/security#data" className="v-footer-link">Your data rights</a>
          </div>

          {/* Studio column */}
          <div className="v-footer-col">
            <p className="v-label v-label--bare">Studio</p>
            <a href="/verdant" className="v-footer-link">Studio</a>
            <a href="/verdant/ethos" className="v-footer-link">Ethos</a>
            <a href="/verdant/faq" className="v-footer-link">FAQ</a>
            <a href={`mailto:${brand.email}`} className="v-footer-link">Contact</a>
          </div>
        </nav>
      </div>

      <div className="v-wrap v-footer-legal">
        <div>
          <span>© 2026 Verdant Studio</span>
          <span style={{ marginLeft: "1.6rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)" }}>v{ethos.version} · {ethos.launched}</span>
        </div>
        <span>An independent software studio. We sell software, not you.</span>
      </div>

      <style>{`
        .v-footer { position: relative; margin-top: clamp(4rem,10vh,9rem);
          padding: clamp(6rem,12vh,9rem) 0 3rem; overflow: hidden;
          background: var(--cream);
          border-top: 1px solid var(--line); }
        .v-footer::before { content: ''; position: absolute; inset: 0; background:
          linear-gradient(180deg, transparent 0%, rgba(13,31,7,0.02) 50%, rgba(13,31,7,0.04) 100%);
          pointer-events: none; z-index: 0; }
        .v-footer-inner { position: relative; z-index: 1; display: flex; flex-wrap: wrap;
          gap: 2.5rem 4rem; justify-content: space-between; align-items: flex-start; }
        .v-footer-brand { display: flex; flex-direction: column; gap: 0.8rem; }
        .v-footer-mark { position: relative; display: inline-flex; align-items: center; font-size: var(--text-xl); color: var(--green); }
        .v-footer-tag { font-family: var(--font-mono); font-size: var(--text-2xs); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 0; }
        .v-footer-cols { display: flex; gap: clamp(2.5rem,6vw,5rem); }
        .v-footer-col { display: flex; flex-direction: column; gap: 0.7rem; }
        .v-footer-col .v-label { margin-bottom: 0.4rem; color: var(--muted); }
        .v-footer-link { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); transition: color .25s; }
        .v-footer-link:hover { color: var(--green); }
        .v-footer-legal { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 0.6rem 2rem; justify-content: space-between;
          margin-top: clamp(3rem,7vh,5rem); padding-top: 1.6rem; border-top: 1px solid var(--line);
          font-family: var(--font-mono); font-size: var(--text-2xs); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }

        /* the stray stone */
        .v-footer-egg { display: inline-block; width: 11px; height: 11px; margin-left: 8px; vertical-align: 3px;
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; rotate: -8deg; }
        .v-footer-egg span { display: block; width: 100%; height: 100%; border-radius: inherit;
          background: radial-gradient(circle at 35% 30%, #5fae7e, #1f6b3a 70%, #123f23); opacity: 0.4;
          box-shadow: inset 0 0 2px rgba(255,255,255,0.4);
          transition: opacity .5s var(--ease), box-shadow .5s var(--ease), scale .5s var(--ease); }
        .v-footer-egg:hover span, .v-footer-egg:focus-visible span {
          opacity: 1; scale: 1.3; box-shadow: inset 0 0 2px rgba(255,255,255,0.6), 0 0 12px rgba(95,174,126,0.75); }

        @media (max-width: 640px) {
          .v-footer { padding: clamp(4rem,12vh,6rem) 0 2.5rem; }
          .v-footer-inner { flex-direction: column; gap: 2.5rem; }
          .v-footer-cols { flex-wrap: wrap; gap: 2rem 2.5rem; }
          .v-footer-legal { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        }
      `}</style>
    </footer>
  );
}
