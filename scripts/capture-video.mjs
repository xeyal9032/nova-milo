import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const assetsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'assets');
const baseUrl = 'http://localhost:3000';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: assetsDir, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('button[type="button"]').filter({ hasText: /KAYIT OL|SIGN UP/i }).last().click();
await page.waitForTimeout(1200);
await page.locator('button[type="button"]').filter({ hasText: /GİRİŞ YAP|SIGN IN/i }).first().click();
await page.waitForTimeout(1000);
await page.goto(`${baseUrl}/dashboard?user=Nova`, { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const chat = page.locator('[class*="chat-icon"]').first();
if (await chat.isVisible().catch(() => false)) await chat.click();
await page.waitForTimeout(2500);

const video = page.video();
await page.close();
if (video) await video.saveAs(path.join(assetsDir, 'demo-preview.webm'));
await context.close();
await browser.close();
console.log('demo-preview.webm hazır');
