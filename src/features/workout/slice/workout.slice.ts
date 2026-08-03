import { createSlice } from '@reduxjs/toolkit';
import type { WorkoutState } from '../types/workout.types';
import {
  createCategoryThunk,
  createExerciseThunk,
  deleteExerciseThunk,
  fetchCategoriesThunk,
  fetchExercisesThunk,
  updateCategoryThunk,
  updateExerciseThunk,
} from './workout.thunk';

const initialState: WorkoutState = {
  categories: [],
  exercises: [],
  loading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    clearWorkoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // categorías
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        // La respuesta trae además un `exercises` vacío que el store no usa.
        const { id, name } = action.payload;
        state.categories.push({ id, name });
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const { id, name } = action.payload;
        const category = state.categories.find((c) => c.id === id);
        if (category) category.name = name;

        // El listado de ejercicios trae category embebido y la respuesta del
        // PATCH no incluye esos ejercicios, así que se sincroniza acá.
        state.exercises.forEach((exercise) => {
          if (exercise.categoryId === id) exercise.category = { id, name };
        });
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // ejercicios
      .addCase(fetchExercisesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercisesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercisesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create y update — ambas respuestas traen el ejercicio con su category,
      // con la misma forma que el GET, así que se escriben directo.
      .addCase(createExerciseThunk.fulfilled, (state, action) => {
        state.exercises.push(action.payload);
      })
      .addCase(createExerciseThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateExerciseThunk.fulfilled, (state, action) => {
        const idx = state.exercises.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.exercises[idx] = action.payload;
      })
      .addCase(updateExerciseThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // delete
      .addCase(deleteExerciseThunk.fulfilled, (state, action) => {
        state.exercises = state.exercises.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteExerciseThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearWorkoutError } = workoutSlice.actions;
export default workoutSlice.reducer;
