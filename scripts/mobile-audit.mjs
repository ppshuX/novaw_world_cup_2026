import { chromium } from 'playwright';

const BASE = 'http://localhost:5180';

const iPhoneSE = { width: 375, height: 812, deviceScaleFactor: 2 };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: iPhoneSE,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

function log(msg) { console.log(msg); }

// Navigate first
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// 1. Check viewport meta
log('\n===== 1. VIEWPORT META =====');
const viewportMeta = await page.$eval('meta[name="viewport"]', el => el.getAttribute('content'));
log(`viewport: ${viewportMeta}`);

// 2. Check body and root structure
log('\n===== 2. HERO HEADER LAYOUT =====');
const heroHeight = await page.evaluate(() => document.querySelector('header')?.offsetHeight);
log(`Hero header height: ${heroHeight}px`);

const heroH1Size = await page.evaluate(() => {
  const h1 = document.querySelector('header h1');
  if (!h1) return null;
  const style = window.getComputedStyle(h1);
  return { fontSize: style.fontSize, lineHeight: style.lineHeight };
});
log(`Hero H1: ${JSON.stringify(heroH1Size)}`);

// 3. Nav tabs - remove duplicate goto
log('\n===== 3. NAV TABS =====');

const tabSizes = await page.evaluate(() => {
  const tabs = document.querySelectorAll('section > div > button');
  return Array.from(tabs).map(t => {
    const style = window.getComputedStyle(t);
    return {
      text: t.textContent?.trim(),
      fontSize: style.fontSize,
      height: style.minHeight,
      width: t.offsetWidth,
      padding: style.padding,
    };
  });
});
log(JSON.stringify(tabSizes, null, 2));

// 4. Hero team blocks and match cards
log('\n===== 4. HERO SIDE PANEL =====');
const heroSide = await page.evaluate(() => {
  const aside = document.querySelector('header aside');
  if (!aside) return null;
  const style = window.getComputedStyle(aside);
  return {
    width: aside.offsetWidth,
    maxWidth: style.maxWidth,
    padding: style.padding,
  };
});
log(JSON.stringify(heroSide));

// 5. Main content sections - check overflow
log('\n===== 5. OVERFLOW CHECK =====');
const overflowItems = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    const parent = el.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    if (rect.right > parentRect.right + 5 && rect.width > 0 && parent.offsetWidth > 0) {
      // Skip body-level and structural
      if (el.tagName === 'BODY' || el.tagName === 'HTML' || parent.tagName === 'BODY') return;
      const text = el.textContent?.trim().slice(0, 40);
      results.push({
        tag: el.tagName.toLowerCase(),
        class: el.className?.toString()?.slice(0, 60),
        text: text || '(empty)',
        elWidth: Math.round(rect.width),
        parentWidth: Math.round(parentRect.width),
        overflow: Math.round(rect.right - parentRect.right),
      });
    }
  });
  return results.slice(0, 15);
});
log(`Elements overflowing parent: ${overflowItems.length}`);
overflowItems.forEach(o => log(`  ${o.tag}.${o.class} | width:${o.elWidth}px parent:${o.parentWidth}px overflow:${o.overflow}px text:"${o.text}"`));

// 6. Touch target sizes
log('\n===== 6. SMALL TOUCH TARGETS (< 44px) =====');
const smallTargets = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('button, a, [role="button"], select, input').forEach(el => {
    const rect = el.getBoundingClientRect();
    const minDim = Math.min(rect.width, rect.height);
    if (minDim < 44 && rect.width > 0) {
      const text = el.textContent?.trim().slice(0, 30) || el.getAttribute('aria-label') || '';
      results.push({
        tag: el.tagName.toLowerCase(),
        text,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        minDim: Math.round(minDim),
      });
    }
  });
  return results;
});
if (smallTargets.length > 0) {
  log(`⚠️  Found ${smallTargets.length} touch targets smaller than 44px:`);
  smallTargets.slice(0, 15).forEach(t => log(`  ${t.tag} "${t.text}" ${t.width}x${t.height}px (min:${t.minDim}px)`));
} else {
  log('✅ All touch targets >= 44px (good)');
}

// 7. Schedule page
log('\n===== 7. SCHEDULE PAGE =====');
await page.click('button:has-text("赛程")');
await page.waitForTimeout(600);

const scheduleLayout = await page.evaluate(() => {
  const cards = document.querySelectorAll('.match-card, article[role="button"]');
  return {
    cardCount: cards.length,
    cardWidth: cards[0]?.offsetWidth || 0,
    visibleCards: Array.from(cards).slice(0, 3).map(c => {
      const rect = c.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    }),
  };
});
log(`Match cards: ${scheduleLayout.cardCount} total, first visible: ${JSON.stringify(scheduleLayout.visibleCards)}`);

