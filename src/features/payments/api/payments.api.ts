import { api } from '@/shared/api/axios';
import type { CreatePaymentPayload } from '../types/payments.types';

export const paymentsApi = {
  create: (clientId: string, payload: CreatePaymentPayload) =>
    api.post(`/payments/${clientId}`, payload),

  archive: (paymentId: string) =>
    api.patch(`/payments/${paymentId}/archive`),
};
