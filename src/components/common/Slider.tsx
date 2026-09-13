import React from 'react';
import clsx from 'clsx';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  helperText?: string;
  unit?: string;
  deltaBadge?: {
    text: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  helperText,
  unit = '',
  deltaBadge,
  className,
}) => {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit ? ` ${unit}` : ''}`;

  return (
    <div className={clsx('flex flex-col space-y-2.5', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center space-x-2.5">
          {deltaBadge && (
            <span
              className={clsx(
                'text-[11px] font-mono px-2 py-0.5 rounded-full border backdrop-blur-md font-semibold',
                deltaBadge.isPositive
                  ? 'bg-[rgba(52,211,153,0.12)] text-[var(--accent-emerald)] border-[rgba(52,211,153,0.35)] shadow-[0_0_8px_rgba(52,211,153,0.2)]'
                  : 'bg-[rgba(244,63,94,0.12)] text-[var(--accent-crimson)] border-[rgba(244,63,94,0.35)] shadow-[0_0_8px_rgba(244,63,94,0.2)]'
              )}
            >
              {deltaBadge.text}
            </span>
          )}
          <span className="font-mono text-sm font-extrabold text-[#ede9fe] bg-[rgba(139,92,246,0.18)] px-3 py-0.5 rounded-lg border border-[rgba(139,92,246,0.45)] shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            {displayValue}
          </span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="plasma-slider cursor-grab active:cursor-grabbing"
      />

      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
        <span>
          {min}
          {unit}
        </span>
        {helperText && (
          <span className="font-sans text-[11px] text-[var(--text-secondary)] italic">
            {helperText}
          </span>
        )}
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
};
