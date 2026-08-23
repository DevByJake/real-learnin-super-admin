import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'brand' | 'muted' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'sm',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#171923] text-[#CBD5E1] border border-[#1F2230]',
    success: 'bg-[#064E3B]/40 text-[#34D399] border border-[#065F46]/50',
    warning: 'bg-[#78350F]/40 text-[#FBBF24] border border-[#92400E]/50',
    error: 'bg-[#7F1D1D]/40 text-[#F87171] border border-[#991B1B]/50',
    brand: 'bg-[#FB923C]/10 text-[#FB923C] border border-[#FB923C]/30',
    muted: 'bg-[#12131C] text-[#94A3B8] border border-[#1F2230]',
    outline: 'bg-transparent text-[#CBD5E1] border border-[#2E3345]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium rounded-full',
    md: 'text-xs px-3 py-1 font-semibold rounded-full',
    lg: 'text-sm px-3.5 py-1.5 font-medium rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap transition-colors select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
