import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchTerm,
  setStatusFilter,
  setTierFilter,
  setCurrentPage,
  deleteOrganization,
  updateOrgStatus,
} from '../store/slices/organizationsSlice';
import {
  setSelectedOrgIdForDrawer,
  setActiveModal,
  addToast,
} from '../store/slices/uiSlice';
import {
  Building2,
  Search,
  Plus,
  Globe,
  Mail,
  Users,
  Activity,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Organization } from '../types';

export const OrganizationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    organizations,
    searchTerm,
    statusFilter,
    tierFilter,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.organizations);

  const globalSearch = useAppSelector((state) => state.ui.globalSearchQuery);
  const [deleteTargetOrg, setDeleteTargetOrg] = useState<Organization | null>(null);

  // Apply filters & search
  const effectiveSearch = (searchTerm || globalSearch).toLowerCase().trim();

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      effectiveSearch === '' ||
      org.name.toLowerCase().includes(effectiveSearch) ||
      org.domain.toLowerCase().includes(effectiveSearch) ||
      org.adminName.toLowerCase().includes(effectiveSearch) ||
      org.adminEmail.toLowerCase().includes(effectiveSearch);

    const matchesStatus = statusFilter === 'All' || org.status === statusFilter;
    const matchesTier = tierFilter === 'All' || org.subscriptionTier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfirmDelete = () => {
    if (deleteTargetOrg) {
      dispatch(deleteOrganization(deleteTargetOrg.id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Organization Removed',
          message: `${deleteTargetOrg.name} license has been archived.`,
        })
      );
      setDeleteTargetOrg(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Organization Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Administer enterprise client licenses, seat capacities, and team activity.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => dispatch(setActiveModal('addOrg'))}
        >
          Provision Organization
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 sm:p-4 bg-[#12131C] border border-[#171923]">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by organization name, domain, or admin email..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-md pl-8 pr-4 py-1.5 focus:outline-none focus:border-[#FB923C]/70"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Pending Renewal">Pending Renewal</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => dispatch(setTierFilter(e.target.value))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Tiers</option>
              <option value="Enterprise Pro">Enterprise Pro</option>
              <option value="Growth">Growth</option>
              <option value="Pilot Team">Pilot Team</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Organizations Table */}
      <Card className="overflow-hidden border border-[#171923]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#171923] bg-[#0D0E14] text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Admin Contact</th>
                <th className="py-3 px-4">Active / Total Users</th>
                <th className="py-3 px-4">Seat Utilization</th>
                <th className="py-3 px-4">Activity Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171923]">
              {paginatedOrgs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Building2 className="w-8 h-8 text-[#94A3B8] mx-auto opacity-50" />
                      <p className="font-medium text-[#CBD5E1]">No organizations found</p>
                      <p className="text-[11px]">
                        Try adjusting your search criteria or register a new enterprise client.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrgs.map((org) => {
                  const statusVariant = {
                    Active: 'success',
                    Suspended: 'error',
                    Trial: 'warning',
                    'Pending Renewal': 'brand',
                  }[org.status] as any;

                  const utilPercent = Math.round((org.allocatedSeats / org.totalSeats) * 100) || 0;

                  return (
                    <tr
                      key={org.id}
                      className="hover:bg-[#171923]/40 transition-colors group cursor-pointer"
                      onClick={() => dispatch(setSelectedOrgIdForDrawer(org.id))}
                    >
                      {/* Name & Domain */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#171923] border border-[#2E3345] flex items-center justify-center text-[#FB923C] font-bold shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#F8FAFC] group-hover:text-[#FB923C] transition-colors">
                              {org.name}
                            </div>
                            <div className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                              <Globe className="w-3 h-3 text-[#38BDF8]" />
                              {org.domain}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Admin Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#CBD5E1]">{org.adminName}</div>
                        <div className="text-[11px] text-[#94A3B8]">{org.adminEmail}</div>
                      </td>

                      {/* Active / Total participants */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#F8FAFC]">
                          {org.activeParticipants}
                        </span>
                        <span className="text-[#94A3B8]"> / {org.totalParticipants} learners</span>
                      </td>

                      {/* Seat Utilization Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-32 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                            <span>
                              {org.allocatedSeats} / {org.totalSeats}
                            </span>
                            <span>{utilPercent}%</span>
                          </div>
                          <div className="w-full bg-[#07080C] h-1.5 rounded-full overflow-hidden border border-[#1F2230]">
                            <div
                              className={`h-full ${
                                utilPercent > 90 ? 'bg-[#F87171]' : 'gradient-brand'
                              }`}
                              style={{ width: `${Math.min(utilPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              org.activityScore > 80
                                ? 'bg-[#34D399]'
                                : org.activityScore > 50
                                ? 'bg-[#FBBF24]'
                                : 'bg-[#F87171]'
                            }`}
                          />
                          <span className="font-semibold text-[#F8FAFC]">
                            {org.activityScore}/100
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={statusVariant} size="sm">
                          {org.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dispatch(setSelectedOrgIdForDrawer(org.id))}
                          >
                            Manage
                          </Button>

                          <button
                            onClick={() => setDeleteTargetOrg(org)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#7F1D1D]/20 rounded-lg transition-colors"
                            title="Delete Organization"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrgs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => dispatch(setCurrentPage(p))}
        />
      </Card>

      {/* Delete Org Dialog */}
      {deleteTargetOrg && (
        <ConfirmDialog
          isOpen={!!deleteTargetOrg}
          onClose={() => setDeleteTargetOrg(null)}
          onConfirm={handleConfirmDelete}
          title="Archive Organization License"
          message={`Are you sure you want to deactivate and archive ${deleteTargetOrg.name}? Assigned learner seats will be locked.`}
          confirmLabel="Archive License"
          confirmVariant="danger"
        />
      )}
    </div>
  );
};
