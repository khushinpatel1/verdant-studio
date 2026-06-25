import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { garden } from "../../data/verdant";

/**
 * GardenTour — the product-tour signature moment (plan §2A).
 *
 * A framed device pinned center-stage. As the visitor scrolls (desktop,
 * fine pointer) OR taps the segmented rail (touch, or anyone), the screen
 * inside swaps through Garden's real screens — Home → Money → Plan → Grove —
 * while the surrounding copy + a small sculptural icon change to narrate
 * each stop. Built from garden.screens + garden.grove in data/verdant.ts —
 * no copy is invented here.
 *
 * Motion:
 *  - Fine pointer, no reduced-motion: GSAP ScrollTrigger pins the section
 *    and steps the active stop as the user scrolls through it — the classic
 *    "scrollytelling" device. No fade-in-up: the screen swap is a soft
 *    cross-dissolve (the device frame itself never moves).
 *  - Touch OR reduced-motion: no pin (avoids the jank of pinning on touch
 *    and respects the OS setting). The rail is always tappable regardless
 *    of input — "no hover-only" — so touch users drive the tour by tapping.
 *
 * PLACEHOLDER: the four images below (garden-home/money/plan/grove.webp)
 * are the current Garden screenshots — see plan §2A, do not reshoot. They
 * are clearly temporary; swap at beta per the video-ready note below.
 */

type TourStop = {
  key: string;
  tab: string;
  img: string;
  line: string;
  body: string;
};

// Build the four tour stops straight from the single source of truth.
// garden.screens already carries Home/Money/Plan; Grove is appended last
// (it's a presence reachable from anywhere, not a tab — same shape here).
const STOPS: TourStop[] = [
  ...garden.screens.map((s) => ({
    key: s.tab.toLowerCase(),
    tab: s.tab,
    img: s.img, // PLACEHOLDER — current Garden screenshots, see plan §2A
    line: s.line,
    body: s.body,
  })),
  {
    key: garden.grove.tab.toLowerCase(),
    tab: garden.grove.tab,
    img: garden.grove.img, // PLACEHOLDER — current Garden screenshot, see plan §2A
    line: garden.grove.line,
    body: garden.grove.body,
  },
];

// One small sculptural glyph per stop — currentColor, reads at rail size.
// Not the big sumi-e ink set (those are full illustrations); these are
// quiet line icons sized for a tab.
function StopIcon({ stop }: { stop: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (stop) {
    case "home":
      // a roofline over a single ground line — "everything, at a glance"
      return (
        <svg {...common}>
          <path d="M4 12.5 12 5l8 7.5" />
          <path d="M6.5 11v7.5h11V11" />
          <path d="M10 18.5v-4.5h4v4.5" />
        </svg>
      );
    case "money":
      // a stem with two leaves branching — where it goes / what's pruned
      return (
        <svg {...common}>
          <path d="M12 19V7" />
          <path d="M12 11c0-2.6 1.8-4.4 4.4-4.6" />
          <path d="M12 15.2c0-2.2-1.6-3.8-4-4" />
        </svg>
      );
    case "plan":
      // a horizon line with a marker — a date on every goal
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="3.4" />
          <path d="M12 12.4V19" />
          <path d="M6 19h12" />
        </svg>
      );
    case "grove":
      // a small grove — three trunks of varying height (the presence, not a tab)
      return (
        <svg {...common}>
          <path d="M7 19V13.5" />
          <path d="M12 19V10" />
          <path d="M17 19V14.5" />
          <path d="M4.5 13.5 7 9l2.5 4.5" />
          <path d="M9 10 12 5l3 5" />
          <path d="M14.5 14.5 17 10l2.5 4.5" />
        </svg>
      );
    default:
      return <svg {...common} />;
  }
}

interface GardenTourProps {
  className?: string;
}

