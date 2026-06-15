import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/shared/hooks/redux.hook';
import { deleteClientThunk } from '../slice/clients.thunk';
import type { Client } from '../types/clients.types';

interface Props {
  open: boolean;
  onClose: () => void;
  client: Client | null;
}

const DeleteClientDialog = ({ open, onClose, client }: Props) => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!client) return;
    setSubmitting(true);
    setError(null);

    const action = await dispatch(deleteClientThunk(client.id));
    setSubmitting(false);

    if (action.meta.requestStatus === 'rejected') {
      setError(action.payload as string);
      return;
    }
    onClose();
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#111111] border border-[#222222] rounded-[8px] p-5 z-50 focus:outline-none">

          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-base font-semibold text-white">
              Eliminar cliente
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-[#888888] hover:text-white transition-colors mt-0.5">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-sm text-[#888888] mb-1">
            ¿Estás seguro de que querés eliminar a{' '}
            <span className="text-white font-medium">{client?.fullname}</span>?
          </p>
          <p className="text-xs text-[#444444] mb-5">Esta acción no se puede deshacer.</p>

          {error && <p className="text-sm text-[#ff4444] mb-4">{error}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-[6px] bg-transparent border border-[#222222] text-white hover:border-[#444444] text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 h-9 rounded-[6px] bg-transparent border border-[#ff4444] text-[#ff4444] hover:bg-[#ff444415] text-sm font-medium"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Eliminando...
                </span>
              ) : 'Eliminar'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteClientDialog;
