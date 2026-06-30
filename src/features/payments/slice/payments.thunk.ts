import { createAsyncThunk } from '@reduxjs/toolkit';
import { paymentsApi } from '../api/payments.api';
import { getApiError } from '@/shared/helpers/apiError';
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
      return rejectWithValue(getApiError(err, {
        400: 'Los datos del pago son inválidos.',
        404: 'El cliente no fue encontrado.',
        default: 'No se pudo registrar el pago. Intentá de nuevo.',
      }));
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
      return rejectWithValue(getApiError(err, {
        400: 'Solo podés archivar pagos vencidos.',
        404: 'El pago no fue encontrado.',
        default: 'No se pudo archivar el pago. Intentá de nuevo.',
      }));
    }
  }
);
