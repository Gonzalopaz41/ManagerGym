import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import type { AuthState, JwtPayload } from '../types/auth.types';
import { loginThunk, refreshThunk } from './auth.thunk';

const decodeRole = (token: string): JwtPayload['Role'] | null => {
  try {
    const payload = jwtDecode<Record<string, any>>(token);
    console.log('[JWT payload]', payload);
    const role = payload.Role ?? payload.role ?? payload.roles;
    if (role === 'admin' || role === 'base') return role;
    if (Array.isArray(role)) {
      if (role.includes('admin')) return 'admin';
      if (role.includes('base')) return 'base';
    }
    return null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken'),
  role: null,
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
      state.role = null;
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
        state.role = decodeRole(action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // refresh
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.role = decodeRole(action.payload.accessToken);
        state.isInitializing = false;
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.role = null;
        state.isInitializing = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
