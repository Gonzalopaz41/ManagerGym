import { createSlice } from '@reduxjs/toolkit';
import type { RoutinesState } from '../types/routines.types';
import {
  createRoutineThunk,
  deleteRoutineThunk,
  fetchRoutineDetailThunk,
  fetchRoutinesThunk,
  updateRoutineStatusThunk,
  updateRoutineThunk,
} from './routines.thunk';

const initialState: RoutinesState = {
  routines: [],
  detail: null,
  loading: false,
  detailLoading: false,
  error: null,
};

const routinesSlice = createSlice({
  name: 'routines',
  initialState,
  reducers: {
    clearRoutinesError: (state) => {
      state.error = null;
    },
    closeRoutineDetail: (state) => {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // listado
      .addCase(fetchRoutinesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutinesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = action.payload;
      })
      .addCase(fetchRoutinesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // detalle
      .addCase(fetchRoutineDetailThunk.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchRoutineDetailThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchRoutineDetailThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      })
      // create — la respuesta ya trae la rutina completa. Queda activa y el
      // backend desactiva la anterior, pero esa no viene en la respuesta,
      // así que el flag del resto se baja acá.
      .addCase(createRoutineThunk.fulfilled, (state, action) => {
        state.routines.forEach((routine) => {
          routine.isActive = false;
        });
        state.routines.unshift(action.payload);
      })
      .addCase(createRoutineThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // update — conserva el id, así que se reemplaza en su lugar.
      .addCase(updateRoutineThunk.fulfilled, (state, action) => {
        const idx = state.routines.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.routines[idx] = action.payload;
        if (state.detail?.id === action.payload.id) state.detail = action.payload;
      })
      .addCase(updateRoutineThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // estado activo/inactivo
      .addCase(updateRoutineStatusThunk.fulfilled, (state, action) => {
        const { routineId, isActive } = action.meta.arg;
        state.routines.forEach((routine) => {
          if (routine.id === routineId) routine.isActive = isActive;
          // Activar una rutina desactiva el resto en la misma operación.
          else if (isActive) routine.isActive = false;
        });
        if (state.detail?.id === routineId) state.detail.isActive = isActive;
      })
      .addCase(updateRoutineStatusThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // delete
      .addCase(deleteRoutineThunk.fulfilled, (state, action) => {
        state.routines = state.routines.filter((r) => r.id !== action.payload);
        if (state.detail?.id === action.payload) state.detail = null;
      })
      .addCase(deleteRoutineThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearRoutinesError, closeRoutineDetail } = routinesSlice.actions;
export default routinesSlice.reducer;