// Check filter controls
const filterLayout = await page.evaluate(() => {
  const filterBtns = document.querySelectorAll('section button');
  const hasFilters = Array.from(filterBtns).some(b => b.textContent?.includes('筛选'));
  const hasReset = Array.from(filterBtns).some(b => b.textContent?.includes('重置'));
  return { hasFilterBtn: hasFilters, hasResetBtn: hasReset };
});
log(`Filter buttons: ${JSON.stringify(filterLayout)}`);

// 8. Bracket page
log('\n===== 8. BRACKET PAGE MOBILE =====');
await page.click('button:has-text("晋级树")');
await page.waitForTimeout(600);

const bracketInfo = await page.evaluate(() => {
  const desktopChart = document.querySelector('.hidden.lg\\:block');
  const mobileCards = document.querySelector('.grid.lg\\:hidden');
  return {
    desktopVisible: !!desktopChart,
    mobileCardsVisible: !!mobileCards,
    mobileCardCount: mobileCards?.querySelectorAll('section').length || 0,
  };
});
log(JSON.stringify(bracketInfo));

// 9. Modal - z-index and scrollability
log('\n===== 9. MODAL BEHAVIOR =====');
await page.click('button:has-text("赛程")');
await page.waitForTimeout(600);
const firstCard = page.locator('.match-card').first();
if (await firstCard.count() > 0) {
  await firstCard.click();
  await page.waitForTimeout(600);
}

const modalInfo = await page.evaluate(() => {
  const modal = document.querySelector('[class*="fixed inset-0 z-50"]');
  if (!modal) return { found: false };
  const style = window.getComputedStyle(modal);
  const inner = modal.querySelector('.max-h-\\[92vh\\], [class*="max-h-"]');
  const innerStyle = inner ? window.getComputedStyle(inner) : null;
  return {
    found: true,
    modalDisplay: style.display,
    innerMaxHeight: innerStyle?.maxHeight,
    innerOverflow: innerStyle?.overflowY,
    position: style.position,
    alignItems: style.alignItems,
  };
});
log(JSON.stringify(modalInfo));

// 10. Check font sizes
log('\n===== 10. FONT SIZE AUDIT =====');
const fontSizes = await page.evaluate(() => {
  const sizes = new Set();
  document.querySelectorAll('p, h1, h2, h3, h4, span, button, a, li, label').forEach(el => {
    const style = window.getComputedStyle(el);
    sizes.add(style.fontSize);
  });
  return Array.from(sizes).sort((a, b) => parseFloat(a) - parseFloat(b));
});
log(`Unique font sizes used: ${fontSizes.join(', ')}`);

// 11. Sources page
log('\n===== 11. SOURCES PAGE LAYOUT =====');
const closeModalBtn = page.locator('[aria-label="关闭弹窗"]');
if (await closeModalBtn.count() > 0) { await closeModalBtn.click(); await page.waitForTimeout(400); }
await page.click('button:has-text("来源")');
await page.waitForTimeout(600);

const sourcesGrid = await page.evaluate(() => {
  const cardLinks = document.querySelectorAll('a.group');
  return {
    totalCards: cardLinks.length,
    firstCardWidth: cardLinks[0]?.offsetWidth,
    layout: cardLinks.length <= 2 ? '1-col' : cardLinks.length <= 3 ? '2-col?' : '3-4 col?',
  };
});
log(JSON.stringify(sourcesGrid));

// 12. Check for common mobile issues
log('\n===== 12. MOBILE UX CHECKLIST =====');

const issues = await page.evaluate(() => {
  const findings = [];

  // Fixed position modals at bottom
  const modalsAtBottom = document.querySelectorAll('[class*="items-end"]');
  findings.push(`Bottom-sheet modals: ${modalsAtBottom.length}`);

  // Text truncation
  const truncated = document.querySelectorAll('[class*="truncate"]');
  findings.push(`Truncated text elements: ${truncated.length}`);

  // Horizontal scroll
  const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
  findings.push(`Horizontal overflow: ${hasHorizontalScroll}`);

  // Check if page width matches viewport
  findings.push(`Body width: ${document.body.scrollWidth}px, Viewport: ${window.innerWidth}px`);

  return findings;
});
issues.forEach(i => log(`  ${i}`));

await browser.close();
log('\n===== DONE =====');
