import { test } from '@playwright/test';
import path from 'path';

test('capture light mode and sticky sidebar visual screenshots', async ({ page }) => {
  const artifactDir = '/Users/gab/.gemini/antigravity-ide/brain/ac048ef4-0eea-4b0c-bbe8-1bdbb91d92bd';
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('/', { waitUntil: 'networkidle' });

  // 1. Overview in Light Mode
  await page.screenshot({ path: path.join(artifactDir, 'light_mode_overview.png') });

  // 2. Sticky Sidebar on Scroll
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactDir, 'sticky_sidebar_scrolled.png') });

  // 3. Fast-Action Triage & Breakdown Cards (no overlapping numbers)
  const triage = page.locator('text=Fast-Action Executive Risk Triage').first();
  await triage.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(artifactDir, 'triage_box_fixed.png') });

  // 4. Collapsed Sidebar state (clean logo, no clipped button, user avatar footer)
  await page.evaluate(() => window.scrollTo(0, 0));
  const collapseToggle = page.locator('button[aria-label="Collapse sidebar"]').or(page.locator('aside button').first());
  await collapseToggle.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactDir, 'collapsed_sidebar_fixed.png') });

  // 5. Expand sidebar and test Catalog & Sellers category cards
  await collapseToggle.click();
  await page.waitForTimeout(300);
  const catalogBtn = page.getByRole('button', { name: /Catalog & Sellers/i });
  await catalogBtn.click();
  await page.waitForTimeout(500);

  // Take screenshot of Catalog Cards
  const catScorecard = page.locator('text=Marketplace Product Categories Scorecard').first();
  await catScorecard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactDir, 'catalog_category_cards_fixed.png') });

  // Scroll down to cards 9 and 10 to inspect long titles
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactDir, 'catalog_cards_row3_fixed.png') });

  // 6. Test Marketing Funnel View with Scrolled Sidebar
  const marketingBtn = page.getByRole('button', { name: /Marketing Funnel/i });
  await marketingBtn.click();
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactDir, 'marketing_funnel_scrolled_fixed.png') });
});
