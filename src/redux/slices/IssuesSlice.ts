import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Issue } from '../../types/Issue';

export const fetchIssues = createAsyncThunk('issues/fetchIssues', async (repoUrl: string) => {
  const response = await axios.get(repoUrl);
  return response.data;
});

const issuesSlice = createSlice({
  name: 'issues',
  initialState: {
    data: [] as Issue[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const issuesReducer = issuesSlice.reducer;
