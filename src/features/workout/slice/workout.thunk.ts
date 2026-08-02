import { createAsyncThunk } from '@reduxjs/toolkit';
import { workoutApi } from '../api/workout.api';
import { getApiError } from '@/shared/helpers/apiError';
import type {
  CreateCategoryPayload,
  CreateExercisePayload,
  UpdateCategoryPayload,
  UpdateExercisePayload,
} from '../types/workout.types';

export const fetchCategoriesThunk = createAsyncThunk(
  'workout/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await workoutApi.getCategories();
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        default: 'No se pudieron cargar las categorías.',
      }));
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  'workout/createCategory',
  async (payload: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      const { data } = await workoutApi.createCategory(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'Ya existe una categoría con ese nombre.',
        default: 'No se pudo crear la categoría. Intentá de nuevo.',
      }));
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'workout/updateCategory',
  async (
    { categoryId, payload }: { categoryId: string; payload: UpdateCategoryPayload },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await workoutApi.updateCategory(categoryId, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'Ya existe una categoría con ese nombre.',
        404: 'La categoría no fue encontrada.',
        default: 'No se pudo actualizar la categoría. Intentá de nuevo.',
      }));
    }
  }
);

export const fetchExercisesThunk = createAsyncThunk(
  'workout/fetchExercises',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await workoutApi.getExercises();
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        default: 'No se pudieron cargar los ejercicios.',
      }));
    }
  }
);

export const createExerciseThunk = createAsyncThunk(
  'workout/createExercise',
  async (payload: CreateExercisePayload, { rejectWithValue }) => {
    try {
      const { data } = await workoutApi.createExercise(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'Ya existe un ejercicio con ese nombre o esa descripción.',
        default: 'No se pudo crear el ejercicio. Intentá de nuevo.',
      }));
    }
  }
);

export const updateExerciseThunk = createAsyncThunk(
  'workout/updateExercise',
  async (
    { exerciseId, payload }: { exerciseId: string; payload: UpdateExercisePayload },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await workoutApi.updateExercise(exerciseId, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        400: 'Ya existe otro ejercicio con ese nombre.',
        404: 'El ejercicio no fue encontrado.',
        default: 'No se pudo actualizar el ejercicio. Intentá de nuevo.',
      }));
    }
  }
);

export const deleteExerciseThunk = createAsyncThunk(
  'workout/deleteExercise',
  async (exerciseId: string, { rejectWithValue }) => {
    try {
      await workoutApi.deleteExercise(exerciseId);
      return exerciseId;
    } catch (error: any) {
      return rejectWithValue(getApiError(error, {
        404: 'El ejercicio no fue encontrado.',
        default: 'No se pudo eliminar el ejercicio. Intentá de nuevo.',
      }));
    }
  }
);
