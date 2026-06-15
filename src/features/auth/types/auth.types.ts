export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isInitializing: boolean;
}
