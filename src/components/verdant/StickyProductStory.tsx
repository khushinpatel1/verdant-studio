import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * StickyProductStory. Three-chapter product narrative (plan §2B).
 *
 * One stable product canvas with three chapters that enter the viewport
 * sequentially. As each chapter enters, the UI state changes via GSAP:
 * cards detach, enlarge, become sheets. No simple fade-ins.
 *
 * Chapters:
 *  1. Understand money — garden home screen focus
 *  2. Plan forward — garden plan screen focus
 *  3. Protect data — privacy/security focus
 *
 * Motion: scroll-driven state changes. Touch/reduced-motion: static rail.
 */

type Chapter = {
  key: string;
  title: string;
  headline: string;
  body: string;
  color: string;
  icon: string;
};

const CHAPTERS: Chapter[] = [
  {
    key: "understand",
    title: "Understand money",
    headline: "Everything, at a glance.",
    body: "Net worth, every account, and one honest health score. No hidden numbers, no buried alerts. Just clarity.",
    color: "var(--leaf)",
    icon: "🏠",
  },
  {
    key: "plan",
    title: "Plan forward",
    headline: "A date on every goal.",
    body: "Debt payoff timelines, savings targets, and the real year you'll be free. Goals with deadlines, ordered by what matters first.",
    color: "var(--moss)",
    icon: "📍",
  },
  {
    key: "protect",
    title: "Protect data",
    headline: "Privacy by design.",
    body: "You choose how much to sync. Manual entry stays local. Bank connections are labeled plaintext. Full control, no guessing.",
    color: "var(--gold)",
    icon: "🔒",
  },
];

export default function StickyProductStory({ className = "" }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReduced || isTouch) return;

    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current || !canvasRef.current) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const stepCount = CHAPTERS.length;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * 2.4}`,
      pin: canvas,
      pinSpacing: true,
      onUpdate(self) {
        const idx = Math.min(stepCount - 1, Math.floor(self.progress * stepCount));
        setActiveChapter(idx);

        // Card detach animation: scale and lift as chapter enters
        const cards = canvas.querySelectorAll(".sps-card");
        cards.forEach((card, i) => {
          if (i === idx) {
            gsap.to(card, {
              scale: 1.08,
              y: -12,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            });
          } else {
            gsap.to(card, {
              scale: 0.95,
              y: 8,
              opacity: 0.5,
              duration: 0.6,
              ease: "power2.out",
            });
          }
        });
      },
      onToggle(self) {
        setPinned(self.isActive);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const goToChapter = (idx: number) => {
    setActiveChapter(Math.max(0, Math.min(CHAPTERS.length - 1, idx)));
  };

  const chapter = CHAPTERS[activeChapter];

  return (
    <div ref={sectionRef} className={`sps-section ${className}`} data-pinned={pinned || undefined}>
      <div ref={canvasRef} className="sps-canvas">
        <div className="v-wrap sps-inner">
          {/* Copy column. changes per chapter */}
          <div className="sps-copy">
            <span className="v-label v-label--bare">0{activeChapter + 1}. {chapter.title}</span>
            <div className="sps-icon" style={{ color: chapter.color }} aria-hidden="true">
              {chapter.icon}
            </div>
            <h2 className="v-display sps-headline">{chapter.headline}</h2>
            <p className="sps-body">{chapter.body}</p>

            {/* Tappable chapter rail */}
            <div className="sps-rail" role="tablist" aria-label="Product story chapters">
              {CHAPTERS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={i === activeChapter}
                  className={`sps-rail-btn${i === activeChapter ? " is-active" : ""}`}
                  onClick={() => goToChapter(i)}
                  data-cursor="View"
                  style={i === activeChapter ? { color: c.color } : {}}
                >
                  <span className="sps-rail-icon">{c.icon}</span>
                  <span>{c.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product canvas. cards shift and scale */}
          <div className="sps-canvas-frame">
            {CHAPTERS.map((c, i) => (
              <div
                key={c.key}
                className={`sps-card${i === activeChapter ? " is-active" : ""}`}
                style={{
                  transform: i === activeChapter ? "scale(1.08) translateY(-12px)" : "scale(0.95) translateY(8px)",
                  opacity: i === activeChapter ? 1 : 0.5,
                }}
              >
                <div className="sps-card-head" style={{ borderTopColor: c.color }}>
                  <span className="sps-card-n">0{i + 1}</span>
                  <h3 className="sps-card-title">{c.title}</h3>
                </div>
                <div className="sps-card-body">
                  <p className="sps-card-headline">{c.headline}</p>
                  <p className="sps-card-text">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sps-section {
          position: relative;
          background: var(--paper);
        }
        .sps-canvas {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding-block: clamp(60px, 10vh, 120px);
        }
        .sps-inner {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(2.5rem, 6vw, 6rem);
          align-items: center;
          width: 100%;
        }

        .sps-copy { max-width: 42ch; }
        .sps-icon {
          font-size: 2rem;
          display: inline-block;
          margin: 1.4rem 0 0.6rem;
        }
        .sps-headline {
          font-size: var(--display-2);
          color: var(--ink);
          line-height: 1.12;
          margin: 0.4rem 0 1rem;
        }
        .sps-body {
          color: var(--ink-soft);
          font-size: var(--text-base);
          line-height: 1.6;
          max-width: 42ch;
        }

        /* Chapter rail */
        .sps-rail {
          display: flex;
          gap: 0.4rem;
          margin-top: clamp(2rem, 4vh, 3rem);
          flex-wrap: wrap;
          border-top: 1px solid var(--line);
          padding-top: 1.2rem;
        }
        .sps-rail-btn {
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
        .sps-rail-btn:hover { color: var(--leaf); }
        .sps-rail-btn.is-active {
          background: var(--paper-soft);
        }

        /* Product canvas */
        .sps-canvas-frame {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          height: 500px;
          width: 100%;
        }
        .sps-card {
          position: absolute;
          width: 100%;
          max-width: 360px;
          background: var(--paper-soft);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 2rem;
          transition: all 0.6s var(--ease-soft);
          pointer-events: none;
        }
        .sps-card.is-active {
          pointer-events: auto;
          z-index: 10;
        }
        .sps-card-head {
          border-top: 2px solid var(--leaf);
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
        }
        .sps-card-n {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--moss);
        }
        .sps-card-title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          color: var(--ink);
          margin: 0;
        }
        .sps-card-body { }
        .sps-card-headline {
          font-size: var(--text-xl);
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 0.8rem;
          line-height: 1.3;
        }
        .sps-card-text {
          font-size: var(--text-sm);
          color: var(--ink-soft);
          line-height: 1.6;
          margin: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .sps-card { transition: none; }
        }

        @media (max-width: 860px) {
          .sps-canvas { min-height: auto; padding-block: clamp(48px, 8vh, 80px); }
          .sps-inner { grid-template-columns: 1fr; }
          .sps-copy { max-width: none; order: 2; }
          .sps-canvas-frame { order: 1; margin-bottom: 1.5rem; height: 400px; }
        }
      `}</style>
    </div>
  );
}
