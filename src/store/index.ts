import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/slice/auth.slice';
import clientsReducer from '../features/clients/slice/clients.slice';
import paymentsReducer from '../features/payments/slice/payments.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    payments: paymentsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
