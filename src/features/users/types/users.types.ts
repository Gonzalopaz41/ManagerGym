import type { UserRole } from '@/features/auth/types/auth.types';

export interface User {
  id: string;
  userName: string;
  Role: UserRole;
  isActive: boolean;
}

export interface CreateUserPayload {
  userName: string;
  password: string;
  Role?: UserRole;
}

export interface UpdateUserPayload {
  userName?: string;
  password?: string;
  Role?: UserRole;
  isActive?: boolean;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  success: string | null;
}
