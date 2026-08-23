import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/ToastContainer';
import { UserModal } from '../modals/UserModal';
import { OrgModal } from '../modals/OrgModal';
import { CareerModal } from '../modals/CareerModal';
import { ClassModal } from '../modals/ClassModal';
import { SimulationModal } from '../modals/SimulationModal';
import { SimulationTestModal } from '../modals/SimulationTestModal';
import { AdminProfileModal } from '../modals/AdminProfileModal';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import { UserDrawer } from '../drawers/UserDrawer';
import { OrgDrawer } from '../drawers/OrgDrawer';
import { ClassDrawer } from '../drawers/ClassDrawer';
import { SimulationDrawer } from '../drawers/SimulationDrawer';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07080C] text-[#F8FAFC] flex flex-col">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-60 flex flex-col flex-1 min-h-screen">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Global Modals */}
      <UserModal />
      <OrgModal />
      <CareerModal />
      <ClassModal />
      <SimulationModal />
      <SimulationTestModal />
      <AdminProfileModal />
      <LogoutConfirmModal />

      {/* Global Drawers */}
      <UserDrawer />
      <OrgDrawer />
      <ClassDrawer />
      <SimulationDrawer />
    </div>
  );
};
