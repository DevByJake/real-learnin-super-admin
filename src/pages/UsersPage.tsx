import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchTerm,
  setAccountTypeFilter,
  setStatusFilter,
  setCareerFilter,
  setCurrentPage,
  deleteUser,
  updateUserStatus,
} from '../store/slices/usersSlice';
import {
  setSelectedUserIdForDrawer,
  setActiveModal,
  addToast,
} from '../store/slices/uiSlice';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Ban,
  Trash2,
  CheckCircle,
  Building2,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { User, UserStatus, UserAccountType } from '../types';

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    users,
    searchTerm,
    accountTypeFilter,
    statusFilter,
    careerFilter,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.users);

  const globalSearch = useAppSelector((state) => state.ui.globalSearchQuery);
  const careers = useAppSelector((state) => state.careers.careers);

  const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null);

  // Apply filters & search
  const effectiveSearch = (searchTerm || globalSearch).toLowerCase().trim();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      effectiveSearch === '' ||
      u.name.toLowerCase().includes(effectiveSearch) ||
      u.email.toLowerCase().includes(effectiveSearch) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(effectiveSearch)) ||
      u.careerName.toLowerCase().includes(effectiveSearch);

    const matchesAccountType =
      accountTypeFilter === 'All' || u.accountType === accountTypeFilter;

    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    const matchesCareer = careerFilter === 'All' || u.careerId === careerFilter;

    return matchesSearch && matchesAccountType && matchesStatus && matchesCareer;
  });

  // Pagination slice
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfirmDelete = () => {
    if (deleteTargetUser) {
      dispatch(deleteUser(deleteTargetUser.id));
      dispatch(
        addToast({
          type: 'info',
          title: 'User Record Deleted',
          message: `${deleteTargetUser.name} has been removed.`,
        })
      );
      setDeleteTargetUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Administer individual learners and enterprise organization participants.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => dispatch(setActiveModal('addUser'))}
        >
          Add User Account
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 sm:p-4 bg-[#12131C] border border-[#171923]">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, organization, or career..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-md pl-8 pr-4 py-1.5 focus:outline-none focus:border-[#FB923C]/70"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {/* Account Type filter */}
            <select
              value={accountTypeFilter}
              onChange={(e) => dispatch(setAccountTypeFilter(e.target.value as any))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Organization Member">Organization Member</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Deactivated">Deactivated</option>
            </select>

            {/* Career Filter */}
            <select
              value={careerFilter}
              onChange={(e) => dispatch(setCareerFilter(e.target.value))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Careers</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden border border-[#171923]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#171923] bg-[#0D0E14] text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Career Goal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171923]">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#94A3B8]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users className="w-8 h-8 text-[#94A3B8] mx-auto opacity-50" />
                      <p className="font-medium text-[#CBD5E1]">No learners found</p>
                      <p className="text-[11px]">
                        Try modifying your search or clearing the active filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const statusVariant = {
                    Active: 'success',
                    Suspended: 'error',
                    Pending: 'warning',
                    Deactivated: 'muted',
                  }[user.status] as any;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#171923]/40 transition-colors group cursor-pointer"
                      onClick={() => dispatch(setSelectedUserIdForDrawer(user.id))}
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                            }
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#2E3345]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-[#F8FAFC] group-hover:text-[#FB923C] transition-colors">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-[#94A3B8]">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Account Type */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={user.accountType === 'Individual' ? 'outline' : 'brand'}
                          size="sm"
                        >
                          {user.accountType}
                        </Badge>
                      </td>

                      {/* Organization */}
                      <td className="py-3.5 px-4">
                        {user.organizationName ? (
                          <span className="text-[#CBD5E1] font-medium flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#34D399]" />
                            {user.organizationName}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">—</span>
                        )}
                      </td>

                      {/* Career */}
                      <td className="py-3.5 px-4">
                        <span className="text-[#CBD5E1] font-medium">{user.careerName}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={statusVariant} size="sm">
                          {user.status}
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
                            onClick={() => dispatch(setSelectedUserIdForDrawer(user.id))}
                            title="Inspect Learner Drawer"
                          >
                            Inspect
                          </Button>

                          <button
                            onClick={() => setDeleteTargetUser(user)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#7F1D1D]/20 rounded-lg transition-colors"
                            title="Delete User Record"
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

        {/* Table Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      </Card>

      {/* Delete User Confirmation Dialog */}
      {deleteTargetUser && (
        <ConfirmDialog
          isOpen={!!deleteTargetUser}
          onClose={() => setDeleteTargetUser(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Learner Record"
          message={`Are you sure you want to permanently delete ${deleteTargetUser.name} (${deleteTargetUser.email})? This action will remove their simulation transcripts and progress records.`}
          confirmLabel="Permanently Delete"
          confirmVariant="danger"
        />
      )}
    </div>
  );
};
