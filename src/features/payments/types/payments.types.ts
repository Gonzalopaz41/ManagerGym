export interface CreatePaymentPayload {
  amount: number;
  method: 'cash' | 'transfer';
  paymentDate: string;
}

export interface PaymentsState {
  loading: boolean;
  error: string | null;
}
