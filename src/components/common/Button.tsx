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
      'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs hover:shadow-sm active:scale-[0.98]',
    violet:
      'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs hover:shadow-sm active:scale-[0.98]',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs hover:border-slate-400 active:scale-[0.98]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs hover:shadow-sm active:scale-[0.98]',
    outline:
      'bg-transparent text-slate-600 border border-slate-300 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400',
  }[variant];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-5 py-2.5 text-base rounded-xl',
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none space-x-2',
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
