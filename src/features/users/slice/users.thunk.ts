import { createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../api/users.api';
import { getApiError } from '@/shared/helpers/apiError';
import type { CreateUserPayload, UpdateUserPayload } from '../types/users.types';

export const fetchUsersThunk = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await usersApi.getAll();
      return Array.isArray(data) ? data : (data.users ?? []);
    } catch (err: any) {
      return rejectWithValue(getApiError(err, {
        default: 'No se pudieron cargar los usuarios.',
      }));
    }
  }
);

export const createUserThunk = createAsyncThunk(
  'users/create',
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const { data } = await usersApi.create(payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(getApiError(err, {
        400: 'El nombre de usuario ya está en uso.',
        401: 'Solo un administrador puede crear usuarios.',
        default: 'No se pudo crear el usuario. Intentá de nuevo.',
      }));
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ id, payload }: { id: string; payload: UpdateUserPayload }, { rejectWithValue }) => {
    try {
      const { data } = await usersApi.update(id, payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(getApiError(err, {
        400: 'El nombre de usuario ya está en uso o los datos son inválidos.',
        404: 'El usuario no fue encontrado.',
        default: 'No se pudo actualizar el usuario. Intentá de nuevo.',
      }));
    }
  }
);
