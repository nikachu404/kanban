import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface breadcrumbsInfoState {
  owner: string;
  repoName: string;
  stars: string;
}

const initialState: breadcrumbsInfoState = {
  owner: '',
  repoName: '',
  stars: '',
};

const breadcrumbsInfoSlice = createSlice({
  name: 'breadcrumbsInfo',
  initialState,
  reducers: {
    setOwner: (state, action: PayloadAction<string>) => {
      state.owner = action.payload;
    },
    setRepoName: (state, action: PayloadAction<string>) => {
      state.repoName = action.payload;
    },
    setStars: (state, action: PayloadAction<string>) => {
      state.stars = action.payload;
    },
  },
});

export const { setOwner, setRepoName, setStars } = breadcrumbsInfoSlice.actions;

export const breadcrumbsInfoReducer = breadcrumbsInfoSlice.reducer;