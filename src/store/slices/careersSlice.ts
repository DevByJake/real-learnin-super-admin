import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Career, CareerStatus } from '../../types';
import { INITIAL_CAREERS } from '../../data/mockData';

interface CareersState {
  careers: Career[];
  searchTerm: string;
  statusFilter: 'All' | CareerStatus;
  categoryFilter: string;
}

const loadSavedCareers = (): Career[] => {
  try {
    const saved = localStorage.getItem('rl_admin_careers');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load careers from storage', e);
  }
  return INITIAL_CAREERS;
};

const initialState: CareersState = {
  careers: loadSavedCareers(),
  searchTerm: '',
  statusFilter: 'All',
  categoryFilter: 'All',
};

export const careersSlice = createSlice({
  name: 'careers',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'All' | CareerStatus>) => {
      state.statusFilter = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    addCareer: (state, action: PayloadAction<Omit<Career, 'id' | 'createdAt' | 'updatedAt' | 'enrolledUsersCount' | 'avgCompletionDays'>>) => {
      const now = new Date().toISOString();
      const newCareer: Career = {
        id: 'career-' + Date.now().toString(36),
        enrolledUsersCount: 0,
        avgCompletionDays: 0,
        createdAt: now,
        updatedAt: now,
        ...action.payload,
      };
      state.careers.unshift(newCareer);
      localStorage.setItem('rl_admin_careers', JSON.stringify(state.careers));
    },
    updateCareer: (state, action: PayloadAction<Career>) => {
      const index = state.careers.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.careers[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('rl_admin_careers', JSON.stringify(state.careers));
      }
    },
    toggleCareerStatus: (state, action: PayloadAction<string>) => {
      const career = state.careers.find((c) => c.id === action.payload);
      if (career) {
        career.status = career.status === 'Active' ? 'Draft' : 'Active';
        career.updatedAt = new Date().toISOString();
        localStorage.setItem('rl_admin_careers', JSON.stringify(state.careers));
      }
    },
    deleteCareer: (state, action: PayloadAction<string>) => {
      state.careers = state.careers.filter((c) => c.id !== action.payload);
      localStorage.setItem('rl_admin_careers', JSON.stringify(state.careers));
    },
    resetCareersToDefault: (state) => {
      state.careers = INITIAL_CAREERS;
      localStorage.setItem('rl_admin_careers', JSON.stringify(INITIAL_CAREERS));
    },
  },
});

export const {
  setSearchTerm,
  setStatusFilter,
  setCategoryFilter,
  addCareer,
  updateCareer,
  toggleCareerStatus,
  deleteCareer,
  resetCareersToDefault,
} = careersSlice.actions;

export default careersSlice.reducer;
