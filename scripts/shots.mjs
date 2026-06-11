// Render the built dist/ in headless Chromium via route interception (no
// server — this sandbox's Chromium is network-blocked). Full-page captures
// under reduced motion (reveals shown, Lenis off), saved to shots/.
//
//   node scripts/shots.mjs [route ...]        e.g. node scripts/shots.mjs verdant verdant/ethos
//   MOTION=1 node scripts/shots.mjs verdant   viewport-only shot with motion on (parallax state)
import { chromium } from "@playwright/test";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const out = join(root, "shots");
mkdirSync(out, { recursive: true });

const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["verdant", "verdant/ethos", "verdant/garden", "verdant/security", "verdant/team"];
const viewports = [
  [1440, 900],
  [390, 844],
  [390, 664],
];
const mime = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".avif": "image/avif",
};
const motion = !!process.env.MOTION;

const browser = await chromium.launch();
for (const [w, h] of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: motion ? "no-preference" : "reduce",
  });
  const page = await ctx.newPage();
  await page.route("**/*", (route) => {
    const u = new URL(route.request().url());
    let p = decodeURIComponent(u.pathname);
    let file = join(dist, p);
    if (p.endsWith("/")) file = join(dist, p, "index.html");
    if (!existsSync(file)) file = join(dist, p, "index.html");
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "not found" });
    route.fulfill({ body: readFileSync(file), contentType: mime[extname(file)] ?? "application/octet-stream" });
  });
  for (const r of routes) {
    await page.goto(`http://verdant.local/${r}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const name = `${r.replace(/\//g, "-")}-${w}x${h}${motion ? "-motion" : ""}.png`;
    await page.screenshot({ path: join(out, name), fullPage: !motion });
    console.log(name);
  }
  await ctx.close();
}
await browser.close();
