import React from 'react';
import clsx from 'clsx';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  glow?: 'none' | 'violet' | 'emerald' | 'crimson' | 'cyan';
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
    violet: 'liquid-glass-violet',
    emerald: 'liquid-glass-emerald',
    crimson: 'liquid-glass-crimson',
    cyan: 'liquid-glass-cyan',
  }[glow];

  return (
    <div
      className={clsx(
        'liquid-glass flex flex-col',
        interactive && 'liquid-glass-interactive',
        glowClasses,
        paddingClasses,
        className
      )}
      {...rest}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            {title && (
              <h3 className="font-display text-base font-bold text-[var(--text-primary)] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center space-x-2">{headerAction}</div>
          )}
        </div>
      )}
      <div className="flex-1 relative z-10">{children}</div>
    </div>
  );
};
