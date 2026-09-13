import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarketingFunnelView } from '../views/MarketingFunnelView';
import {
  mockMarketingFunnel,
  mockChannelAttribution,
  mockSalesVelocity,
  mockSegmentPerformance,
  mockMarketingLeads,
} from '../api/mocks/data';

describe('MarketingFunnelView Component', () => {
  it('renders heading, badges, and all 4 KPI scorecards accurately', () => {
    render(
      <MarketingFunnelView
        initialOverview={mockMarketingFunnel}
        initialChannels={mockChannelAttribution}
        initialVelocity={mockSalesVelocity}
        initialSegments={mockSegmentPerformance}
        initialLeads={mockMarketingLeads}
      />
    );

    // Title and badge
    expect(screen.getByText(/B2B Marketplace Growth & Seller Telemetry/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Marketing Funnel & Sales Velocity/i })).toBeInTheDocument();

    // 4 KPI Scorecards
    expect(screen.getByText('Overall Conversion Rate')).toBeInTheDocument();
    expect(screen.getByText('10.5%')).toBeInTheDocument();

    expect(screen.getByText('Avg Sales Cycle Velocity')).toBeInTheDocument();
    expect(screen.getAllByText(/18.4 Days/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('Seller Activation Rate')).toBeInTheDocument();
    expect(screen.getByText('49.9%')).toBeInTheDocument();

    expect(screen.getByText('Revenue Realization Ratio')).toBeInTheDocument();
    expect(screen.getAllByText(/60.6%/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the visual stepped funnel stages with 3 key phases and revenue bridge', () => {
    render(
      <MarketingFunnelView
        initialOverview={mockMarketingFunnel}
        initialChannels={mockChannelAttribution}
        initialVelocity={mockSalesVelocity}
        initialSegments={mockSegmentPerformance}
        initialLeads={mockMarketingLeads}
      />
    );

    expect(screen.getByTestId('funnel-stages-card')).toBeInTheDocument();
    expect(screen.getByText(/1. Top of Funnel/i)).toBeInTheDocument();
    expect(screen.getByText(/Marketing Qualified Leads \(MQL\)/i)).toBeInTheDocument();
    expect(screen.getAllByText('8,000').length).toBeGreaterThan(0);

    expect(screen.getByText(/2. Sales Conversion/i)).toBeInTheDocument();
    expect(screen.getByText(/Closed Won Merchant Deals/i)).toBeInTheDocument();
    expect(screen.getAllByText('842').length).toBeGreaterThan(0);

    expect(screen.getByText(/3. Fulfilled Activation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Active Marketplace Sellers/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('420').length).toBeGreaterThan(0);

    // Revenue bridge
    expect(screen.getByText(/Revenue Realization Bridge: Self-Declared vs Realized GMV/i)).toBeInTheDocument();
    expect(screen.getAllByText(/R\$ 14.25M/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/R\$ 8.64M/i).length).toBeGreaterThan(0);
  });

  it('renders origin channel attribution chart and allows switching metric modes', () => {
    render(
      <MarketingFunnelView
        initialOverview={mockMarketingFunnel}
        initialChannels={mockChannelAttribution}
        initialVelocity={mockSalesVelocity}
        initialSegments={mockSegmentPerformance}
        initialLeads={mockMarketingLeads}
      />
    );

    expect(screen.getByTestId('channel-attribution-card')).toBeInTheDocument();
    expect(screen.getByText(/Origin Channel Attribution & Conversion/i)).toBeInTheDocument();

    const conversionBtn = screen.getByRole('button', { name: /Conversion Rate \(%\)/i });
    fireEvent.click(conversionBtn);

    const revenueBtn = screen.getByRole('button', { name: /Realized GMV/i });
    fireEvent.click(revenueBtn);
  });

  it('renders sales velocity distribution chart and allows toggling view modes', () => {
    render(
      <MarketingFunnelView
        initialOverview={mockMarketingFunnel}
        initialChannels={mockChannelAttribution}
        initialVelocity={mockSalesVelocity}
        initialSegments={mockSegmentPerformance}
        initialLeads={mockMarketingLeads}
      />
    );

    expect(screen.getByTestId('velocity-distribution-card')).toBeInTheDocument();
    expect(screen.getByText(/Sales Cycle Velocity Distribution/i)).toBeInTheDocument();

    // Toggle to By Lead Type
    const leadTypeBtn = screen.getByRole('button', { name: /By Lead Type/i });
    fireEvent.click(leadTypeBtn);

    // Toggle back to By Segment
    const segmentBtn = screen.getByRole('button', { name: /By Segment/i });
    fireEvent.click(segmentBtn);
  });

  it('renders seller industry segment economics table with all 5 segments', () => {
    render(
      <MarketingFunnelView
        initialOverview={mockMarketingFunnel}
        initialChannels={mockChannelAttribution}
        initialVelocity={mockSalesVelocity}
        initialSegments={mockSegmentPerformance}
        initialLeads={mockMarketingLeads}
      />
    );

    expect(screen.getByText(/Seller Industry Segment Economics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/home appliances/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/health beauty/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/sports leisure/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/computers accessories/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fashion clothing/i).length).toBeGreaterThan(0);
  });

  it('renders marketing leads directory with search, filter buttons, and pagination', () => {
    render(
      <MarketingFunnelView
        initialOverview={mockMarketingFunnel}
        initialChannels={mockChannelAttribution}
        initialVelocity={mockSalesVelocity}
        initialSegments={mockSegmentPerformance}
        initialLeads={mockMarketingLeads}
      />
    );

    expect(screen.getByTestId('leads-directory-card')).toBeInTheDocument();
    expect(screen.getByText('mql-001')).toBeInTheDocument();
    expect(screen.getByText('mql-002')).toBeInTheDocument();

    // Filter by won deals
    const wonBtn = screen.getByRole('button', { name: /Won Deals/i });
    fireEvent.click(wonBtn);

    // Filter by active sellers
    const activeBtn = screen.getByRole('button', { name: /Active Sellers/i });
    fireEvent.click(activeBtn);

    // Search input
    const searchInput = screen.getByPlaceholderText(/Search MQL ID, segment.../i);
    fireEvent.change(searchInput, { target: { value: 'mql-001' } });
    expect(screen.getByText('mql-001')).toBeInTheDocument();
  });
});
