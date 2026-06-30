export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type UserRole = 'admin' | 'base';

export interface JwtPayload {
  Role: UserRole;
  sub: string;
  iat: number;
  exp: number;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  isInitializing: boolean;
}
