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
      'bg-gradient-to-r from-[#10b981] to-[#34d399] text-[#070a13] font-bold shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_28px_rgba(52,211,153,0.6)] hover:brightness-110 active:scale-[0.97]',
    violet:
      'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_28px_rgba(139,92,246,0.6)] hover:brightness-110 active:scale-[0.97]',
    secondary:
      'bg-[rgba(255,255,255,0.06)] text-[var(--text-primary)] border border-[rgba(255,255,255,0.12)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.22)] active:scale-[0.97] backdrop-blur-md',
    danger:
      'bg-gradient-to-r from-[#e11d48] to-[#f43f5e] text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_28px_rgba(244,63,94,0.6)] hover:brightness-110 active:scale-[0.97]',
    outline:
      'bg-transparent text-[var(--text-secondary)] border border-[rgba(255,255,255,0.12)] hover:text-[var(--text-primary)] hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.04)]',
  }[variant];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-5 py-2.5 text-base rounded-2xl',
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none space-x-2',
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
