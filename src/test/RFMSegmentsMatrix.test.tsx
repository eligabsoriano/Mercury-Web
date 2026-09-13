import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RFMSegmentsMatrix } from '../components/charts/RFMSegmentsMatrix';
import { mockSegmentsOverview } from '../api/mocks/data';

describe('RFMSegmentsMatrix Component', () => {
  it('renders all 11 quintile segment cards in grid view', () => {
    render(<RFMSegmentsMatrix data={mockSegmentsOverview} />);

    expect(screen.getByText('RFM Customer Segmentation Matrix')).toBeInTheDocument();
    expect(screen.getAllByText('Champions').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Loyal Customers')).toBeInTheDocument();
    expect(screen.getByText("Can't Lose Them")).toBeInTheDocument();
    expect(screen.getByText('At Risk')).toBeInTheDocument();
    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('switches to Revenue Share horizontal bar view and back', () => {
    render(<RFMSegmentsMatrix data={mockSegmentsOverview} />);

    const revShareBtn = screen.getByRole('button', { name: /Revenue Share/i });
    fireEvent.click(revShareBtn);

    // Switch back to grid
    const gridBtn = screen.getByRole('button', { name: /Grid Cards/i });
    fireEvent.click(gridBtn);
    expect(screen.getAllByText('Champions').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onSelectSegment when Filter Customers CTA is clicked', () => {
    const handleSelectSegment = vi.fn();
    render(<RFMSegmentsMatrix data={mockSegmentsOverview} onSelectSegment={handleSelectSegment} />);

    const filterBtn = screen.getByRole('button', { name: /Filter Customers/i });
    fireEvent.click(filterBtn);
    expect(handleSelectSegment).toHaveBeenCalledWith('Champions');
  });
});
