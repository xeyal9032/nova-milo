import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const assetsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'assets');
const baseUrl = 'http://localhost:3000';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Kayıt paneli — overlay sağ panel butonu
const signUpOverlay = page.locator('button').filter({
  hasText: /KAYIT OL|SIGN UP|QEYDİYYAT|REGISTRIEREN|РЕГИСТРАЦИЯ/i,
}).last();
await signUpOverlay.click({ timeout: 15000 });
await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(assetsDir, 'screenshot-register.png') });

await page.goto(`${baseUrl}/dashboard?user=Nova`, { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);

const chatIcon = page.locator('[class*="chat-icon"]').first();
await chatIcon.click({ force: true });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(assetsDir, 'screenshot-dashboard-chat.png') });

await browser.close();
console.log('Ek görüntüler hazır');
