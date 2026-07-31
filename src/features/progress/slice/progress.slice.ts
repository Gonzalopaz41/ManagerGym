import { createSlice } from '@reduxjs/toolkit';
import type { ProgressState } from '../types/progress.types';
import {
  createProgressThunk,
  fetchProgressByExerciseThunk,
  fetchProgressThunk,
} from './progress.thunk';

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
      // fetch por ejercicio
      .addCase(fetchProgressByExerciseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressByExerciseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchProgressByExerciseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create — el componente refetchea al confirmar
      .addCase(createProgressThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearProgressError, clearProgress } = progressSlice.actions;
export default progressSlice.reducer;
