import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Mercury ErrorBoundary] Uncaught runtime exception caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    this.props.onReset?.();
  };

  handleReload = (): void => {
    window.location.reload();
  };

  toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const title = this.props.fallbackTitle ?? 'Executive Telemetry View Encountered an Exception';
      const message =
        this.props.fallbackMessage ??
        'An unexpected rendering anomaly occurred in this dashboard module. Other intelligence modules remain isolated and operational.';

      return (
        <div
          data-testid="error-boundary-fallback"
          className="liquid-glass rounded-2xl p-6 sm:p-8 border border-[rgba(244,63,94,0.35)] shadow-[0_8px_32px_rgba(244,63,94,0.15)] relative overflow-hidden my-4"
        >
          {/* Ambient red flare */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[radial-gradient(circle,rgba(244,63,94,0.18)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(244,63,94,0.15)] border border-[rgba(244,63,94,0.4)] flex items-center justify-center text-[#f43f5e] shrink-0 shadow-[0_0_16px_rgba(244,63,94,0.3)]">
              <AlertTriangle size={24} />
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(244,63,94,0.12)] border border-[rgba(244,63,94,0.3)] text-[10px] font-mono text-[#fca5a5] uppercase font-bold tracking-wider mb-1">
                <ShieldAlert size={11} />
                <span>Runtime Resilience Isolation</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 max-w-2xl leading-relaxed">
            {message}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[rgba(56,189,248,0.18)] hover:bg-[rgba(56,189,248,0.28)] border border-[rgba(56,189,248,0.4)] text-[#7dd3fc] text-xs font-semibold transition-all active:scale-95"
            >
              <RefreshCw size={14} />
              <span>Retry Module</span>
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.12)] text-white text-xs font-medium transition-all active:scale-95"
            >
              <span>Reload Entire System</span>
            </button>

            {this.state.error && (
              <button
                type="button"
                onClick={this.toggleDetails}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[var(--text-muted)] hover:text-white text-xs font-mono transition-colors ml-auto"
              >
                <span>{this.state.showDetails ? 'Hide Diagnostics' : 'Inspect Stack Trace'}</span>
                {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {this.state.showDetails && this.state.error && (
            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <div className="p-3.5 rounded-xl bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.08)] font-mono text-[11px] text-[#fca5a5] overflow-x-auto space-y-1">
                <div className="font-bold text-white">{this.state.error.name}: {this.state.error.message}</div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-[var(--text-muted)] mt-2 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] text-[var(--text-secondary)] mt-2 border-t border-[rgba(255,255,255,0.06)] pt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
