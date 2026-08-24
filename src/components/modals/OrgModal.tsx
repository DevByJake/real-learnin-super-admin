import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, addToast } from '../../store/slices/uiSlice';
import { addOrganization } from '../../store/slices/organizationsSlice';
import { addActivityLog } from '../../store/slices/activitySlice';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { OrganizationStatus } from '../../types';

export const OrgModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'addOrg');

  const [name, setName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [totalSeats, setTotalSeats] = useState(50);
  const [subscriptionTier, setSubscriptionTier] = useState<'Enterprise Pro' | 'Growth' | 'Pilot Team' | 'Standard'>('Growth');
  const [activeDurationMonths, setActiveDurationMonths] = useState<number>(12);
  const [status, setStatus] = useState<OrganizationStatus>('Active');
  const [error, setError] = useState('');

  const handleClose = () => {
    dispatch(setActiveModal(null));
    setName('');
    setAdminName('');
    setAdminEmail('');
    setAdminPassword('');
    setShowPassword(false);
    setSubscriptionTier('Growth');
    setActiveDurationMonths(12);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      setError('Please fill in the Organization name, Admin Email, and Password');
      return;
    }

    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + Number(activeDurationMonths));

    const generatedDomain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

    dispatch(
      addOrganization({
        name: name.trim(),
        domain: generatedDomain,
        adminName: adminName.trim() || 'Organization Admin',
        adminEmail: adminEmail.trim(),
        totalParticipants: 0,
        activeParticipants: 0,
        totalSeats: Number(totalSeats),
        allocatedSeats: 0,
        activityScore: 80,
        status,
        subscriptionTier,
        renewalDate: renewalDate.toISOString(),
        industry: 'Enterprise',
      })
    );

    dispatch(
      addActivityLog({
        type: 'new_organization',
        title: 'New Organization Created',
        description: `Organization ${name} (${subscriptionTier}, ${totalSeats} seats) provisioned for ${activeDurationMonths} months.`,
        meta: {
          orgName: name,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Organization provisioned',
        message: `${name} has been added with ${subscriptionTier} tier (${activeDurationMonths} months active).`,
      })
    );

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Provision Organization"
      description="Create a new client organization account, configure subscription plan duration, and set up access."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#7F1D1D]/30 border border-[#991B1B] text-[#F87171] text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Organization Name"
            placeholder="e.g. Acme Corporation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Primary Admin Full Name"
            placeholder="e.g. Johnathan Smith"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Organization Email"
            type="email"
            placeholder="e.g. admin@acme.com"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />

          <div className="w-full">
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
              Organization Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-sm rounded-lg pl-3.5 pr-10 py-2 focus:outline-none focus:border-[#FB923C]/70 focus:ring-1 focus:ring-[#FB923C]/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Subscription Tier"
            value={subscriptionTier}
            onChange={(e) => setSubscriptionTier(e.target.value as any)}
          >
            <option value="Enterprise Pro">Enterprise Pro</option>
            <option value="Growth">Growth</option>
            <option value="Pilot Team">Pilot Team</option>
            <option value="Standard">Standard</option>
          </Select>

          <Select
            label="Active Plan Duration"
            value={activeDurationMonths}
            onChange={(e) => setActiveDurationMonths(Number(e.target.value))}
          >
            <option value={1}>1 Month (Monthly Trial)</option>
            <option value={3}>3 Months (Quarterly)</option>
            <option value={6}>6 Months (Half Year)</option>
            <option value={12}>1 Year (12 Months)</option>
            <option value={24}>2 Years (24 Months)</option>
          </Select>

          <Input
            label="Licensed Seats"
            type="number"
            min={1}
            value={totalSeats}
            onChange={(e) => setTotalSeats(parseInt(e.target.value) || 10)}
            required
          />
        </div>

        <div>
          <Select
            label="Account Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrganizationStatus)}
          >
            <option value="Active">Active</option>
            <option value="Trial">Trial (14-Day)</option>
            <option value="Pending Renewal">Pending Renewal</option>
            <option value="Suspended">Suspended</option>
          </Select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2230]">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Provision Organization
          </Button>
        </div>
      </form>
    </Modal>
  );
};
