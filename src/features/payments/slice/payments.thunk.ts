import { createAsyncThunk } from '@reduxjs/toolkit';
import { paymentsApi } from '../api/payments.api';
import type { CreatePaymentPayload } from '../types/payments.types';

export const createPaymentThunk = createAsyncThunk(
  'payments/create',
  async (
    { clientId, payload }: { clientId: string; payload: CreatePaymentPayload },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await paymentsApi.create(clientId, payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? 'Error al registrar el pago'
      );
    }
  }
);

export const archivePaymentThunk = createAsyncThunk(
  'payments/archive',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      await paymentsApi.archive(paymentId);
      return paymentId;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? 'Error al archivar el pago'
      );
    }
  }
);
