import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../api/dashboard.api';
import { getApiError } from '@/shared/helpers/apiError';
import type { DashboardStats, DashboardPayment } from '../types/dashboard.types';

export const fetchDashboardThunk = createAsyncThunk<
  { stats: DashboardStats; recentPayments: DashboardPayment[] },
  void
>(
  'dashboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const [clientsRes, activeRes, expiredRes, archivedRes, paymentsRes] = await Promise.all([
        dashboardApi.getClientTotal(),
        dashboardApi.getPaymentTotal('active'),
        dashboardApi.getPaymentTotal('expired'),
        dashboardApi.getPaymentTotal('archived'),
        dashboardApi.getAllPayments(),
      ]);

      return {
        stats: {
          totalClients:    clientsRes.data.total,
          activeMembers:   activeRes.data.total,
          expiredMembers:  expiredRes.data.total,
          archivedMembers: archivedRes.data.total,
        },
        recentPayments: paymentsRes.data.payments ?? [],
      };
    } catch (err: any) {
      return rejectWithValue(getApiError(err, {
        default: 'No se pudieron cargar los datos del dashboard.',
      }));
    }
  }
);
