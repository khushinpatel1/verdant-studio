// Element/viewport-level captures from dist/ — companion to shots.mjs.
//   node scripts/shot-el.mjs <route> <selector> [w] [h]
import { chromium } from "@playwright/test";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const out = join(root, "shots");
mkdirSync(out, { recursive: true });

const [route = "verdant", selector = "section", w = "1440", h = "900"] = process.argv.slice(2);
const mime = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".woff2": "font/woff2",
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
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
await page.waitForTimeout(700);
const el = page.locator(selector).first();
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const name = `el-${route.replace(/\//g, "-")}-${selector.replace(/[^a-z0-9-]/gi, "")}-${w}.png`;
await el.screenshot({ path: join(out, name) });
console.log(name);
await browser.close();
