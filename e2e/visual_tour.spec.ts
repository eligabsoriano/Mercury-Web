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
});
