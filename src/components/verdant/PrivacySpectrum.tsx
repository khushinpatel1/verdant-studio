import { useState } from "react";
import { privacySpectrum } from "../../data/verdant";

/**
 * PrivacySpectrum. Security page signature moment (plan §3).
 *
 * An interactive 3-tier toggle. Tap a tier (touch-capable, no hover-only) and
 * the panel below reveals exactly what stays private vs what touches a
 * server for that tier. pulled straight from data/verdant.ts so the honest
 * spectrum is never re-typed or drifted. Tier 3 (bank link) is clearly marked
 * architecture-only; nothing here implies it is live.
 *
 * Motion: a soft cross-dissolve + height settle between tiers, no fade-up.
 * Reduced-motion: the dissolve collapses to an instant swap (CSS handles it).
 */
export default function PrivacySpectrum({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);
  const tier = privacySpectrum[active];

  return (
    <div className={`vsp ${className}`}>
      {/* Tappable tier rail. always works regardless of input */}
      <div className="vsp-rail" role="tablist" aria-label="Privacy tiers">
        {privacySpectrum.map((t, i) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`vsp-rail-btn${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
            data-cursor="View"
          >
            <span className="vsp-rail-n">{t.n}</span>
            <span className="vsp-rail-label">{t.label}</span>
            <span className="vsp-rail-status">{t.status}</span>
          </button>
        ))}
      </div>

      {/* Revealed panel. what's private vs what touches a server */}
      <div className="vsp-panel" key={tier.key}>
        <div className="vsp-panel-head">
          <p className="vsp-panel-what">{tier.what}</p>
          <p className="vsp-panel-reality">{tier.reality}</p>
        </div>

        <div className="vsp-cols">
          <div className="vsp-col vsp-col--private">
            <p className="v-label v-label--bare vsp-col-label">Stays private</p>
            <ul className="vsp-col-list">
              {tier.privateOf.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="vsp-col vsp-col--server">
            <p className="v-label v-label--bare vsp-col-label">Touches a server</p>
            <ul className="vsp-col-list">
              {tier.touchesServer.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .vsp { position: relative; }

        /* ── Tier rail ── */
        .vsp-rail {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          border-bottom: 1px solid var(--line);
          padding-bottom: 0;
        }
        .vsp-rail-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
          background: none;
          border: none;
          border-top: 2px solid transparent;
          padding: 1.1rem 0.4rem 1.3rem;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.3s var(--ease);
        }
        .vsp-rail-n {
          font-family: var(--font-mono);
          font-size: var(--text-2xs);
          letter-spacing: 0.18em;
          color: var(--moss);
        }
        .vsp-rail-label {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          color: var(--ink-soft);
          transition: color 0.3s var(--ease);
        }
        .vsp-rail-status {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--moss);
          opacity: 0.75;
        }
        .vsp-rail-btn.is-active { border-top-color: var(--leaf); }
        .vsp-rail-btn.is-active .vsp-rail-label { color: var(--leaf); }
        .vsp-rail-btn:hover .vsp-rail-label { color: var(--leaf); }

        /* Tier 3 gets a quiet "not live" marker via the status line color */
        .vsp-rail-btn[aria-selected="true"]:nth-child(3) .vsp-rail-status,
        .vsp-rail-btn:nth-child(3) .vsp-rail-status {
          color: var(--gold);
        }

        /* ── Revealed panel ── */
        .vsp-panel {
          padding-top: clamp(1.8rem, 3.5vh, 2.6rem);
          animation: vsp-dissolve 0.5s var(--ease-soft);
        }
        @keyframes vsp-dissolve {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vsp-panel { animation: none; }
        }

        .vsp-panel-what {
          font-family: var(--font-display);
          font-size: var(--display-2);
          color: var(--ink);
          line-height: 1.18;
          max-width: 46ch;
        }
        .vsp-panel-reality {
          color: var(--ink-soft);
          font-size: var(--text-base);
          line-height: 1.6;
          max-width: 50ch;
          margin-top: 0.9rem;
        }

        .vsp-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1.6rem, 4vw, 3.2rem);
          margin-top: clamp(2rem, 4vh, 3rem);
        }
        .vsp-col { border-top: 1px solid var(--line); padding-top: 1.2rem; }
        .vsp-col-label { margin-bottom: 1rem; }
        .vsp-col--private .vsp-col-label { color: var(--leaf); }
        .vsp-col--private .vsp-col-label::before { background: var(--leaf); opacity: 1; }
        .vsp-col--server .vsp-col-label { color: var(--gold); }
        .vsp-col--server .vsp-col-label::before { background: var(--gold); opacity: 1; }
        .vsp-col-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .vsp-col-list li {
          font-size: var(--text-base);
          line-height: 1.55;
          color: var(--ink-soft);
          padding-left: 1.1rem;
          position: relative;
        }
        .vsp-col--private .vsp-col-list li::before {
          content: "";
          position: absolute; left: 0; top: 0.6em;
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--leaf);
        }
        .vsp-col--server .vsp-col-list li::before {
          content: "";
          position: absolute; left: 0; top: 0.6em;
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold);
        }

        @media (max-width: 860px) {
          .vsp-rail { grid-template-columns: 1fr; gap: 0; }
          .vsp-rail-btn { border-top: none; border-left: 2px solid transparent; padding: 0.9rem 0.8rem; }
          .vsp-rail-btn.is-active { border-left-color: var(--leaf); background: var(--paper-soft); }
          .vsp-cols { grid-template-columns: 1fr; gap: 1.6rem; }
        }
      `}</style>
    </div>
  );
}
