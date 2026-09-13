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
          className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-200 shadow-sm relative my-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle size={24} />
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-mono text-rose-700 uppercase font-bold tracking-wider mb-1">
                <ShieldAlert size={11} />
                <span>Runtime Resilience Isolation</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-2xl leading-relaxed">
            {message}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry Module</span>
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              <span>Reload Entire System</span>
            </button>

            {this.state.error && (
              <button
                type="button"
                onClick={this.toggleDetails}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 text-xs font-mono transition-colors ml-auto cursor-pointer"
              >
                <span>{this.state.showDetails ? 'Hide Diagnostics' : 'Inspect Stack Trace'}</span>
                {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {this.state.showDetails && this.state.error && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-[11px] text-rose-200 overflow-x-auto space-y-1">
                <div className="font-bold text-white">{this.state.error.name}: {this.state.error.message}</div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-slate-400 mt-2 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] text-slate-400 mt-2 border-t border-slate-800 pt-2 whitespace-pre-wrap">
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
