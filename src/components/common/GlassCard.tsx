import React from 'react';
import clsx from 'clsx';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  glow?: 'none' | 'violet' | 'emerald' | 'crimson';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  subtitle,
  headerAction,
  glow = 'none',
  interactive = false,
  padding = 'md',
  className,
  children,
  ...rest
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6',
  }[padding];

  const glowClasses = {
    none: '',
    violet: 'glass-panel-glow-violet',
    emerald: 'glass-panel-glow-emerald',
    crimson: 'glass-panel-glow-crimson',
  }[glow];

  return (
    <div
      className={clsx(
        'glass-panel flex flex-col',
        interactive && 'glass-panel-interactive cursor-pointer',
        glowClasses,
        paddingClasses,
        className
      )}
      {...rest}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[hsla(217,33%,25%,0.35)]">
          <div>
            {title && (
              <h3 className="font-display text-base font-semibold text-primary tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="flex items-center space-x-2">{headerAction}</div>}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};
