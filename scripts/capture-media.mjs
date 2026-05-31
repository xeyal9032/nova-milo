/**
 * Uygulama ekran görüntüleri ve demo videosu (GIF için kaynak) üretir.
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'docs', 'assets');
const baseUrl = process.env.APP_URL || 'http://localhost:3000';

await mkdir(assetsDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function captureLoginScreens() {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(assetsDir, 'screenshot-login.png'),
    fullPage: false,
  });

  // Kayıt panelini aç
  const signUpBtn = page.locator('button[type="button"]').filter({
    hasText: /KAYIT OL|SIGN UP|QEYDİYYAT|REGISTRIEREN|РЕГИСТРАЦИЯ/i,
  }).last();
  if (await signUpBtn.count()) {
    await signUpBtn.click();
    await page.waitForTimeout(900);
    await page.screenshot({
      path: path.join(assetsDir, 'screenshot-register.png'),
      fullPage: false,
    });
  }

  await page.close();
}

async function captureDashboardScreens() {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto(`${baseUrl}/dashboard?user=Nova`, {
    waitUntil: 'networkidle',
    timeout: 90000,
  });
  await page.waitForTimeout(4000);

  await page.screenshot({
    path: path.join(assetsDir, 'screenshot-dashboard.png'),
    fullPage: true,
  });

  // Sohbet panelini aç
  const chatToggle = page.locator('[class*="chat-icon"]').first();
  if (await chatToggle.isVisible().catch(() => false)) {
    await chatToggle.click();
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(assetsDir, 'screenshot-dashboard-chat.png'),
      fullPage: false,
    });
  }

  await page.close();
}

async function recordDemoVideo() {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: assetsDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);

  const panelSignUp = page.locator('button[type="button"]').filter({
    hasText: /KAYIT OL|SIGN UP|QEYDİYYAT|REGISTRIEREN/i,
  }).last();
  if (await panelSignUp.count()) {
    await panelSignUp.click();
    await page.waitForTimeout(1200);
    const panelSignIn = page.locator('button[type="button"]').filter({
      hasText: /GİRİŞ YAP|SIGN IN|DAXIL OL|ANMELDEN|ВОЙТИ/i,
    }).first();
    if (await panelSignIn.count()) await panelSignIn.click();
    await page.waitForTimeout(1000);
  }

  await page.goto(`${baseUrl}/dashboard?user=Nova`, {
    waitUntil: 'networkidle',
    timeout: 90000,
  });
  await page.waitForTimeout(3500);

  const chatToggle = page.locator('[class*="chat-icon"]').first();
  if (await chatToggle.isVisible().catch(() => false)) {
    await chatToggle.click();
    await page.waitForTimeout(1500);
  }

  await page.waitForTimeout(2000);

  const video = page.video();
  await page.close();
  if (video) {
    const webmPath = path.join(assetsDir, 'demo-preview.webm');
    await video.saveAs(webmPath);
    console.log('Video kaydedildi:', webmPath);
  }
  await context.close();
}

console.log('Ekran görüntüleri alınıyor...', baseUrl);
await captureLoginScreens();
await captureDashboardScreens();
await recordDemoVideo();
await browser.close();
console.log('Tamamlandı:', assetsDir);
