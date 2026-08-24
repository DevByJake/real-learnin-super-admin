import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedUserIdForDrawer, addToast } from '../../store/slices/uiSlice';
import { updateUserStatus, updateUser } from '../../store/slices/usersSlice';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { UserStatus } from '../../types';
import { formatDate } from '../../lib/utils';
import {
  User,
  Mail,
  Building2,
  Compass,
  Trophy,
  Sparkles,
  BookOpen,
  Calendar,
  KeyRound,
  Shield,
  Save,
} from 'lucide-react';

export const UserDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedUserId = useAppSelector((state) => state.ui.selectedUserIdForDrawer);
  const users = useAppSelector((state) => state.users.users);
  const user = users.find((u) => u.id === selectedUserId);

  const careers = useAppSelector((state) => state.careers.careers);
  const [notes, setNotes] = useState(user?.notes || '');
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(user?.status || 'Active');
  const [selectedCareerId, setSelectedCareerId] = useState(user?.careerId || 'career-cs');

  React.useEffect(() => {
    if (user) {
      setNotes(user.notes || '');
      setCurrentStatus(user.status);
      setSelectedCareerId(user.careerId || 'career-cs');
    }
  }, [user]);

  if (!user) return null;

  const handleClose = () => {
    dispatch(setSelectedUserIdForDrawer(null));
  };

  const handleSave = () => {
    const selectedCareer = careers.find((c) => c.id === selectedCareerId);
    dispatch(
      updateUser({
        ...user,
        status: currentStatus,
        notes: notes.trim(),
        careerId: selectedCareerId,
        careerName: selectedCareer?.name || user.careerName,
      })
    );
    dispatch(
      addToast({
        type: 'success',
        title: 'User Profile Updated',
        message: `Changes for ${user.name} saved successfully.`,
      })
    );
  };

  const handleResetPassword = () => {
    dispatch(
      addToast({
        type: 'info',
        title: 'Password Reset Email Sent',
        message: `A secure one-time reset link has been dispatched to ${user.email}.`,
      })
    );
  };

  const statusVariant = {
    Active: 'success',
    Suspended: 'error',
    Pending: 'warning',
    Deactivated: 'muted',
  }[user.status] as any;

  return (
    <Drawer
      isOpen={!!selectedUserId}
      onClose={handleClose}
      title="Learner Administration Profile"
      subtitle={`ID: ${user.id} • ${user.accountType}`}
      footer={
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            onClick={handleResetPassword}
          >
            Send Password Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSave}
          >
            Save Admin Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* User Top Card */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#2E3345]"
              referrerPolicy="no-referrer"
            />
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#12131C] ${
                user.status === 'Active' ? 'bg-[#34D399]' : 'bg-[#94A3B8]'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#F8FAFC] truncate">{user.name}</h3>
              <Badge variant={statusVariant} size="sm">
                {user.status}
              </Badge>
            </div>
            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 text-[#FB923C]" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Learning Track */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#FB923C]" /> Career Goal
            </span>
          </div>

          <p className="text-xs text-[#CBD5E1] font-medium">{user.careerName}</p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1F2230]/70 text-xs">
            <div className="flex items-center gap-2 p-2 bg-[#0D0E14] rounded-lg">
              <BookOpen className="w-4 h-4 text-[#38BDF8]" />
              <div>
                <p className="text-[#94A3B8] text-[10px]">Classes Done</p>
                <p className="font-bold text-[#F8FAFC]">{user.completedClassesCount} Modules</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-[#0D0E14] rounded-lg">
              <Sparkles className="w-4 h-4 text-[#FB7185]" />
              <div>
                <p className="text-[#94A3B8] text-[10px]">Simulations</p>
                <p className="font-bold text-[#F8FAFC]">{user.completedSimulationsCount} Passed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details Form */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
            Administrative Details
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Career Track & Goal
              </label>
              <select
                value={selectedCareerId}
                onChange={(e) => setSelectedCareerId(e.target.value)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Account Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as UserStatus)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              >
                <option value="Active">Active (Full Access)</option>
                <option value="Suspended">Suspended (Locked Out)</option>
                <option value="Pending">Pending Verification</option>
                <option value="Deactivated">Deactivated (GDPR Archive)</option>
              </select>
            </div>

            {user.accountType === 'Organization Member' && (
              <div className="p-3 bg-[#171923] border border-[#1F2230] rounded-lg flex items-center justify-between text-xs">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#34D399]" /> Organization:
                </span>
                <span className="font-medium text-[#F8FAFC]">{user.organizationName || 'N/A'}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#0D0E14] rounded-lg border border-[#1F2230]">
                <span className="text-[#94A3B8] block text-[10px]">Registered On</span>
                <span className="text-[#CBD5E1] font-medium">{formatDate(user.joinedAt)}</span>
              </div>

              <div className="p-2.5 bg-[#0D0E14] rounded-lg border border-[#1F2230]">
                <span className="text-[#94A3B8] block text-[10px]">Last Session</span>
                <span className="text-[#CBD5E1] font-medium">{formatDate(user.lastActiveAt)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Super Admin Internal Audit Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log internal notes regarding user compliance, certification readiness, or enterprise support..."
                rows={3}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]"
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
