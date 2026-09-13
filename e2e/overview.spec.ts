import { test, expect } from '@playwright/test';

test.describe('Mercury Executive Overview Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders executive title, brand header and 5 canonical KPI cards', async ({ page }) => {
    // Brand header
    await expect(page).toHaveTitle(/Mercury/);
    await expect(page.locator('h1')).toContainText('Portfolio Health, Revenue Exposure');

    // 5 Macro KPI cards
    await expect(page.getByText('Total Portfolio GMV')).toBeVisible();
    await expect(page.getByText('R$ 15.98M').first()).toBeVisible();

    await expect(page.getByText('Active Customer Base')).toBeVisible();
    await expect(page.getByText('96,096', { exact: true }).first()).toBeVisible();

    await expect(page.getByText('High Churn Risk Rate')).toBeVisible();
    await expect(page.getByText('18.4%').first()).toBeVisible();

    await expect(page.getByText('Revenue at Risk', { exact: true })).toBeVisible();
    await expect(page.getByText('R$ 2.45M').first()).toBeVisible();

    await expect(page.getByText('Repeat Buyer Rate', { exact: true })).toBeVisible();
    await expect(page.getByText('2.99%').first()).toBeVisible();
  });

  test('interacts with Revenue Trends time-range filters and secondary metric toggles', async ({ page }) => {
    const trailing12mBtn = page.getByRole('button', { name: 'Trailing 12m' });
    await expect(trailing12mBtn).toBeVisible();
    await trailing12mBtn.click();

    const recent6mBtn = page.getByRole('button', { name: 'Recent 6m' });
    await recent6mBtn.click();

    const allTimeBtn = page.getByRole('button', { name: 'All Time (18m)' });
    await allTimeBtn.click();

    // Toggle secondary metrics
    const lateRateBtn = page.getByRole('button', { name: '+ Late Rate' });
    await lateRateBtn.click();

    const ordersBtn = page.getByRole('button', { name: '+ Orders' });
    await ordersBtn.click();
  });

  test('interacts with RFM Segmentation Matrix and switches between Grid and Revenue Share', async ({ page }) => {
    // Switch to Revenue Share bar chart
    const revenueShareTab = page.getByRole('button', { name: 'Revenue Share' });
    await expect(revenueShareTab).toBeVisible();
    await revenueShareTab.click();

    // Switch back to Grid Cards
    const gridCardsTab = page.getByRole('button', { name: 'Grid Cards' });
    await gridCardsTab.click();

    // Click a segment card to reveal strategic playbook recommendation
    const championsCard = page.locator('[data-testid="segment-card-champions"]').first();
    await championsCard.click();
    await expect(page.getByText('VIP Concierge & Dedicated Account Outreach').first()).toBeVisible();
  });

  test('interacts with Counterfactual What-If Churn Laboratory sliders', async ({ page }) => {
    await expect(page.getByText('Counterfactual What-If Churn Laboratory')).toBeVisible();
    await expect(page.getByText('Delivery Delay Reduction')).toBeVisible();
    await expect(page.getByText('Review Score Intervention')).toBeVisible();
    await expect(page.getByText('Retention Incentive Voucher')).toBeVisible();

    // Verify baseline vs projected state visualizer
    await expect(page.getByText('BASELINE STATE')).toBeVisible();
    await expect(page.getByText('PROJECTED COUNTERFACTUAL')).toBeVisible();
  });

  test('opens and closes Pipeline Observability Drawer from header health badge', async ({ page }) => {
    // Click pipeline health badge in header
    const pipelineBadge = page.getByRole('button', { name: /Open Pipeline Health & Observability Drawer/i });
    await expect(pipelineBadge).toBeVisible();
    await pipelineBadge.click();

    // Drawer should open
    await expect(page.getByText('Pipeline Observability Telemetry')).toBeVisible();

    // Close drawer using close button
    const closeBtn = page.getByRole('button', { name: 'Close Pipeline Drawer' });
    await closeBtn.click();
    await expect(page.getByText('Pipeline Observability Telemetry')).not.toBeVisible();
  });
});
