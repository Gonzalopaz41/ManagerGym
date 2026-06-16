import type { DashboardPayment } from '../types/dashboard.types';

const statusConfig: Record<DashboardPayment['status'], { label: string; className: string }> = {
  active:   { label: 'Activo',    className: 'bg-[#00cc8820] text-[#00cc88] border border-[#00cc8840]' },
  expired:  { label: 'Vencido',   className: 'bg-[#ff444420] text-[#ff4444] border border-[#ff444440]' },
  archived: { label: 'Archivado', className: 'bg-[#22222280] text-[#888888] border border-[#333333]'   },
};

const methodLabel: Record<DashboardPayment['method'], string> = {
  cash:     'Efectivo',
  transfer: 'Transferencia',
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);

interface Props {
  payments: DashboardPayment[];
}

const RecentPaymentsList = ({ payments }: Props) => {
  const recent = payments.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="border border-[#222222] rounded-[8px] py-12 flex items-center justify-center">
        <p className="text-sm text-[#888888]">Sin pagos registrados</p>
      </div>
    );
  }

  return (
    <div className="border border-[#222222] rounded-[8px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="bg-[#0a0a0a]">
              <th className="text-left px-4 py-3 text-[#888888] font-medium">Fecha</th>
              <th className="text-left px-4 py-3 text-[#888888] font-medium">Monto</th>
              <th className="text-left px-4 py-3 text-[#888888] font-medium hidden sm:table-cell">Método</th>
              <th className="text-left px-4 py-3 text-[#888888] font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => {
              const cfg = statusConfig[p.status];
              return (
                <tr key={p.id} className="border-t border-[#111111] hover:bg-[#0f0f0f] transition-colors">
                  <td className="px-4 py-3 text-white">{formatDate(p.paymentDate)}</td>
                  <td className="px-4 py-3 text-white">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-[#888888] hidden sm:table-cell">{methodLabel[p.method]}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPaymentsList;
