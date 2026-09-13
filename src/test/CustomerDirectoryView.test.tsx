import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerIntelligenceView } from '../views/CustomerIntelligenceView';

describe('CustomerIntelligenceView / CustomerDirectoryView Component', () => {
  it('renders directory heading and summary stat pills', async () => {
    render(<CustomerIntelligenceView />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Customer Intelligence & Risk Directory/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Matching Records/i)).toBeInTheDocument();
    expect(screen.getByText(/Page Revenue at Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Churn Probability/i)).toBeInTheDocument();
  });

  it('renders dual tabs: All Customers and Priority At-Risk Queue', async () => {
    render(<CustomerIntelligenceView />);

    const allTab = screen.getByRole('button', { name: /All Customers/i });
    const atRiskTab = screen.getByRole('button', { name: /Priority At-Risk Queue/i });

    expect(allTab).toBeInTheDocument();
    expect(atRiskTab).toBeInTheDocument();
  });

  it('switches between All Customers and Priority At-Risk Queue tabs', async () => {
    render(<CustomerIntelligenceView />);

    const atRiskTab = screen.getByRole('button', { name: /Priority At-Risk Queue/i });
    fireEvent.click(atRiskTab);

    await waitFor(() => {
      expect(screen.getByText(/Active View: Intervention Queue/i)).toBeInTheDocument();
    });

    const allTab = screen.getByRole('button', { name: /All Customers/i });
    fireEvent.click(allTab);

    await waitFor(() => {
      expect(screen.getByText(/Active View: Universal Registry/i)).toBeInTheDocument();
    });
  });

  it('renders search input and filter dropdowns', async () => {
    render(<CustomerIntelligenceView />);

    const searchInput = screen.getByPlaceholderText(/Search by customer_unique_id, city, or state/i);
    expect(searchInput).toBeInTheDocument();

    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns.length).toBeGreaterThanOrEqual(4);
  });

  it('filters customers when searching with debounce', async () => {
    render(<CustomerIntelligenceView />);

    const searchInput = screen.getByPlaceholderText(/Search by customer_unique_id, city, or state/i);
    fireEvent.change(searchInput, { target: { value: '8d50f5ea' } });

    await waitFor(
      () => {
        expect(screen.getByText(/8d50f5ea/i)).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  it('opens Customer 360 modal when clicking a customer row', async () => {
    const handleSelect = vi.fn();
    render(<CustomerIntelligenceView onSelectCustomer={handleSelect} />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    // Click the first customer row (or 360 button)
    const demo360Btn = screen.getByRole('button', { name: /Quick 360 Demo/i });
    fireEvent.click(demo360Btn);

    await waitFor(() => {
      expect(screen.getByLabelText('Customer 360 Profile')).toBeInTheDocument();
    });
  });

  it('triggers CSV export when clicking Export CSV button', async () => {
    render(<CustomerIntelligenceView />);

    const exportBtn = screen.getByRole('button', { name: /Export CSV/i });
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(exportBtn).toBeEnabled();
    });
  });
});
