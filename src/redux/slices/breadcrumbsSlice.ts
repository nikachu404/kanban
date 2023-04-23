import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface isBreadcrumbsVisibleState {
  isBreadcrumbsVisible: boolean;
}

const initialState: isBreadcrumbsVisibleState = {
  isBreadcrumbsVisible: false,
};

const isBreadcrumbsVisible = createSlice({
  name: 'isBreadcrumbsVisible',
  initialState,
  reducers: {
    setIsBreadcrumbsVisible: (state, action: PayloadAction<boolean>) => {
      state.isBreadcrumbsVisible = action.payload;
    },
  },
});

export const { setIsBreadcrumbsVisible } = isBreadcrumbsVisible.actions;

export const isBreadcrumbsVisibleReducer = isBreadcrumbsVisible.reducer;
