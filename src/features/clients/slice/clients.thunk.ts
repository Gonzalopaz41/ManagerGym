import { createAsyncThunk } from '@reduxjs/toolkit';
import { clientsApi } from '../api/clients.api';
import { getApiError } from '@/shared/helpers/apiError';
import type { CreateClientPayload, UpdateClientPayload } from '../types/clients.types';

export const fetchClientsThunk = createAsyncThunk(
  'clients/fetchAll',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const { data } = await clientsApi.getAll(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        default: 'No se pudieron cargar los clientes.',
      }));
    }
  }
);

export const searchClientsThunk = createAsyncThunk(
  'clients/search',
  async (term: string, { rejectWithValue }) => {
    try {
      const { data } = await clientsApi.search(term);
      return Array.isArray(data) ? data : [data];
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'No se encontraron clientes con ese criterio.',
        default: 'Error al buscar clientes.',
      }));
    }
  }
);

export const createClientThunk = createAsyncThunk(
  'clients/create',
  async (payload: CreateClientPayload, { rejectWithValue }) => {
    try {
      const { data } = await clientsApi.create(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'El email ya está registrado o los datos ingresados son inválidos.',
        default: 'No se pudo crear el cliente. Intentá de nuevo.',
      }));
    }
  }
);

export const updateClientThunk = createAsyncThunk(
  'clients/update',
  async ({ id, payload }: { id: string; payload: UpdateClientPayload }, { rejectWithValue }) => {
    try {
      const { data } = await clientsApi.update(id, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'El email ya está en uso o los datos son inválidos.',
        404: 'El cliente no fue encontrado.',
        default: 'No se pudo actualizar el cliente. Intentá de nuevo.',
      }));
    }
  }
);

export const deleteClientThunk = createAsyncThunk(
  'clients/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await clientsApi.remove(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'El cliente no fue encontrado.',
        default: 'No se pudo eliminar el cliente. Intentá de nuevo.',
      }));
    }
  }
);
