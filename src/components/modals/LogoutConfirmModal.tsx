import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, addToast } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export const LogoutConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'logoutConfirm');

  const handleClose = () => {
    dispatch(setActiveModal(null));
  };

  const handleConfirmLogout = () => {
    handleClose();
    dispatch(logout());
    dispatch(
      addToast({
        type: 'info',
        title: 'Super Admin Session Reset',
        message: 'You have logged out of the Super Admin console safely.',
      })
    );
    navigate('/login');
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirmLogout}
      title="Confirm Super Admin Logout"
      message="Are you sure you want to exit the Real Learning Super Admin Dashboard? All current administrative session tokens will be invalidated."
      confirmLabel="Logout from Platform"
      confirmVariant="danger"
    />
  );
};
