import {api} from '@/shared/api/axios';
import type { CreateUserPayload, UpdateUserPayload } from '../types/users.types';

export const usersApi = {
  getAll: () => api.get('/auth/users'),
  create: (payload: CreateUserPayload) => api.post('/auth/register', payload),
  update: (id: string, payload: UpdateUserPayload) => api.patch(`/auth/users/${id}`, payload),
};
