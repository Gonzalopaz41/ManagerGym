import { createSlice } from '@reduxjs/toolkit';
import type { ClientsState } from '../types/clients.types';
import {
  createClientThunk,
  deleteClientThunk,
  fetchClientsThunk,
  searchClientsThunk,
  updateClientThunk,
} from './clients.thunk';

const initialState: ClientsState = {
  clients: [],
  total: 0,
  page: 1,
  last_page: 1,
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchClientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.last_page = action.payload.last_page;
      })
      .addCase(fetchClientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // search
      .addCase(searchClientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchClientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(searchClientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create — optimistic: refetch handled by component
      .addCase(createClientThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // update
      .addCase(updateClientThunk.fulfilled, (state, action) => {
        const idx = state.clients.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.clients[idx] = action.payload;
      })
      .addCase(updateClientThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // delete
      .addCase(deleteClientThunk.fulfilled, (state, action) => {
        state.clients = state.clients.filter((c) => c.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteClientThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = clientsSlice.actions;
export default clientsSlice.reducer;
