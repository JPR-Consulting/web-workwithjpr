// Fotografiert jede <section data-out="…"> einer Grafik-Vorlage als PNG.
//   node scripts/graphics/render.mjs scripts/graphics/php2shell.html
// Braucht Playwright mit Chromium (CHROME_EXE setzt einen vorhandenen Browser).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const file = resolve(process.argv[2]);
const browser = await chromium.launch({ executablePath: process.env.CHROME_EXE || undefined });
for (const scale of [1, 2]) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: scale });
  await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const el of await page.locator(`section[data-scale="${scale}"]`).all()) {
    const out = await el.getAttribute('data-out');
    mkdirSync(dirname(out), { recursive: true });
    await el.screenshot({ path: out });
    const box = await el.boundingBox();
    console.log(`✓ ${out} (${Math.round(box.width)}×${Math.round(box.height)} CSS-px, Faktor ${scale})`);
  }
  await page.close();
}
await browser.close();
