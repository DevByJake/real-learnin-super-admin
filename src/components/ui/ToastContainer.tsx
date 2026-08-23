import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeToast } from '../../store/slices/uiSlice';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#F87171] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#FBBF24] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#FB923C] shrink-0" />,
        }[toast.type];

        const borderColor = {
          success: 'border-[#065F46]',
          error: 'border-[#991B1B]',
          warning: 'border-[#92400E]',
          info: 'border-[#FB923C]/50',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto bg-[#12131C] border shadow-2xl rounded-xl p-4 flex items-start gap-3 transition-all transform animate-in slide-in-from-bottom-2',
              borderColor
            )}
          >
            {icon}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[#F8FAFC]">{toast.title}</h4>
              {toast.message && <p className="text-xs text-[#CBD5E1] mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
