import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, addToast } from '../../store/slices/uiSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Mail, Calendar, Key, CheckCircle } from 'lucide-react';

export const AdminProfileModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'adminProfile');

  const handleClose = () => {
    dispatch(setActiveModal(null));
  };

  const handleSaveSecurity = () => {
    dispatch(
      addToast({
        type: 'success',
        title: 'Security Settings Saved',
        message: 'Two-Factor Authentication (2FA) enforcement is active.',
      })
    );
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Super Administrator Profile"
      description="System-level privileges, authentication sessions, and security keys."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="p-4 bg-[#0D0E14] border border-[#1F2230] rounded-xl flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center text-white text-base font-bold shadow-md">
            RL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Real Learning Root Admin</h3>
              <Badge variant="brand">Super Admin</Badge>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              admin@real-learning.io
            </p>
          </div>
        </div>

        {/* Security / System details */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#171923] rounded-lg border border-[#1F2230]">
            <span className="text-[#94A3B8]">Role Authority:</span>
            <span className="text-[#34D399] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Full Root Management
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#171923] rounded-lg border border-[#1F2230]">
            <span className="text-[#94A3B8]">Session IP & Location:</span>
            <span className="text-[#CBD5E1] font-mono">198.51.100.42 (Encrypted TLS 1.3)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#171923] rounded-lg border border-[#1F2230]">
            <span className="text-[#94A3B8]">Account Created:</span>
            <span className="text-[#CBD5E1] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FB923C]" /> Jan 1, 2025
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#171923] rounded-lg border border-[#1F2230]">
            <span className="text-[#94A3B8]">2-Factor Authentication:</span>
            <span className="text-[#34D399] font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Enforced via Hardware Key
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1F2230]">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" leftIcon={<Key className="w-3.5 h-3.5" />} onClick={handleSaveSecurity}>
            Refresh API Token
          </Button>
        </div>
      </div>
    </Modal>
  );
};
