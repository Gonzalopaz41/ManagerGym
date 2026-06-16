export interface DashboardStats {
  totalClients: number;
  activeMembers: number;
  expiredMembers: number;
  archivedMembers: number;
}

export interface DashboardPayment {
  id: string;
  amount: number;
  method: 'cash' | 'transfer';
  paymentDate: string;
  status: 'active' | 'expired' | 'archived';
}

export interface DashboardState {
  stats: DashboardStats | null;
  recentPayments: DashboardPayment[];
  loading: boolean;
  error: string | null;
}
