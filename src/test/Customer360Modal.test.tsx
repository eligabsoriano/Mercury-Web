import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Customer360Modal } from '../components/customers/Customer360Modal';

describe('Customer360Modal Component', () => {
  const defaultCustomerId = '8d50f5eadf502056fa2f144b30424d35';

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Customer360Modal
        isOpen={false}
        customerId={defaultCustomerId}
        onClose={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders customer header and financial details when open', async () => {
    render(
      <Customer360Modal
        isOpen={true}
        customerId={defaultCustomerId}
        onClose={() => {}}
      />
    );

    // Header and Customer ID
    await waitFor(() => {
      expect(screen.getByText(defaultCustomerId)).toBeInTheDocument();
    });

    expect(screen.getByText(/Customer 360/i)).toBeInTheDocument();
    expect(screen.getByText(/Lifetime Spend/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed Orders/i)).toBeInTheDocument();
  });

  it('displays churn probability and risk tier badge', async () => {
    render(
      <Customer360Modal
        isOpen={true}
        customerId={defaultCustomerId}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/HistGradientBoosting Churn Risk/i)).toBeInTheDocument();
    });

    // Churn probability label
    expect(screen.getByText(/P\(Churn\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Monetary Exposure/i)).toBeInTheDocument();
  });

  it('switches to Basket & Fulfillment tab and renders delivery metrics', async () => {
    render(
      <Customer360Modal
        isOpen={true}
        customerId={defaultCustomerId}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(defaultCustomerId)).toBeInTheDocument();
    });

    const fulfillmentTab = screen.getByRole('button', { name: /Basket & Fulfillment/i });
    fireEvent.click(fulfillmentTab);

    await waitFor(() => {
      expect(screen.getByText(/Basket Diversity & Merchandise/i)).toBeInTheDocument();
      expect(screen.getByText(/Fulfillment Speed & Delivery Friction/i)).toBeInTheDocument();
      expect(screen.getByText(/Spend Composition/i)).toBeInTheDocument();
    });
  });

  it('switches to Prescriptive Playbook tab and displays recommendation', async () => {
    render(
      <Customer360Modal
        isOpen={true}
        customerId={defaultCustomerId}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(defaultCustomerId)).toBeInTheDocument();
    });

    const playbookTab = screen.getByRole('button', { name: /Prescriptive Playbook/i });
    fireEvent.click(playbookTab);

    await waitFor(() => {
      expect(screen.getByText(/Prescriptive Playbook Recommendation/i)).toBeInTheDocument();
      expect(screen.getByText(/Action Cost/i)).toBeInTheDocument();
      expect(screen.getByText(/Save Rate Range/i)).toBeInTheDocument();
      expect(screen.getByText(/Intervention Script Template/i)).toBeInTheDocument();
    });
  });

  it('triggers onNavigateToSimulator when action button is clicked', async () => {
    const handleNavigate = vi.fn();
    const handleClose = vi.fn();

    render(
      <Customer360Modal
        isOpen={true}
        customerId={defaultCustomerId}
        onClose={handleClose}
        onNavigateToSimulator={handleNavigate}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(defaultCustomerId)).toBeInTheDocument();
    });

    const simulateBtn = screen.getByRole('button', { name: /Simulate Churn What-If/i });
    expect(simulateBtn).toBeInTheDocument();
    fireEvent.click(simulateBtn);

    expect(handleNavigate).toHaveBeenCalledWith(defaultCustomerId);
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();

    render(
      <Customer360Modal
        isOpen={true}
        customerId={defaultCustomerId}
        onClose={handleClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(defaultCustomerId)).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: /Close Customer 360 Drawer/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
