import { createSlice } from '@reduxjs/toolkit';
import type { DashboardState } from '../types/dashboard.types';
import { fetchDashboardThunk } from './dashboard.thunk';

const initialState: DashboardState = {
  stats: null,
  recentPayments: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentPayments = action.payload.recentPayments;
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
