import { useEffect, useState } from 'react';
import { Dialog } from 'radix-ui';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import {
  createExerciseThunk,
  fetchExercisesThunk,
  updateExerciseThunk,
} from '../slice/workout.thunk';
import { clearWorkoutError } from '../slice/workout.slice';
import type { CreateExercisePayload, Exercise } from '../types/workout.types';

interface Props {
  open: boolean;
  onClose: () => void;
  exercise?: Exercise | null;
}

const emptyForm = { name: '', description: '', categoryId: '' };

const inputClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors';

const selectClass = `${inputClass} cursor-pointer`;

const labelClass = 'text-[13px] font-medium text-white';

const ExerciseFormDialog = ({ open, onClose, exercise }: Props) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.workout.categories);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!exercise;

  useEffect(() => {
    if (exercise) {
      setForm({
        name: exercise.name ?? '',
        description: exercise.description ?? '',
        categoryId: exercise.categoryId ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
    // El slice también guarda el error del rechazo y WorkoutPage lo muestra a
    // nivel de página: sin esto quedaría pegado ahí al cancelar el diálogo.
    dispatch(clearWorkoutError());
  }, [exercise, open]);

  const set =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: CreateExercisePayload = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      ...(form.description && { description: form.description.trim() }),
    };

    const action = isEdit
      ? await dispatch(updateExerciseThunk({ exerciseId: exercise!.id, payload }))
      : await dispatch(createExerciseThunk(payload));

    setSubmitting(false);

    if (action.meta.requestStatus === 'rejected') {
      setError(action.payload as string);
      return;
    }

    // Ni el POST ni el PATCH devuelven el category embebido que la tabla usa.
    dispatch(fetchExercisesThunk());
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#111111] border border-[#222222] rounded-[8px] p-5 z-50 focus:outline-none">

          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white">
              {isEdit ? 'Editar ejercicio' : 'Nuevo ejercicio'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-[#888888] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Ej: dominadas"
                maxLength={50}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Categoría *</label>
              <select
                value={form.categoryId}
                onChange={set('categoryId')}
                required
                disabled={categories.length === 0}
                className={`${selectClass} disabled:opacity-50`}
              >
                <option value="">Seleccioná una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-[#ffaa00]">
                  No hay categorías cargadas. Creá una con el botón "Nueva categoría".
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Descripción</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Ej: dominadas con agarre prono"
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
                disabled={submitting || !form.name || !form.categoryId}
                className="flex-1 h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Guardando...
                  </span>
                ) : isEdit ? 'Guardar cambios' : 'Crear ejercicio'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ExerciseFormDialog;
