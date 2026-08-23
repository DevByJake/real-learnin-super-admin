import React, { useState } from 'react';
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
  const [domain, setDomain] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [totalSeats, setTotalSeats] = useState(50);
  const [subscriptionTier, setSubscriptionTier] = useState<'Enterprise Pro' | 'Growth' | 'Pilot Team' | 'Standard'>('Growth');
  const [status, setStatus] = useState<OrganizationStatus>('Active');
  const [industry, setIndustry] = useState('Enterprise Software');
  const [error, setError] = useState('');

  const handleClose = () => {
    dispatch(setActiveModal(null));
    setName('');
    setDomain('');
    setAdminName('');
    setAdminEmail('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminEmail.trim()) {
      setError('Please fill in the Organization name and Primary Admin Email');
      return;
    }

    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    dispatch(
      addOrganization({
        name: name.trim(),
        domain: domain.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
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
        industry,
      })
    );

    dispatch(
      addActivityLog({
        type: 'new_organization',
        title: 'New Organization Created',
        description: `Organization ${name} (${subscriptionTier}, ${totalSeats} seats) provisioned.`,
        meta: {
          orgName: name,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Organization provisioned',
        message: `${name} has been added to Real Learning.`,
      })
    );

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Provision Organization"
      description="Create a new client organization license and allocate learner seats."
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
            label="Corporate Domain"
            placeholder="e.g. acme.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary Admin Full Name"
            placeholder="e.g. Johnathan Smith"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />

          <Input
            label="Primary Admin Email"
            type="email"
            placeholder="e.g. admin@acme.com"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Licensed Seats"
            type="number"
            min={1}
            value={totalSeats}
            onChange={(e) => setTotalSeats(parseInt(e.target.value) || 10)}
            required
          />

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

        <Input
          label="Industry / Vertical"
          placeholder="e.g. Healthcare, Fintech, SaaS, Retail"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />

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
