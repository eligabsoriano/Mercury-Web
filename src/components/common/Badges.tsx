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
        'inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        isHigh
          ? 'badge-risk-high'
          : isMedium
          ? 'badge-risk-medium'
          : 'badge-risk-low',
        className
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full',
          isHigh
            ? 'bg-[#f43f5e]'
            : isMedium
            ? 'bg-[#fbbf24]'
            : 'bg-[#34d399]'
        )}
      />
      <span>{tier}</span>
      {probability !== undefined && (
        <span className="opacity-75 font-mono text-[11px]">
          ({(probability * 100).toFixed(0)}%)
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
  // Styles for the 11 RFM canonical segments
  const getStyle = (seg: string) => {
    switch (seg.toLowerCase()) {
      case 'champions':
        return 'bg-[hsla(158,64%,52%,0.18)] text-[#34d399] border-[hsla(158,64%,52%,0.35)]';
      case 'loyal customers':
      case 'potential loyalists':
        return 'bg-[hsla(199,89%,48%,0.18)] text-[#38bdf8] border-[hsla(199,89%,48%,0.35)]';
      case 'at risk':
      case "can't lose them":
        return 'bg-[hsla(354,70%,54%,0.18)] text-[#f43f5e] border-[hsla(354,70%,54%,0.35)]';
      case 'customers needing attention':
      case 'about to sleep':
        return 'bg-[hsla(38,92%,50%,0.18)] text-[#fbbf24] border-[hsla(38,92%,50%,0.35)]';
      case 'recent customers':
      case 'promising':
        return 'bg-[hsla(263,70%,58%,0.18)] text-[#a78bfa] border-[hsla(263,70%,58%,0.35)]';
      case 'hibernating':
      case 'lost':
      default:
        return 'bg-[hsla(215,16%,48%,0.15)] text-[#94a3b8] border-[hsla(215,16%,48%,0.30)]';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
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
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border',
        isP1
          ? 'bg-[hsla(354,70%,54%,0.20)] text-[#fb7185] border-[hsla(354,70%,54%,0.40)]'
          : isP2
          ? 'bg-[hsla(38,92%,50%,0.20)] text-[#fcd34d] border-[hsla(38,92%,50%,0.40)]'
          : 'bg-[hsla(217,33%,25%,0.35)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
        className
      )}
    >
      {priority}
    </span>
  );
};
