import { createAsyncThunk } from '@reduxjs/toolkit';
import { progressApi } from '../api/progress.api';
import { getApiError } from '@/shared/helpers/apiError';
import type { CreateProgressPayload } from '../types/progress.types';

export const fetchProgressThunk = createAsyncThunk(
  'progress/fetchByClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const { data } = await progressApi.getByClient(clientId);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'El cliente no fue encontrado.',
        default: 'No se pudo cargar el progreso del cliente.',
      }));
    }
  }
);

export const fetchProgressByExerciseThunk = createAsyncThunk(
  'progress/fetchByExercise',
  async (
    { clientId, exerciseId }: { clientId: string; exerciseId: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await progressApi.getByExercise(clientId, exerciseId);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'El cliente no fue encontrado.',
        default: 'No se pudo cargar el progreso de ese ejercicio.',
      }));
    }
  }
);

export const createProgressThunk = createAsyncThunk(
  'progress/create',
  async (
    { clientId, payload }: { clientId: string; payload: CreateProgressPayload },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await progressApi.create(clientId, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'Los datos del registro son inválidos.',
        404: 'El cliente o el ejercicio no fueron encontrados.',
        default: 'No se pudo registrar el progreso. Intentá de nuevo.',
      }));
    }
  }
);
