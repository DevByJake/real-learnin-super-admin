import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#07080C]/80 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={cn(
            'w-screen bg-[#0D0E14] border-l border-[#171923] shadow-2xl flex flex-col',
            widthStyles[width]
          )}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#171923] bg-[#12131C] flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC] tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-md hover:bg-[#171923] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-3.5 sm:p-4 px-5 border-t border-[#171923] bg-[#12131C] shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
