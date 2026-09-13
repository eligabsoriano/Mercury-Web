import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'violet' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...rest
}) => {
  const variantStyles = {
    primary:
      'bg-[var(--accent-emerald)] text-[var(--text-inverse)] font-semibold hover:brightness-110 shadow-emerald active:scale-[0.98]',
    violet:
      'bg-[var(--accent-violet)] text-white font-semibold hover:brightness-110 shadow-violet active:scale-[0.98]',
    secondary:
      'bg-[var(--bg-panel)] text-primary border border-[var(--border-subtle)] hover:bg-[var(--bg-panel-hover)] hover:border-[hsla(217,33%,38%,0.6)] active:scale-[0.98]',
    danger:
      'bg-[var(--accent-crimson)] text-white font-semibold hover:brightness-110 shadow-crimson active:scale-[0.98]',
    outline:
      'bg-transparent text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-primary hover:border-[hsla(217,33%,38%,0.6)]',
  }[variant];

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-2.5 text-base rounded-xl',
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none space-x-2',
        variantStyles,
        sizeStyles,
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
};
