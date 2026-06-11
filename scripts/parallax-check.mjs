// Sanity check: with motion on, scrolling must update --vp on parallax fields;
// with reduced motion, --vp must stay unset.
import { chromium } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

const browser = await chromium.launch();
for (const motion of [true, false]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: motion ? "no-preference" : "reduce",
  });
  const page = await ctx.newPage();
  await page.route("**/*", (rt) => {
    const u = new URL(rt.request().url());
    let p = decodeURIComponent(u.pathname);
    let file = join(dist, p);
    if (p.endsWith("/")) file = join(dist, p, "index.html");
    if (!existsSync(file)) file = join(dist, p, "index.html");
    if (!existsSync(file)) return rt.fulfill({ status: 404, body: "nf" });
    rt.fulfill({ body: readFileSync(file), contentType: mime[extname(file)] ?? "application/octet-stream" });
  });
  await page.goto("http://verdant.local/verdant/", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const before = await page.locator(".vh-hero-art").evaluate((el) => el.style.getPropertyValue("--vp"));
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);
  const after = await page.locator(".vh-hero-art").evaluate((el) => el.style.getPropertyValue("--vp"));
  console.log(motion ? "motion " : "reduced", JSON.stringify({ before, after }));
  await ctx.close();
}
await browser.close();
