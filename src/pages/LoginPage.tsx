import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@reallearning.io');
  const [password, setPassword] = useState('superadmin2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter valid email and password credentials.');
      return;
    }

    setIsLoading(true);

    // Simulate fast secure auth verification
    setTimeout(() => {
      setIsLoading(false);
      dispatch(loginSuccess({ email }));
      dispatch(
        addToast({
          type: 'success',
          title: 'Authentication Successful',
          message: `Welcome back to Real Learning Super Admin Portal.`,
        })
      );
      navigate('/admin-dashboard');
    }, 800);
  };

  const handleQuickFill = () => {
    setEmail('admin@reallearning.io');
    setPassword('superadmin2025');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#07080C] text-[#F8FAFC] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#FB923C] selection:text-black">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FB923C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FB7185]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FB923C] to-[#FB7185] p-0.5 shadow-xl shadow-[#FB923C]/20 mb-2">
            <div className="w-full h-full bg-[#0D0E14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#FB923C]" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Super Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Real Learning Enterprise Platform Governance
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#12131C] border border-[#171923] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl relative">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-[#F87171]/10 border border-[#F87171]/30 rounded-xl text-xs text-[#F87171]">
                {errorMsg}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@reallearning.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FB923C] focus:ring-1 focus:ring-[#FB923C]/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#CBD5E1]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Password reset link sent to registered root email.')
                  }
                  className="text-[11px] text-[#FB923C] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs sm:text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#FB923C] focus:ring-1 focus:ring-[#FB923C]/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#94A3B8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#171923] bg-[#0D0E14] text-[#FB923C] focus:ring-[#FB923C] focus:ring-offset-0 cursor-pointer"
                />
                <span>Keep session active for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FB923C] to-[#FB7185] text-black font-bold text-xs sm:text-sm py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-[#FB923C]/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Super Admin</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-[#171923] flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Demo Mode Active</span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="flex items-center gap-1 text-[#34D399] hover:underline font-medium cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Fill Admin Credentials</span>
            </button>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            SOC2 Type II
          </span>
          <span>•</span>
          <span>TLS 1.3 Encrypted</span>
          <span>•</span>
          <span>Hardware 2FA</span>
        </div>
      </div>
    </div>
  );
};
