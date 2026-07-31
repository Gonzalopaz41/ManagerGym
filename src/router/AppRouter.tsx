import { Navigate, Route, Routes } from 'react-router';
import { LoginPage } from '@/features/auth';
import { ClientsPage, ClientProfilePage } from '@/features/clients';
import { DashboardPage } from '@/features/dashboard';
import { UsersPage } from '@/features/users';
import { WorkoutPage } from '@/features/workout';
import { useAppSelector } from '@/shared/hooks/redux.hook';
import AppLayout from '@/shared/components/AppLayout';

const AppRouter = () => {
  const { accessToken, role, isInitializing } = useAppSelector((state) => state.auth);

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
        <Route path="/workout" element={<WorkoutPage />} />
        <Route
          path="/users"
          element={role === 'admin' ? <UsersPage /> : <Navigate to="/dashboard" replace />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={accessToken ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
