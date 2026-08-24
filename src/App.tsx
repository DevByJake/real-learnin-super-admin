import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { CareersPage } from './pages/CareersPage';
import { ClassesPage } from './pages/ClassesPage';
import { SimulationsPage } from './pages/SimulationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { LegalInformationPage } from './pages/LegalInformationPage';
import { FaqPage } from './pages/FaqPage';
import { LoginPage } from './pages/LoginPage';
import { useAppSelector } from './store/hooks';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="simulations" element={<SimulationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-conditions" element={<TermsConditionsPage />} />
            <Route path="legal-information" element={<LegalInformationPage />} />
            <Route path="faq" element={<FaqPage />} />
          </Route>
          {/* Default and fallback routes */}
          <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
