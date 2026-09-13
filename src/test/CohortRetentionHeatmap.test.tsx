import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CohortRetentionHeatmap } from '../components/charts/CohortRetentionHeatmap';
import { mockCohortRetention } from '../api/mocks/data';

describe('CohortRetentionHeatmap Component', () => {
  it('renders cohort retention table with acquisition cohorts and periods', () => {
    render(<CohortRetentionHeatmap data={mockCohortRetention} />);

    expect(screen.getByText('12-Month Cohort Retention Decay Matrix')).toBeInTheDocument();
    expect(screen.getByText('Jan 2017')).toBeInTheDocument();
    expect(screen.getByText('Dec 2017')).toBeInTheDocument();
    expect(screen.getByText('Average Decay')).toBeInTheDocument();
  });

  it('renders the executive cohort takeaway summary', () => {
    render(<CohortRetentionHeatmap data={mockCohortRetention} />);

    expect(
      screen.getByText(/Executive Cohort Takeaway: Single-Purchase Marketplace Drop-Off/i)
    ).toBeInTheDocument();
  });
});
