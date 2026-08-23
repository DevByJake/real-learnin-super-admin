import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Compass,
  GraduationCap,
  Sparkles,
  BarChart3,
  Settings,
  UserCheck,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSidebarOpen, setActiveModal } from '../../store/slices/uiSlice';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const usersCount = useAppSelector((state) => state.users.users.length);
  const orgsCount = useAppSelector((state) => state.organizations.organizations.length);
  const simsCount = useAppSelector((state) => state.simulations.simulations.length);

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        {
          name: 'Dashboard',
          path: '/admin-dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          exact: true,
        },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          name: 'Users',
          path: '/admin-dashboard/users',
          icon: <Users className="w-4 h-4" />,
          badge: usersCount > 0 ? usersCount : undefined,
        },
        {
          name: 'Organizations',
          path: '/admin-dashboard/organizations',
          icon: <Building2 className="w-4 h-4" />,
          badge: orgsCount > 0 ? orgsCount : undefined,
        },
        {
          name: 'Careers',
          path: '/admin-dashboard/careers',
          icon: <Compass className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        {
          name: 'Classes',
          path: '/admin-dashboard/classes',
          icon: <GraduationCap className="w-4 h-4" />,
        },
        {
          name: 'Simulations',
          path: '/admin-dashboard/simulations',
          icon: <Sparkles className="w-4 h-4" />,
          badge: simsCount > 0 ? simsCount : undefined,
        },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        {
          name: 'Analytics',
          path: '/admin-dashboard/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#07080C]/80 backdrop-blur-xs lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-60 bg-[#0D0E14] border-r border-[#171923] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#171923] flex items-center justify-between shrink-0 bg-[#07080C]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FB923C] to-[#FB7185] flex items-center justify-center font-bold text-black text-xs shadow-sm">
              RL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#F8FAFC]">Real Learning</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FB923C] block">
                Super Admin
              </span>
            </div>
          </div>

          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#171923] lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-2 text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const isActive = item.exact
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors duration-150 group',
                        isActive
                          ? 'bg-[#12131C] text-[#FB923C] border-[#171923] shadow-xs'
                          : 'border-transparent text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#12131C]'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'transition-colors duration-150',
                            isActive ? 'text-[#FB923C]' : 'text-[#94A3B8] group-hover:text-[#CBD5E1]'
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-colors duration-150',
                            isActive
                              ? 'bg-[#FB923C]/20 text-[#FB923C]'
                              : 'bg-[#171923] text-[#94A3B8]'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Utility & Profile */}
        <div className="p-3 border-t border-[#171923] bg-[#07080C]/40 space-y-1 shrink-0">
          <NavLink
            to="/admin-dashboard/settings"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors duration-150',
                isActive
                  ? 'bg-[#12131C] text-[#FB923C] border-[#171923]'
                  : 'border-transparent text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#12131C]'
              )
            }
          >
            <Settings className="w-4 h-4 text-[#94A3B8]" />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={() => dispatch(setActiveModal('adminProfile'))}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border border-transparent text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#12131C] transition-colors duration-150 text-left cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#94A3B8]" />
            <span>Admin Profile</span>
          </button>

          <button
            onClick={() => dispatch(setActiveModal('logoutConfirm'))}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border border-transparent text-[#F87171] hover:bg-[#7F1D1D]/20 transition-colors duration-150 text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#F87171]" />
            <span>Logout</span>
          </button>

          {/* Super Admin User info card */}
          <div className="mt-2 pt-3 border-t border-[#171923] px-1.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FB923C] to-[#FB7185] flex items-center justify-center text-black text-xs font-bold shrink-0">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#F8FAFC] truncate">John Doe</p>
              <p className="text-[10px] text-[#94A3B8] truncate">Super Admin</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#34D399]" title="System Online" />
          </div>
        </div>
      </aside>
    </>
  );
};
