import { chromium } from "playwright";

const baseUrl = "http://localhost:4321";
const pages = [
  { name: "index", path: "/verdant/" },
  { name: "ethos", path: "/verdant/ethos" },
  { name: "garden", path: "/verdant/garden" },
  { name: "security", path: "/verdant/security" },
  { name: "team", path: "/verdant/team" },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const p of pages) {
      const url = `${baseUrl}${p.path}`;
      console.log(`Capturing ${p.name} at ${vp.width}x${vp.height}...`);

      try {
        await page.goto(url, { waitUntil: "networkidle" });
        // Wait for animations to settle
        await page.waitForTimeout(1000);
        const fileName = `shots/006-after/${p.name}-${vp.name}.png`;
        await page.screenshot({ path: fileName, fullPage: true });
        console.log(`  ✓ Saved: ${fileName}`);
      } catch (e) {
        console.error(`  ✗ Failed: ${e.message}`);
      }
    }
  }

  await browser.close();
  console.log("Done!");
})();
