import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const repoUrlSlice = createSlice({
  name: 'repoUrl',
  initialState: '',
  reducers: {
    setRepoUrl: (_state, action: PayloadAction<string>) => action.payload,
    clearRepoUrl: () => '',
  },
});

export const selectRepoUrl = (state: RootState) => state.repoUrl;

export const { setRepoUrl, clearRepoUrl } = repoUrlSlice.actions;

export const repoUrlSliceReducer = repoUrlSlice.reducer;