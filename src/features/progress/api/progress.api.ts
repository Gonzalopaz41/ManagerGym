import { api } from '@/shared/api/axios';
import type { CreateProgressPayload } from '../types/progress.types';

export const progressApi = {
  getByClient: (clientId: string) =>
    api.get(`/clients/${clientId}/progress`),

  create: (clientId: string, payload: CreateProgressPayload) =>
    api.post(`/clients/${clientId}/progress`, payload),
};
