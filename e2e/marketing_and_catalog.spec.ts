import { test, expect } from '@playwright/test';

test.describe('Mercury Marketing Funnel & Catalog Intelligence E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigates to Marketing Funnel and verifies all executive sections and interactive controls', async ({ page }) => {
    // Navigate to Marketing Funnel via sidebar
    const marketingNavBtn = page.getByRole('button', { name: /Marketing Funnel/i });
    await expect(marketingNavBtn).toBeVisible();
    await marketingNavBtn.click();

    const view = page.getByTestId('marketing-funnel-view');
    await expect(view).toBeVisible();

    // Verify header and title
    await expect(view.locator('h1')).toContainText('Marketing Funnel & Sales Velocity');
    await expect(view.getByText(/B2B Marketplace Growth & Seller Telemetry/i)).toBeVisible();

    // Verify 4 KPI scorecards
    await expect(view.getByText('Overall Conversion Rate')).toBeVisible();
    await expect(view.getByText('10.5%', { exact: true })).toBeVisible();

    await expect(view.getByText('Avg Sales Cycle Velocity')).toBeVisible();
    await expect(view.getByText(/18.4 Days/i).first()).toBeVisible();

    await expect(view.getByText('Seller Activation Rate')).toBeVisible();
    await expect(view.getByText('49.9%', { exact: true })).toBeVisible();

    await expect(view.getByText('Revenue Realization Ratio')).toBeVisible();
    await expect(view.getByText(/60.6%/).first()).toBeVisible();

    // Verify Visual Stepped Funnel Stages
    await expect(view.getByTestId('funnel-stages-card')).toBeVisible();
    await expect(view.getByText(/1. Top of Funnel/i)).toBeVisible();
    await expect(view.getByText('8,000').first()).toBeVisible();
    await expect(view.getByText(/2. Sales Conversion/i)).toBeVisible();
    await expect(view.getByText('842').first()).toBeVisible();
    await expect(view.getByText(/3. Fulfilled Activation/i)).toBeVisible();
    await expect(view.getByText('420').first()).toBeVisible();

    // Verify Revenue Realization Bridge
    await expect(view.getByText(/Revenue Realization Bridge: Self-Declared vs Realized GMV/i)).toBeVisible();
    await expect(view.getByText(/R\$ 14.25M/i).first()).toBeVisible();
    await expect(view.getByText(/R\$ 8.64M/i).first()).toBeVisible();

    // Verify and interact with Channel Attribution Chart
    const channelCard = view.getByTestId('channel-attribution-card');
    await expect(channelCard).toBeVisible();
    await expect(channelCard.getByText(/Origin Channel Attribution & Conversion/i)).toBeVisible();

    // Switch metric to Conversion Rate
    const convRateBtn = channelCard.getByRole('button', { name: 'Conversion Rate (%)' });
    await convRateBtn.click();

    // Switch metric to Realized GMV
    const gmvBtn = channelCard.getByRole('button', { name: 'Realized GMV' });
    await gmvBtn.click();

    // Switch metric back to Leads & Deals
    const volumeBtn = channelCard.getByRole('button', { name: 'Leads & Deals' });
    await volumeBtn.click();

    // Verify and interact with Velocity Distribution Chart
    const velocityCard = page.getByTestId('velocity-distribution-card');
    await expect(velocityCard).toBeVisible();
    await expect(velocityCard.getByText(/Sales Cycle Velocity Distribution/i)).toBeVisible();

    // Toggle to By Lead Type
    const leadTypeBtn = velocityCard.getByRole('button', { name: 'By Lead Type' });
    await leadTypeBtn.click();

    // Toggle back to By Segment
    const segmentBtn = velocityCard.getByRole('button', { name: 'By Segment' });
    await segmentBtn.click();

    // Verify Seller Industry Segment Economics table
    await expect(page.getByText('Seller Industry Segment Economics')).toBeVisible();
    await expect(page.getByText('home appliances').first()).toBeVisible();
    await expect(page.getByText('health beauty').first()).toBeVisible();

    // Verify and interact with Marketing Leads Directory
    const leadsCard = page.getByTestId('leads-directory-card');
    await expect(leadsCard).toBeVisible();
    await expect(leadsCard.getByText(/Marketing Qualified Leads & Seller Intake Directory/i)).toBeVisible();
    await expect(leadsCard.getByText('mql-001')).toBeVisible();

    // Filter by Won Deals
    const wonBtn = leadsCard.getByRole('button', { name: 'Won Deals' });
    await wonBtn.click();

    // Filter by Active Sellers
    const activeBtn = leadsCard.getByRole('button', { name: 'Active Sellers' });
    await activeBtn.click();

    // Reset to All
    const allBtn = leadsCard.getByRole('button', { name: 'All' });
    await allBtn.click();

    // Search lead
    const searchInput = leadsCard.getByPlaceholder(/Search MQL ID, segment.../i);
    await searchInput.fill('mql-002');
    await expect(leadsCard.getByText('mql-002')).toBeVisible();
    await searchInput.clear();

    // Capture marketing funnel screenshot
    await page.screenshot({ path: 'e2e/screenshots/marketing_funnel_view.png', fullPage: true });
  });

  test('navigates to Catalog & Sellers view and verifies categories, scatter chart, and directory', async ({ page }) => {
    // Navigate to Catalog & Sellers via sidebar
    const catalogNavBtn = page.getByRole('button', { name: /Catalog & Sellers/i });
    await expect(catalogNavBtn).toBeVisible();
    await catalogNavBtn.click();

    const view = page.getByTestId('catalog-intelligence-view');
    await expect(view).toBeVisible();

    // Verify header and title
    await expect(view.locator('h1')).toContainText('Catalog Intelligence & Seller Logistics');
    await expect(view.getByText(/Catalog & Merchant Telemetry/i)).toBeVisible();

    // Verify 4 Category KPI Cards
    await expect(view.getByText('Product Categories', { exact: true })).toBeVisible();
    await expect(view.getByText(/\b(8|10)\b/).first()).toBeVisible();

    await expect(view.getByText('Products Catalogued')).toBeVisible();
    await expect(view.getByText('32,951', { exact: true })).toBeVisible();

    await expect(view.getByText('Top Category Revenue')).toBeVisible();
    await expect(view.getByText('R$ 1.26M').first()).toBeVisible();

    await expect(view.getByText('Highest Rated Category')).toBeVisible();
    await expect(view.getByText(/★ 4.18/).first()).toBeVisible();

    // Verify Product Categories Scorecard and sort controls
    await expect(view.getByText(/Marketplace Product Categories Scorecard/i)).toBeVisible();
    await expect(view.getByText(/Displaying \d+ product categories/i)).toBeVisible();
    await expect(view.getByText(/Health Beauty/i).first()).toBeVisible();
    await expect(view.getByText(/Watches Gifts/i).first()).toBeVisible();

    // Test category sort controls
    const unitsSortBtn = view.locator('button:has-text("Units Sold")').first();
    await unitsSortBtn.click();

    const ratingSortBtn = view.getByRole('button', { name: /^Rating \(★\)$/i });
    await ratingSortBtn.click();

    const skusSortBtn = view.getByRole('button', { name: /^SKUs$/i });
    await skusSortBtn.click();

    const revSortBtn = view.locator('button:has-text("Revenue")').first();
    await revSortBtn.click();

    // Verify Category Revenue Distribution Chart
    const catChartCard = view.getByTestId('category-revenue-chart-card');
    await expect(catChartCard).toBeVisible();
    await expect(catChartCard.getByText(/Product Category Revenue & Volume Distribution/i)).toBeVisible();

    // Metric toggle inside chart card
    const chartUnitsBtn = catChartCard.getByRole('button', { name: 'Units Sold' });
    await chartUnitsBtn.click();

    const chartSkusBtn = catChartCard.getByRole('button', { name: 'Catalog SKUs' });
    await chartSkusBtn.click();

    const chartRevBtn = catChartCard.getByRole('button', { name: 'Gross Revenue' });
    await chartRevBtn.click();

    // Verify Seller Performance Scatter Chart
    const scatterCard = view.getByTestId('seller-performance-scatter-card');
    await expect(scatterCard).toBeVisible();
    await expect(scatterCard.getByText(/Seller Revenue vs Satisfaction Matrix/i)).toBeVisible();
    await expect(scatterCard.getByText(/<5% Late/i)).toBeVisible();

    // Verify Marketplace Sellers Directory
    await expect(view.getByText(/Marketplace Merchants & Delivery Health Directory/i)).toBeVisible();
    await expect(view.getByText(/seller-sp-001/i)).toBeVisible();

    // Search seller
    const sellerSearchInput = view.getByPlaceholder(/Search Seller ID, city, state.../i);
    await sellerSearchInput.fill('seller-sp-001');
    await expect(view.getByText(/seller-sp-001/i)).toBeVisible();
    await sellerSearchInput.clear();

    // Capture catalog screenshot
    await page.screenshot({ path: 'e2e/screenshots/catalog_intelligence_view.png', fullPage: true });
  });
});
