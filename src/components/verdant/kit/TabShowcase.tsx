import React, { useState } from 'react';

interface Tab {
  label: string;
  content: string;
  preview?: string;
}

interface TabShowcaseProps {
  tabs: Tab[];
  defaultTab?: number;
}

export default function TabShowcase({
  tabs,
  defaultTab = 0
}: TabShowcaseProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const activeTabData = tabs[activeTab];

  return (
    <div className="v-tab-showcase">
      <div className="v-tab-showcase__tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`v-tab-showcase__tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="v-tab-showcase__content">
        <div className="v-tab-showcase__input">
          <pre className="v-tab-showcase__code">{activeTabData.content}</pre>
        </div>
        {activeTabData.preview && (
          <div className="v-tab-showcase__output">
            <div className="v-tab-showcase__preview">{activeTabData.preview}</div>
          </div>
        )}
      </div>

      <style>{`
        .v-tab-showcase {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: clamp(2rem, 6vw, 4rem) var(--v-pad-h, clamp(20px, 5vw, 56px));
          max-width: var(--maxw);
          margin: 0 auto;
        }

        .v-tab-showcase__tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--line);
          flex-wrap: wrap;
        }

        .v-tab-showcase__tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--muted);
          transition: all 200ms var(--ease-soft);
          position: relative;
          bottom: -1px;
        }

        .v-tab-showcase__tab:hover {
          color: var(--fg);
        }

        .v-tab-showcase__tab.active {
          color: var(--fg);
          border-bottom-color: var(--green);
        }

        .v-tab-showcase__content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: stretch;
        }

        @media (max-width: 1024px) {
          .v-tab-showcase__content {
            grid-template-columns: 1fr;
          }
        }

        .v-tab-showcase__input,
        .v-tab-showcase__output {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .v-tab-showcase__code {
          background: var(--card);
          padding: 1.5rem;
          border-radius: var(--radius);
          border: 1px solid var(--line);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--fg);
          line-height: 1.5;
          overflow-x: auto;
          margin: 0;
        }

        .v-tab-showcase__preview {
          background: var(--card);
          padding: 1.5rem;
          border-radius: var(--radius);
          border: 1px solid var(--line);
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-sm);
          color: var(--muted);
        }

        @media (prefers-reduced-motion: reduce) {
          .v-tab-showcase__tab,
          .v-tab-showcase__code {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
