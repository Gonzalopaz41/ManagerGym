import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { LoginPage, refreshThunk } from '@/features/auth';
import { ClientsPage, ClientProfilePage } from '@/features/clients';
import { DashboardPage } from '@/features/dashboard';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import AppLayout from '@/shared/components/AppLayout';

const AppRouter = () => {
  const dispatch = useAppDispatch();
  const { accessToken, isInitializing } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitializing) {
      dispatch(refreshThunk());
    }
  }, []);

  if (isInitializing) {
    return <div className="min-h-screen bg-[#000000]" />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={accessToken ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Rutas autenticadas */}
      <Route element={accessToken ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientProfilePage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={accessToken ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
