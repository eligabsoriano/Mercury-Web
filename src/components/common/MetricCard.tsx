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
      text: 'text-emerald-700',
      iconBox: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    crimson: {
      text: 'text-rose-700',
      iconBox: 'bg-rose-50 border-rose-200 text-rose-700',
    },
    violet: {
      text: 'text-indigo-700',
      iconBox: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
    amber: {
      text: 'text-amber-700',
      iconBox: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    cyan: {
      text: 'text-sky-700',
      iconBox: 'bg-sky-50 border-sky-200 text-sky-700',
    },
  }[accent];

  return (
    <GlassCard
      padding="md"
      interactive
      className={clsx('relative overflow-hidden group bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow', className)}
    >
      <div className="flex items-start justify-between relative z-10 gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block truncate">
            {title}
          </span>
          <div className="mt-2 flex items-baseline space-x-2 flex-wrap">
            <span className="kpi-value text-slate-900">{value}</span>
            {subtitle && (
              <span className="text-xs text-slate-500 font-normal truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={clsx(
              'p-2.5 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0',
              accentConfigs.iconBox
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(delta || takeaway) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs relative z-10">
          <div className="flex items-center justify-between">
            {delta && (
              <div
                className={clsx(
                  'inline-flex items-center space-x-1 font-medium px-2 py-0.5 rounded-full border text-[11px]',
                  delta.neutral
                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                    : delta.isPositive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                )}
              >
                {delta.neutral ? (
                  <Minus size={11} />
                ) : delta.isPositive ? (
                  <TrendingUp size={11} />
                ) : (
                  <TrendingDown size={11} />
                )}
                <span className="font-semibold">{delta.value}</span>
                {delta.label && (
                  <span className="text-slate-500 font-normal ml-0.5 text-[10px]">
                    {delta.label}
                  </span>
                )}
              </div>
            )}
          </div>

          {takeaway && (
            <span className="text-[11px] text-slate-500 font-normal leading-snug">
              {takeaway}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
};
