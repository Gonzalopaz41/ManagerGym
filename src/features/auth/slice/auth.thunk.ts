import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/auth.api';
import type { LoginCredentials } from '../types/auth.types';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? 'Credenciales incorrectas'
      );
    }
  }
);

export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return rejectWithValue('Sin refresh token');
    try {
      const { data } = await authApi.refresh(refreshToken);
      return data;
    } catch {
      localStorage.removeItem('refreshToken');
      return rejectWithValue('Sesión expirada');
    }
  }
);
