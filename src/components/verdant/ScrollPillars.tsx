import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Koi from "./ink/Koi";
import Enso from "./ink/Enso";
import Bamboo from "./ink/Bamboo";
import BlossomBranch from "./ink/BlossomBranch";

/**
 * ScrollPillars — Home's signature moment (plan §2B).
 *
 * Desktop / no-motion-preference: a pinned section. As the user scrolls
 * through it, a sculptural ink icon crossfades and the headline + line swap
 * through Garden's four pillars — Anthropic's design-page move, our hand.
 *
 * Icon choice: the four already-built sumi-e components in ink/ (Koi,
 * Enso, Bamboo, BlossomBranch) ARE the "sculptural clay icon" set —
 * built for exactly this kind of moment, on-brand, no raster placeholder
 * needed. `koi.jpg` sits behind each icon as a faint textured backdrop
 * instead of being the icon itself — the fallback asset, used as intended.
 *
 * Touch: no pin (scroll-jacking on touch is hostile). A tappable segmented
 * rail switches the active pillar; icon + copy crossfade via CSS state only.
 *
 * Reduced-motion: static stacked list of all four pillars, nothing pinned,
 * nothing crossfading — everything simply present and readable.
 */

gsap.registerPlugin(ScrollTrigger);

type Pillar = {
  key: string;
  kicker: string;
  headline: string;
  emphasis: string;
  line: string;
  Icon: typeof Koi;
  iconSide: "left" | "right";
  backdrop: "koi";
};

const PILLARS: Pillar[] = [
  {
    key: "private",
    kicker: "01 — Privacy",
    headline: "Private by ",
    emphasis: "structure",
    line:
      "Not by promise. A 3-tier spectrum — manual stays fully local, AI import is touched once by the parser, bank link travels labeled and in the open. You choose the tier; the structure holds it.",
    Icon: Enso,
    iconSide: "right",
    backdrop: "koi",
  },
  {
    key: "grows",
    kicker: "02 — Growth",
    headline: "Grows ",
    emphasis: "with you",
    line:
      "Net worth grows like a tended bed. Debts are weeds, named and pulled one at a time. Goals are seeds — planted with a date, watched until they bloom.",
    Icon: Bamboo,
    iconSide: "left",
    backdrop: "koi",
  },
  {
    key: "honest",
    kicker: "03 — The model",
    headline: "Honest by ",
    emphasis: "model",
    line:
      "You pay for the app — that's the whole business. No ads, no data sold. You're the customer here, never the product.",
    Icon: BlossomBranch,
    iconSide: "right",
    backdrop: "koi",
  },
  {
    key: "offline",
    kicker: "04 — Yours",
    headline: "Yours ",
    emphasis: "offline",
    line:
      "Local-first by default. It works with no signal and no account to start — your numbers are there whether or not anything else is.",
    Icon: Koi,
    iconSide: "left",
    backdrop: "koi",
  },
];

