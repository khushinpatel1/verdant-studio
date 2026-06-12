import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const ROUTES = [
  '/verdant',
  '/verdant/garden',
  '/verdant/ethos',
  '/verdant/security',
  '/verdant/team',
  '/verdant/emerald',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

const screenshotDir = 'screenshots-w3';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.createContext();
  const page = await context.newPage();

  // Route all requests through dist files
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    let filePath = path.join(process.cwd(), 'dist', url.pathname);

    // Handle directory requests → index.html
    if (filePath.endsWith('/')) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      route.fulfillFromPath(filePath);
    } else {
      route.abort();
    }
  });

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate using file:// protocol
      const filePath = path.join(process.cwd(), 'dist', route === '/' ? 'index.html' : `${route}/index.html`);
      const fileUrl = `file://${filePath}`;

      try {
        await page.goto(fileUrl, { waitUntil: 'networkidle' });
        // Wait a bit for animations/reveals to settle
        await page.waitForTimeout(500);

        const screenshot = `${screenshotDir}/${route.replace(/\//g, '-') || 'home'}-${viewport.name}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        console.log(`✓ ${route} (${viewport.name})`);
      } catch (e) {
        console.error(`✗ ${route} (${viewport.name}):`, e.message);
      }
    }
  }

  await browser.close();
  console.log(`\nScreenshots saved to ${screenshotDir}/`);
}

captureScreenshots().catch(console.error);
