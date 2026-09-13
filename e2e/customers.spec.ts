import { test, expect } from '@playwright/test';

test.describe('Mercury Customer Intelligence Directory & 360 Deep-Dive E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to Customers & 360 view via sidebar
    const customersNav = page.getByRole('button', { name: /Customers & 360/i });
    await expect(customersNav).toBeVisible();
    await customersNav.click();
  });

  test('renders Customer Intelligence Directory with title, dual tabs, and summary metrics', async ({ page }) => {
    // Check main title
    await expect(
      page.getByRole('heading', { level: 1, name: /Customer Intelligence & Risk Directory/i })
    ).toBeVisible();

    // Dual tabs
    const allTab = page.getByRole('button', { name: /All Customers/i });
    const atRiskTab = page.getByRole('button', { name: /Priority At-Risk Queue/i });
    await expect(allTab).toBeVisible();
    await expect(atRiskTab).toBeVisible();

    // Summary Metric Cards
    await expect(page.getByText('Matching Records')).toBeVisible();
    await expect(page.getByText('Page Revenue at Risk')).toBeVisible();
    await expect(page.getByText('Avg Churn Probability')).toBeVisible();
    await expect(page.getByText('Repeat Buyers (Page)')).toBeVisible();

    // Capture clean screenshot of Customer Intelligence Directory
    await page.screenshot({ path: 'e2e/screenshots/customer_directory_full.png', fullPage: true });
  });

  test('switches between All Customers and Priority At-Risk Queue tabs', async ({ page }) => {
    const atRiskTab = page.getByRole('button', { name: /Priority At-Risk Queue/i });
    await atRiskTab.click();

    // Verify at-risk active status
    await expect(page.getByText(/Active View: Intervention Queue/i)).toBeVisible();

    const allTab = page.getByRole('button', { name: /All Customers/i });
    await allTab.click();

    await expect(page.getByText(/Active View: Universal Registry/i)).toBeVisible();
  });

  test('searches customer directory with debounced input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by customer_unique_id, city, or state/i);
    await expect(searchInput).toBeVisible();

    // Type customer ID prefix
    await searchInput.fill('8d50f5ea');

    // Wait for debounced search and matching row
    await expect(page.getByText('8d50f5eadf502056fa2f144b30424d35').first()).toBeVisible();
  });

  test('filters customer directory using Risk Tier and State dropdowns', async ({ page }) => {
    const selects = page.locator('select');
    const riskSelect = selects.nth(0);
    const stateSelect = selects.nth(2);

    // Filter by High Risk
    await riskSelect.selectOption('High Risk');

    // Filter by State SP
    await stateSelect.selectOption('SP');

    // Verify reset button appears and click it
    const resetBtn = page.getByRole('button', { name: /Reset/i });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();
    await expect(resetBtn).not.toBeVisible();
  });

  test('opens Customer 360 modal, verifies all panels, and navigates tabs', async ({ page }) => {
    // Click Quick 360 Demo or a customer row
    const demoBtn = page.getByRole('button', { name: /Quick 360 Demo/i });
    await demoBtn.click();

    // Customer 360 Drawer opens
    const drawer = page.getByRole('dialog', { name: /Customer 360 Profile/i });
    await expect(drawer).toBeVisible();

    // Capture screenshot of Customer Intelligence Directory
    await page.screenshot({ path: 'e2e/screenshots/customer_directory.png', fullPage: true });

    // Header info
    await expect(drawer.getByRole('heading', { name: '8d50f5eadf502056fa2f144b30424d35' })).toBeVisible();
    await expect(drawer.getByText('sao paulo', { exact: false })).toBeVisible();
    await expect(drawer.getByText('Lifetime Spend')).toBeVisible();

    // Churn Risk Gauge & Shapley Factors
    await expect(drawer.getByText('HistGradientBoosting Churn Risk')).toBeVisible();
    await expect(drawer.getByText('Key Churn Drivers & Feature Contributions')).toBeVisible();
    await expect(drawer.getByText('RFM Quintile Matrix Drilldown')).toBeVisible();

    // Capture screenshot of Customer 360 Drawer
    await page.screenshot({ path: 'e2e/screenshots/customer_360_drawer.png' });

    // Switch to Basket & Fulfillment tab
    const fulfillmentTab = drawer.getByRole('button', { name: /Basket & Fulfillment/i });
    await fulfillmentTab.click();
    await expect(drawer.getByText('Basket Diversity & Merchandise')).toBeVisible();
    await expect(drawer.getByText('Fulfillment Speed & Delivery Friction')).toBeVisible();
    await expect(drawer.getByText('Spend Composition')).toBeVisible();

    // Switch to Prescriptive Playbook tab
    const playbookTab = drawer.getByRole('button', { name: /Prescriptive Playbook/i });
    await playbookTab.click();
    await expect(drawer.getByText('Prescriptive Playbook Recommendation')).toBeVisible();
    await expect(drawer.getByText('Intervention Script Template')).toBeVisible();

    // Close drawer via close button
    const closeBtn = drawer.getByRole('button', { name: /Close Customer 360 Drawer/i });
    await closeBtn.click();
    await expect(drawer).not.toBeVisible();
  });

  test('closes Customer 360 modal using Escape key', async ({ page }) => {
    const demoBtn = page.getByRole('button', { name: /Quick 360 Demo/i });
    await demoBtn.click();

    const drawer = page.getByRole('dialog', { name: /Customer 360 Profile/i });
    await expect(drawer).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });
});
