'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, label, className, children, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          {...props}
          className={cn(
            'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-neutral-50 disabled:cursor-not-allowed',
            error && 'border-danger',
            className,
          )}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
