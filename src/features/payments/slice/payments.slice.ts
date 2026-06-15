import { createSlice } from '@reduxjs/toolkit';
import type { PaymentsState } from '../types/payments.types';
import { archivePaymentThunk, createPaymentThunk } from './payments.thunk';

const initialState: PaymentsState = {
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(archivePaymentThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(archivePaymentThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
