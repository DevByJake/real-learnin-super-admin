import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-sm rounded-lg px-3.5 py-2 transition-all duration-150',
            'focus:outline-none focus:border-[#FB923C]/70 focus:ring-1 focus:ring-[#FB923C]/50 cursor-pointer',
            error && 'border-[#F87171]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-[#F87171] mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
