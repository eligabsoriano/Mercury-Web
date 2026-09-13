import React from 'react';
import clsx from 'clsx';

export interface RiskTierBadgeProps {
  tier: string; // 'High' | 'Medium' | 'Low' | 'High Risk' | 'Medium Risk' | 'Low Risk'
  probability?: number;
  className?: string;
}

export const RiskTierBadge: React.FC<RiskTierBadgeProps> = ({
  tier,
  probability,
  className,
}) => {
  const normalized = tier.toLowerCase();
  const isHigh = normalized.includes('high');
  const isMedium = normalized.includes('medium');

  return (
    <span
      className={clsx(
        'crystal-gem',
        isHigh
          ? 'crystal-gem-crimson'
          : isMedium
          ? 'crystal-gem-amber'
          : 'crystal-gem-emerald',
        className
      )}
    >
      <span
        className={clsx(
          'gem-dot',
          isHigh
            ? 'gem-dot-crimson'
            : isMedium
            ? 'gem-dot-amber'
            : 'gem-dot-emerald'
        )}
      />
      <span>{tier}</span>
      {probability !== undefined && (
        <span className="opacity-75 font-mono text-[11px] ml-0.5 font-medium">
          {(probability * 100).toFixed(0)}%
        </span>
      )}
    </span>
  );
};

export interface SegmentBadgeProps {
  segment: string;
  className?: string;
}

export const SegmentBadge: React.FC<SegmentBadgeProps> = ({ segment, className }) => {
  const getStyle = (seg: string) => {
    switch (seg.toLowerCase()) {
      case 'champions':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'loyal customers':
      case 'potential loyalists':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'at risk':
      case "can't lose them":
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'customers needing attention':
      case 'about to sleep':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'recent customers':
      case 'promising':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'hibernating':
      case 'lost':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border select-none transition-transform hover:scale-105',
        getStyle(segment),
        className
      )}
    >
      {segment}
    </span>
  );
};

export interface PriorityBadgeProps {
  priority: string; // 'Priority 1', 'Priority 2', etc.
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const isP1 = priority.includes('1');
  const isP2 = priority.includes('2');

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border',
        isP1
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : isP2
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-slate-100 text-slate-600 border-slate-200',
        className
      )}
    >
      {priority}
    </span>
  );
};
