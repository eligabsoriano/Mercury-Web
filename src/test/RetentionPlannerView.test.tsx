import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RetentionPlannerView } from '../views/RetentionPlannerView';

describe('RetentionPlannerView Component', () => {
  it('renders heading, description, and jump navigation buttons', async () => {
    render(<RetentionPlannerView />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Retention Economics & Playbook Planner/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Algorithmic Capital Allocation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Knapsack Optimizer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Playbooks Catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Campaign ROI Lab/i })).toBeInTheDocument();
  });

  it('renders Knapsack Capital Deployment Optimizer with presets and KPI cards', async () => {
    render(<RetentionPlannerView />);

    expect(
      screen.getByText(/Knapsack Retention Capital Deployment Optimizer/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /R\$ 25k/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /R\$ 50k/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /R\$ 75k/i })).toBeInTheDocument();

    expect(screen.getByText(/Allocated Capital/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Expected Recovered GMV/i)).toBeInTheDocument();
    expect(screen.getByText(/Blended Portfolio ROI/i)).toBeInTheDocument();
  });

  it('updates Knapsack budget when clicking a budget preset button', async () => {
    render(<RetentionPlannerView />);

    const preset150k = screen.getByRole('button', { name: /R\$ 150k/i });
    fireEvent.click(preset150k);

    await waitFor(() => {
      expect(screen.getAllByText(/150/i).length).toBeGreaterThan(0);
    });
  });

  it('renders all candidate pool allocations in the Knapsack breakdown', async () => {
    render(<RetentionPlannerView />);

    await waitFor(() => {
      expect(screen.getByText(/VIP Concierge \(Champions & Can't Lose\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Logistics Recovery \(Late Delivery Victims\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Sentiment Repair \(Negative Reviewers\)/i)).toBeInTheDocument();
    });
  });

  it('renders Canonical Retention Playbook Catalog with playbooks from API', async () => {
    render(<RetentionPlannerView />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Canonical Retention Playbook Catalog/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('heading', {
          level: 3,
          name: /VIP Concierge & Dedicated Account Outreach/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: /Logistics Friction Recovery & Shipping Waiver/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: /Customer Sentiment Repair & Quality Resolution/i,
        })
      ).toBeInTheDocument();
    });
  });

  it('filters playbooks by channel when filter buttons are clicked', async () => {
    render(<RetentionPlannerView />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: /VIP Concierge & Dedicated Account Outreach/i,
        })
      ).toBeInTheDocument();
    });

    const logisticsFilterBtn = screen.getByRole('button', { name: /^Logistics Recovery$/i });
    fireEvent.click(logisticsFilterBtn);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: /Logistics Friction Recovery & Shipping Waiver/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', {
          level: 3,
          name: /VIP Concierge & Dedicated Account Outreach/i,
        })
      ).not.toBeInTheDocument();
    });
  });

  it('copies script template when clicking Copy button on a playbook card', async () => {
    render(<RetentionPlannerView />);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Copy/i }).length).toBeGreaterThan(0);
    });

    const copyBtn = screen.getAllByRole('button', { name: /Copy/i })[0];
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Copied/i).length).toBeGreaterThan(0);
    });
  });

  it('renders Campaign ROI & Financial Economics Simulator with sliders and forecasts', async () => {
    render(<RetentionPlannerView />);

    expect(
      screen.getByText(/Campaign ROI & Financial Economics Simulator/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Targeted Customer Count/i)).toBeInTheDocument();
    expect(screen.getByText(/Intervention Cost Per Customer/i)).toBeInTheDocument();
    expect(screen.getByText(/Expected Save Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Revenue at Risk/i)).toBeInTheDocument();

    expect(screen.getByText(/Total Campaign Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Protected GMV/i)).toBeInTheDocument();
    expect(screen.getByText(/Net Value Created/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Break-Even Save Rate/i).length).toBeGreaterThan(0);
  });

  it('clicking Simulate ROI on a playbook card selects it in the Campaign ROI Simulator', async () => {
    render(<RetentionPlannerView />);

    await waitFor(() => {
      const simulateBtns = screen.getAllByRole('button', { name: /Simulate ROI/i });
      expect(simulateBtns.length).toBeGreaterThan(0);
    });

    const firstSimulateBtn = screen.getAllByRole('button', { name: /Simulate ROI/i })[0];
    fireEvent.click(firstSimulateBtn);

    await waitFor(() => {
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('vip_concierge');
    });
  });
});
