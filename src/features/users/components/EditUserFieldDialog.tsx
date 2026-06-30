import { useEffect, useState } from 'react';
import { Dialog } from 'radix-ui';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/shared/hooks/redux.hook';
import { updateUserThunk } from '../slice/users.thunk';
import type { User } from '../types/users.types';
import type { UserRole } from '@/features/auth/types/auth.types';

export type EditableField = 'userName' | 'password' | 'Role';

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  field: EditableField;
}

const fieldConfig: Record<EditableField, { title: string; label: string; placeholder: string; type: string }> = {
  userName: { title: 'Editar nombre de usuario', label: 'Nuevo nombre de usuario', placeholder: 'Ej: juan_gomez',   type: 'text'     },
  password: { title: 'Cambiar contraseña',        label: 'Nueva contraseña',        placeholder: 'Mín. 4 caracteres', type: 'password' },
  Role:     { title: 'Cambiar rol',               label: 'Rol',                     placeholder: '',                  type: 'select'   },
};

const inputClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors';

const selectClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white px-3 text-sm outline-none transition-colors cursor-pointer';

const EditUserFieldDialog = ({ open, onClose, user, field }: Props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cfg = fieldConfig[field];

  useEffect(() => {
    if (open) {
      setValue(field === 'Role' ? user.Role : '');
      setError(null);
    }
  }, [open, field, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() && field !== 'Role') return;
    setError(null);
    setSubmitting(true);

    const payload = field === 'Role'
      ? { Role: value as UserRole }
      : { [field]: value.trim() };

    const action = await dispatch(updateUserThunk({ id: user.id, payload }));

    setSubmitting(false);

    if (action.meta.requestStatus === 'rejected') {
      setError(action.payload as string);
      return;
    }

    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#111111] border border-[#222222] rounded-[8px] p-5 z-50 focus:outline-none">

          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white">
              {cfg.title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-[#888888] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-white">{cfg.label}</label>

              {cfg.type === 'select' ? (
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={selectClass}
                >
                  <option value="base">Base</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <input
                  type={cfg.type}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={cfg.placeholder}
                  minLength={4}
                  maxLength={20}
                  required
                  className={inputClass}
                />
              )}
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
                disabled={submitting}
                className="flex-1 h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Guardando...
                  </span>
                ) : 'Guardar'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditUserFieldDialog;
