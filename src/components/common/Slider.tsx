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
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {deltaBadge && (
            <span
              className={clsx(
                'text-[11px] font-mono px-2 py-0.5 rounded-full border font-semibold',
                deltaBadge.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              )}
            >
              {deltaBadge.text}
            </span>
          )}
          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
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

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>
          {min}
          {unit}
        </span>
        {helperText && (
          <span className="font-sans text-[11px] text-slate-500 italic">
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
