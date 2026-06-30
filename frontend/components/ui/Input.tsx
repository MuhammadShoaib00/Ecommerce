'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, leftIcon, className, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900',
            'placeholder:text-neutral-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            leftIcon && 'pl-9',
            error
              ? 'border-danger focus:ring-danger'
              : 'border-neutral-300 hover:border-neutral-400',
            props.disabled && 'bg-neutral-50 cursor-not-allowed opacity-60',
            className,
          )}
        />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
