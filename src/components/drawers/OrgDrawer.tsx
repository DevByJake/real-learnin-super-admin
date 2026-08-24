import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedOrgIdForDrawer, addToast } from '../../store/slices/uiSlice';
import { updateOrganization, updateOrgSeats } from '../../store/slices/organizationsSlice';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { OrganizationStatus } from '../../types';
import { formatDate } from '../../lib/utils';
import {
  Building2,
  Mail,
  Users,
  Save,
  PlusCircle,
  Calendar,
  UserCheck,
} from 'lucide-react';

export const OrgDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedOrgId = useAppSelector((state) => state.ui.selectedOrgIdForDrawer);
  const orgs = useAppSelector((state) => state.organizations.organizations);
  const users = useAppSelector((state) => state.users.users);
  const org = orgs.find((o) => o.id === selectedOrgId);

  const [name, setName] = useState(org?.name || '');
  const [adminName, setAdminName] = useState(org?.adminName || '');
  const [adminEmail, setAdminEmail] = useState(org?.adminEmail || '');
  const [seats, setSeats] = useState(org?.totalSeats || 50);
  const [status, setStatus] = useState<OrganizationStatus>(org?.status || 'Active');
  const [tier, setTier] = useState(org?.subscriptionTier || 'Growth');

  useEffect(() => {
    if (org) {
      setName(org.name);
      setAdminName(org.adminName);
      setAdminEmail(org.adminEmail);
      setSeats(org.totalSeats);
      setStatus(org.status);
      setTier(org.subscriptionTier);
    }
  }, [org]);

  if (!org) return null;

  const orgUsers = users.filter((u) => u.organizationId === org.id);

  const handleClose = () => {
    dispatch(setSelectedOrgIdForDrawer(null));
  };

  const handleSave = () => {
    dispatch(
      updateOrganization({
        ...org,
        name: name.trim() || org.name,
        adminName: adminName.trim() || org.adminName,
        adminEmail: adminEmail.trim() || org.adminEmail,
        totalSeats: Number(seats),
        status,
        subscriptionTier: tier as any,
      })
    );
    dispatch(
      addToast({
        type: 'success',
        title: 'Organization Synchronized',
        message: `Licensing parameters for ${name} saved successfully.`,
      })
    );
  };

  const handleAddTenSeats = () => {
    const newSeats = Number(seats) + 10;
    setSeats(newSeats);
    dispatch(updateOrgSeats({ id: org.id, totalSeats: newSeats }));
    dispatch(
      addToast({
        type: 'success',
        title: 'Added 10 Extra Seats',
        message: `Licensed capacity for ${org.name} upgraded to ${newSeats} seats.`,
      })
    );
  };

  const statusVariant = {
    Active: 'success',
    Suspended: 'error',
    Trial: 'warning',
    'Pending Renewal': 'brand',
  }[status] as any;

  const seatUtilizationPercentage = Math.round((org.allocatedSeats / Number(seats)) * 100) || 0;

  return (
    <Drawer
      isOpen={!!selectedOrgId}
      onClose={handleClose}
      title={name}
      subtitle={`Tier: ${tier} • ${status}`}
      footer={
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={handleAddTenSeats}
          >
            Add +10 Seats
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSave}
          >
            Save License Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Org Banner Card */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#171923] border border-[#2E3345] flex items-center justify-center text-[#FB923C] font-bold text-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F8FAFC]">{name}</h3>
                <Badge variant={statusVariant} size="sm">
                  {status}
                </Badge>
              </div>
              <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                {adminEmail} • {tier}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Organization Parameters Form */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-4">
          <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
            Organization Account Parameters
          </h4>

          <div>
            <label className="block text-[11px] font-medium text-[#CBD5E1] mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#CBD5E1] mb-1">
                Admin Full Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#CBD5E1] mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#CBD5E1] mb-1">
                Subscription Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              >
                <option value="Enterprise Pro">Enterprise Pro</option>
                <option value="Growth">Growth</option>
                <option value="Pilot Team">Pilot Team</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#CBD5E1] mb-1">
                Licensed Seats
              </label>
              <input
                type="number"
                min={org.allocatedSeats}
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value) || org.allocatedSeats)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#CBD5E1] mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrganizationStatus)}
                className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              >
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Pending Renewal">Pending Renewal</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seat Utilization Bar */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FB923C]" /> Seat Capacity Utilization
            </span>
            <span className="text-xs font-bold text-[#F8FAFC]">
              {org.allocatedSeats} / {seats} seats ({seatUtilizationPercentage}%)
            </span>
          </div>

          <div className="w-full bg-[#07080C] h-2 rounded-full overflow-hidden border border-[#1F2230]">
            <div
              className={`h-full transition-all duration-300 ${
                seatUtilizationPercentage > 90 ? 'bg-[#F87171]' : 'gradient-brand'
              }`}
              style={{ width: `${Math.min(seatUtilizationPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Enrolled Learners */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Enrolled Learners ({orgUsers.length})
            </h4>
          </div>

          {orgUsers.length === 0 ? (
            <div className="p-4 bg-[#0D0E14] border border-[#1F2230] rounded-xl text-center text-xs text-[#94A3B8]">
              No active learners registered under this organization yet.
            </div>
          ) : (
            <div className="space-y-2">
              {orgUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-3 bg-[#12131C] border border-[#1F2230] rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-[#F8FAFC]">{u.name}</p>
                      <p className="text-[10px] text-[#94A3B8]">{u.careerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={u.status === 'Active' ? 'success' : 'muted'} size="sm">
                      {u.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
