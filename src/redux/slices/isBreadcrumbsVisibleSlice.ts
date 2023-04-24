import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface isBreadcrumbsVisibleState {
  isBreadcrumbsVisible: boolean;
}

const initialState: isBreadcrumbsVisibleState = {
  isBreadcrumbsVisible: false,
};

const isBreadcrumbsVisibleSlice = createSlice({
  name: 'isBreadcrumbsVisible',
  initialState,
  reducers: {
    setIsBreadcrumbsVisible: (state, action: PayloadAction<boolean>) => {
      state.isBreadcrumbsVisible = action.payload;
    },
  },
});

export const { setIsBreadcrumbsVisible } = isBreadcrumbsVisibleSlice.actions;

export const isBreadcrumbsVisibleReducer = isBreadcrumbsVisibleSlice.reducer;
