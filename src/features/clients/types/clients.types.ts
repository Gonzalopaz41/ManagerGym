export interface Payment {
  id: string;
  amount: number;
  method: 'cash' | 'transfer';
  paymentDate: string;
  status: 'active' | 'expired' | 'archived';
}

export interface Client {
  id: string;
  fullname: string;
  phone: number;
  email?: string;
  address?: string;
  birth_date?: string;
  observation?: string;
  isActive: boolean;
  createdAt: string;
  payments: Payment[];
}

export interface PaginatedClients {
  clients: Client[];
  total: number;
  page: number;
  last_page: number;
}

export interface CreateClientPayload {
  fullname: string;
  phone: number;
  email?: string;
  address?: string;
  birth_date?: string;
  observation?: string;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;

export interface ClientsState {
  clients: Client[];
  total: number;
  page: number;
  last_page: number;
  loading: boolean;
  error: string | null;
}
