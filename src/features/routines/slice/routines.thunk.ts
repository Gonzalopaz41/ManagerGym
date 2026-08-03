import { createAsyncThunk } from '@reduxjs/toolkit';
import { routinesApi } from '../api/routines.api';
import { getApiError } from '@/shared/helpers/apiError';
import type { CreateRoutinePayload } from '../types/routines.types';

export const fetchRoutinesThunk = createAsyncThunk(
  'routines/fetchByClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const { data } = await routinesApi.getByClient(clientId);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'El cliente no fue encontrado.',
        default: 'No se pudieron cargar las rutinas.',
      }));
    }
  }
);

export const fetchRoutineDetailThunk = createAsyncThunk(
  'routines/fetchDetail',
  async (routineId: string, { rejectWithValue }) => {
    try {
      const { data } = await routinesApi.getById(routineId);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'La rutina no fue encontrada.',
        default: 'No se pudo cargar el detalle de la rutina.',
      }));
    }
  }
);

export const createRoutineThunk = createAsyncThunk(
  'routines/create',
  async (
    { clientId, payload }: { clientId: string; payload: CreateRoutinePayload },
    { rejectWithValue }
  ) => {
    try {
      // Queda activa y desactiva la anterior en la misma operación.
      const { data } = await routinesApi.create(clientId, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'Los datos de la rutina son inválidos.',
        404: 'El cliente no fue encontrado.',
        default: 'No se pudo crear la rutina. Intentá de nuevo.',
      }));
    }
  }
);

export const updateRoutineThunk = createAsyncThunk(
  'routines/update',
  async (
    { routineId, payload }: { routineId: string; payload: CreateRoutinePayload },
    { rejectWithValue }
  ) => {
    try {
      // Update in-place transaccional: conserva id, createdAt e isActive.
      // El body va completo, no admite parciales.
      const { data } = await routinesApi.update(routineId, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'Los datos de la rutina son inválidos.',
        404: 'La rutina no fue encontrada.',
        default: 'No se pudo actualizar la rutina. Intentá de nuevo.',
      }));
    }
  }
);

export const updateRoutineStatusThunk = createAsyncThunk(
  'routines/updateStatus',
  async (
    { routineId, isActive }: { routineId: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await routinesApi.updateStatus(routineId, isActive);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'La rutina no fue encontrada.',
        default: 'No se pudo cambiar el estado de la rutina.',
      }));
    }
  }
);

export const deleteRoutineThunk = createAsyncThunk(
  'routines/delete',
  async (routineId: string, { rejectWithValue }) => {
    try {
      await routinesApi.remove(routineId);
      return routineId;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'La rutina no fue encontrada.',
        default: 'No se pudo eliminar la rutina. Intentá de nuevo.',
      }));
    }
  }
);
