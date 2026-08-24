import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const initialAuth = localStorage.getItem('isAuthenticated') === 'true';

const initialState: AuthState = {
  isAuthenticated: initialAuth,
  user: {
    name: 'John Doe',
    email: 'admin@reallearning.io',
    role: 'Super Administrator',
    avatar: 'JD',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.user.email = action.payload.email || 'admin@reallearning.io';
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
