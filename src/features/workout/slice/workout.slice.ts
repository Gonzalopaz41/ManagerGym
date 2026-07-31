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
        state.categories.push(action.payload);
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        // El PATCH no documenta su respuesta, así que se aplica lo que enviamos.
        const { categoryId, payload } = action.meta.arg;
        const category = state.categories.find((c) => c.id === categoryId);
        if (!category || !payload.name) return;

        category.name = payload.name;

        // El listado de ejercicios trae category embebido: sin esto la tabla
        // seguiría mostrando el nombre viejo hasta el próximo refetch.
        state.exercises.forEach((exercise) => {
          if (exercise.categoryId === categoryId) {
            exercise.category = { id: categoryId, name: payload.name! };
          }
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
      // create y update — el POST devuelve el ejercicio sin su category
      // embebido y el PATCH no documenta su respuesta, así que el store no se
      // escribe con ellas: el componente refetchea el listado, que sí la trae.
      .addCase(createExerciseThunk.rejected, (state, action) => {
        state.error = action.payload as string;
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
