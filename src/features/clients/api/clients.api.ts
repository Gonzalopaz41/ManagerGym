import { api } from '@/shared/api/axios';
import type {
  Client,
  CreateClientPayload,
  PaginatedClients,
  UpdateClientPayload,
} from '../types/clients.types';

export const clientsApi = {
  getAll: (params: { page: number; limit: number }) =>
    api.get<PaginatedClients>('/clients', { params }),

  search: (term: string) =>
    api.get<Client | Client[]>(`/clients/${encodeURIComponent(term)}`),

  create: (payload: CreateClientPayload) =>
    api.post<Client>('/clients', payload),

  update: (id: string, payload: UpdateClientPayload) =>
    api.patch<Client>(`/clients/${id}`, payload),

  remove: (id: string) =>
    api.delete<{ message: string }>(`/clients/${id}`),
};
