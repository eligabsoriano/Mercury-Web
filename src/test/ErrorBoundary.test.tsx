import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Mock component that throws on demand
const ProblemChild: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test rendering crash in child component');
  }
  return <div data-testid="child-content">Normal Content Operational</div>;
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error during expected thrown errors in tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('renders children properly when no runtime exception occurs', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Normal Content Operational')).toBeInTheDocument();
    expect(screen.queryByTestId('error-boundary-fallback')).not.toBeInTheDocument();
  });

  it('catches render error and displays the glassmorphic fallback card', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(
      screen.getByText('Executive Telemetry View Encountered an Exception')
    ).toBeInTheDocument();
    expect(screen.getByText(/Runtime Resilience Isolation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry Module/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Entire System/i })).toBeInTheDocument();
  });

  it('displays custom fallback title and message when provided', () => {
    render(
      <ErrorBoundary
        fallbackTitle="Custom Module Failure"
        fallbackMessage="Custom failure explanation for executive operators."
      >
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Module Failure')).toBeInTheDocument();
    expect(
      screen.getByText('Custom failure explanation for executive operators.')
    ).toBeInTheDocument();
  });

  it('allows inspecting and hiding technical stack trace diagnostics', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    const toggleBtn = screen.getByRole('button', { name: /Inspect Stack Trace/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click to expand diagnostics
    fireEvent.click(toggleBtn);
    expect(screen.getAllByText(/Test rendering crash in child component/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Hide Diagnostics/i })).toBeInTheDocument();

    // Click to hide diagnostics
    fireEvent.click(screen.getByRole('button', { name: /Hide Diagnostics/i }));
    expect(screen.queryAllByText(/Test rendering crash in child component/i).length).toBe(0);
  });

  it('triggers onReset callback when Retry Module is clicked', () => {
    const onResetMock = vi.fn();

    render(
      <ErrorBoundary onReset={onResetMock}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryBtn = screen.getByRole('button', { name: /Retry Module/i });
    fireEvent.click(retryBtn);

    expect(onResetMock).toHaveBeenCalledTimes(1);
  });
});
