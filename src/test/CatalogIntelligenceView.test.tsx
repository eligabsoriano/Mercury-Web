import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CatalogIntelligenceView } from '../views/CatalogIntelligenceView';
import {
  mockCategories,
  mockSellers,
  mockProducts,
} from '../api/mocks/data';

describe('CatalogIntelligenceView Component', () => {
  it('renders heading, badges, and all 4 Category KPI summary cards', () => {
    render(
      <CatalogIntelligenceView
        initialCategories={mockCategories}
        initialSellers={mockSellers}
        initialProducts={mockProducts}
      />
    );

    // Title and badge
    expect(screen.getByText(/Catalog & Merchant Telemetry/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Catalog Intelligence & Seller Logistics/i,
      })
    ).toBeInTheDocument();

    // 4 KPI Cards
    expect(screen.getByText('Product Categories')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText('Products Catalogued')).toBeInTheDocument();
    expect(screen.getByText('32,951')).toBeInTheDocument();

    expect(screen.getByText('Top Category Revenue')).toBeInTheDocument();
    expect(screen.getAllByText('R$ 1.26M').length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('Highest Rated Category')).toBeInTheDocument();
    expect(screen.getAllByText(/4.18/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders interactive Product Categories Scorecard with category cards and sorting', () => {
    render(
      <CatalogIntelligenceView
        initialCategories={mockCategories}
        initialSellers={mockSellers}
        initialProducts={mockProducts}
      />
    );

    expect(screen.getByText(/Marketplace Product Categories Scorecard/i)).toBeInTheDocument();
    expect(screen.getByText(/Displaying 8 product categories/i)).toBeInTheDocument();

    // Check categories exist
    expect(screen.getAllByText(/Health Beauty/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Watches Gifts/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bed Bath Table/i).length).toBeGreaterThan(0);

    // Test sort controls
    const sortButtons = screen.getAllByRole('button', { name: /^Units Sold$/i });
    fireEvent.click(sortButtons[0]);

    const ratingBtn = screen.getByRole('button', { name: /^Rating \(★\)$/i });
    fireEvent.click(ratingBtn);

    const skusBtn = screen.getByRole('button', { name: /^SKUs$/i });
    fireEvent.click(skusBtn);

    const revenueButtons = screen.getAllByRole('button', { name: /^Revenue$/i });
    fireEvent.click(revenueButtons[0]);
  });

  it('renders Category Revenue Distribution chart and allows toggling metrics', () => {
    render(
      <CatalogIntelligenceView
        initialCategories={mockCategories}
        initialSellers={mockSellers}
        initialProducts={mockProducts}
      />
    );

    const chartCard = screen.getByTestId('category-revenue-chart-card');
    expect(chartCard).toBeInTheDocument();
    expect(within(chartCard).getByText(/Product Category Revenue & Volume Distribution/i)).toBeInTheDocument();

    // Toggle to Units Sold
    const unitsBtn = within(chartCard).getByRole('button', { name: /^Units Sold$/i });
    fireEvent.click(unitsBtn);

    // Toggle to Catalog SKUs
    const skusBtn = within(chartCard).getByRole('button', { name: /^Catalog SKUs$/i });
    fireEvent.click(skusBtn);

    // Toggle back to Gross Revenue
    const revBtn = within(chartCard).getByRole('button', { name: /^Gross Revenue$/i });
    fireEvent.click(revBtn);
  });

  it('renders Seller Revenue vs Satisfaction Matrix scatter chart with legend', () => {
    render(
      <CatalogIntelligenceView
        initialCategories={mockCategories}
        initialSellers={mockSellers}
        initialProducts={mockProducts}
      />
    );

    expect(screen.getByTestId('seller-performance-scatter-card')).toBeInTheDocument();
    expect(screen.getByText(/Seller Revenue vs Satisfaction Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/<5% Late/i)).toBeInTheDocument();
    expect(screen.getByText(/5–10% Late/i)).toBeInTheDocument();
    expect(screen.getByText(/>10% Late/i)).toBeInTheDocument();
  });

  it('renders Marketplace Merchants & Delivery Health Directory with search, state filter, and pagination', () => {
    render(
      <CatalogIntelligenceView
        initialCategories={mockCategories}
        initialSellers={mockSellers}
        initialProducts={mockProducts}
      />
    );

    expect(screen.getByText(/Marketplace Merchants & Delivery Health Directory/i)).toBeInTheDocument();

    // Check seller row exists
    expect(screen.getByText(/seller-sp-001/i)).toBeInTheDocument();
    expect(screen.getByText(/seller-rj-002/i)).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText(/Search Seller ID, city, state.../i);
    fireEvent.change(searchInput, { target: { value: 'seller-sp-001' } });
    expect(screen.getByText(/seller-sp-001/i)).toBeInTheDocument();
  });
});
