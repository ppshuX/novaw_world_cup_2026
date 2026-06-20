import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5174';
const OUTPUT = 'reports/mobile-screenshots/';

mkdirSync(OUTPUT, { recursive: true });

const iPhone14Pro = { width: 393, height: 852, deviceScaleFactor: 3 };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: iPhone14Pro,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  isMobile: true,
  hasTouch: true,
});

const page = await context.newPage();

// ---------- 1. Home page ----------
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: OUTPUT + '01-home-full.png', fullPage: true });
console.log('✅ 01-home-full.png');

// ---------- 2. Schedule page ----------
await page.click('button:has-text("赛程")');
await page.waitForTimeout(800);
await page.screenshot({ path: OUTPUT + '02-schedule-full.png', fullPage: true });
console.log('✅ 02-schedule-full.png');

// ---------- 3. Schedule - open filter drawer ----------
await page.click('button:has-text("筛选赛程")');
await page.waitForTimeout(600);
await page.screenshot({ path: OUTPUT + '03-schedule-filter-drawer.png', fullPage: true });
console.log('✅ 03-schedule-filter-drawer.png');
await page.click('button:has-text("查看结果")');
await page.waitForTimeout(300);

// ---------- 4. Bracket page ----------
await page.click('button:has-text("晋级树")');
await page.waitForTimeout(800);
await page.screenshot({ path: OUTPUT + '04-bracket-full.png', fullPage: true });
console.log('✅ 04-bracket-full.png');

// ---------- 5. Open a match modal ----------
await page.click('button:has-text("赛程")');
await page.waitForTimeout(600);
// Click first match card
const firstCard = page.locator('.match-card').first();
if (await firstCard.count() > 0) {
  await firstCard.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: OUTPUT + '05-match-modal.png', fullPage: true });
  console.log('✅ 05-match-modal.png');
  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

// Close match modal via close button
const closeModal = page.locator('[aria-label="关闭弹窗"]');
if (await closeModal.count() > 0) {
  await closeModal.click();
  await page.waitForTimeout(400);
}

// ---------- 6. Go home, open team profile ----------
await page.click('button:has-text("首页")');
await page.waitForTimeout(600);

// Click team in the hero "下一场重点比赛" panel
const teamBtn = page.locator('aside button').first();
if (await teamBtn.count() > 0) {
  await teamBtn.click();
  await page.waitForTimeout(600);
}
await page.screenshot({ path: OUTPUT + '06-team-profile-modal.png', fullPage: true });
console.log('✅ 06-team-profile-modal.png');

// Close team modal
const closeTeam = page.locator('[aria-label="关闭球队名片"]');
if (await closeTeam.count() > 0) {
  await closeTeam.click();
  await page.waitForTimeout(300);
}
await page.click('button:has-text("来源")');
await page.waitForTimeout(600);
await page.screenshot({ path: OUTPUT + '07-sources-page.png', fullPage: true });
console.log('✅ 07-sources-page.png');

// ---------- 8. Install page ----------
await page.click('button:has-text("App")');
await page.waitForTimeout(600);
await page.screenshot({ path: OUTPUT + '08-install-page.png', fullPage: true });
console.log('✅ 08-install-page.png');

await browser.close();
console.log('\n🎉 All screenshots saved to ' + OUTPUT);
