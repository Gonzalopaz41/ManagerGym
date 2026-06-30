import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/slice/auth.slice';
import clientsReducer from '../features/clients/slice/clients.slice';
import paymentsReducer from '../features/payments/slice/payments.slice';
import dashboardReducer from '../features/dashboard/slice/dashboard.slice';
import { usersReducer } from '../features/users';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    payments: paymentsReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
