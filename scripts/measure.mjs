// Quick geometry probe: node scripts/measure.mjs <route> <sel1> <sel2> ...
import { chromium } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const [route = "verdant", ...sels] = process.argv.slice(2);
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.route("**/*", (rt) => {
  const u = new URL(rt.request().url());
  let p = decodeURIComponent(u.pathname);
  let file = join(dist, p);
  if (p.endsWith("/")) file = join(dist, p, "index.html");
  if (!existsSync(file)) file = join(dist, p, "index.html");
  if (!existsSync(file)) return rt.fulfill({ status: 404, body: "nf" });
  rt.fulfill({ body: readFileSync(file), contentType: mime[extname(file)] ?? "application/octet-stream" });
});
await page.goto(`http://verdant.local/${route}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
for (const sel of sels) {
  const r = await page.locator(sel).first().boundingBox().catch(() => null);
  console.log(sel, r ? JSON.stringify({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }) : "not found");
}
await browser.close();
