import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExecutiveOverviewView } from '../views/ExecutiveOverviewView';
import { mockPortfolioOverview, mockPipelineHealth, mockModelMetadata } from '../api/mocks/data';

describe('ExecutiveOverviewView Component', () => {
  it('renders all 5 canonical Macro KPI cards accurately', () => {
    render(
      <ExecutiveOverviewView
        overview={mockPortfolioOverview}
        pipelineHealth={mockPipelineHealth}
        modelMeta={mockModelMetadata}
      />
    );

    // KPI 1: GMV
    expect(screen.getByText('Total Portfolio GMV')).toBeInTheDocument();
    expect(screen.getByText('R$ 15.98M')).toBeInTheDocument();

    // KPI 2: Active Customers
    expect(screen.getByText('Active Customer Base')).toBeInTheDocument();
    expect(screen.getByText('96,096')).toBeInTheDocument();

    // KPI 3: High Churn Risk Rate
    expect(screen.getByText('High Churn Risk Rate')).toBeInTheDocument();
    expect(screen.getByText('18.4%')).toBeInTheDocument();

    // KPI 4: Portfolio Revenue at Risk
    expect(screen.getByText('Revenue at Risk')).toBeInTheDocument();
    expect(screen.getByText('R$ 2.45M')).toBeInTheDocument();

    // KPI 5: Repeat Buyer Rate
    expect(screen.getByText('Repeat Buyer Rate')).toBeInTheDocument();
    expect(screen.getAllByText('2.99%').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Counterfactual What-If Churn Laboratory with operational dials', () => {
    render(
      <ExecutiveOverviewView
        overview={mockPortfolioOverview}
        pipelineHealth={mockPipelineHealth}
        modelMeta={mockModelMetadata}
      />
    );

    expect(screen.getByText('Counterfactual What-If Churn Laboratory')).toBeInTheDocument();
    expect(screen.getByText('Delivery Delay Reduction')).toBeInTheDocument();
    expect(screen.getByText('Review Score Intervention')).toBeInTheDocument();
    expect(screen.getByText('Retention Incentive Voucher')).toBeInTheDocument();
  });

  it('triggers onNavigateToView when Launch Churn Simulator is clicked', () => {
    const handleNavigate = vi.fn();
    render(
      <ExecutiveOverviewView
        overview={mockPortfolioOverview}
        pipelineHealth={mockPipelineHealth}
        modelMeta={mockModelMetadata}
        onNavigateToView={handleNavigate}
      />
    );

    const launchButton = screen.getByRole('button', { name: /Launch Churn Simulator/i });
    launchButton.click();
    expect(handleNavigate).toHaveBeenCalledWith('churn-simulator');
  });
});
