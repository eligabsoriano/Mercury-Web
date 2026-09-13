import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../components/common';

// Test consumer component
const ToastConsumer: React.FC = () => {
  const { showToast, dismissToast } = useToast();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Operation Succeeded',
            message: 'Portfolio telemetry updated smoothly',
          })
        }
      >
        Trigger Success Toast
      </button>

      <button
        type="button"
        onClick={() =>
          showToast({
            type: 'error',
            title: 'Operation Failed',
            message: 'Critical network exception encountered',
          })
        }
      >
        Trigger Error Toast
      </button>

      <button
        type="button"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Resource Warning',
            message: 'High churn threshold exceeded',
          })
        }
      >
        Trigger Warning Toast
      </button>

      <button
        type="button"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'System Notice',
            message: 'Background synchronization active',
          })
        }
      >
        Trigger Info Toast
      </button>

      <button
        type="button"
        onClick={() => {
          const id = showToast({
            type: 'info',
            title: 'Persistent Toast',
            duration: 0,
          });
          setTimeout(() => dismissToast(id), 100);
        }}
      >
        Trigger Dismissable Toast
      </button>
    </div>
  );
};

describe('Toast Notification System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders ToastProvider and consumer children properly', () => {
    render(
      <ToastProvider>
        <div data-testid="toast-child">Child View Content</div>
      </ToastProvider>
    );

    expect(screen.getByTestId('toast-child')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('throws error when useToast is used outside of ToastProvider', () => {
    // Suppress console.error for expected React throw
    const originalError = console.error;
    console.error = vi.fn();

    const OutsideConsumer: React.FC = () => {
      useToast();
      return null;
    };

    expect(() => render(<OutsideConsumer />)).toThrow(
      'useToast must be used within a ToastProvider'
    );

    console.error = originalError;
  });

  it('displays success toast with correct content and icon style', () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Trigger Success Toast/i }));

    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByText('Operation Succeeded')).toBeInTheDocument();
    expect(
      screen.getByText('Portfolio telemetry updated smoothly')
    ).toBeInTheDocument();
  });

  it('displays error, warning, and info toasts when triggered', () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Trigger Error Toast/i }));
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByText('Operation Failed')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Trigger Warning Toast/i }));
    expect(screen.getByTestId('toast-warning')).toBeInTheDocument();
    expect(screen.getByText('Resource Warning')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Trigger Info Toast/i }));
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
    expect(screen.getByText('System Notice')).toBeInTheDocument();
  });

  it('allows manually dismissing a toast by clicking the dismiss button', () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Trigger Success Toast/i }));
    expect(screen.getByText('Operation Succeeded')).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', { name: /Dismiss notification/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText('Operation Succeeded')).not.toBeInTheDocument();
  });

  it('automatically dismisses toasts after timer duration elapses', () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Trigger Success Toast/i }));
    expect(screen.getByText('Operation Succeeded')).toBeInTheDocument();

    // Fast-forward 4000ms
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Operation Succeeded')).not.toBeInTheDocument();
  });
});
