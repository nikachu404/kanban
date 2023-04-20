import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Column } from '../../types/Column';
import { RootState } from '../store';

interface ColumnsState {
  data: Column[];
}

const initialState: ColumnsState = {
  data: [
    { id: 'todo', title: 'To Do', items: [] },
    { id: 'in-progress', title: 'In Progress', items: [] },
    { id: 'done', title: 'Done', items: [] }
  ],
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumns(state, action: PayloadAction<Column[]>) {
      state.data = action.payload;
    },
  },
});

export const { setColumns } = columnsSlice.actions;

export const selectColumns = (state: RootState) => state.columns.data;

export const columnsReducer = columnsSlice.reducer;
