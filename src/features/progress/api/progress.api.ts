import { api } from '@/shared/api/axios';
import type { CreateProgressPayload } from '../types/progress.types';

export const progressApi = {
  getByClient: (clientId: string) =>
    api.get(`/clients/${clientId}/progress`),

  getByExercise: (clientId: string, exerciseId: string) =>
    api.get(`/clients/${clientId}/progress/${exerciseId}`),

  create: (clientId: string, payload: CreateProgressPayload) =>
    api.post(`/clients/${clientId}/progress`, payload),
};
