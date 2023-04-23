import { createSlice } from '@reduxjs/toolkit';

const repoUrlSlice = createSlice({
  name: 'repoUrl',
  initialState: '',
  reducers: {
    setRepoUrl: (_state, action) => {
      return action.payload;
    },
    clearRepoUrl: () => {
      return '';
    },
  },
});

export const repoUrlSliceReducer = repoUrlSlice.reducer;
export const { setRepoUrl, clearRepoUrl } = repoUrlSlice.actions;