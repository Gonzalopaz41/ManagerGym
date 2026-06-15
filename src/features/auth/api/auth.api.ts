import { api } from '@/shared/api/axios';
import type { LoginCredentials, AuthTokens } from '../types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthTokens>('/auth/login', credentials),

  logout: () =>
    api.post<{ message: string }>('/auth/logout'),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string }>('/auth/refresh', { refresh_token: refreshToken }),
};
