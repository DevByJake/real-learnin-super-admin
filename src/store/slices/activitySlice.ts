import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActivityLog, PlatformOverviewStats, TimeSeriesPoint, SkillScoreDistribution } from '../../types';
import { INITIAL_ACTIVITY_LOGS, INITIAL_OVERVIEW_STATS, TIME_SERIES_DATA, SKILL_SCORE_DISTRIBUTION } from '../../data/mockData';

interface ActivityState {
  activityLogs: ActivityLog[];
  overviewStats: PlatformOverviewStats;
  timeSeriesData: TimeSeriesPoint[];
  skillScoreDistributions: SkillScoreDistribution[];
  activityFilter: 'All' | 'user_registration' | 'new_organization' | 'simulation_completed' | 'class_completed';
}

const loadSavedActivityLogs = (): ActivityLog[] => {
  try {
    const saved = localStorage.getItem('rl_admin_activity');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load activity logs', e);
  }
  return INITIAL_ACTIVITY_LOGS;
};

const initialState: ActivityState = {
  activityLogs: loadSavedActivityLogs(),
  overviewStats: INITIAL_OVERVIEW_STATS,
  timeSeriesData: TIME_SERIES_DATA,
  skillScoreDistributions: SKILL_SCORE_DISTRIBUTION,
  activityFilter: 'All',
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivityFilter: (state, action: PayloadAction<ActivityState['activityFilter']>) => {
      state.activityFilter = action.payload;
    },
    addActivityLog: (state, action: PayloadAction<Omit<ActivityLog, 'id' | 'timestamp'>>) => {
      const newLog: ActivityLog = {
        id: 'act-' + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.activityLogs.unshift(newLog);
      // Keep max 50 logs
      if (state.activityLogs.length > 50) {
        state.activityLogs.pop();
      }
      localStorage.setItem('rl_admin_activity', JSON.stringify(state.activityLogs));
    },
    clearActivityLogs: (state) => {
      state.activityLogs = [];
      localStorage.setItem('rl_admin_activity', JSON.stringify([]));
    },
    resetActivityToDefault: (state) => {
      state.activityLogs = INITIAL_ACTIVITY_LOGS;
      localStorage.setItem('rl_admin_activity', JSON.stringify(INITIAL_ACTIVITY_LOGS));
    },
  },
});

export const {
  setActivityFilter,
  addActivityLog,
  clearActivityLogs,
  resetActivityToDefault,
} = activitySlice.actions;

export default activitySlice.reducer;
