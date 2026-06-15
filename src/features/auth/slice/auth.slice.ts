import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from '../types/auth.types';
import { loginThunk, refreshThunk } from './auth.thunk';

const initialState: AuthState = {
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken'),
  loading: false,
  error: null,
  isInitializing: !!localStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // refresh
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isInitializing = false;
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isInitializing = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
