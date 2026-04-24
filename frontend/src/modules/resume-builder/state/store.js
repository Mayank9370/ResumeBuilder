import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from '@/modules/resume-builder/state/resumeSlice';
import uiReducer from '@/modules/resume-builder/state/uiSlice';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    ui: uiReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
