import { useEffect } from 'react';
import { Users, UserCheck, AlertCircle, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { fetchDashboardThunk } from '../slice/dashboard.thunk';
import KpiCard from '../components/KpiCard';
import MembershipDonut from '../components/MembershipDonut';
import RevenueBarChart from '../components/RevenueBarChart';
import RecentPaymentsList from '../components/RecentPaymentsList';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, recentPayments, loading, error } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardThunk());
  }, [dispatch]);

  const now = new Date();
  const recaudacionDelMes = recentPayments
    .filter((p) => {
      const d = new Date(p.paymentDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-[#888888] mt-1">Resumen general del gimnasio</p>
      </div>

      {error && <p className="text-sm text-[#ff4444] mb-6">{error}</p>}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total clientes"
          value={stats?.totalClients ?? 0}
          icon={Users}
          loading={loading}
        />
        <KpiCard
          label="Socios activos"
          value={stats?.activeMembers ?? 0}
          icon={UserCheck}
          iconColor="#00cc88"
          loading={loading}
        />
        <KpiCard
          label="Membresías vencidas"
          value={stats?.expiredMembers ?? 0}
          icon={AlertCircle}
          iconColor="#ff4444"
          loading={loading}
        />
        <KpiCard
          label="Recaudación del mes"
          value={formatCurrency(recaudacionDelMes)}
          icon={DollarSign}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">

        {/* Donut */}
        <div className="border border-[#222222] rounded-[8px] bg-[#111111] p-5">
          <h2 className="text-[15px] font-semibold text-white mb-4">Estado de membresías</h2>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <div className="h-36 w-36 rounded-full bg-[#1a1a1a] animate-pulse" />
            </div>
          ) : (
            <MembershipDonut
              active={stats?.activeMembers ?? 0}
              expired={stats?.expiredMembers ?? 0}
              archived={stats?.archivedMembers ?? 0}
            />
          )}
        </div>

        {/* Bar chart */}
        <div className="lg:col-span-2 border border-[#222222] rounded-[8px] bg-[#111111] p-5">
          <h2 className="text-[15px] font-semibold text-white mb-4">Recaudación mensual</h2>
          {loading ? (
            <div className="h-[220px] flex items-end gap-2 px-2 pb-6">
              {[55, 80, 45, 90, 65, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#1a1a1a] rounded-t animate-pulse"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          ) : (
            <RevenueBarChart payments={recentPayments} />
          )}
        </div>
      </div>

      {/* Recent payments */}
      <div>
        <h2 className="text-[15px] font-semibold text-white mb-4">Últimos pagos registrados</h2>
        {loading ? (
          <div className="border border-[#222222] rounded-[8px] overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#111111]">
                    {[120, 90, 80, 70].map((w, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#1a1a1a] rounded animate-pulse" style={{ width: w }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <RecentPaymentsList payments={recentPayments} />
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
