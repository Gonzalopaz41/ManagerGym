import { createAsyncThunk } from '@reduxjs/toolkit';
import { clientsApi } from '../api/clients.api';
import type { CreateClientPayload, UpdateClientPayload } from '../types/clients.types';

const reject = (error: any) =>
  error.response?.data?.message ?? 'Ocurrió un error inesperado';

export const fetchClientsThunk = createAsyncThunk(
  'clients/fetchAll',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const { data } = await clientsApi.getAll(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(reject(error));
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
      return rejectWithValue(reject(error));
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
      return rejectWithValue(reject(error));
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
      return rejectWithValue(reject(error));
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
      return rejectWithValue(reject(error));
    }
  }
);
