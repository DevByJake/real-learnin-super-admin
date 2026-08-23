import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  confirmVariant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3.5 bg-[#171923] p-4 rounded-xl border border-[#1F2230]">
          <div className="p-2 rounded-lg bg-[#7F1D1D]/30 text-[#F87171] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-sm text-[#CBD5E1] leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant === 'warning' ? 'secondary' : confirmVariant}
            className={confirmVariant === 'warning' ? 'bg-[#78350F]/40 text-[#FBBF24] border border-[#92400E]' : undefined}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
