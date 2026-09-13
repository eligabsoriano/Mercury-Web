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
        <span className="opacity-80 font-mono text-[11px] ml-0.5">
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
        return 'bg-[rgba(52,211,153,0.12)] text-[#6ee7b7] border-[rgba(52,211,153,0.35)] shadow-[0_0_12px_rgba(52,211,153,0.18)]';
      case 'loyal customers':
      case 'potential loyalists':
        return 'bg-[rgba(56,189,248,0.12)] text-[#7dd3fc] border-[rgba(56,189,248,0.35)] shadow-[0_0_12px_rgba(56,189,248,0.18)]';
      case 'at risk':
      case "can't lose them":
        return 'bg-[rgba(244,63,94,0.14)] text-[#fda4af] border-[rgba(244,63,94,0.40)] shadow-[0_0_12px_rgba(244,63,94,0.22)]';
      case 'customers needing attention':
      case 'about to sleep':
        return 'bg-[rgba(251,191,36,0.12)] text-[#fde68a] border-[rgba(251,191,36,0.35)] shadow-[0_0_12px_rgba(251,191,36,0.18)]';
      case 'recent customers':
      case 'promising':
        return 'bg-[rgba(139,92,246,0.14)] text-[#d8b4fe] border-[rgba(139,92,246,0.38)] shadow-[0_0_12px_rgba(139,92,246,0.20)]';
      case 'hibernating':
      case 'lost':
      default:
        return 'bg-[rgba(255,255,255,0.06)] text-[#94a3b8] border-[rgba(255,255,255,0.12)]';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-200 hover:scale-105 select-none',
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
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md',
        isP1
          ? 'bg-[rgba(244,63,94,0.18)] text-[#fecdd3] border-[rgba(244,63,94,0.45)] shadow-[0_0_10px_rgba(244,63,94,0.25)]'
          : isP2
          ? 'bg-[rgba(251,191,36,0.18)] text-[#fef3c7] border-[rgba(251,191,36,0.45)] shadow-[0_0_10px_rgba(251,191,36,0.25)]'
          : 'bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] border-[rgba(255,255,255,0.15)]',
        className
      )}
    >
      {priority}
    </span>
  );
};
