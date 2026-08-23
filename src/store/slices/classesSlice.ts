import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClassModule, ClassStatus, Lesson, QuizQuestion } from '../../types';
import { INITIAL_CLASSES } from '../../data/mockData';

interface ClassesState {
  classes: ClassModule[];
  searchTerm: string;
  careerFilter: string;
  statusFilter: 'All' | ClassStatus;
  levelFilter: string;
  currentPage: number;
  itemsPerPage: number;
}

const loadSavedClasses = (): ClassModule[] => {
  try {
    const saved = localStorage.getItem('rl_admin_classes');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load classes from storage', e);
  }
  return INITIAL_CLASSES;
};

const initialState: ClassesState = {
  classes: loadSavedClasses(),
  searchTerm: '',
  careerFilter: 'All',
  statusFilter: 'All',
  levelFilter: 'All',
  currentPage: 1,
  itemsPerPage: 8,
};

export const classesSlice = createSlice({
  name: 'classes',
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
    setStatusFilter: (state, action: PayloadAction<'All' | ClassStatus>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setLevelFilter: (state, action: PayloadAction<string>) => {
      state.levelFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addClass: (state, action: PayloadAction<Omit<ClassModule, 'id' | 'createdAt' | 'updatedAt' | 'enrolledCount' | 'completedCount'>>) => {
      const now = new Date().toISOString();
      const newClass: ClassModule = {
        id: 'class-' + Date.now().toString(36),
        enrolledCount: 0,
        completedCount: 0,
        createdAt: now,
        updatedAt: now,
        ...action.payload,
      };
      state.classes.unshift(newClass);
      localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
    },
    updateClass: (state, action: PayloadAction<ClassModule>) => {
      const index = state.classes.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
      }
    },
    toggleClassPublishStatus: (state, action: PayloadAction<string>) => {
      const item = state.classes.find((c) => c.id === action.payload);
      if (item) {
        item.status = item.status === 'Published' ? 'Draft' : 'Published';
        item.updatedAt = new Date().toISOString();
        localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
      }
    },
    addLessonToClass: (state, action: PayloadAction<{ classId: string; lesson: Omit<Lesson, 'id'> }>) => {
      const item = state.classes.find((c) => c.id === action.payload.classId);
      if (item) {
        const newLesson: Lesson = {
          id: 'les-' + Date.now().toString(36),
          ...action.payload.lesson,
        };
        item.lessons.push(newLesson);
        item.updatedAt = new Date().toISOString();
        localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
      }
    },
    updateLessonInClass: (state, action: PayloadAction<{ classId: string; lesson: Lesson }>) => {
      const item = state.classes.find((c) => c.id === action.payload.classId);
      if (item) {
        const lIndex = item.lessons.findIndex((l) => l.id === action.payload.lesson.id);
        if (lIndex !== -1) {
          item.lessons[lIndex] = action.payload.lesson;
          item.updatedAt = new Date().toISOString();
          localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
        }
      }
    },
    deleteLessonFromClass: (state, action: PayloadAction<{ classId: string; lessonId: string }>) => {
      const item = state.classes.find((c) => c.id === action.payload.classId);
      if (item) {
        item.lessons = item.lessons.filter((l) => l.id !== action.payload.lessonId);
        item.updatedAt = new Date().toISOString();
        localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
      }
    },
    addQuizQuestionToClass: (state, action: PayloadAction<{ classId: string; question: Omit<QuizQuestion, 'id'> }>) => {
      const item = state.classes.find((c) => c.id === action.payload.classId);
      if (item) {
        const newQuestion: QuizQuestion = {
          id: 'quiz-' + Date.now().toString(36),
          ...action.payload.question,
        };
        item.quiz.push(newQuestion);
        item.updatedAt = new Date().toISOString();
        localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
      }
    },
    deleteQuizQuestionFromClass: (state, action: PayloadAction<{ classId: string; questionId: string }>) => {
      const item = state.classes.find((c) => c.id === action.payload.classId);
      if (item) {
        item.quiz = item.quiz.filter((q) => q.id !== action.payload.questionId);
        item.updatedAt = new Date().toISOString();
        localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
      }
    },
    deleteClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter((c) => c.id !== action.payload);
      localStorage.setItem('rl_admin_classes', JSON.stringify(state.classes));
    },
    resetClassesToDefault: (state) => {
      state.classes = INITIAL_CLASSES;
      localStorage.setItem('rl_admin_classes', JSON.stringify(INITIAL_CLASSES));
    },
  },
});

export const {
  setSearchTerm,
  setCareerFilter,
  setStatusFilter,
  setLevelFilter,
  setCurrentPage,
  addClass,
  updateClass,
  toggleClassPublishStatus,
  addLessonToClass,
  updateLessonInClass,
  deleteLessonFromClass,
  addQuizQuestionToClass,
  deleteQuizQuestionFromClass,
  deleteClass,
  resetClassesToDefault,
} = classesSlice.actions;

export default classesSlice.reducer;
