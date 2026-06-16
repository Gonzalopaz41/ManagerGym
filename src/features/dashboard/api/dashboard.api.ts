import { api } from '@/shared/api/axios';

export const dashboardApi = {
  getClientTotal: () =>
    api.get('/clients', { params: { limit: 1, page: 1 } }),

  getPaymentTotal: (status: 'active' | 'expired' | 'archived') =>
    api.get('/payments', { params: { status, limit: 1, page: 1 } }),

  getAllPayments: () =>
    api.get('/payments', { params: { limit: 200, page: 1 } }),
};
