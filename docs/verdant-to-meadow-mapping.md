# Verdant → Meadow: Page & Section Mapping

> Branch: `feat/verdant-to-meadow`
> Source: `/Users/khushinpatel/Dev/verdant-site`
> Target: `/Users/khushinpatel/Dev/pastures` (Meadow skin)

---

## North Star

The muse is the **Japanese garden**: moon + flower, moss + moonlight, stillness
with life moving slowly underneath. "Subtle but efficient" — everything intentional,
nothing extra. Palette: moonlight whites/creams, moss greens, earthy browns.
Typography: Newsreader (display serif) + Hanken Grotesque (body) + DM Mono (data).

Carry over: narrative voice, product names (Studio/Garden/Emerald/Ethos/Team),
privacy-first manifesto, seasons metaphor, typographic restraint.
**Do NOT carry over**: glassmorphism, gradient blobs, pill badges, fat-radii cards,
React-Router SPA structure, webgl-fluid dependency, non-working image placeholders.

---

## Pastures Site Map (Meadow skin, new)

| New page file               | Route           | Source in verdant-site            |
|-----------------------------|-----------------|-----------------------------------|
| `meadow.astro`              | `/meadow`       | `Studio.jsx` — home/overview      |
| `meadow-garden.astro`       | `/meadow-garden`| `Garden.jsx` — product showcase   |
| `meadow-ethos.astro`        | `/meadow-ethos` | `Ethos.jsx` — about/values        |
| `meadow-team.astro`         | `/meadow-team`  | `Team.jsx` — studio/team          |
| `meadow-emerald.astro`      | `/meadow-emerald`| `Emerald.jsx` — teaser/easter-egg |
| ~~`meadow-care.astro`~~     | removed         | Merged into home; no direct source|
| ~~`meadow-about.astro`~~    | removed         | Replaced by meadow-ethos          |

**Rationale**: verdant-site has richer narrative than the old demo Verda content. The
old "Care Guide" and "About" pages had no verdant equivalent. Care content becomes a
features section on home; About becomes the full Ethos page.

---

## Section-by-Section Mapping

### `/meadow` — Studio/Home
| Verdant section      | Pastures section type      | Notes                                         |
|----------------------|---------------------------|-----------------------------------------------|
| ScrollScene hero (layered parallax + fireflies) | `KineticHero` | kinetic words + muse imagery |
| Manifesto block      | `RevealBlock`              | "No ads. No tracking. Just software." + stats |
| Seasons / approach   | `CardGrid`                 | 4 seasons metaphor cards: Plant/Tend/Prune/Grow |
| Pull quote           | `RevealBlock` (body-only)  | inline quote layout via body prose            |
| Products shelf (Garden + Emerald) | `CardGrid`    | 2 product cards — navigation into sub-pages  |
| CTA band             | `VideoScene`               | ambient nature video + CTA text               |
| Footer               | `MegaFooter`               |                                               |

### `/meadow-garden` — Garden Product Page
| Verdant section       | Pastures section type    | Notes                                              |
|-----------------------|--------------------------|----------------------------------------------------|
| Product hero          | `KineticHero`            | "Your money. Your garden. Nobody else's."           |
| App showcase          | `PinnedShowcase`         | Pinned device frame with 3 feature steps           |
| Privacy stats         | `CardGrid`               | E2E / 0 trackers / 100% yours                     |
| Pull quote            | `RevealBlock`             | "The best financial advisor is one paid by you."   |
| Waitlist CTA          | `RevealBlock`             | "Be first in the garden." + email note             |
| Footer                | `MegaFooter`             |                                                    |

### `/meadow-ethos` — Ethos / About
| Verdant section       | Pastures section type    | Notes                                              |
|-----------------------|--------------------------|----------------------------------------------------|
| Manifesto hero        | `KineticHero`            | "What you give us stays between us."              |
| Values (4 values)     | `CardGrid`               | No ads / No trackers / Built slowly / One studio  |
| Process prose         | `RevealBlock`             | Long-form "how we work" body                      |
| Booking / availability | `Accordion`             | FAQs or availability note                         |
| Footer                | `MegaFooter`             |                                                    |

### `/meadow-team` — Team
| Verdant section       | Pastures section type    | Notes                                              |
|-----------------------|--------------------------|----------------------------------------------------|
| Team hero             | `KineticHero`            | "The people behind the work."                      |
| Founder feature       | `RevealBlock`             | Featured founder plate with bio                   |
| Open plots (future seats) | `CardGrid`           | Design / Engineering — "seasons ahead"            |
| Footer                | `MegaFooter`             |                                                    |

### `/meadow-emerald` — Emerald Easter-Egg
| Verdant section       | Pastures section type    | Notes                                              |
|-----------------------|--------------------------|----------------------------------------------------|
| Full-bleed tease      | `KineticHero`            | "Something is taking root."                        |
| Cipher/flavor text    | `RevealBlock`             | "germinating — below the surface"                  |
| Footer                | `MegaFooter`             |                                                    |

---

## Token Changes (tokens.css — Meadow skin)

Tune `[data-skin="meadow"]` away from generic Material green toward Verdant's
moonlight/moss/earthy palette:

| Token          | Old                | New                | From Verdant palette       |
|----------------|--------------------|--------------------|----------------------------|
| `--bg`         | `#faf8f3`          | `#FBF8F2` (cream)  | `--cream`                  |
| `--fg`         | `#1b1a17`          | `#15300A` (forest-dark) | `--forest-dark`       |
| `--muted`      | `#6c6b63`          | `#7A9E7E` (moss)   | `--moss`                   |
| `--accent`     | `#4a7c59`          | `#2D5016` (forest) | `--forest`                 |
| `--accent-2`   | `#d98e5a`          | `#C8973F` (gold)   | `--gold`                   |
| `--card`       | `#ffffff`          | `#F4EEE2` (parchment) | `--parchment`           |
| `--line`       | `#e7e3da`          | `#C8D5B9` (sage)   | `--sage`                   |
| `--radius`     | `24px`             | `4px`              | Japanese austerity — no fat radii |
| `--font-display` | `"Manrope"`      | `"Newsreader"`     | Verdant display font       |
| `--font-body`  | `"Inter"`          | `"Hanken Grotesque"` | Verdant body font        |

Also add `--font-mono: "DM Mono"` for data/label contexts.

---

## Assets

Current Meadow assets are generic plant/tropical imagery. Replace with Japanese
garden / moonlight / moss / nature imagery aligned to the muse:

- Hero: moonlit garden, still water, night blooms — Unsplash
- RevealBlock: parchment texture, calligraphic ink, moss stone garden
- CardGrid backgrounds: earthy, botanical close-ups
- VideoScene: ambient nature — rain on leaves, flowing water (Coverr/Mixkit)
- Emerald: deep dusk/mystery forest scene

---

## Deliberately Left Out

| Verdant feature          | Reason not ported                                                 |
|--------------------------|-------------------------------------------------------------------|
| FluidBackground WebGL    | Not working reliably in verdant-site itself; complex dependency  |
| Fireflies canvas effect  | Could be added as new section type but raises complexity for V1  |
| Profile.jsx (/team/:slug)| Requires dynamic routing (Astro SSR or client router); out of scope |
| TxLoop (animated frames) | Real app screenshots don't exist; placeholder would hurt quality |
| Calendar component       | Booking/availability is live-content; use Accordion note instead |
| React Router / SPA structure | Pastures is Astro, MPA — different architecture           |
