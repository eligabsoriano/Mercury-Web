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
    <div className={clsx('flex flex-col space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-primary uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {deltaBadge && (
            <span
              className={clsx(
                'text-[11px] font-mono px-1.5 py-0.5 rounded border',
                deltaBadge.isPositive
                  ? 'bg-[hsla(158,64%,52%,0.15)] text-[var(--accent-emerald)] border-[var(--border-emerald)]'
                  : 'bg-[hsla(354,70%,54%,0.15)] text-[var(--accent-crimson)] border-[var(--border-crimson)]'
              )}
            >
              {deltaBadge.text}
            </span>
          )}
          <span className="font-mono text-sm font-bold text-gradient-violet bg-[hsla(263,70%,58%,0.15)] px-2.5 py-0.5 rounded-md border border-[var(--border-focus)]">
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
        className="mercury-slider cursor-pointer"
      />

      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
        <span>
          {min}
          {unit}
        </span>
        {helperText && <span className="font-sans text-[11px]">{helperText}</span>}
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
};
