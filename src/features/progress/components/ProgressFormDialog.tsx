import { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'radix-ui';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { fetchExercisesThunk } from '@/features/workout';
import type { Category, Exercise } from '@/features/workout';
import { createProgressThunk } from '../slice/progress.thunk';
import type { CreateProgressPayload } from '../types/progress.types';

interface Props {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
}

const today = () => new Date().toISOString().split('T')[0];

const emptyForm = {
  exerciseId: '',
  sets: '',
  reps: '',
  weight: '',
  notes: '',
  recordedAt: today(),
};

const inputClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors';

const labelClass = 'text-[13px] font-medium text-white';

const ProgressFormDialog = ({ open, onClose, clientId, clientName, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const exercises = useAppSelector((state) => state.workout.exercises);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm({ ...emptyForm, recordedAt: today() });
    setError(null);
    if (exercises.length === 0) dispatch(fetchExercisesThunk());
  }, [open]);

  const grouped = useMemo(() => {
    const groups = new Map<string, { category: Category; items: Exercise[] }>();
    exercises.forEach((exercise) => {
      const group = groups.get(exercise.category.id);
      if (group) group.items.push(exercise);
      else groups.set(exercise.category.id, { category: exercise.category, items: [exercise] });
    });
    return [...groups.values()];
  }, [exercises]);

  const set =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sets = Number(form.sets);
    const reps = Number(form.reps);

    if (!Number.isInteger(sets) || sets <= 0) {
      setError('Las series deben ser un número entero mayor a 0.');
      return;
    }
    if (!Number.isInteger(reps) || reps <= 0) {
      setError('Las repeticiones deben ser un número entero mayor a 0.');
      return;
    }
    if (form.weight && Number(form.weight) < 0) {
      setError('El peso no puede ser negativo.');
      return;
    }

    const payload: CreateProgressPayload = {
      exerciseId: form.exerciseId,
      sets,
      reps,
      recordedAt: form.recordedAt,
      ...(form.weight && { weight: Number(form.weight) }),
      ...(form.notes && { notes: form.notes.trim() }),
    };

    setSubmitting(true);
    const action = await dispatch(createProgressThunk({ clientId, payload }));
    setSubmitting(false);

    if (action.meta.requestStatus === 'rejected') {
      setError(action.payload as string);
      return;
    }

    onSuccess();
    onClose();
  };

  const noCatalog = exercises.length === 0;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#111111] border border-[#222222] rounded-[8px] p-5 z-50 focus:outline-none">

          <div className="flex items-start justify-between mb-1">
            <Dialog.Title className="text-base font-semibold text-white">
              Registrar progreso
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-[#888888] hover:text-white transition-colors mt-0.5">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <p className="text-sm text-[#888888] mb-5">{clientName}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Ejercicio *</label>
              <select
                value={form.exerciseId}
                onChange={set('exerciseId')}
                required
                disabled={noCatalog}
                className={`${inputClass} cursor-pointer disabled:opacity-50`}
              >
                <option value="">Seleccioná un ejercicio</option>
                {grouped.map(({ category, items }) => (
                  <optgroup key={category.id} label={category.name}>
                    {items.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {noCatalog && (
                <p className="text-xs text-[#ffaa00]">
                  No hay ejercicios cargados. Creá alguno desde la sección Ejercicios.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Series *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.sets}
                  onChange={set('sets')}
                  placeholder="4"
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Repeticiones *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.reps}
                  onChange={set('reps')}
                  placeholder="10"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Peso (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.weight}
                  onChange={set('weight')}
                  placeholder="60.5"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Fecha *</label>
                <input
                  type="date"
                  value={form.recordedAt}
                  onChange={set('recordedAt')}
                  required
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Notas</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                placeholder="Ej: le costó la última serie"
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
                disabled={submitting || !form.exerciseId || !form.sets || !form.reps}
                className="flex-1 h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Guardando...
                  </span>
                ) : 'Registrar'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProgressFormDialog;
