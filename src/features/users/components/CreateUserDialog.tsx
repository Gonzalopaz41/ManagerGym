import { useEffect, useState, type FormEvent } from 'react';
import { Dialog } from 'radix-ui';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/shared/hooks/redux.hook';
import { createUserThunk, fetchUsersThunk } from '../slice/users.thunk';
import type { UserRole } from '@/features/auth/types/auth.types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyForm = { userName: '', password: '', Role: 'base' as UserRole };

const inputClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors';

const selectClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white px-3 text-sm outline-none transition-colors cursor-pointer';

const labelClass = 'text-[13px] font-medium text-white';

const CreateUserDialog = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setError(null);
    }
  }, [open]);

  const set =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const action = await dispatch(createUserThunk({
      userName: form.userName.trim(),
      password: form.password,
      Role: form.Role,
    }));

    setSubmitting(false);

    if (action.meta.requestStatus === 'rejected') {
      setError(action.payload as string);
      return;
    }

    dispatch(fetchUsersThunk());
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#111111] border border-[#222222] rounded-[8px] p-5 z-50 focus:outline-none">

          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white">
              Nuevo usuario
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-[#888888] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Nombre de usuario *</label>
              <input
                type="text"
                value={form.userName}
                onChange={set('userName')}
                placeholder="Ej: juan_gomez"
                minLength={4}
                maxLength={20}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Contraseña *</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Mín. 4 caracteres"
                minLength={4}
                maxLength={20}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Rol</label>
              <select value={form.Role} onChange={set('Role')} className={selectClass}>
                <option value="base">Base</option>
                <option value="admin">Admin</option>
              </select>
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
                    Creando...
                  </span>
                ) : 'Crear usuario'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateUserDialog;
