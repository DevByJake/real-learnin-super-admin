import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import usersReducer from './slices/usersSlice';
import organizationsReducer from './slices/organizationsSlice';
import careersReducer from './slices/careersSlice';
import classesReducer from './slices/classesSlice';
import simulationsReducer from './slices/simulationsSlice';
import activityReducer from './slices/activitySlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: usersReducer,
    organizations: organizationsReducer,
    careers: careersReducer,
    classes: classesReducer,
    simulations: simulationsReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
