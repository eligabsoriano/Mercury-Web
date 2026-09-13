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
  const accentConfigs = {
    emerald: {
      text: 'text-[var(--accent-emerald)]',
      bgGlow: 'bg-[radial-gradient(circle,#34d399_0%,transparent_70%)]',
      iconBox: 'bg-[rgba(52,211,153,0.14)] border-[rgba(52,211,153,0.35)] text-[#34d399] shadow-[0_0_15px_rgba(52,211,153,0.25)]',
      glow: 'emerald' as const,
    },
    crimson: {
      text: 'text-[var(--accent-crimson)]',
      bgGlow: 'bg-[radial-gradient(circle,#f43f5e_0%,transparent_70%)]',
      iconBox: 'bg-[rgba(244,63,94,0.14)] border-[rgba(244,63,94,0.35)] text-[#f43f5e] shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      glow: 'crimson' as const,
    },
    violet: {
      text: 'text-[var(--accent-violet)]',
      bgGlow: 'bg-[radial-gradient(circle,#8b5cf6_0%,transparent_70%)]',
      iconBox: 'bg-[rgba(139,92,246,0.16)] border-[rgba(139,92,246,0.40)] text-[#c084fc] shadow-[0_0_15px_rgba(139,92,246,0.25)]',
      glow: 'violet' as const,
    },
    amber: {
      text: 'text-[var(--accent-amber)]',
      bgGlow: 'bg-[radial-gradient(circle,#fbbf24_0%,transparent_70%)]',
      iconBox: 'bg-[rgba(251,191,36,0.14)] border-[rgba(251,191,36,0.35)] text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.25)]',
      glow: 'none' as const,
    },
    cyan: {
      text: 'text-[var(--accent-cyan)]',
      bgGlow: 'bg-[radial-gradient(circle,#38bdf8_0%,transparent_70%)]',
      iconBox: 'bg-[rgba(56,189,248,0.14)] border-[rgba(56,189,248,0.35)] text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.25)]',
      glow: 'cyan' as const,
    },
  }[accent];

  return (
    <GlassCard
      padding="md"
      interactive
      className={clsx('relative overflow-hidden group', className)}
    >
      {/* Ambient Internal Backlight Halo */}
      <div
        className={clsx(
          'absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none',
          accentConfigs.bgGlow
        )}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-secondary)]">
            {title}
          </span>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="kpi-value">{value}</span>
            {subtitle && (
              <span className="text-xs text-[var(--text-secondary)] font-normal">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={clsx(
              'p-3 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-105',
              accentConfigs.iconBox
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(delta || takeaway) && (
        <div className="mt-4 pt-3.5 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-xs relative z-10">
          {delta && (
            <div
              className={clsx(
                'flex items-center space-x-1.5 font-medium px-2.5 py-0.5 rounded-full border backdrop-blur-md',
                delta.neutral
                  ? 'bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] border-[rgba(255,255,255,0.1)]'
                  : delta.isPositive
                  ? 'bg-[rgba(52,211,153,0.12)] text-[var(--accent-emerald)] border-[rgba(52,211,153,0.3)] shadow-[0_0_10px_rgba(52,211,153,0.15)]'
                  : 'bg-[rgba(244,63,94,0.12)] text-[var(--accent-crimson)] border-[rgba(244,63,94,0.3)] shadow-[0_0_10px_rgba(244,63,94,0.15)]'
              )}
            >
              {delta.neutral ? (
                <Minus size={12} />
              ) : delta.isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{delta.value}</span>
              {delta.label && <span className="opacity-75 ml-0.5 text-[11px]">{delta.label}</span>}
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
