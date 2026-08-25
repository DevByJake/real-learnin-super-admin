import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  sidebarOpen: boolean;
  globalSearchQuery: string;
  toasts: ToastMessage[];
  selectedUserIdForDrawer: string | null;
  selectedOrgIdForDrawer: string | null;
  selectedClassIdForDrawer: string | null;
  selectedSimulationIdForDrawer: string | null;
  activeModal: 'addCareer' | 'addClass' | 'addSimulation' | 'testSimulation' | 'adminProfile' | 'logoutConfirm' | null;
  testSimulationTargetId: string | null;
}

const initialState: UIState = {
  sidebarOpen: false,
  globalSearchQuery: '',
  toasts: [],
  selectedUserIdForDrawer: null,
  selectedOrgIdForDrawer: null,
  selectedClassIdForDrawer: null,
  selectedSimulationIdForDrawer: null,
  activeModal: null,
  testSimulationTargetId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setGlobalSearchQuery: (state, action: PayloadAction<string>) => {
      state.globalSearchQuery = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      state.toasts.push({
        id,
        duration: 4000,
        ...action.payload,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setSelectedUserIdForDrawer: (state, action: PayloadAction<string | null>) => {
      state.selectedUserIdForDrawer = action.payload;
    },
    setSelectedOrgIdForDrawer: (state, action: PayloadAction<string | null>) => {
      state.selectedOrgIdForDrawer = action.payload;
    },
    setSelectedClassIdForDrawer: (state, action: PayloadAction<string | null>) => {
      state.selectedClassIdForDrawer = action.payload;
    },
    setSelectedSimulationIdForDrawer: (state, action: PayloadAction<string | null>) => {
      state.selectedSimulationIdForDrawer = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<UIState['activeModal']>) => {
      state.activeModal = action.payload;
    },
    setTestSimulationTarget: (state, action: PayloadAction<string | null>) => {
      state.testSimulationTargetId = action.payload;
      if (action.payload) {
        state.activeModal = 'testSimulation';
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setGlobalSearchQuery,
  addToast,
  removeToast,
  setSelectedUserIdForDrawer,
  setSelectedOrgIdForDrawer,
  setSelectedClassIdForDrawer,
  setSelectedSimulationIdForDrawer,
  setActiveModal,
  setTestSimulationTarget,
} = uiSlice.actions;

export default uiSlice.reducer;
