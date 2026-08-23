import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Sparkles,
  Building2,
  Users,
  Compass,
  GraduationCap,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, setActiveModal, setGlobalSearchQuery } from '../../store/slices/uiSlice';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const globalSearch = useAppSelector((state) => state.ui.globalSearchQuery);
  const activityLogs = useAppSelector((state) => state.activity.activityLogs);

  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/admin-dashboard' || path === '/admin-dashboard/') {
      return { title: 'Platform Overview', category: 'Overview' };
    }
    if (path.startsWith('/admin-dashboard/users')) {
      return { title: 'User Management', category: 'Management' };
    }
    if (path.startsWith('/admin-dashboard/organizations')) {
      return { title: 'Organization Management', category: 'Management' };
    }
    if (path.startsWith('/admin-dashboard/careers')) {
      return { title: 'Career Management', category: 'Management' };
    }
    if (path.startsWith('/admin-dashboard/classes')) {
      return { title: 'Classes & Curriculum', category: 'Content' };
    }
    if (path.startsWith('/admin-dashboard/simulations')) {
      return { title: 'AI Simulation Management', category: 'Content' };
    }
    if (path.startsWith('/admin-dashboard/analytics')) {
      return { title: 'Platform Analytics', category: 'Analytics' };
    }
    if (path.startsWith('/admin-dashboard/settings')) {
      return { title: 'Platform Settings', category: 'System' };
    }
    return { title: 'Super Admin', category: 'Real Learning' };
  };

  const pageMeta = getPageMeta();

  return (
    <header className="h-16 border-b border-[#171923] bg-[#07080C]/50 backdrop-blur-sm sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left side: Hamburger on mobile + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#12131C] rounded-lg lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#F8FAFC] tracking-tight">{pageMeta.title}</h2>
          <p className="text-xs text-[#94A3B8] hidden sm:block">Platform overview and system activity</p>
        </div>
      </div>

      {/* Right side: Global Search + Quick Action + Notifications + Admin Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global search */}
        <div className="relative hidden md:block w-60 lg:w-64">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records..."
            value={globalSearch}
            onChange={(e) => dispatch(setGlobalSearchQuery(e.target.value))}
            className="w-full bg-[#12131C] border border-[#171923] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/70 focus:outline-none focus:border-[#FB923C]/50 transition-colors"
          />
        </div>

        {/* Quick Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickCreate(!showQuickCreate)}
            className="bg-gradient-to-r from-[#FB923C] to-[#FB7185] text-black px-3.5 sm:px-4 py-1.5 rounded-md text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>New Record</span>
          </button>

          {showQuickCreate && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickCreate(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-[#12131C] border border-[#171923] rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    dispatch(setActiveModal('addUser'));
                    setShowQuickCreate(false);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#CBD5E1] hover:bg-[#171923] hover:text-[#F8FAFC] text-left"
                >
                  <Users className="w-4 h-4 text-[#FB923C]" />
                  <span>New User Account</span>
                </button>

                <button
                  onClick={() => {
                    dispatch(setActiveModal('addOrg'));
                    setShowQuickCreate(false);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#CBD5E1] hover:bg-[#171923] hover:text-[#F8FAFC] text-left"
                >
                  <Building2 className="w-4 h-4 text-[#34D399]" />
                  <span>New Organization</span>
                </button>

                <button
                  onClick={() => {
                    dispatch(setActiveModal('addCareer'));
                    setShowQuickCreate(false);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#CBD5E1] hover:bg-[#171923] hover:text-[#F8FAFC] text-left"
                >
                  <Compass className="w-4 h-4 text-[#FBBF24]" />
                  <span>New Career Track</span>
                </button>

                <button
                  onClick={() => {
                    dispatch(setActiveModal('addClass'));
                    setShowQuickCreate(false);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#CBD5E1] hover:bg-[#171923] hover:text-[#F8FAFC] text-left"
                >
                  <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
                  <span>New Class Module</span>
                </button>

                <button
                  onClick={() => {
                    dispatch(setActiveModal('addSimulation'));
                    setShowQuickCreate(false);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#CBD5E1] hover:bg-[#171923] hover:text-[#F8FAFC] text-left border-t border-[#171923] mt-1 pt-1.5"
                >
                  <Sparkles className="w-4 h-4 text-[#FB7185]" />
                  <span>New AI Simulation</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#12131C] rounded-md relative transition-colors cursor-pointer border border-transparent hover:border-[#171923]"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {activityLogs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FB923C]" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#12131C] border border-[#171923] rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 border-b border-[#171923] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#FB923C]" />
                    <h3 className="text-xs font-semibold text-[#F8FAFC]">Platform Activity Feed</h3>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] font-mono">Live</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#171923]">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 hover:bg-[#171923]/60 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1 rounded-md bg-[#171923] text-[#FB923C] shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#F8FAFC] truncate">{log.title}</p>
                          <p className="text-[11px] text-[#94A3B8] line-clamp-2 mt-0.5">{log.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[#0D0E14] border-t border-[#171923] text-center">
                  <span className="text-[11px] text-[#94A3B8]">
                    Real Learning platform operating normally
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
