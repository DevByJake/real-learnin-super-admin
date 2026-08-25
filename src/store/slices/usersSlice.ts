import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserStatus } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';

interface UsersState {
  users: User[];
  searchTerm: string;
  statusFilter: 'All' | UserStatus;
  careerFilter: string;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
}

const loadSavedUsers = (): User[] => {
  try {
    const saved = localStorage.getItem('rl_admin_users');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load users from storage', e);
  }
  return INITIAL_USERS;
};

const initialState: UsersState = {
  users: loadSavedUsers(),
  searchTerm: '',
  statusFilter: 'All',
  careerFilter: 'All',
  currentPage: 1,
  itemsPerPage: 8,
  isLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<'All' | UserStatus>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCareerFilter: (state, action: PayloadAction<string>) => {
      state.careerFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addUser: (state, action: PayloadAction<Omit<User, 'id' | 'joinedAt' | 'lastActiveAt'>>) => {
      const newUser: User = {
        id: 'usr-' + Date.now().toString(36),
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        ...action.payload,
      };
      state.users.unshift(newUser);
      localStorage.setItem('rl_admin_users', JSON.stringify(state.users));
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        localStorage.setItem('rl_admin_users', JSON.stringify(state.users));
      }
    },
    updateUserStatus: (state, action: PayloadAction<{ id: string; status: UserStatus }>) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.status = action.payload.status;
        localStorage.setItem('rl_admin_users', JSON.stringify(state.users));
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      localStorage.setItem('rl_admin_users', JSON.stringify(state.users));
    },
    resetUsersToDefault: (state) => {
      state.users = INITIAL_USERS;
      localStorage.setItem('rl_admin_users', JSON.stringify(INITIAL_USERS));
    },
  },
});

export const {
  setSearchTerm,
  setStatusFilter,
  setCareerFilter,
  setCurrentPage,
  addUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  resetUsersToDefault,
} = usersSlice.actions;

export default usersSlice.reducer;
