import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5174';
const OUTPUT = 'reports/mobile-screenshots/';

mkdirSync(OUTPUT, { recursive: true });

const iPhoneSE = { width: 375, height: 812, deviceScaleFactor: 2 };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: iPhoneSE,
  isMobile: true,
  hasTouch: true,
});

const page = await context.newPage();

// ---------- 1. Home page ----------
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
// viewport only
await page.screenshot({ path: OUTPUT + '01-home-hero.png' });
// scroll to below hero
await page.evaluate(() => window.scrollBy(0, 700));
await page.waitForTimeout(300);
await page.screenshot({ path: OUTPUT + '01-home-scroll.png' });
// scroll to favorites
await page.evaluate(() => window.scrollBy(0, 800));
await page.waitForTimeout(300);
await page.screenshot({ path: OUTPUT + '01-home-favorites.png' });
console.log('✅ Home screenshots');

// ---------- 2. Schedule page ----------
await page.click('button:has-text("赛程")');
await page.waitForTimeout(800);
await page.screenshot({ path: OUTPUT + '02-schedule-viewport.png' });
// scroll
await page.evaluate(() => window.scrollBy(0, 800));
await page.waitForTimeout(300);
await page.screenshot({ path: OUTPUT + '02-schedule-scroll.png' });
console.log('✅ Schedule screenshots');

// ---------- 3. Filter drawer ----------
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.click('button:has-text("筛选赛程")');
await page.waitForTimeout(600);
await page.screenshot({ path: OUTPUT + '03-filter-drawer.png' });
await page.click('button:has-text("查看结果")');
await page.waitForTimeout(300);
console.log('✅ Filter drawer');

// ---------- 4. Bracket page ----------
await page.click('button:has-text("晋级树")');
await page.waitForTimeout(800);
await page.screenshot({ path: OUTPUT + '04-bracket-viewport.png' });
// scroll
await page.evaluate(() => window.scrollBy(0, 800));
await page.waitForTimeout(300);
await page.screenshot({ path: OUTPUT + '04-bracket-scroll.png' });
console.log('✅ Bracket screenshots');

// ---------- 5. Open a match modal ----------
await page.click('button:has-text("赛程")');
await page.waitForTimeout(600);
const firstCard = page.locator('.match-card').first();
if (await firstCard.count() > 0) {
  await firstCard.click();
  await page.waitForTimeout(600);
}
await page.screenshot({ path: OUTPUT + '05-match-modal.png' });
console.log('✅ Match modal');
// close
const closeModal = page.locator('[aria-label="关闭弹窗"]');
if (await closeModal.count() > 0) { await closeModal.click(); await page.waitForTimeout(300); }

// ---------- 6. Team profile ----------
await page.click('button:has-text("首页")');
await page.waitForTimeout(600);
const teamBtn = page.locator('aside button').first();
if (await teamBtn.count() > 0) { await teamBtn.click(); await page.waitForTimeout(600); }
await page.screenshot({ path: OUTPUT + '06-team-modal.png' });
console.log('✅ Team modal');
const closeTeam = page.locator('[aria-label="关闭球队名片"]');
if (await closeTeam.count() > 0) { await closeTeam.click(); await page.waitForTimeout(300); }

// ---------- 7. Sources ----------
await page.click('button:has-text("来源")');
await page.waitForTimeout(600);
await page.screenshot({ path: OUTPUT + '07-sources.png' });
console.log('✅ Sources');

// ---------- 8. Install ----------
await page.click('button:has-text("App")');
await page.waitForTimeout(600);
await page.screenshot({ path: OUTPUT + '08-install.png' });
console.log('✅ Install');

await browser.close();
console.log('\n🎉 Done');
