import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext, type ToastType, type ToastItem } from './ToastContext';

const TOAST_STYLES: Record<ToastType, { icon: React.ReactNode; border: string; bg: string; iconBox: string; titleColor: string }> = {
  success: {
    icon: <CheckCircle2 size={16} />,
    border: 'border-emerald-200',
    bg: 'bg-white',
    iconBox: 'bg-emerald-50 text-emerald-600',
    titleColor: 'text-slate-900',
  },
  error: {
    icon: <AlertCircle size={16} />,
    border: 'border-rose-200',
    bg: 'bg-white',
    iconBox: 'bg-rose-50 text-rose-600',
    titleColor: 'text-slate-900',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    border: 'border-amber-200',
    bg: 'bg-white',
    iconBox: 'bg-amber-50 text-amber-600',
    titleColor: 'text-slate-900',
  },
  info: {
    icon: <Info size={16} />,
    border: 'border-sky-200',
    bg: 'bg-white',
    iconBox: 'bg-sky-50 text-sky-600',
    titleColor: 'text-slate-900',
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
              className={`pointer-events-auto rounded-xl p-3.5 border shadow-lg flex items-start space-x-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${style.bg} ${style.border}`}
              role="alert"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${style.iconBox}`}>
                {style.icon}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className={`text-xs font-bold font-display tracking-tight ${style.titleColor}`}>
                  {toast.title}
                </div>
                {toast.message && (
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
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
