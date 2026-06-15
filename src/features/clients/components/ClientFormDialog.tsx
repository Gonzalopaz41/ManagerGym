import { useEffect, useState } from 'react';
import { Dialog } from 'radix-ui';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/shared/hooks/redux.hook';
import { createClientThunk, updateClientThunk } from '../slice/clients.thunk';
import { fetchClientsThunk } from '../slice/clients.thunk';
import type { Client, CreateClientPayload } from '../types/clients.types';

interface Props {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
}

const emptyForm = {
  fullname: '',
  phone: '',
  email: '',
  address: '',
  birth_date: '',
  observation: '',
};

const inputClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors';

const labelClass = 'text-[13px] font-medium text-white';

const ClientFormDialog = ({ open, onClose, client }: Props) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!client;

  useEffect(() => {
    if (client) {
      setForm({
        fullname:    client.fullname            ?? '',
        phone:       String(client.phone)       ?? '',
        email:       client.email               ?? '',
        address:     client.address             ?? '',
        birth_date:  client.birth_date?.slice(0, 10) ?? '',
        observation: client.observation         ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [client, open]);

  const set = (field: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: CreateClientPayload = {
      fullname: form.fullname.trim(),
      phone: Number(form.phone),
      ...(form.email     && { email:       form.email.trim()     }),
      ...(form.address   && { address:     form.address.trim()   }),
      ...(form.birth_date && { birth_date: form.birth_date       }),
      ...(form.observation && { observation: form.observation.trim() }),
    };

    const action = isEdit
      ? await dispatch(updateClientThunk({ id: client!.id, payload }))
      : await dispatch(createClientThunk(payload));

    setSubmitting(false);

    if (action.meta.requestStatus === 'rejected') {
      setError(action.payload as string);
      return;
    }

    if (!isEdit) {
      dispatch(fetchClientsThunk({ page: 1, limit: 10 }));
    }
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#111111] border border-[#222222] rounded-[8px] p-5 z-50 focus:outline-none">

          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white">
              {isEdit ? 'Editar cliente' : 'Nuevo cliente'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-[#888888] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Nombre completo *</label>
              <input
                type="text"
                value={form.fullname}
                onChange={set('fullname')}
                placeholder="Ej: Carlos Pérez"
                maxLength={30}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Teléfono *</label>
              <input
                type="number"
                value={form.phone}
                onChange={set('phone')}
                placeholder="Ej: 3811234567"
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="email@ejemplo.com"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Dirección</label>
              <input
                type="text"
                value={form.address}
                onChange={set('address')}
                placeholder="Ej: San Martín 333"
                maxLength={30}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Fecha de nacimiento</label>
              <input
                type="date"
                value={form.birth_date}
                onChange={set('birth_date')}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Observaciones</label>
              <textarea
                value={form.observation}
                onChange={set('observation')}
                placeholder="Objetivos, lesiones, notas..."
                maxLength={500}
                rows={3}
                className="w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 py-2 text-sm outline-none transition-colors resize-none"
              />
            </div>

            {error && <p className="text-sm text-[#ff4444]">{error}</p>}

            <div className="flex gap-3 mt-1">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 h-9 rounded-[6px] bg-transparent border border-[#222222] text-white hover:border-[#444444] text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting || !form.fullname || !form.phone}
                className="flex-1 h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Guardando...
                  </span>
                ) : isEdit ? 'Guardar cambios' : 'Crear cliente'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ClientFormDialog;
