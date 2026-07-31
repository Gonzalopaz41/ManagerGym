import { api } from '@/shared/api/axios';
import type { LoginCredentials, AuthTokens } from '../types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthTokens>('/auth/login', credentials),

  logout: () =>
    api.post<{ message: string }>('/auth/logout'),

  // refreshToken es opcional: el spec documenta solo accessToken, pero se
  // contempla por si el backend pasa a rotar el refresh token.
  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken?: string }>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    ),
};