export default function ScrollPillars({
  className = "",
}: {
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"pinned" | "touch" | "static">("pinned");
  const activeRef = useRef(0);

  // Decide the interaction mode once, on mount, and on relevant media changes.
  useEffect(() => {
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchMQ = window.matchMedia("(pointer: coarse)");

    const decide = () => {
      if (reduceMQ.matches) setMode("static");
      else if (touchMQ.matches) setMode("touch");
      else setMode("pinned");
    };
    decide();

    reduceMQ.addEventListener("change", decide);
    touchMQ.addEventListener("change", decide);
    return () => {
      reduceMQ.removeEventListener("change", decide);
      touchMQ.removeEventListener("change", decide);
    };
  }, []);

  // Pinned ScrollTrigger timeline — desktop / fine-pointer / motion-ok only.
  useEffect(() => {
    if (mode !== "pinned") return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const segments = PILLARS.length;
    let st: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${stage.offsetHeight * (segments - 1) + window.innerHeight * 0.6}`,
        pin: stage,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(
            segments - 1,
            Math.floor(self.progress * segments)
          );
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, section);

    return () => {
      st?.kill();
      ctx.revert();
    };
  }, [mode]);

  const goTo = (idx: number) => {
    activeRef.current = idx;
    setActive(idx);
  };

  // ── Reduced-motion: a plain stacked list, everything visible at once ──
  if (mode === "static") {
    return (
      <section
        ref={sectionRef}
        className={`vp-section vp-static ${className}`}
        aria-label="What Garden is built on"
      >
        <ul className="vp-static-list">
          {PILLARS.map((p) => (
            <li key={p.key} className="vp-static-item">
              <div className="vp-static-icon" aria-hidden="true">
                <p.Icon side={p.iconSide} />
              </div>
              <div className="vp-static-copy">
                <p className="v-label v-label--bare">{p.kicker}</p>
                <h3 className="v-display vp-static-head">
                  {p.headline}
                  <em>{p.emphasis}</em>
                </h3>
                <p className="vp-static-line">{p.line}</p>
              </div>
            </li>
          ))}
        </ul>
        <PillarStyles />
      </section>
    );
  }

  const current = PILLARS[active];

  // ── Touch: no pin — a tappable segmented rail drives a crossfade ──
  if (mode === "touch") {
    return (
      <section
        ref={sectionRef}
        className={`vp-section vp-touch ${className}`}
        aria-label="What Garden is built on"
      >
        <div className="vp-touch-stage">
          <div className="vp-icon-wrap" data-backdrop={current.backdrop} aria-hidden="true">
            <div className="vp-icon-backdrop" />
            <div className="vp-icon" key={current.key}>
              <current.Icon side={current.iconSide} />
            </div>
          </div>
          <div className="vp-copy" key={`copy-${current.key}`}>
            <p className="v-label v-label--bare">{current.kicker}</p>
            <h3 className="v-display vp-head">
              {current.headline}
              <em>{current.emphasis}</em>
            </h3>
            <p className="vp-line">{current.line}</p>
          </div>
        </div>
        <div className="vp-rail" role="tablist" aria-label="Pillar selector">
          {PILLARS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`vp-rail-seg ${i === active ? "is-active" : ""}`}
              onClick={() => goTo(i)}
            >
              <span className="vp-rail-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="vp-rail-label">
                {p.headline}
                {p.emphasis}
              </span>
            </button>
          ))}
        </div>
        <PillarStyles />
      </section>
    );
  }

  // ── Pinned (desktop) ──
  return (
    <section
      ref={sectionRef}
      className={`vp-section vp-pinned ${className}`}
      aria-label="What Garden is built on"
    >
      <div ref={stageRef} className="vp-stage">
        <div className="vp-stage-inner">
          <div className="vp-icon-col">
            {PILLARS.map((p, i) => (
              <div
                key={p.key}
                className={`vp-icon-wrap ${i === active ? "is-active" : ""}`}
                data-backdrop={p.backdrop}
                aria-hidden="true"
              >
                <div className="vp-icon-backdrop" />
                <div className="vp-icon">
                  <p.Icon side={p.iconSide} />
                </div>
              </div>
            ))}
          </div>
          <div className="vp-copy-col">
            {PILLARS.map((p, i) => (
              <div
                key={p.key}
                className={`vp-copy ${i === active ? "is-active" : ""}`}
                aria-hidden={i !== active}
              >
                <p className="v-label v-label--bare">{p.kicker}</p>
                <h3 className="v-display vp-head">
                  {p.headline}
                  <em>{p.emphasis}</em>
                </h3>
                <p className="vp-line">{p.line}</p>
              </div>
            ))}
          </div>
          <div className="vp-progress" aria-hidden="true">
            {PILLARS.map((p, i) => (
              <span key={p.key} className={`vp-progress-dot ${i === active ? "is-active" : ""}`} />
            ))}
          </div>
        </div>
      </div>
      <PillarStyles />
    </section>
  );
}

/* Styles co-located with the component (matches Koi.tsx / Moon.tsx convention
   of an inline <style> for self-contained, no-extra-stylesheet pieces). All
   colors reference verdant.css --vars. --radius stays the skin's 4px. */
function PillarStyles() {
  return (
    <style>{`
      .vp-section {
        position: relative;
        background: var(--paper);
      }

      /* ── Icon dressing shared across modes ── */
      .vp-icon-wrap {
        position: relative;
        width: clamp(180px, 22vw, 280px);
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .vp-icon-backdrop {
        position: absolute;
        inset: 6%;
        border-radius: 50%;
        opacity: 0.16;
        background-size: cover;
        background-position: center;
        -webkit-mask-image: radial-gradient(ellipse 58% 58% at 50% 50%, #000 0%, #000 55%, transparent 90%);
        mask-image: radial-gradient(ellipse 58% 58% at 50% 50%, #000 0%, #000 55%, transparent 90%);
      }
      .vp-icon-wrap[data-backdrop="koi"] .vp-icon-backdrop { background-image: url(/verdant/media/koi.jpg); }
      .vp-icon {
        position: relative;
        z-index: 1;
        width: 76%;
        height: 76%;
        color: var(--leaf);
      }

      /* ════════ PINNED (desktop) ════════ */
      .vp-pinned { overflow: visible; }
      .vp-stage {
        height: 100svh;
        display: flex;
        align-items: center;
        overflow: hidden;
      }
      .vp-stage-inner {
        position: relative;
        width: 100%;
        max-width: var(--maxw);
        margin: 0 auto;
        padding-inline: clamp(20px, 5vw, 72px);
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        column-gap: clamp(12px, 1.6vw, 28px);
        align-items: center;
      }
      .vp-icon-col {
        grid-column: 1 / 6;
        position: relative;
        height: clamp(220px, 30vw, 320px);
      }
      .vp-icon-col .vp-icon-wrap {
        position: absolute;
        inset: 0;
        margin: auto;
        opacity: 0;
        transform: scale(0.88);
        transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
      }
      .vp-icon-col .vp-icon-wrap.is-active {
        opacity: 1;
        transform: scale(1);
      }
      .vp-copy-col {
        grid-column: 7 / 13;
        position: relative;
        min-height: clamp(220px, 26vw, 280px);
      }
      .vp-copy {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: translateY(18px);
        transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
        pointer-events: none;
      }
      .vp-copy.is-active {
        opacity: 1;
        transform: none;
        pointer-events: auto;
      }
      .vp-head {
        font-size: var(--display-2);
        color: var(--ink);
        margin-top: 1rem;
        line-height: 1.08;
        max-width: 14ch;
        overflow-wrap: break-word;
      }
      .vp-line {
        font-size: var(--text-lg);
        line-height: 1.65;
        color: var(--ink-soft);
        max-width: 42ch;
        margin-top: 1.4rem;
      }
      .vp-progress {
        grid-column: 1 / 13;
        position: absolute;
        left: 0;
        bottom: clamp(-2.4rem, -4vh, -1.6rem);
        display: flex;
        gap: 0.6rem;
      }
      .vp-progress-dot {
        width: 2.2rem;
        height: 2px;
        background: var(--line);
        transition: background 0.4s var(--ease), width 0.4s var(--ease);
      }
      .vp-progress-dot.is-active {
        background: var(--gold);
        width: 3.6rem;
      }

      @media (max-width: 860px) {
        .vp-icon-col { grid-column: 1 / 13; height: clamp(160px, 50vw, 220px); }
        .vp-copy-col { grid-column: 1 / 13; margin-top: 1.5rem; }
      }

      /* ════════ TOUCH (segmented rail, no pin) ════════ */
      .vp-touch { padding-block: clamp(64px, 10vh, 120px); }
      .vp-touch-stage {
        max-width: var(--maxw);
        margin: 0 auto;
        padding-inline: clamp(20px, 5vw, 72px);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1.6rem;
      }
      .vp-touch .vp-icon-wrap { width: clamp(160px, 44vw, 220px); }
      .vp-touch .vp-icon { animation: vp-fade-in 0.5s var(--ease); }
      .vp-touch .vp-copy { animation: vp-fade-in 0.5s var(--ease); max-width: 32ch; }
      .vp-touch .vp-head { max-width: none; }
      .vp-touch .vp-line { max-width: none; margin-inline: auto; }
      @keyframes vp-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: none; }
      }
      .vp-rail {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 2rem;
        max-width: var(--maxw);
        margin-inline: auto;
        padding-inline: clamp(20px, 5vw, 72px);
      }
      .vp-rail-seg {
        font-family: var(--font-mono);
        font-size: var(--text-2xs);
        letter-spacing: 0.08em;
        color: var(--ink-soft);
        background: var(--paper-soft);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 0.7rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        cursor: pointer;
        min-height: 44px;
        transition: background 0.3s var(--ease), color 0.3s var(--ease), border-color 0.3s var(--ease);
      }
      .vp-rail-seg.is-active {
        background: var(--ink);
        color: var(--paper);
        border-color: var(--ink);
      }
      .vp-rail-num { opacity: 0.6; }

      /* ════════ STATIC (reduced-motion) ════════ */
      .vp-static-list {
        list-style: none;
        margin: 0;
        padding: 0;
        max-width: var(--maxw);
        margin-inline: auto;
        padding-inline: clamp(20px, 5vw, 72px);
      }
      .vp-static-item {
        display: grid;
        grid-template-columns: clamp(120px, 16vw, 180px) 1fr;
        gap: clamp(1.6rem, 4vw, 3rem);
        align-items: center;
        padding: clamp(2rem, 5vh, 3.2rem) 0;
        border-top: 1px solid var(--line);
      }
      .vp-static-item:first-child { border-top: none; }
      .vp-static-icon { color: var(--leaf); }
      .vp-static-head {
        font-size: var(--display-2);
        color: var(--ink);
        margin-top: 0.6rem;
        line-height: 1.1;
      }
      .vp-static-line {
        font-size: var(--text-base);
        line-height: 1.65;
        color: var(--ink-soft);
        max-width: 48ch;
        margin-top: 1rem;
      }
      @media (max-width: 640px) {
        .vp-static-item { grid-template-columns: 1fr; text-align: left; }
        .vp-static-icon { width: 100px; }
      }
    `}</style>
  );
}
