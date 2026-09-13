import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChurnSimulatorView } from '../views/ChurnSimulatorView';

describe('ChurnSimulatorView Component', () => {
  it('renders the main heading and counterfactual inference badge', async () => {
    render(<ChurnSimulatorView />);

    expect(
      screen.getByRole('heading', { level: 1, name: /ML Churn Scoring & What-If Simulation Lab/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Counterfactual Inference Engine/i)).toBeInTheDocument();
  });

  it('renders all preset action buttons: Reset, Logistics Crisis, Win-Back Push, Optimal Preset', async () => {
    render(<ChurnSimulatorView />);

    expect(screen.getByRole('button', { name: /^Reset$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logistics Crisis/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Win-Back Push/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Optimal Preset/i })).toBeInTheDocument();
  });

  it('renders customer hydration card with quick-select candidate accounts', async () => {
    render(<ChurnSimulatorView />);

    expect(
      screen.getByText(/Customer Feature Hydration & Baseline Context/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Quick-Select Candidate Accounts:/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Or enter \/ paste Customer Unique ID/i)).toBeInTheDocument();
  });

  it('allows clicking a quick-select customer to hydrate their baseline metrics', async () => {
    const handleSelect = vi.fn();
    render(<ChurnSimulatorView onSelectCustomer={handleSelect} />);

    const quickSelectBtn = screen.getByRole('button', { name: /Can't Lose Them \(VIP\)/i });
    fireEvent.click(quickSelectBtn);

    expect(handleSelect).toHaveBeenCalledWith('3977529608a9133437c6671319932829');

    await waitFor(() => {
      expect(screen.getByText(/3977529608a9133437c6671319932829/i)).toBeInTheDocument();
    });
  });

  it('renders the 4 operational sliders and the concierge outreach toggle', async () => {
    render(<ChurnSimulatorView />);

    expect(screen.getByText(/Carrier Delivery Delay Adjustment/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Review Score Shift/i)).toBeInTheDocument();
    expect(screen.getByText(/Retention Discount Incentive/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Cadence \/ Frequency Delta/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP Concierge Support Outreach/i)).toBeInTheDocument();
  });

  it('toggles VIP Concierge Support Outreach switch', async () => {
    render(<ChurnSimulatorView />);

    const toggleBtn = screen.getByRole('button', {
      name: /Toggle VIP Concierge Support Outreach/i,
    });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
  });

  it('renders comparative counterfactual outcome with before and after indicators', async () => {
    render(<ChurnSimulatorView />);

    expect(screen.getByText(/Comparative Counterfactual Outcome/i)).toBeInTheDocument();
    expect(screen.getByText(/BASELINE \(STATUS QUO\)/i)).toBeInTheDocument();
    expect(screen.getByText(/PROJECTED SIMULATION/i)).toBeInTheDocument();
    expect(screen.getByText(/Risk Tier Transition/i)).toBeInTheDocument();
    expect(screen.getByText(/Retention Priority Transition/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Assessment:/i)).toBeInTheDocument();
  });

  it('renders model transparency card with ROC-AUC and feature importance', async () => {
    render(<ChurnSimulatorView />);

    await waitFor(() => {
      expect(
        screen.getByText(/ML Serving Model Transparency & Algorithmic Guardrails/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/ROC-AUC Score/i)).toBeInTheDocument();
      expect(screen.getByText(/PR-AUC Curve/i)).toBeInTheDocument();
      expect(screen.getByText(/Shapley \/ Permutation Feature Importance/i)).toBeInTheDocument();
    });
  });

  it('expands all engineered feature space tags on click', async () => {
    render(<ChurnSimulatorView />);

    await waitFor(() => {
      expect(screen.getByText(/Inspect All Features/i)).toBeInTheDocument();
    });

    const expandBtn = screen.getByRole('button', { name: /Inspect All Features/i });
    fireEvent.click(expandBtn);

    await waitFor(() => {
      expect(screen.getByText(/Numeric Feature Inputs/i)).toBeInTheDocument();
      expect(screen.getByText(/Categorical Encoded Dimensions/i)).toBeInTheDocument();
    });
  });

  it('applies presets when clicking Optimal Preset button', async () => {
    render(<ChurnSimulatorView />);

    const optimalBtn = screen.getByRole('button', { name: /Optimal Preset/i });
    fireEvent.click(optimalBtn);

    await waitFor(() => {
      // Check that discount rate badge updated to 20%
      expect(screen.getByText(/20% promotional voucher/i)).toBeInTheDocument();
    });
  });
});
