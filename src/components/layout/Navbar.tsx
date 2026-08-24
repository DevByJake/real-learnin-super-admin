import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

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
    </header>
  );
};
