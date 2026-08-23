import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organization, OrganizationStatus } from '../../types';
import { INITIAL_ORGANIZATIONS } from '../../data/mockData';

interface OrganizationsState {
  organizations: Organization[];
  searchTerm: string;
  statusFilter: 'All' | OrganizationStatus;
  tierFilter: string;
  currentPage: number;
  itemsPerPage: number;
}

const loadSavedOrgs = (): Organization[] => {
  try {
    const saved = localStorage.getItem('rl_admin_orgs');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load organizations from storage', e);
  }
  return INITIAL_ORGANIZATIONS;
};

const initialState: OrganizationsState = {
  organizations: loadSavedOrgs(),
  searchTerm: '',
  statusFilter: 'All',
  tierFilter: 'All',
  currentPage: 1,
  itemsPerPage: 8,
};

export const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<'All' | OrganizationStatus>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setTierFilter: (state, action: PayloadAction<string>) => {
      state.tierFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addOrganization: (state, action: PayloadAction<Omit<Organization, 'id' | 'createdAt' | 'completedSimulations' | 'completedClasses'>>) => {
      const newOrg: Organization = {
        id: 'org-' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        completedSimulations: 0,
        completedClasses: 0,
        ...action.payload,
      };
      state.organizations.unshift(newOrg);
      localStorage.setItem('rl_admin_orgs', JSON.stringify(state.organizations));
    },
    updateOrganization: (state, action: PayloadAction<Organization>) => {
      const index = state.organizations.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = action.payload;
        localStorage.setItem('rl_admin_orgs', JSON.stringify(state.organizations));
      }
    },
    updateOrgStatus: (state, action: PayloadAction<{ id: string; status: OrganizationStatus }>) => {
      const org = state.organizations.find((o) => o.id === action.payload.id);
      if (org) {
        org.status = action.payload.status;
        localStorage.setItem('rl_admin_orgs', JSON.stringify(state.organizations));
      }
    },
    updateOrgSeats: (state, action: PayloadAction<{ id: string; totalSeats: number }>) => {
      const org = state.organizations.find((o) => o.id === action.payload.id);
      if (org) {
        org.totalSeats = action.payload.totalSeats;
        localStorage.setItem('rl_admin_orgs', JSON.stringify(state.organizations));
      }
    },
    deleteOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter((o) => o.id !== action.payload);
      localStorage.setItem('rl_admin_orgs', JSON.stringify(state.organizations));
    },
    resetOrganizationsToDefault: (state) => {
      state.organizations = INITIAL_ORGANIZATIONS;
      localStorage.setItem('rl_admin_orgs', JSON.stringify(INITIAL_ORGANIZATIONS));
    },
  },
});

export const {
  setSearchTerm,
  setStatusFilter,
  setTierFilter,
  setCurrentPage,
  addOrganization,
  updateOrganization,
  updateOrgStatus,
  updateOrgSeats,
  deleteOrganization,
  resetOrganizationsToDefault,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
