import React from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'elevated' | 'outlined';

interface CardProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  elevated: 'bg-white shadow-elevated',
  outlined: 'bg-white border-2 border-neutral-200',
};

export function Card({ variant = 'default', className, children }: CardProps) {
  return (
    <div className={cn('rounded-xl p-5', variantClasses[variant], className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('mb-4 pb-3 border-b border-neutral-100', className)}>
      {children}
    </div>
  );
}
