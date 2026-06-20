import { useState } from "react";

/**
 * FAQAccordion — Accessible, touch-capable accordion (plan §3).
 *
 * Each Q is a button that toggles its A visible. Multiple items can be open.
 * Touch: tappable anywhere on the item (not hover-only). Keyboard: Enter/Space
 * to toggle, arrows to navigate. Reduced-motion: instant open/close, no collapse
 * animation. ARIA: proper roles, aria-expanded, aria-controls so screen readers
 * announce state changes.
 *
 * No emoji headings. Copy is honest per the privacy spectrum (manual/AI/bank).
 */

type FAQItem = {
  q: string;
  a: string;
};

export default function FAQAccordion({ items, className = "" }: { items: FAQItem[]; className?: string }) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpen = new Set(openIds);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenIds(newOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleItem(id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const buttons = document.querySelectorAll(`[data-faq-id]`);
      const currentIndex = Array.from(buttons).findIndex(
        (btn) => (btn as HTMLElement).getAttribute("data-faq-id") === String(id)
      );
      if (currentIndex < buttons.length - 1) {
        (buttons[currentIndex + 1] as HTMLButtonElement).focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const buttons = document.querySelectorAll(`[data-faq-id]`);
      const currentIndex = Array.from(buttons).findIndex(
        (btn) => (btn as HTMLElement).getAttribute("data-faq-id") === String(id)
      );
      if (currentIndex > 0) {
        (buttons[currentIndex - 1] as HTMLButtonElement).focus();
      }
    }
  };

  return (
    <div className={`vfaq ${className}`}>
      {items.map((item, i) => {
        const isOpen = openIds.has(i);
        return (
          <div key={i} className={`vfaq-item${isOpen ? " is-open" : ""}`} data-v-reveal style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}>
            <button
              className="vfaq-trigger"
              aria-expanded={isOpen}
              aria-controls={`vfaq-panel-${i}`}
              onClick={() => toggleItem(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              data-faq-id={i}
              type="button"
            >
              <span className="vfaq-icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
              <h3 className="vfaq-question">{item.q}</h3>
            </button>

            <div
              id={`vfaq-panel-${i}`}
              className="vfaq-panel"
              role="region"
              aria-labelledby={`vfaq-trigger-${i}`}
              hidden={!isOpen}
            >
              <div className="vfaq-answer">{item.a}</div>
            </div>
          </div>
        );
      })}

      <style>{`
        .vfaq { display: flex; flex-direction: column; gap: 0; }

        /* ── Item wrapper ── */
        .vfaq-item {
          border-top: 1px solid var(--line);
          transition: background 0.2s var(--ease-soft);
        }
        .vfaq-item:last-child {
          border-bottom: 1px solid var(--line);
        }
        .vfaq-item.is-open {
          background: rgba(47, 125, 79, 0.02);
        }

        /* ── Trigger button — full-width tap target, no visual hover-states ── */
        .vfaq-trigger {
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
          width: 100%;
          padding: 1.6rem 0;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: color 0.2s var(--ease);
          font-family: inherit;
        }
        .vfaq-trigger:hover,
        .vfaq-trigger:focus-visible {
          color: var(--leaf);
        }
        .vfaq-trigger:focus-visible {
          outline: 2px solid var(--leaf);
          outline-offset: 2px;
        }

        /* ── Icon: + when closed, − when open ── */
        .vfaq-icon {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.4rem;
          height: 1.4rem;
          margin-top: 0.2rem;
          font-family: var(--font-body);
          font-size: var(--text-lg);
          color: var(--leaf);
          transition: transform 0.25s var(--ease);
          line-height: 1;
        }

        /* ── Question text ── */
        .vfaq-question {
          margin: 0;
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 400;
          line-height: 1.3;
          color: currentColor;
          flex: 1;
        }

        /* ── Answer panel — hidden by default, revealed on expand ── */
        .vfaq-panel {
          overflow: hidden;
          transition: max-height 0.3s var(--ease), opacity 0.3s var(--ease);
          max-height: 0;
          opacity: 0;
          padding: 0;
        }
        .vfaq-item.is-open .vfaq-panel {
          max-height: 600px;
          opacity: 1;
          padding: 0 0 1.2rem 2.6rem;
        }

        /* Answer text — restrained, longer line lengths ── */
        .vfaq-answer {
          font-size: var(--text-base);
          line-height: 1.7;
          color: var(--ink-soft);
          max-width: 65ch;
        }
        .vfaq-answer p {
          margin: 0;
        }
        .vfaq-answer a {
          color: var(--leaf);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: color 0.2s var(--ease);
        }
        .vfaq-answer a:hover {
          color: var(--leaf-deep);
        }

        /* ── Reduced motion: instant open/close, no collapse anim ── */
        @media (prefers-reduced-motion: reduce) {
          .vfaq-panel,
          .vfaq-icon {
            transition: none;
          }
          .vfaq-item.is-open .vfaq-panel {
            max-height: none;
            overflow: visible;
          }
        }

        /* ── Responsive: reduce gap on small screens ── */
        @media (max-width: 640px) {
          .vfaq-trigger {
            gap: 0.8rem;
          }
          .vfaq-icon {
            margin-top: 0.35rem;
          }
          .vfaq-item.is-open .vfaq-panel {
            padding-left: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
