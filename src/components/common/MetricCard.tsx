import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: {
    value: number | string;
    label?: string;
    isPositive?: boolean;
    neutral?: boolean;
  };
  takeaway?: string;
  icon?: React.ReactNode;
  accent?: 'emerald' | 'crimson' | 'violet' | 'amber' | 'cyan';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  takeaway,
  icon,
  accent = 'emerald',
  className,
}) => {
  const accentStyles = {
    emerald: {
      text: 'text-[var(--accent-emerald)]',
      bg: 'bg-[var(--accent-emerald-glow)]',
      border: 'border-[var(--border-emerald)]',
      gradient: 'text-gradient-emerald',
    },
    crimson: {
      text: 'text-[var(--accent-crimson)]',
      bg: 'bg-[var(--accent-crimson-glow)]',
      border: 'border-[var(--border-crimson)]',
      gradient: 'text-gradient-crimson',
    },
    violet: {
      text: 'text-[var(--accent-violet)]',
      bg: 'bg-[var(--accent-violet-glow)]',
      border: 'border-[var(--border-focus)]',
      gradient: 'text-gradient-violet',
    },
    amber: {
      text: 'text-[var(--accent-amber)]',
      bg: 'bg-[var(--accent-amber-glow)]',
      border: 'border-[hsla(38,92%,50%,0.35)]',
      gradient: '',
    },
    cyan: {
      text: 'text-[var(--accent-cyan)]',
      bg: 'bg-[var(--accent-cyan-glow)]',
      border: 'border-[hsla(199,89%,48%,0.35)]',
      gradient: 'text-gradient-cyan',
    },
  }[accent];

  return (
    <GlassCard padding="md" className={clsx('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-muted)]">
            {title}
          </span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="kpi-value text-primary">{value}</span>
            {subtitle && (
              <span className="text-xs text-[var(--text-muted)] font-normal">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={clsx(
              'p-2.5 rounded-xl border flex items-center justify-center',
              accentStyles.bg,
              accentStyles.border,
              accentStyles.text
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(delta || takeaway) && (
        <div className="mt-4 pt-3 border-t border-[hsla(217,33%,25%,0.35)] flex items-center justify-between text-xs">
          {delta && (
            <div
              className={clsx(
                'flex items-center space-x-1 font-medium px-2 py-0.5 rounded-md',
                delta.neutral
                  ? 'bg-[hsla(215,16%,50%,0.15)] text-[var(--text-muted)]'
                  : delta.isPositive
                  ? 'bg-[hsla(158,64%,52%,0.15)] text-[var(--accent-emerald)]'
                  : 'bg-[hsla(354,70%,54%,0.15)] text-[var(--accent-crimson)]'
              )}
            >
              {delta.neutral ? (
                <Minus size={13} />
              ) : delta.isPositive ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
              )}
              <span>{delta.value}</span>
              {delta.label && <span className="opacity-75 ml-0.5">{delta.label}</span>}
            </div>
          )}

          {takeaway && (
            <span className="text-[11px] text-[var(--text-secondary)] italic truncate ml-2">
              {takeaway}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
};
