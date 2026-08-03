import { api } from '@/shared/api/axios';
import type { CreateRoutinePayload } from '../types/routines.types';

export const routinesApi = {
  getByClient: (clientId: string) =>
    api.get(`/clients/${clientId}/routines`),

  getById: (routineId: string) =>
    api.get(`/routines/${routineId}`),

  create: (clientId: string, payload: CreateRoutinePayload) =>
    api.post(`/clients/${clientId}/routines`, payload),

  /** Body completo, no acepta parciales. Conserva id, createdAt e isActive. */
  update: (routineId: string, payload: CreateRoutinePayload) =>
    api.patch(`/routines/${routineId}`, payload),

  updateStatus: (routineId: string, isActive: boolean) =>
    api.patch(`/routines/${routineId}/status`, { isActive }),

  remove: (routineId: string) =>
    api.delete(`/routines/${routineId}`),
};
