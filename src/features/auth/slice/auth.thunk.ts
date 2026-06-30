import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/auth.api';
import { getApiError } from '@/shared/helpers/apiError';
import type { LoginCredentials } from '../types/auth.types';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        401: 'Usuario o contraseña incorrectos.',
        default: 'No se pudo iniciar sesión. Intentá de nuevo.',
      }));
    }
  }
);

export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return rejectWithValue('Sin sesión activa.');
    try {
      const { data } = await authApi.refresh(refreshToken);
      return data;
    } catch {
      localStorage.removeItem('refreshToken');
      return rejectWithValue('Tu sesión expiró. Volvé a iniciar sesión.');
    }
  }
);