export default function GardenTour({ className = "" }: GardenTourProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    // Touch or reduced-motion: static, rail-driven only — no pin, no scroll-step.
    if (prefersReduced || isTouch) return;

    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current || !pinRef.current) return;

    const section = sectionRef.current;
    const pinTarget = pinRef.current;
    const stepCount = STOPS.length;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * 1.8}`,
      pin: pinTarget,
      pinSpacing: true,
      onUpdate(self) {
        const idx = Math.min(stepCount - 1, Math.floor(self.progress * stepCount));
        setActive(idx);
      },
      onToggle(self) {
        setPinned(self.isActive);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const goTo = (idx: number) => setActive(Math.max(0, Math.min(STOPS.length - 1, idx)));

  return (
    <div ref={sectionRef} className={`vgt-section ${className}`} data-pinned={pinned || undefined}>
      <div ref={pinRef} className="vgt-pin">
        <div className="v-wrap vgt-inner">
          {/* ── Copy column — changes per stop, never the frame ── */}
          <div className="vgt-copy">
            <span className="v-label v-label--bare">0{active + 1} — {STOPS[active].tab}</span>
            <div className="vgt-icon" aria-hidden="true">
              <StopIcon stop={STOPS[active].key} />
            </div>
            <h2 className="v-display vgt-line">{STOPS[active].line}</h2>
            <p className="vgt-body">{STOPS[active].body}</p>

            {/* Tappable segmented rail — touch-capable, no hover-only.
                This is the ONLY way touch/reduced-motion visitors move
                through the tour, and it always works alongside scroll. */}
            <div className="vgt-rail" role="tablist" aria-label="Garden tour">
              {STOPS.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`vgt-rail-btn${i === active ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                  data-cursor="View"
                >
                  <StopIcon stop={s.key} />
                  <span>{s.tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Framed device — the slot itself never moves; only the
              screen inside cross-dissolves between stops. ── */}
          <div className="vgt-frame">
            <div className="vgt-frame-bezel">
              {/*
                VIDEO-READY SLOT — to drop the real product-demo video in
                later with zero layout change:
                  1. Replace the .vgt-frame-screen <img> stack below with a
                     single <video> element carrying the same className
                     (vgt-frame-screen-el), e.g.:
                       <video
                         className="vgt-frame-screen-el"
                         src={garden.demoVideo}
                         autoPlay muted loop playsInline
                         poster={STOPS[0].img}
                       />
                  2. Drop the per-stop <img> map entirely (or keep it as the
                     <noscript>/poster fallback for reduced-motion).
                  3. Keep ScrollTrigger driving `currentTime` on the video
                     instead of `active` (scrub the video to progress * duration)
                     if a scroll-scrubbed video is wanted instead of a single loop.
                The bezel/aspect-ratio/mask never change — same frame, same slot.
              */}
              <div className="vgt-frame-screen">
                {STOPS.map((s, i) => (
                  <img
                    key={s.key}
                    src={s.img}
                    alt={`Garden — ${s.tab}`}
                    className={`vgt-frame-screen-el${i === active ? " is-active" : ""}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    width="780"
                    height="1688"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .vgt-section {
          position: relative;
          background: var(--paper);
        }
        .vgt-pin {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding-block: clamp(60px, 10vh, 120px);
        }
        .vgt-inner {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(2.5rem, 6vw, 6rem);
          align-items: center;
          width: 100%;
        }

        .vgt-copy { max-width: 42ch; }
        .vgt-icon {
          color: var(--leaf);
          margin: 1.4rem 0 0.6rem;
          width: 22px;
          height: 22px;
        }
        .vgt-line {
          font-size: var(--display-2);
          color: var(--ink);
          line-height: 1.12;
          margin: 0.4rem 0 1rem;
        }
        .vgt-body {
          color: var(--ink-soft);
          font-size: var(--text-base);
          line-height: 1.6;
          max-width: 42ch;
        }

        /* ── Segmented rail — tappable, touch-capable, no hover-only ── */
        .vgt-rail {
          display: flex;
          gap: 0.4rem;
          margin-top: clamp(2rem, 4vh, 3rem);
          flex-wrap: wrap;
          border-top: 1px solid var(--line);
          padding-top: 1.2rem;
        }
        .vgt-rail-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          padding: 0.6rem 0.85rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-soft);
          cursor: pointer;
          border-radius: var(--radius);
          transition: color 0.3s var(--ease), background 0.3s var(--ease);
        }
        .vgt-rail-btn svg { flex: none; width: 16px; height: 16px; opacity: 0.7; transition: opacity 0.3s var(--ease); }
        .vgt-rail-btn:hover { color: var(--leaf); }
        .vgt-rail-btn.is-active {
          color: var(--leaf);
          background: var(--paper-soft);
        }
        .vgt-rail-btn.is-active svg { opacity: 1; }

        /* ── Framed device — the slot that never moves ── */
        .vgt-frame {
          display: flex;
          justify-content: center;
        }
        .vgt-frame-bezel {
          --rad: 42px;
          --pad: 10px;
          position: relative;
          width: clamp(240px, 27vw, 320px);
          aspect-ratio: 400 / 812;
          border-radius: var(--rad);
          padding: var(--pad);
          background: linear-gradient(160deg, #f0f2ed 0%, #e8ebe6 46%, #dfe4d7 100%);
          box-shadow:
            0 40px 90px -24px rgba(13, 31, 7, 0.18),
            0 0 0 1px rgba(47, 125, 79, 0.08),
            0 2px 0 rgba(255, 255, 255, 0.6) inset,
            0 -2px 8px rgba(0, 0, 0, 0.06) inset;
        }
        .vgt-frame-bezel::after {
          content: "";
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 38%;
          height: 7px;
          border-radius: 5px;
          background: rgba(47, 125, 79, 0.2);
          z-index: 2;
        }
        /* The screen slot itself — this is the <video>-ready container.
           Sized/clipped here; whatever fills it (img stack today, a single
           <video> later) is just object-fit: cover inside this box. */
        .vgt-frame-screen {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: calc(var(--rad) - var(--pad));
          background: var(--paper);
        }
        .vgt-frame-screen-el {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 0;
          opacity: 0;
          transition: opacity 0.6s var(--ease-soft);
        }
        .vgt-frame-screen-el.is-active {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .vgt-frame-screen-el { transition: none; }
        }

        @media (max-width: 860px) {
          .vgt-pin { min-height: auto; padding-block: clamp(48px, 8vh, 80px); }
          .vgt-inner { grid-template-columns: 1fr; }
          .vgt-copy { max-width: none; order: 2; }
          .vgt-frame { order: 1; margin-bottom: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
