import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addToast } from '../store/slices/uiSlice';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Mail,
  ShieldCheck,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      setPasswordError('Please enter your old password');
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    setPasswordError('');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');

    dispatch(
      addToast({
        type: 'success',
        title: 'Password Updated Successfully',
        message: 'Your administrator password has been updated.',
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Manage your account holder details and root security credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Account Holder Profile Card */}
        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#34D399]/10 text-[#34D399]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Account Holder Profile</CardTitle>
                <p className="text-xs text-[#94A3B8]">Root administrator identity and session authority</p>
              </div>
            </div>
            <Badge variant="brand" size="sm">
              Super Admin
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Profile Header */}
            <div className="p-4 bg-[#0D0E14] border border-[#1F2230] rounded-xl flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center text-white text-base font-bold shadow-md shrink-0">
                RL
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">Real Learning Root Admin</h3>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#FB923C]" />
                  admin@real-learning.io
                </p>
              </div>
            </div>

            {/* Authority & Security Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#0D0E14] rounded-lg border border-[#1F2230]">
                <span className="text-[#94A3B8]">Role Authority:</span>
                <span className="text-[#34D399] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Full Root Management
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#0D0E14] rounded-lg border border-[#1F2230]">
                <span className="text-[#94A3B8]">Session IP & Location:</span>
                <span className="text-[#CBD5E1] font-mono">198.51.100.42 (TLS 1.3 Encrypted)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#0D0E14] rounded-lg border border-[#1F2230]">
                <span className="text-[#94A3B8]">Account Created:</span>
                <span className="text-[#CBD5E1] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FB923C]" /> Jan 1, 2025
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#0D0E14] rounded-lg border border-[#1F2230]">
                <span className="text-[#94A3B8]">2-Factor Authentication:</span>
                <span className="text-[#34D399] font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Enforced via Hardware Key
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Change Administrator Password */}
        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#FB923C]/10 text-[#FB923C]">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Change Administrator Password</CardTitle>
                <p className="text-xs text-[#94A3B8]">Update your root account security credentials</p>
              </div>
            </div>
            <Badge variant="outline" size="sm">
              Credentials
            </Badge>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              {passwordError && (
                <div className="p-2.5 bg-[#7F1D1D]/30 border border-[#991B1B] text-[#F87171] text-xs rounded-lg">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-md pl-3 pr-9 py-2 focus:outline-none focus:border-[#FB923C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-md pl-3 pr-9 py-2 focus:outline-none focus:border-[#FB923C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-md pl-3 pr-9 py-2 focus:outline-none focus:border-[#FB923C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Lock className="w-3.5 h-3.5" />}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
