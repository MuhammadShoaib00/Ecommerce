'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[#2493ff] to-[#005eff] text-white shadow-[0_12px_25px_rgba(0,101,255,0.24)] hover:shadow-[0_16px_35px_rgba(0,101,255,0.32)] active:translate-y-0',
  secondary:
    'bg-white text-neutral-950 shadow-sm hover:bg-neutral-50 active:bg-neutral-100',
  ghost:
    'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  danger:
    'bg-danger text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
  outline:
    'border border-neutral-300 bg-white/5 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition duration-150 hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {isLoading ? (
        <Spinner size="sm" className="text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
    </button>
  );
}
