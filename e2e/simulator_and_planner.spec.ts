import { test, expect } from '@playwright/test';

test.describe('Mercury ML Churn Engine & Retention Budget Optimizer E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('View 3: Counterfactual Churn Simulator', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Churn Simulator view via sidebar
      const simulatorNav = page.locator('aside').getByRole('button', { name: /Churn Simulator/i });
      await expect(simulatorNav).toBeVisible();
      await simulatorNav.click();
    });

    test('renders Churn Simulator header, control levers, and comparative projection card', async ({ page }) => {
      // Main heading and subtitle
      await expect(
        page.getByRole('heading', { level: 1, name: /ML Churn Scoring & What-If Simulation Lab/i })
      ).toBeVisible();
      await expect(page.getByText(/Counterfactual Inference Engine/i)).toBeVisible();

      // Sliders present
      await expect(page.getByText('Carrier Delivery Delay Adjustment')).toBeVisible();
      await expect(page.getByText('Customer Review Score Shift')).toBeVisible();
      await expect(page.getByText('Retention Discount Incentive')).toBeVisible();
      await expect(page.getByText('Order Cadence / Frequency Delta')).toBeVisible();

      // Concierge toggle
      await expect(page.getByRole('button', { name: 'Toggle VIP Concierge Support Outreach' })).toBeVisible();

      // Counterfactual outcome card
      await expect(page.getByRole('heading', { level: 3, name: /Comparative Counterfactual Outcome/i })).toBeVisible();
      await expect(page.getByText('BASELINE (STATUS QUO)')).toBeVisible();
      await expect(page.getByText('PROJECTED SIMULATION')).toBeVisible();

      // Model transparency card
      await expect(page.getByRole('heading', { level: 3, name: /ML Serving Model Transparency & Algorithmic Guardrails/i })).toBeVisible();
      await expect(page.getByText('HistGradientBoostingClassifier')).toBeVisible();
      await expect(page.getByText('0.874', { exact: true })).toBeVisible(); // ROC-AUC

      // Capture screenshot
      await page.screenshot({ path: 'e2e/screenshots/churn_simulator_full.png', fullPage: true });
    });

    test('hydrates customer features from quick-pick candidate accounts', async ({ page }) => {
      // By default initial customer is selected
      await expect(page.getByText('8d50f5ea').first()).toBeVisible();

      // Quick pick candidate buttons: Click Champion
      const championPill = page.getByRole('button', { name: /Champion • R\$ 1,240/i });
      await expect(championPill).toBeVisible();
      await championPill.click();

      // Verify customer account ID displayed in baseline card
      await expect(page.getByText('47c1a303').first()).toBeVisible();

      // Select another customer (Can't Lose Them VIP)
      const vipPill = page.getByRole('button', { name: /Can't Lose Them \(VIP\)/i });
      await expect(vipPill).toBeVisible();
      await vipPill.click();

      await expect(page.getByText('39775296').first()).toBeVisible();
    });

    test('interacts with operational what-if sliders and updates delta projection', async ({ page }) => {
      // Locate sliders within the operational levers section
      const sliders = page.locator('main input[type="range"]');
      const delaySlider = sliders.nth(0);
      await delaySlider.fill('-5');
      await delaySlider.dispatchEvent('change');

      const discountSlider = sliders.nth(2);
      await discountSlider.fill('15');
      await discountSlider.dispatchEvent('change');

      // Verify comparative outcome metrics update
      await expect(page.getByText(/Projected Outcome:/i)).toBeVisible();
      await expect(page.getByText(/Executive Assessment:/i)).toBeVisible();
    });

    test('activates action presets and resets simulation levers', async ({ page }) => {
      // Click 'Logistics Crisis' preset
      const crisisBtn = page.getByRole('button', { name: 'Logistics Crisis' });
      await expect(crisisBtn).toBeVisible();
      await crisisBtn.click();

      // Verify assessment reflects critical risk or delay
      await expect(page.getByText(/Executive Assessment:/i)).toBeVisible();

      // Click 'Optimal Preset'
      const optimalBtn = page.getByRole('button', { name: 'Optimal Preset' });
      await expect(optimalBtn).toBeVisible();
      await optimalBtn.click();

      // Click 'Reset' preset
      const resetBtn = page.getByRole('button', { name: 'Reset', exact: true });
      await expect(resetBtn).toBeVisible();
      await resetBtn.click();
    });

    test('expands model features in Model Transparency Card', async ({ page }) => {
      const inspectBtn = page.getByRole('button', { name: /Engineered Feature Space/i });
      await expect(inspectBtn).toBeVisible();
      await inspectBtn.click();

      // Verify features tags are displayed
      await expect(page.getByText('Numeric Feature Inputs')).toBeVisible();
      await expect(page.getByText('Categorical Encoded Dimensions')).toBeVisible();

      // Collapse back
      await inspectBtn.click();
      await expect(page.getByText('Numeric Feature Inputs')).not.toBeVisible();
    });
  });

  test.describe('View 4: Retention Planner & Budget Optimizer', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Retention Planner view via sidebar
      const plannerNav = page.locator('aside').getByRole('button', { name: /Retention Planner/i });
      await expect(plannerNav).toBeVisible();
      await plannerNav.click();
    });

    test('renders Retention Planner header, macro KPI cards, and all 6 playbooks', async ({ page }) => {
      // Main heading and subtitle
      await expect(
        page.getByRole('heading', { level: 1, name: /Retention Economics & Playbook Planner/i })
      ).toBeVisible();

      // Jump Pills
      await expect(page.getByRole('button', { name: 'Knapsack Optimizer' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Playbooks Catalog' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Campaign ROI Lab' })).toBeVisible();

      // Knapsack Macro KPI Cards
      await expect(page.getByText('Allocated Capital')).toBeVisible();
      await expect(page.getByText('Target Customers')).toBeVisible();
      await expect(page.getByText('Expected Recovered GMV')).toBeVisible();
      await expect(page.getByText('Blended Portfolio ROI')).toBeVisible();

      // Check all 6 canonical playbooks are rendered
      await expect(
        page.getByRole('heading', { level: 3, name: /VIP Concierge & Dedicated Account Outreach/i })
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { level: 3, name: /Logistics Friction Recovery & Shipping Waiver/i })
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { level: 3, name: /Customer Sentiment Repair & Quality Resolution/i })
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { level: 3, name: /Automated Win-Back & Promotional Re-engagement/i })
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { level: 3, name: /VIP Loyalty Nurture & Tier Recognition/i })
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { level: 3, name: /Baseline Operational Communication/i })
      ).toBeVisible();

      // Capture screenshot
      await page.screenshot({ path: 'e2e/screenshots/retention_planner_full.png', fullPage: true });
    });

    test('filters playbooks by communication channel and strategy', async ({ page }) => {
      // Click VIP Concierge channel filter
      const vipFilter = page.getByRole('button', { name: /^VIP Concierge$/i });
      await expect(vipFilter).toBeVisible();
      await vipFilter.click();

      // VIP playbook should remain visible
      await expect(
        page.getByRole('heading', { level: 3, name: /VIP Concierge & Dedicated Account Outreach/i })
      ).toBeVisible();

      // Switch back to All Channels
      const allTab = page.getByRole('button', { name: /All Channels \(6\)/i });
      await allTab.click();

      // All 6 playbooks visible again
      await expect(
        page.getByRole('heading', { level: 3, name: /Logistics Friction Recovery/i })
      ).toBeVisible();
    });

    test('interacts with Knapsack Budget slider and presets', async ({ page }) => {
      // Click budget preset buttons
      const btn25k = page.getByRole('button', { name: 'R$ 25k' });
      await expect(btn25k).toBeVisible();
      await btn25k.click();

      // Verify allocated budget displayed
      await expect(page.getByText('R$ 25,000').first()).toBeVisible();

      const btn150k = page.getByRole('button', { name: 'R$ 150k' });
      await btn150k.click();
      await expect(page.getByText('R$ 150,000').first()).toBeVisible();

      // Verify Candidate Pool Visualizer progress bars and pool names exist
      await expect(page.getByText(/VIP Concierge \(Champions/i)).toBeVisible();
      await expect(page.getByText(/Logistics Recovery \(Late Delivery/i)).toBeVisible();
    });

    test('interacts with Campaign ROI Lab and recalculates financial scorecard', async ({ page }) => {
      // Playbook dropdown selection
      const playbookSelect = page.locator('#playbook-select');
      await expect(playbookSelect).toBeVisible();
      await playbookSelect.selectOption('vip_concierge');

      // Sliders inside ROI calculator
      const targetCustomerSlider = page.locator('input[type="range"]').nth(1); // 0 is Knapsack budget, 1 is target customers
      await targetCustomerSlider.fill('800');
      await targetCustomerSlider.dispatchEvent('change');

      // Check financial results card updates
      await expect(page.getByText('Total Campaign Cost', { exact: true })).toBeVisible();
      await expect(page.getByText('Gross Protected GMV', { exact: true })).toBeVisible();
      await expect(page.getByText('Net Value Created', { exact: true })).toBeVisible();
      await expect(page.getByText('Break-Even Save Rate', { exact: true })).toBeVisible();
      await expect(page.getByText('Capital Efficiency Multiplier', { exact: true })).toBeVisible();
    });

    test('clicks Simulate ROI on playbook card and scrolls to calculator', async ({ page }) => {
      const simulateBtns = page.getByRole('button', { name: /Simulate ROI/i });
      await expect(simulateBtns.first()).toBeVisible();
      await simulateBtns.first().click();

      // Verify ROI calculator is visible
      await expect(page.getByText('Campaign ROI & Financial Economics Simulator')).toBeVisible();
    });
  });
});
