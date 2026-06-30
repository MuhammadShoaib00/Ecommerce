import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Input } from './Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, className, ...props }, ref) => {
    const id = props.id ?? props.name;
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
        <Input ref={ref} id={id} error={error} {...props} />
      </div>
    );
  },
);
FormField.displayName = 'FormField';
