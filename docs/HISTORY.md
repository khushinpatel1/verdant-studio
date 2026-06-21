# Verdant Studio (site) — History

> "This was a complete failure. I should've went with Plan B."

---

## Era 1: The Koson Foundation (June 5–10)

The site started in 005, a pure aesthetic build: cream paper, forest greens, Koson woodblock prints, dark painted bands. V1 had bones KP loved — painterly, structural clarity, restraint. No animations, no gimmicks. The layout was simple: hero, feature rows, a few cards. It felt like something made by humans.

**The problem it solved:** no website at all. Verdant went from zero to a coherent identity overnight.

**What lived there:** `/verdant-1wg.pages.dev/`, frozen in time. The bones remained rock-solid. Everyone who touched v1 later knew: *this* is the architecture we wanted. The paint was the problem, never the frame.

---

## Era 2: The Bioluminescent Divergence (June 11–15)

V2 arrived as a sibling branch. KP asked for more pages, more growth, more life on the site. The engineering team interpreted "growth" as bloom effects, firefly animations on the hero canvas (`GrowingGarden.tsx`), scrolling vine reveals, heavy green CTAs. Luminous, alive, generative.

It shipped. It was live. And it was wrong.

KP saw it and felt the rot immediately: "visually bare," "sluggish," "way too AI." The language was corny. The assets weren't great. The site felt stale. Every gimmick screamed machine-generated: SVG zooms of tiny assets, heavy bloom/blur, default Google Fonts (Inter, Manrope — the house style of LLM churn). The animations took CPU. The page structure was a grid of symmetric cards, the exact opposite of Anthropic's asymmetry.

V2 wasn't a redesign. It was a sidetrack. The bones were still V2, but wrapped in aesthetic theater.

**The turning point:** Session 080–081 (June 17). KP tasked the engineering team to attack the site "from multiple angles"—five different people, full deep dives into language, performance, design, assets. The session burned 387k tokens trying to parallel 5-persona audits. All seven initiatives died at the wall. Nothing shipped. The pattern was wrong: you can't batch-rewrite narrative voice through a committee filter.

The real diagnosis came quieter: fonts, SVG tactics, animation bloat, symmetric card grids. Core problems, not edge cases.

---

## Era 3: The Failed Resurrection (June 18–19)

Plan 010 launched: "V1 visuals on V2 plan." Take V2's new pages (16 routes vs. V1's 7) and V2's four good interaction islands (`ScrollPillars`, `GardenTour`, `PrivacySpectrum`, `FAQAccordion`). Reskin them in V1's colors, strip the bloom effects, swap fonts to Instrument Serif and Schibsted Grotesk. Keep the heavy green banners but tone them. Cherry-pick V2's media.

It shipped. It was better. And KP still hated it.

**The realization:** You can't paint over bad bones. V2's structure was grid-based, symmetric, built for dense information. V1's structure was hierarchical asymmetry, each section a different size and pace. Paint doesn't matter when the frame is wrong.

On June 19, in a live session, KP said it plain: "The execution of the V1 visuals on V2 plan was a complete waste." Then: "I should've went with Plan B, bringing all of the V2 features, all the V2 pages and all the architectural changes and advancements to the V1 website." The engineering team had inverted the problem. Instead of V1-paint on V2-bones, it needed to be the opposite.

---

## Era 4: The Anthropic Inversion (June 20–21)

Plan 011 inverted it. Fresh `v3` branch, rooted back at `v1`. Cherry-pick V2's 8 extra pages and its 4 good islands onto V1 bones. Then impose Anthropic's structural grammar on top—alternating feature rows, light card grids with heavy negative space, repeated centered CTAs, at most 3 type sizes per viewport. Keep the painterly soul: cream paper, forest greens, gold accent, Koson prints. Dark painted bands stay, but as drama, not as default. Firefly canvas goes to the vault (KP still loved it; we saved it for later).

**The keystone was the section kit.** Not a homepage component. A *kit* — every section reusing the same two or three patterns, composable, minimal. Build it once. Use it everywhere. No variance unless there's a reason.

KP stood it up. Four phases: section kit, home, all pages, polish. By June 20 evening, v3 was live at `verdant-studio-v3.pages.dev/`. All 16 routes shipped. Clean build. Structure sound.

**The real move:** V1's painterly hierarchy was the right skeleton all along. V2 had the pages and the good interaction islands. Anthropic had taught us the pacing. All three were always meant to combine. The detour through V2-paint-on-V1-bones was the mistake—it let us forget that bones matter most.

---

## Era 5: The Deploy Ghost (June 20)

Late on June 20, KP pushed v3. The code landed. The site was live. But here's what happened on the surface: `main` branch in GitHub had all the commits. CI passed green. But the deployed site at `verdant-studio.pages.dev/` was still showing the old v2. Committed but not live.

The root cause: GitHub Actions workflow had a ternary that pointed `main` to a dead Cloudflare Pages project called `verdant`. That project had been deleted weeks earlier. The workflow was deploying commits to a ghost.

KP's patience broke. "We need to fix it. It should never happen again. You're just burning my turns, man."

The fix was one line: point the deploy workflow at `verdant-studio-v3` with `--branch=v3` instead. The workflow was already wired to build and deploy; it just needed to point at the real target. It was a papercut in the deployment story that had cost credibility each time someone pushed thinking live was live and it wasn't.

By end of day, it was fixed. Commit `e30474f`. Deploy working. The v3 site was actually live. No more phantom deploys.

---

## Era 6: The Public Door (June 21)

With v3 live and the deploy fixed, Plan 006 ("Public Readiness") became the closing task before Beta launch. Real privacy and terms pages. No more robots.txt disallow. Mobile nav behavior fixed. CSP headers. Lazy-load attributes on heavy images. Logo CSS moved out of accessible content. Every privacy/Grove/encryption sentence rewritten to match *actual* behavior, not marketing fiction.

These weren't sweeping changes—they were the opposite. They were structural honesty: only ship claims the product actually keeps. No shadows, no mystery, no corny language about "encrypted by default" (Grove is opt-in; say that plainly). Fix every contrast bug. Test on mobile. Verify every link. This was the day the team closed the door on anything less than launch-ready.

By June 21, v3 was the production site. Main deployed to v3. The workflow was fixed. The pages were honest. The site looked right—painterly and minimal and structurally sound, not "AI-built," not bloated, not trying too hard.

One year of Verdant Studio to June 20. One website, three versions tried, one actually used. Two deleted from Cloudflare. The real one finally live.

---

## Where Verdant Stands

V3 is production. It lives at `verdant-studio-v3.pages.dev/` (also at the main verdant-studio.pages.dev URL via the deploy workflow). All 16 routes are live: home, garden, ethos, security, privacy, terms, faq, pricing, beta, studio, type specimen, and the four Emerald routes.

The structure is V1's hierarchy on Anthropic's bones with V2's pages. The paint is cream paper and forest greens. The fonts are distinctive (Instrument Serif, Schibsted Grotesk, Fragment Mono)—not defaults, not AI-tells. The animations are purposeful or gone. The images are curated and bleed cleanly at the edges. The language is honest.

The team learned: structure beats paint. Inversion beats iteration. Small, real changes beat big diffuse audits. Deleted projects are as important as shipped features—they mark the boundaries of what didn't work. The deploy story matters as much as the code. Fonts are readable data; organic is structural; KP's instinct to hate a site isn't a failure to communicate—it's data that the bones are wrong.

Verdant goes to Beta not as a triumph, but as a real thing: built in daylight, fixed when it broke, shipped when it was honest, still made with hands.
