import { createSlice } from '@reduxjs/toolkit';
import type { ProgressState } from '../types/progress.types';
import { createProgressThunk, fetchProgressThunk } from './progress.thunk';

const initialState: ProgressState = {
  records: [],
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    },
    clearProgress: (state) => {
      state.records = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch por cliente
      .addCase(fetchProgressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchProgressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create — la respuesta trae el registro con su ejercicio y categoría.
      .addCase(createProgressThunk.fulfilled, (state, action) => {
        state.records.push(action.payload);
      })
      .addCase(createProgressThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearProgressError, clearProgress } = progressSlice.actions;
export default progressSlice.reducer;
