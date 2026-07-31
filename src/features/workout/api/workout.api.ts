import { api } from '@/shared/api/axios';
import type {
  CreateCategoryPayload,
  CreateExercisePayload,
  UpdateCategoryPayload,
  UpdateExercisePayload,
} from '../types/workout.types';

export const workoutApi = {
  getCategories: () =>
    api.get('/workout/categories'),

  createCategory: (payload: CreateCategoryPayload) =>
    api.post('/workout/categories', payload),

  updateCategory: (categoryId: string, payload: UpdateCategoryPayload) =>
    api.patch(`/workout/categories/${categoryId}`, payload),

  getExercises: () =>
    api.get('/workout/exercises'),

  getExercisesByCategory: (categoryId: string) =>
    api.get(`/workout/exercises/${categoryId}`),

  createExercise: (payload: CreateExercisePayload) =>
    api.post('/workout/exercises', payload),

  updateExercise: (exerciseId: string, payload: UpdateExercisePayload) =>
    api.patch(`/workout/exercises/${exerciseId}`, payload),

  deleteExercise: (exerciseId: string) =>
    api.delete(`/workout/exercises/${exerciseId}`),
};
