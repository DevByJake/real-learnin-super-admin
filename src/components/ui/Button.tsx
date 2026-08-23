import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#FB923C] to-[#FB7185] text-black font-bold shadow-xs hover:opacity-90 active:scale-[0.98] border-0',
    secondary: 'bg-[#12131C] text-[#F8FAFC] border border-[#171923] hover:bg-[#171923] hover:border-[#2E3345] active:scale-[0.98]',
    outline: 'bg-transparent text-[#CBD5E1] border border-[#171923] hover:bg-[#12131C] hover:text-[#F8FAFC] hover:border-[#2E3345]',
    ghost: 'bg-transparent text-[#94A3B8] hover:bg-[#12131C] hover:text-[#F8FAFC]',
    danger: 'bg-[#7F1D1D]/30 text-[#F87171] border border-[#991B1B]/40 hover:bg-[#7F1D1D]/50 hover:text-white',
    success: 'bg-[#064E3B]/30 text-[#34D399] border border-[#065F46]/40 hover:bg-[#064E3B]/50 hover:text-white',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5 min-h-[30px]',
    md: 'text-xs px-4 py-2 rounded-md gap-2 min-h-[36px]',
    lg: 'text-sm px-5 py-2.5 rounded-lg gap-2.5 min-h-[42px]',
    icon: 'p-1.5 rounded-md aspect-square min-h-[32px] min-w-[32px]',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
