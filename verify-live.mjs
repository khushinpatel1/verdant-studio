#!/usr/bin/env node
/**
 * verify-live.mjs — the definition of "done" for Verdant.
 *
 * Loads the REAL deployed URL in a real browser (Chromium via Playwright),
 * with the REAL Cloudflare _headers (incl. CSP) that file:// and `astro dev`
 * never send. Then it proves the site actually works by interacting with it:
 *
 *   - no console errors / no uncaught page errors / no CSP violations
 *   - the FAQ accordion HYDRATES and OPENS on click (the bug that ate 5 sessions:
 *     a CSP header that blocked Astro's inline hydration script. Invisible to any
 *     localhost/file:// check, because those don't send the header.)
 *
 * "Done" = `node verify-live.mjs` exits 0. Not "I believe it's fixed." Green or red.
 *
 * Usage:
 *   node verify-live.mjs                 # defaults to prod base URL below
 *   node verify-live.mjs https://other.pages.dev
 */
import { chromium } from 'playwright';

const BASE = (process.argv[2] || 'https://verdant-studio-v3.pages.dev').replace(/\/$/, '');

// Pages that render the hydration-dependent FAQ accordion.
const FAQ_PAGES = ['/verdant/faq/', '/verdant/security/', '/verdant/pricing/'];
// Pages that should just load clean (no interaction asserted).
const SMOKE_PAGES = ['/verdant/', '/verdant/garden/', '/verdant/ethos/', '/verdant/team/', '/verdant/emerald/'];

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✗ ${m}\x1b[0m`);

let failures = 0;

async function withPage(browser, fn) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  // CSP violations surface as console errors in WebKit/Chromium; also catch the
  // security-policy-violation event explicitly for belt-and-suspenders.
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      // eslint-disable-next-line no-console
      console.error(`CSP-VIOLATION blocked ${e.violatedDirective}: ${e.blockedURI || e.sourceFile}`);
    });
  });
  try {
    await fn(page, errors);
  } finally {
    await page.close();
  }
}

async function smoke(browser, path) {
  await withPage(browser, async (page, errors) => {
    let resp;
    try {
      resp = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (e) { bad(`${path} — navigation failed: ${e.message.split('\n')[0]}`); failures++; return; }
    const status = resp?.status();
    if (!status || status >= 400) { bad(`${path} — HTTP ${status}`); failures++; return; }
    await page.waitForTimeout(400);
    if (errors.length) { bad(`${path} — ${errors.length} error(s): ${errors[0]}`); failures++; return; }
    ok(`${path} — HTTP ${status}, clean console`);
  });
}

async function faq(browser, path) {
  await withPage(browser, async (page, errors) => {
    let resp;
    try {
      resp = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (e) { bad(`${path} — navigation failed: ${e.message.split('\n')[0]}`); failures++; return; }
    const status = resp?.status();
    if (!status || status >= 400) { bad(`${path} — HTTP ${status}`); failures++; return; }

    const trigger = page.locator('.vfaq-trigger').first();
    await trigger.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    if (!(await trigger.count())) { bad(`${path} — no FAQ trigger rendered`); failures++; return; }

    // Scroll into view first: some FAQ instances use client:visible (lazy
    // hydration on intersection), so a real user scrolls → it hydrates → clicks.
    // Mirror that exactly, then give the IntersectionObserver + hydration a beat.
    await trigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Pre-click state: collapsed.
    const before = await trigger.getAttribute('aria-expanded');
    if (before !== 'false') { bad(`${path} — FAQ not collapsed at start (aria-expanded=${before})`); failures++; }

    // The real test: does clicking it open? Only passes if React hydrated,
    // which only happens if the inline hydration script wasn't CSP-blocked.
    // One retry absorbs a hydration race on client:visible instances.
    await trigger.click();
    await page.waitForTimeout(400);
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') {
      await page.waitForTimeout(600);
      await trigger.click();
      await page.waitForTimeout(400);
    }
    const after = await trigger.getAttribute('aria-expanded');
    const panelVisible = await page.locator('.vfaq-item.is-open .vfaq-answer').first().isVisible().catch(() => false);

    if (after !== 'true' || !panelVisible) {
      bad(`${path} — FAQ did NOT open on click (hydration dead). aria-expanded=${after}, answerVisible=${panelVisible}`);
      failures++;
    } else if (errors.length) {
      bad(`${path} — FAQ opened but ${errors.length} console error(s): ${errors[0]}`);
      failures++;
    } else {
      ok(`${path} — FAQ hydrated & opens, clean console`);
    }
  });
}

(async () => {
  console.log(`\nverify-live → ${BASE}\n`);
  const browser = await chromium.launch();
  console.log('Smoke (load clean):');
  for (const p of SMOKE_PAGES) await smoke(browser, p);
  console.log('Interaction (FAQ must hydrate & open):');
  for (const p of FAQ_PAGES) await faq(browser, p);
  await browser.close();

  console.log('');
  if (failures) {
    console.log(`\x1b[31mRED — ${failures} check(s) failed on the LIVE site.\x1b[0m\n`);
    process.exit(1);
  }
  console.log(`\x1b[32mGREEN — live site verified.\x1b[0m\n`);
  process.exit(0);
})().catch((e) => { console.error('verify-live crashed:', e); process.exit(2); });
