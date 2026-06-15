import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, CreditCard, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { clientsApi } from '../api/clients.api';
import PaymentFormDialog from '@/shared/components/PaymentFormDialog';
import { archivePaymentThunk } from '@/features/payments';
import type { Client, Payment } from '../types/clients.types';

const statusConfig: Record<Payment['status'], { label: string; className: string }> = {
  active:   { label: 'Activo',    className: 'bg-[#00cc8820] text-[#00cc88] border border-[#00cc8840]' },
  expired:  { label: 'Vencido',   className: 'bg-[#ff444420] text-[#ff4444] border border-[#ff444440]' },
  archived: { label: 'Archivado', className: 'bg-[#22222280] text-[#888888] border border-[#333333]'   },
};

const methodLabel: Record<Payment['method'], string> = {
  cash:     'Efectivo',
  transfer: 'Transferencia',
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);

const getExpirationDate = (paymentDate: string) => {
  const d = new Date(paymentDate);
  d.setDate(d.getDate() + 30);
  return formatDate(d.toISOString());
};

interface InfoRowProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3">
    <Icon size={15} className="text-[#888888] mt-0.5 shrink-0" />
    <div>
      <p className="text-xs text-[#888888]">{label}</p>
      <p className="text-sm text-white mt-0.5">{value}</p>
    </div>
  </div>
);

