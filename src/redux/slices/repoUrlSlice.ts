import { createSlice } from '@reduxjs/toolkit';

const repoUrlSlice = createSlice({
  name: 'repo',
  initialState: '',
  reducers: {
    setRepoUrl: (state, action) => {
      return action.payload;
    },
    clearRepoUrl: (state) => {
      return '';
    },
  },
});

export const repoUrlSliceReducer = repoUrlSlice.reducer;
export const { setRepoUrl, clearRepoUrl } = repoUrlSlice.actions;