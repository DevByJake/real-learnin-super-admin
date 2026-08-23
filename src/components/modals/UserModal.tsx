import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, addToast } from '../../store/slices/uiSlice';
import { addUser } from '../../store/slices/usersSlice';
import { addActivityLog } from '../../store/slices/activitySlice';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { UserAccountType, UserStatus } from '../../types';

export const UserModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'addUser');
  const careers = useAppSelector((state) => state.careers.careers);
  const organizations = useAppSelector((state) => state.organizations.organizations);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState<UserAccountType>('Individual');
  const [organizationId, setOrganizationId] = useState('');
  const [careerId, setCareerId] = useState(careers[0]?.id || '');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    dispatch(setActiveModal(null));
    setName('');
    setEmail('');
    setError('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both name and email');
      return;
    }

    const selectedCareer = careers.find((c) => c.id === careerId) || careers[0];
    const selectedOrg = organizations.find((o) => o.id === organizationId);

    dispatch(
      addUser({
        name: name.trim(),
        email: email.trim(),
        accountType,
        organizationId: accountType === 'Organization Member' ? organizationId : undefined,
        organizationName: accountType === 'Organization Member' ? selectedOrg?.name : undefined,
        careerId: selectedCareer?.id || 'career-cs',
        careerName: selectedCareer?.name || 'Customer Success & Support',
        progressPercentage: 0,
        completedClassesCount: 0,
        completedSimulationsCount: 0,
        status,
        notes: notes.trim(),
      })
    );

    dispatch(
      addActivityLog({
        type: 'user_registration',
        title: 'User Account Created by Super Admin',
        description: `Created ${accountType} account for ${name} (${email}).`,
        meta: {
          userName: name,
          careerName: selectedCareer?.name,
          orgName: selectedOrg?.name,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'User created successfully',
        message: `${name} has been provisioned on Real Learning.`,
      })
    );

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Provision New User"
      description="Create a new learner profile and assign their career track."
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
            label="Full Name"
            placeholder="e.g. Maya Lin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="e.g. maya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Account Type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as UserAccountType)}
          >
            <option value="Individual">Individual Learner</option>
            <option value="Organization Member">Organization Member</option>
          </Select>

          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending Verification</option>
            <option value="Suspended">Suspended</option>
          </Select>
        </div>

        {accountType === 'Organization Member' && (
          <Select
            label="Associated Organization"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            required
          >
            <option value="">Select an organization...</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.allocatedSeats}/{org.totalSeats} seats)
              </option>
            ))}
          </Select>
        )}

        <Select
          label="Career Track & Goal"
          value={careerId}
          onChange={(e) => setCareerId(e.target.value)}
        >
          {careers.map((career) => (
            <option key={career.id} value={career.id}>
              {career.name} ({career.category})
            </option>
          ))}
        </Select>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Internal Admin Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes about this learner or enterprise onboarding..."
            rows={3}
            className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70 focus:ring-1 focus:ring-[#FB923C]/50"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2230]">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create User Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};
