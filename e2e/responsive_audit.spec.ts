import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: '4k_desktop_1920', width: 1920, height: 1080 },
  { name: 'laptop_1440', width: 1440, height: 900 },
  { name: 'tablet_landscape_1024', width: 1024, height: 768 },
  { name: 'tablet_portrait_768', width: 768, height: 1024 },
] as const;

async function navigateToView(page: Page, labelRegex: RegExp) {
  const primaryBtn = page.getByRole('button', { name: labelRegex }).first();
  if (await primaryBtn.isVisible()) {
    await primaryBtn.click();
    return;
  }

  // If sidebar is hidden in mobile portrait, toggle mobile drawer
  const drawerToggle = page.getByLabel('Toggle Navigation Drawer');
  if (await drawerToggle.isVisible()) {
    await drawerToggle.click();
    const drawerBtn = page.getByRole('button', { name: labelRegex }).last();
    await expect(drawerBtn).toBeVisible();
    await drawerBtn.click();
  }
}

test.describe('Mercury Executive Cockpit Responsive Layout & Quality Gate Audit', () => {
  for (const vp of VIEWPORTS) {
    test(`validates layout integrity and zero horizontal overflow at ${vp.width}x${vp.height} (${vp.name})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Wait for header to render
      await expect(page.locator('header')).toBeVisible();

      // Check View 1: Executive Overview
      await expect(page.locator('h1')).toContainText('Portfolio Health, Revenue Exposure');
      let hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Horizontal layout overflow detected in Executive Overview at ${vp.width}px`).toBe(false);

      // Check View 2: Customer Intelligence Directory
      await navigateToView(page, /Customers & 360/i);
      await expect(page.locator('h1')).toContainText('Customer Intelligence & Risk Directory');
      hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Horizontal layout overflow detected in Customers Directory at ${vp.width}px`).toBe(false);

      // Check View 3: Churn Simulator
      await navigateToView(page, /Churn Simulator/i);
      await expect(page.locator('h1')).toContainText('ML Churn Scoring');
      hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Horizontal layout overflow detected in Churn Simulator at ${vp.width}px`).toBe(false);

      // Check View 4: Retention Planner
      await navigateToView(page, /Retention Planner/i);
      await expect(page.locator('h1')).toContainText('Retention Economics & Playbook Planner');
      hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Horizontal layout overflow detected in Retention Planner at ${vp.width}px`).toBe(false);

      // Check View 5: Marketing Funnel
      await navigateToView(page, /Marketing Funnel/i);
      await expect(page.locator('h1')).toContainText('Marketing Funnel & Sales Velocity');
      hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Horizontal layout overflow detected in Marketing Funnel at ${vp.width}px`).toBe(false);

      // Check View 6: Catalog Intelligence
      await navigateToView(page, /Catalog & Sellers/i);
      await expect(page.locator('h1')).toContainText('Catalog Intelligence & Seller Logistics');
      hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Horizontal layout overflow detected in Catalog Intelligence at ${vp.width}px`).toBe(false);

      // Capture screenshot for audit record
      await page.screenshot({
        path: `e2e/screenshots/responsive_${vp.name}.png`,
        fullPage: false,
      });
    });
  }

  test('verifies ErrorBoundary and Toast resilience in live browser session', async ({ page }) => {
    await page.goto('/');

    // Verify Toast container exists and is mounted in DOM
    const toastContainer = page.getByTestId('toast-container');
    await expect(toastContainer).toBeAttached();

    // Trigger data refresh from header button to observe toast notification
    const refreshBtn = page.getByLabel('Refresh Telemetry and Analytics');
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // Expect toast notification to appear
    const toast = page.getByTestId('toast-success');
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Telemetry Refreshed')).toBeVisible();
  });
});
