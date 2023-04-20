import { configureStore } from '@reduxjs/toolkit';
import issuesReducer from './slices/Issues';

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch