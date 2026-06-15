import { useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { fetchClientsThunk, searchClientsThunk } from '../slice/clients.thunk';
import ClientsTable from '../components/ClientsTable';
import ClientFormDialog from '../components/ClientFormDialog';
import DeleteClientDialog from '../components/DeleteClientDialog';
import Pagination from '@/shared/components/Pagination';
import PaymentFormDialog from '@/shared/components/PaymentFormDialog';
import type { Client } from '../types/clients.types';

const LIMIT = 10;

const SkeletonRow = () => (
  <tr className="border-t border-[#111111]">
    {[140, 90, 120, 60, 40].map((w, i) => (
      <td key={i} className="px-4 py-3">
        <div className={`h-4 bg-[#1a1a1a] rounded animate-pulse`} style={{ width: w }} />
      </td>
    ))}
  </tr>
);

const ClientsPage = () => {
  const dispatch = useAppDispatch();
  const { clients, loading, error, page, last_page, total } = useAppSelector(
    (state) => state.clients
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [payingClient, setPayingClient] = useState<Client | null>(null);

  const isSearching = searchTerm.trim().length > 0;

  // Carga inicial y cambio de página
  useEffect(() => {
    if (!isSearching) {
      dispatch(fetchClientsThunk({ page: currentPage, limit: LIMIT }));
    }
  }, [currentPage]);

  // Búsqueda con debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      dispatch(fetchClientsThunk({ page: 1, limit: LIMIT }));
      setCurrentPage(1);
      return;
    }
    if (searchTerm.trim().length < 2) return;

    const timer = setTimeout(() => {
      dispatch(searchClientsThunk(searchTerm.trim()));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Clientes</h1>
        <Button
          onClick={() => setFormOpen(true)}
          className="h-9 px-4 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0 flex items-center gap-2"
        >
          <UserPlus size={15} />
          Nuevo cliente
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre..."
          className="h-9 w-full max-w-sm rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] pl-9 pr-3 text-sm outline-none transition-colors"
        />
      </div>

      {/* Estados */}
      {error && (
        <p className="text-sm text-[#ff4444] mb-4">{error}</p>
      )}

      {loading ? (
        <div className="border border-[#222222] rounded-[8px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0a0a0a]">
                {['Nombre', 'Teléfono', 'Email', 'Estado', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[#888888] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      ) : clients.length === 0 ? (
        <div className="border border-[#222222] rounded-[8px] py-16 flex flex-col items-center gap-2">
          <p className="text-[#888888] text-sm">
            {isSearching ? 'No se encontraron resultados.' : 'Todavía no hay clientes registrados.'}
          </p>
          {!isSearching && (
            <button
              onClick={() => setFormOpen(true)}
              className="text-sm text-white underline underline-offset-4 hover:text-[#888888] transition-colors"
            >
              Crear el primero
            </button>
          )}
        </div>
      ) : (
        <ClientsTable
          clients={clients}
          onEdit={handleEdit}
          onDelete={(c) => setDeletingClient(c)}
          onPay={(c) => setPayingClient(c)}
        />
      )}

      {/* Paginación */}
      {!isSearching && !loading && (
        <Pagination
          page={page}
          last_page={last_page}
          total={total}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}

      {/* Dialogs */}
      <ClientFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        client={editingClient}
      />
      <DeleteClientDialog
        open={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        client={deletingClient}
      />
      {payingClient && (
        <PaymentFormDialog
          open={!!payingClient}
          onClose={() => setPayingClient(null)}
          clientId={payingClient.id}
          clientName={payingClient.fullname}
          onSuccess={() => {
            setPayingClient(null);
            dispatch(fetchClientsThunk({ page: currentPage, limit: LIMIT }));
          }}
        />
      )}
    </div>
  );
};

export default ClientsPage;
