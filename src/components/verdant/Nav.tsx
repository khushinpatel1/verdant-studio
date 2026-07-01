import { useEffect, useRef, useState } from "react";
import { brand, nav } from "../../data/verdant";
import Logo from "./Logo";

/**
 * VERDANT nav. fixed, quiet until you scroll. Mono links with a gold underline
 * that grows on hover (and marks the active page). A forest-gradient full-screen
 * overlay on mobile. Mounted client:load in the layout.
 */
export default function Nav({ path }: { path: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/verdant" ? path === "/verdant" : path === href || path.startsWith(href + "/");

  return (
    <>
      <header ref={headerRef} className={`v-nav${scrolled ? " v-nav--scrolled" : ""}`} inert={open}>
        <a href="/verdant" className="v-nav-mark"><Logo size={20} /></a>

        <nav className="v-nav-links">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}
               className={`v-nav-link${isActive(l.href) ? " is-active" : ""}`}>{l.label}</a>
          ))}
        </nav>

        <div className="v-nav-end">
          <a href={nav.cta.href} className="v-cta v-nav-cta">{nav.cta.label}</a>
          <button className="v-nav-burger" aria-label="Menu" onClick={() => setOpen(true)}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className={`v-nav-overlay${open ? " open" : ""}`} aria-hidden={!open} inert={!open}>
        <button ref={closeButtonRef} className="v-nav-overlay-close" aria-label="Close" onClick={() => setOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="v-nav-overlay-inner">
          <p className="v-label v-label--light" style={{ marginBottom: "2.4rem" }}>{brand.tagline}</p>
          <ul className="v-nav-overlay-links">
            {nav.links.map((l, i) => (
              <li key={l.href} style={{ ["--i" as any]: i }}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  <span className="v-nav-overlay-num">0{i + 1}</span>
                  <span className="v-nav-overlay-label">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="v-nav-overlay-foot">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <span>Independent · privacy-first</span>
          </div>
        </div>
      </div>

      <style>{`
        .v-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem clamp(20px, 5vw, 56px);
          transition: background .4s var(--ease), backdrop-filter .4s var(--ease),
                      box-shadow .4s var(--ease), padding .4s var(--ease);
        }
        .v-nav--scrolled {
          background: color-mix(in srgb, var(--paper) 78%, transparent);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          box-shadow: 0 1px 0 var(--line);
          padding-top: 1rem; padding-bottom: 1rem;
        }
        .v-nav-mark {
          display: inline-flex; color: var(--leaf);
          transition: transform .3s var(--ease), color .3s;
        }
        .v-nav-mark:hover { transform: rotate(-2deg); color: var(--leaf-deep); }
        .v-nav-links { display: flex; gap: 2.1rem; }
        .v-nav-link {
          position: relative; font-family: var(--font-mono); font-size: var(--text-2xs);
          letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink);
          padding-bottom: 4px; transition: color .25s;
        }
        .v-nav-link::after {
          content: ""; position: absolute; left: 0; bottom: 0; height: 1.5px; width: 0;
          background: var(--leaf); transition: width .3s var(--ease);
        }
        .v-nav-link:hover { color: var(--leaf); }
        .v-nav-link:hover::after, .v-nav-link.is-active::after { width: 100%; }
        .v-nav-end { display: flex; align-items: center; gap: 1.4rem; }
        .v-nav-cta { padding-top: 0; padding-bottom: 0; }
        .v-nav-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
        .v-nav-burger span { display: block; width: 24px; height: 1.5px; background: var(--leaf); }

        .v-nav-overlay {
          position: fixed; inset: 0; z-index: 300; display: none;
          flex-direction: column; justify-content: center;
          padding: clamp(2rem, 7vw, 6rem);
          background: linear-gradient(135deg, var(--mist), var(--dawn));
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s var(--ease), visibility 0.3s var(--ease);
        }
        .v-nav-overlay.open {
          display: flex;
          opacity: 1;
          visibility: visible;
        }
        .v-nav-overlay-inner { width: 100%; max-width: 60rem; margin: 0 auto; }
        .v-nav-overlay-links { list-style: none; padding: 0; margin: 0; }
        .v-nav-overlay-links li { border-top: 1px solid rgba(22, 36, 27, 0.08); }
        .v-nav-overlay-links li:last-child { border-bottom: 1px solid rgba(22, 36, 27, 0.08); }
        .open .v-nav-overlay-links li { animation: v-row-in .55s var(--ease) both; animation-delay: calc(0.08s + var(--i) * 0.07s); }
        @keyframes v-row-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .v-nav-overlay-links a {
          display: flex; align-items: baseline; gap: 1.4rem; padding: clamp(0.9rem,2.4vw,1.6rem) 0.3rem;
          color: var(--ink); transition: padding-left .4s var(--ease), color .3s;
        }
        .v-nav-overlay-links a:hover { padding-left: 1rem; color: var(--leaf); }
        .v-nav-overlay-num { font-family: var(--font-mono); font-size: var(--text-2xs); color: var(--ink-soft); transform: translateY(-0.4em); }
        .v-nav-overlay-label { font-family: var(--font-display); font-size: var(--display-2); line-height: 0.98; letter-spacing: -0.02em; }
        .v-nav-overlay-foot {
          display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin-top: clamp(1.8rem,4vw,3rem);
          font-family: var(--font-mono); font-size: var(--text-2xs); letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft);
        }
        .v-nav-overlay-foot a { color: var(--ink); border-bottom: 1px solid var(--leaf); padding-bottom: 2px; }
        .v-nav-overlay-foot a:hover { color: var(--leaf); }
        .v-nav-overlay-close {
          position: absolute; top: 1.6rem; right: clamp(1.6rem,5vw,3rem);
          width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(22, 36, 27, 0.1);
          background: none; color: var(--ink); cursor: pointer; font-size: 1.1rem;
          display: grid; place-items: center; transition: transform .3s var(--ease), border-color .3s, color .3s;
        }
        .v-nav-overlay-close:hover { transform: rotate(90deg); color: var(--leaf); border-color: var(--leaf); }

        @media (max-width: 820px) {
          .v-nav-links, .v-nav-cta { display: none; }
          .v-nav-burger { display: flex; }
        }
      `}</style>
    </>
  );
}