const SkeletonProfile = () => (
  <div className="p-6 max-w-[1200px] mx-auto">
    <div className="h-5 w-36 bg-[#1a1a1a] rounded animate-pulse mb-8" />
    <div className="h-8 w-64 bg-[#1a1a1a] rounded animate-pulse mb-2" />
    <div className="h-4 w-40 bg-[#1a1a1a] rounded animate-pulse mb-8" />
    <div className="border border-[#222222] rounded-[8px] bg-[#111111] p-5 mb-8">
      <div className="h-5 w-44 bg-[#1a1a1a] rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-4 w-4 bg-[#1a1a1a] rounded animate-pulse mt-0.5 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-16 bg-[#1a1a1a] rounded animate-pulse" />
              <div className="h-4 w-32 bg-[#1a1a1a] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ClientProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const clientFromStore = useAppSelector((state) =>
    state.clients.clients.find((c) => c.id === id)
  );

  const [client, setClient] = useState<Client | null>(clientFromStore ?? null);
  const [loading, setLoading] = useState(!clientFromStore);
  const [error, setError] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  useEffect(() => {
    if (clientFromStore) {
      setClient(clientFromStore);
      setLoading(false);
      return;
    }
    if (!id) return;

    setLoading(true);
    clientsApi
      .search(id)
      .then(({ data }) => {
        const found = Array.isArray(data) ? data[0] : (data as Client);
        if (found) setClient(found);
        else setError('Cliente no encontrado');
      })
      .catch((err) => {
        if (err?.response?.status === 401) navigate('/login', { replace: true });
        else setError('No se pudo cargar el perfil del cliente');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleArchive = async (paymentId: string) => {
    setArchivingId(paymentId);
    setArchiveError(null);
    const action = await dispatch(archivePaymentThunk(paymentId));
    setArchivingId(null);

    if (action.meta.requestStatus === 'fulfilled') {
      setClient((prev) =>
        prev
          ? {
              ...prev,
              payments: prev.payments.map((p) =>
                p.id === paymentId ? { ...p, status: 'archived' } : p
              ),
            }
          : null
      );
    } else {
      setArchiveError((action.payload as string) ?? 'Error al archivar el pago');
    }
  };

  const refreshClient = () => {
    if (!id) return;
    clientsApi.search(id).then(({ data }) => {
      const found = Array.isArray(data) ? data[0] : (data as Client);
      if (found) setClient(found);
    });
  };

  if (loading) return <SkeletonProfile />;

  if (error || !client) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Volver a clientes
        </Link>
        <p className="text-sm text-[#ff4444]">{error ?? 'Cliente no encontrado'}</p>
      </div>
    );
  }

  const sortedPayments = [...client.payments].sort(
    (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  );
  const latestStatus = sortedPayments[0]?.status ?? null;

  return (
    <div className="p-6 max-w-[1200px] mx-auto">

      {/* Back */}
      <Link
        to="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Volver a clientes
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{client.fullname}</h1>
          <p className="text-sm text-[#888888] mt-1">
            Miembro desde {formatDate(client.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {latestStatus && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-xs font-medium ${statusConfig[latestStatus].className}`}
            >
              {statusConfig[latestStatus].label}
            </span>
          )}
          <button
            onClick={() => setPaymentDialogOpen(true)}
            className="h-9 px-4 rounded-[6px] bg-white text-black text-sm font-medium hover:bg-[#e0e0e0] transition-colors flex items-center gap-2"
          >
            <CreditCard size={15} />
            Nuevo pago
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="border border-[#222222] rounded-[8px] bg-[#111111] p-5 mb-8">
        <h2 className="text-[15px] font-semibold text-white mb-4">Información del cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Phone}    label="Teléfono"            value={String(client.phone)} />
          <InfoRow icon={Mail}     label="Email"               value={client.email    ?? '—'} />
          <InfoRow icon={MapPin}   label="Dirección"           value={client.address  ?? '—'} />
          <InfoRow icon={Calendar} label="Fecha de nacimiento" value={client.birth_date ? formatDate(client.birth_date) : '—'} />
          {client.observation && (
            <div className="sm:col-span-2">
              <InfoRow icon={FileText} label="Observaciones" value={client.observation} />
            </div>
          )}
        </div>
      </div>

      {/* Payments */}
      <div>
        <h2 className="text-[15px] font-semibold text-white mb-4">
          Historial de pagos
          <span className="ml-2 text-xs font-normal text-[#888888]">({sortedPayments.length})</span>
        </h2>

        {archiveError && (
          <p className="text-sm text-[#ff4444] mb-3">{archiveError}</p>
        )}

        {sortedPayments.length === 0 ? (
          <div className="border border-[#222222] rounded-[8px] py-12 flex items-center justify-center">
            <p className="text-sm text-[#888888]">Sin pagos registrados</p>
          </div>
        ) : (
          <div className="border border-[#222222] rounded-[8px] overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-[#0a0a0a]">
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Fecha pago</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium hidden sm:table-cell">Vencimiento</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Monto</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium hidden md:table-cell">Método</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((payment) => {
                  const cfg = statusConfig[payment.status];
                  const isArchiving = archivingId === payment.id;
                  return (
                    <tr
                      key={payment.id}
                      className="border-t border-[#111111] hover:bg-[#0f0f0f] transition-colors"
                    >
                      <td className="px-4 py-3 text-white">{formatDate(payment.paymentDate)}</td>
                      <td className="px-4 py-3 text-[#888888] hidden sm:table-cell">
                        {getExpirationDate(payment.paymentDate)}
                      </td>
                      <td className="px-4 py-3 text-white">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-[#888888] hidden md:table-cell">{methodLabel[payment.method]}</td>
                      <td className="px-4 py-3">
                        {payment.status === 'expired' ? (
                          <select
                            value={payment.status}
                            onChange={() => handleArchive(payment.id)}
                            disabled={isArchiving}
                            className="h-7 rounded-[4px] bg-[#ff444420] text-[#ff4444] border border-[#ff444440] text-xs font-medium px-2 outline-none cursor-pointer disabled:opacity-50 transition-colors"
                          >
                            <option value="expired">Vencido</option>
                            <option value="archived">Archivar</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${cfg.className}`}>
                            {isArchiving ? '...' : cfg.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      <PaymentFormDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        clientId={client.id}
        clientName={client.fullname}
        onSuccess={() => {
          setPaymentDialogOpen(false);
          refreshClient();
        }}
      />

    </div>
  );
};

export default ClientProfilePage;
