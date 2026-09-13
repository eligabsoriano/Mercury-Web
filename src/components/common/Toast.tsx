import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext, type ToastType, type ToastItem } from './ToastContext';

const TOAST_STYLES: Record<ToastType, { icon: React.ReactNode; border: string; bg: string; iconColor: string; titleColor: string }> = {
  success: {
    icon: <CheckCircle2 size={16} />,
    border: 'border-[rgba(52,211,153,0.35)]',
    bg: 'bg-[linear-gradient(135deg,rgba(16,36,30,0.92)_0%,rgba(6,20,16,0.96)_100%)]',
    iconColor: 'text-[#34d399]',
    titleColor: 'text-[#a7f3d0]',
  },
  error: {
    icon: <AlertCircle size={16} />,
    border: 'border-[rgba(244,63,94,0.35)]',
    bg: 'bg-[linear-gradient(135deg,rgba(40,16,24,0.92)_0%,rgba(20,6,12,0.96)_100%)]',
    iconColor: 'text-[#f43f5e]',
    titleColor: 'text-[#fecdd3]',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    border: 'border-[rgba(251,191,36,0.35)]',
    bg: 'bg-[linear-gradient(135deg,rgba(36,30,14,0.92)_0%,rgba(20,16,6,0.96)_100%)]',
    iconColor: 'text-[#fbbf24]',
    titleColor: 'text-[#fef08a]',
  },
  info: {
    icon: <Info size={16} />,
    border: 'border-[rgba(56,189,248,0.35)]',
    bg: 'bg-[linear-gradient(135deg,rgba(14,30,44,0.92)_0%,rgba(6,16,28,0.96)_100%)]',
    iconColor: 'text-[#38bdf8]',
    titleColor: 'text-[#bae6fd]',
  },
};

export interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: Omit<ToastItem, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duration = options.duration ?? 4000;
      const newToast: ToastItem = { ...options, id, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const contextValue = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Floating Toast Portal */}
      <div
        data-testid="toast-container"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-[calc(100vw-2.5rem)] sm:w-96 pointer-events-none"
        aria-live="polite"
        aria-label="System Notifications"
      >
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type];

          return (
            <div
              key={toast.id}
              data-testid={`toast-${toast.type}`}
              className={`pointer-events-auto rounded-xl p-3.5 border shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex items-start space-x-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${style.bg} ${style.border}`}
              role="alert"
            >
              <div className={`p-1 rounded-lg bg-[rgba(255,255,255,0.06)] shrink-0 ${style.iconColor}`}>
                {style.icon}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className={`text-xs font-bold font-display tracking-tight ${style.titleColor}`}>
                  {toast.title}
                </div>
                {toast.message && (
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="p-1 text-[var(--text-muted)] hover:text-white rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
