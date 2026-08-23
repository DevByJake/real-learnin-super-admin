import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AISimulation, SimulationStatus, SkillDifficulty, EvaluatedSkill } from '../../types';
import { INITIAL_SIMULATIONS } from '../../data/mockData';

interface SimulationsState {
  simulations: AISimulation[];
  searchTerm: string;
  careerFilter: string;
  difficultyFilter: 'All' | SkillDifficulty;
  statusFilter: 'All' | SimulationStatus;
  currentPage: number;
  itemsPerPage: number;
}

const loadSavedSimulations = (): AISimulation[] => {
  try {
    const saved = localStorage.getItem('rl_admin_simulations');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load simulations from storage', e);
  }
  return INITIAL_SIMULATIONS;
};

const initialState: SimulationsState = {
  simulations: loadSavedSimulations(),
  searchTerm: '',
  careerFilter: 'All',
  difficultyFilter: 'All',
  statusFilter: 'All',
  currentPage: 1,
  itemsPerPage: 8,
};

export const simulationsSlice = createSlice({
  name: 'simulations',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCareerFilter: (state, action: PayloadAction<string>) => {
      state.careerFilter = action.payload;
      state.currentPage = 1;
    },
    setDifficultyFilter: (state, action: PayloadAction<'All' | SkillDifficulty>) => {
      state.difficultyFilter = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<'All' | SimulationStatus>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addSimulation: (state, action: PayloadAction<Omit<AISimulation, 'id' | 'updatedAt' | 'completionsCount' | 'avgScore' | 'avgDurationMinutes'>>) => {
      const now = new Date().toISOString();
      const newSim: AISimulation = {
        id: 'sim-' + Date.now().toString(36),
        completionsCount: 0,
        avgScore: 0,
        avgDurationMinutes: 0,
        updatedAt: now,
        ...action.payload,
      };
      state.simulations.unshift(newSim);
      localStorage.setItem('rl_admin_simulations', JSON.stringify(state.simulations));
    },
    updateSimulation: (state, action: PayloadAction<AISimulation>) => {
      const index = state.simulations.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.simulations[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('rl_admin_simulations', JSON.stringify(state.simulations));
      }
    },
    toggleSimulationStatus: (state, action: PayloadAction<string>) => {
      const sim = state.simulations.find((s) => s.id === action.payload);
      if (sim) {
        sim.status = sim.status === 'Published' ? 'Draft' : 'Published';
        sim.updatedAt = new Date().toISOString();
        localStorage.setItem('rl_admin_simulations', JSON.stringify(state.simulations));
      }
    },
    deleteSimulation: (state, action: PayloadAction<string>) => {
      state.simulations = state.simulations.filter((s) => s.id !== action.payload);
      localStorage.setItem('rl_admin_simulations', JSON.stringify(state.simulations));
    },
    resetSimulationsToDefault: (state) => {
      state.simulations = INITIAL_SIMULATIONS;
      localStorage.setItem('rl_admin_simulations', JSON.stringify(INITIAL_SIMULATIONS));
    },
  },
});

export const {
  setSearchTerm,
  setCareerFilter,
  setDifficultyFilter,
  setStatusFilter,
  setCurrentPage,
  addSimulation,
  updateSimulation,
  toggleSimulationStatus,
  deleteSimulation,
  resetSimulationsToDefault,
} = simulationsSlice.actions;

export default simulationsSlice.reducer;
