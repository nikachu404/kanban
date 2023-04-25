import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const isBreadcrumbsVisibleSlice = createSlice({
  name: 'isBreadcrumbsVisible',
  initialState: false,
  reducers: {
    setIsBreadcrumbsVisible: (_state, action: PayloadAction<boolean>) => action.payload,
  },
});

export const selectIsBreadcrumbsVisible = (state: RootState) => state.isBreadcrumbsVisible;

export const { setIsBreadcrumbsVisible } = isBreadcrumbsVisibleSlice.actions;

export const isBreadcrumbsVisibleReducer = isBreadcrumbsVisibleSlice.reducer;
