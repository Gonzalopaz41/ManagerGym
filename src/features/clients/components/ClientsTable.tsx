import { Link } from 'react-router';
import { CreditCard, Pencil, Trash2 } from 'lucide-react';
import type { Client, Payment } from '../types/clients.types';

interface Props {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onPay: (client: Client) => void;
}

const statusConfig: Record<Payment['status'], { label: string; className: string }> = {
  active:   { label: 'Activo',    className: 'bg-[#00cc8820] text-[#00cc88] border border-[#00cc8840]' },
  expired:  { label: 'Vencido',   className: 'bg-[#ff444420] text-[#ff4444] border border-[#ff444440]' },
  archived: { label: 'Archivado', className: 'bg-[#22222280] text-[#888888] border border-[#333333]'   },
};

const getLatestPayment = (client: Client): Payment | null => {
  if (!client.payments?.length) return null;
  return [...client.payments].sort(
    (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  )[0];
};

const getExpirationDate = (paymentDate: string) => {
  const d = new Date(paymentDate);
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const ClientsTable = ({ clients, onEdit, onDelete, onPay }: Props) => {
  return (
    <div className="border border-[#222222] rounded-[8px] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0a0a0a]">
            <th className="text-left px-4 py-3 text-[#888888] font-medium">Nombre</th>
            <th className="text-left px-4 py-3 text-[#888888] font-medium">Teléfono</th>
            <th className="text-left px-4 py-3 text-[#888888] font-medium hidden sm:table-cell">Email</th>
            <th className="text-left px-4 py-3 text-[#888888] font-medium">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const latest = getLatestPayment(client);
            const cfg = latest ? statusConfig[latest.status] : null;
            return (
              <tr
                key={client.id}
                className="border-t border-[#111111] hover:bg-[#0f0f0f] transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/clients/${client.id}`}
                    className="text-white hover:underline underline-offset-4 hover:text-[#888888] transition-colors"
                  >
                    {client.fullname}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#888888]">{client.phone}</td>
                <td className="px-4 py-3 text-[#888888] hidden sm:table-cell">
                  {client.email ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {cfg && latest ? (
                    <div className="flex flex-col gap-0.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium w-fit ${cfg.className}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-[#444444]">
                        Vence: {getExpirationDate(latest.paymentDate)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#444444] text-xs">Sin pagos</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onPay(client)}
                      className="text-[#888888] hover:text-[#00cc88] transition-colors p-1"
                      aria-label="Registrar pago"
                    >
                      <CreditCard size={15} />
                    </button>
                    <button
                      onClick={() => onEdit(client)}
                      className="text-[#888888] hover:text-white transition-colors p-1"
                      aria-label="Editar cliente"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(client)}
                      className="text-[#888888] hover:text-[#ff4444] transition-colors p-1"
                      aria-label="Eliminar cliente"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;
