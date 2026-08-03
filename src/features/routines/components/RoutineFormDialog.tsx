import { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'radix-ui';
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { fetchExercisesThunk } from '@/features/workout';
import type { Category, Exercise } from '@/features/workout';
import { createRoutineThunk, updateRoutineThunk } from '../slice/routines.thunk';
import { clearRoutinesError } from '../slice/routines.slice';
import type { CreateRoutinePayload, RoutineDetail } from '../types/routines.types';

interface Props {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  routine?: RoutineDetail | null;
}

interface ItemForm {
  exerciseId: string;
  sets: string;
  reps: string;
  suggestedWeight: string;
  notes: string;
}

interface DayForm {
  name: string;
  items: ItemForm[];
}

const emptyItem = (): ItemForm => ({
  exerciseId: '',
  sets: '',
  reps: '',
  suggestedWeight: '',
  notes: '',
});

const emptyDay = (): DayForm => ({ name: '', items: [emptyItem()] });

const inputClass =
  'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors';

const labelClass = 'text-[13px] font-medium text-white';

const iconButtonClass =
  'p-1.5 rounded-[4px] text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-colors disabled:opacity-30 disabled:hover:text-[#888888] disabled:hover:bg-transparent';

const move = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
};

const RoutineFormDialog = ({
  open,
  onClose,
  clientId,
  clientName,
  routine,
}: Props) => {
  const dispatch = useAppDispatch();
  const exercises = useAppSelector((state) => state.workout.exercises);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<DayForm[]>([emptyDay()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!routine;

  useEffect(() => {
    if (!open) return;

    if (routine) {
      setName(routine.name);
      setDescription(routine.description ?? '');
      setDays(
        routine.days.map((day) => ({
          name: day.name,
          items: day.items.map((item) => ({
            exerciseId: item.exerciseId,
            sets: String(item.sets),
            reps: String(item.reps),
            suggestedWeight: item.suggestedWeight != null ? String(item.suggestedWeight) : '',
            notes: item.notes ?? '',
          })),
        }))
      );
    } else {
      setName('');
      setDescription('');
      setDays([emptyDay()]);
    }

    setError(null);
    dispatch(clearRoutinesError());
    if (exercises.length === 0) dispatch(fetchExercisesThunk());
  }, [open, routine]);

  const grouped = useMemo(() => {
    const groups = new Map<string, { category: Category; items: Exercise[] }>();
    exercises.forEach((exercise) => {
      const group = groups.get(exercise.category.id);
      if (group) group.items.push(exercise);
      else groups.set(exercise.category.id, { category: exercise.category, items: [exercise] });
    });
    return [...groups.values()];
  }, [exercises]);

  const setDay = (dayIndex: number, patch: Partial<DayForm>) =>
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d)));

  const setItem = (dayIndex: number, itemIndex: number, patch: Partial<ItemForm>) =>
    setDays((prev) =>
      prev.map((day, i) =>
        i !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, j) =>
                j === itemIndex ? { ...item, ...patch } : item
              ),
            }
      )
    );

  const addItem = (dayIndex: number) =>
    setDays((prev) =>
      prev.map((day, i) => (i === dayIndex ? { ...day, items: [...day.items, emptyItem()] } : day))
    );

  const removeItem = (dayIndex: number, itemIndex: number) =>
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, items: day.items.filter((_, j) => j !== itemIndex) } : day
      )
    );

  const moveItem = (dayIndex: number, from: number, to: number) =>
    setDays((prev) =>
      prev.map((day, i) => (i === dayIndex ? { ...day, items: move(day.items, from, to) } : day))
    );

  const buildPayload = (): CreateRoutinePayload => ({
    name: name.trim(),
    ...(description.trim() && { description: description.trim() }),
    // El order sale de la posición en la lista, así no hay que pedírselo al usuario.
    days: days.map((day, dayIndex) => ({
      name: day.name.trim(),
      order: dayIndex + 1,
      items: day.items.map((item, itemIndex) => ({
        exerciseId: item.exerciseId,
        sets: Number(item.sets),
        reps: Number(item.reps),
        order: itemIndex + 1,
        ...(item.suggestedWeight && { suggestedWeight: Number(item.suggestedWeight) }),
        ...(item.notes.trim() && { notes: item.notes.trim() }),
      })),
    })),
  });

  const validate = (): string | null => {
    if (!name.trim()) return 'La rutina necesita un nombre.';
    if (days.length === 0) return 'Agregá al menos un día.';

    for (let d = 0; d < days.length; d++) {
      const day = days[d];
      if (!day.name.trim()) return `El día ${d + 1} necesita un nombre.`;
      if (day.items.length === 0) return `El día ${d + 1} necesita al menos un ejercicio.`;

      for (let i = 0; i < day.items.length; i++) {
        const item = day.items[i];
        const position = `ejercicio ${i + 1} del día ${d + 1}`;
        if (!item.exerciseId) return `Elegí el ${position}.`;

        const sets = Number(item.sets);
        const reps = Number(item.reps);
        if (!Number.isInteger(sets) || sets <= 0) return `Las series del ${position} deben ser un entero mayor a 0.`;
        if (!Number.isInteger(reps) || reps <= 0) return `Las repeticiones del ${position} deben ser un entero mayor a 0.`;
        if (item.suggestedWeight && Number(item.suggestedWeight) < 0) {
          return `El peso del ${position} no puede ser negativo.`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = buildPayload();
    const action = isEdit
      ? await dispatch(updateRoutineThunk({ routineId: routine!.id, payload }))
      : await dispatch(createRoutineThunk({ clientId, payload }));

    setSubmitting(false);

    if (action.meta.requestStatus === 'rejected') {
      setError(action.payload as string);
      return;
    }

    // El slice ya escribió la respuesta en el store, no hace falta refetch.
    onClose();
  };

  const noCatalog = exercises.length === 0;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111111] border border-[#222222] rounded-[8px] p-5 z-50 focus:outline-none">

          <div className="flex items-start justify-between mb-1">
            <Dialog.Title className="text-base font-semibold text-white">
              {isEdit ? 'Editar rutina' : 'Nueva rutina'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-[#888888] hover:text-white transition-colors mt-0.5">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <p className="text-sm text-[#888888] mb-5">{clientName}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Nombre de la rutina *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: rutina de volumen - 4 días"
                maxLength={80}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: enfocada en hipertrofia, 8 semanas"
                maxLength={500}
                rows={2}
                className="w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 py-2 text-sm outline-none transition-colors resize-none"
              />
            </div>

            {noCatalog && (
              <p className="text-xs text-[#ffaa00]">
                No hay ejercicios cargados. Creá alguno en la sección Ejercicios antes de armar la rutina.
              </p>
            )}

            {/* Días */}
            <div className="flex flex-col gap-4">
              {days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border border-[#222222] rounded-[8px] bg-[#0a0a0a] p-4 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#888888] shrink-0">Día {dayIndex + 1}</span>
                    <input
                      type="text"
                      value={day.name}
                      onChange={(e) => setDay(dayIndex, { name: e.target.value })}
                      placeholder="Ej: día 1 - pecho y tríceps"
                      maxLength={80}
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => setDays((prev) => move(prev, dayIndex, dayIndex - 1))}
                      disabled={dayIndex === 0}
                      aria-label="Subir día"
                      className={iconButtonClass}
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDays((prev) => move(prev, dayIndex, dayIndex + 1))}
                      disabled={dayIndex === days.length - 1}
                      aria-label="Bajar día"
                      className={iconButtonClass}
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDays((prev) => prev.filter((_, i) => i !== dayIndex))}
                      disabled={days.length === 1}
                      aria-label="Eliminar día"
                      className="p-1.5 rounded-[4px] text-[#888888] hover:text-[#ff4444] hover:bg-[#1a1a1a] transition-colors disabled:opacity-30 disabled:hover:text-[#888888] disabled:hover:bg-transparent"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Ejercicios del día */}
                  <div className="flex flex-col gap-3">
                    {day.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="border border-[#222222] rounded-[6px] p-3 flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <select
                            value={item.exerciseId}
                            onChange={(e) => setItem(dayIndex, itemIndex, { exerciseId: e.target.value })}
                            disabled={noCatalog}
                            className={`${inputClass} flex-1 cursor-pointer disabled:opacity-50`}
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
                          <button
                            type="button"
                            onClick={() => moveItem(dayIndex, itemIndex, itemIndex - 1)}
                            disabled={itemIndex === 0}
                            aria-label="Subir ejercicio"
                            className={iconButtonClass}
                          >
                            <ChevronUp size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(dayIndex, itemIndex, itemIndex + 1)}
                            disabled={itemIndex === day.items.length - 1}
                            aria-label="Bajar ejercicio"
                            className={iconButtonClass}
                          >
                            <ChevronDown size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(dayIndex, itemIndex)}
                            disabled={day.items.length === 1}
                            aria-label="Eliminar ejercicio"
                            className="p-1.5 rounded-[4px] text-[#888888] hover:text-[#ff4444] hover:bg-[#1a1a1a] transition-colors disabled:opacity-30 disabled:hover:text-[#888888] disabled:hover:bg-transparent"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.sets}
                            onChange={(e) => setItem(dayIndex, itemIndex, { sets: e.target.value })}
                            placeholder="Series"
                            className={inputClass}
                          />
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.reps}
                            onChange={(e) => setItem(dayIndex, itemIndex, { reps: e.target.value })}
                            placeholder="Reps"
                            className={inputClass}
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={item.suggestedWeight}
                            onChange={(e) => setItem(dayIndex, itemIndex, { suggestedWeight: e.target.value })}
                            placeholder="Peso kg"
                            className={inputClass}
                          />
                        </div>

                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => setItem(dayIndex, itemIndex, { notes: e.target.value })}
                          placeholder="Indicaciones (opcional)"
                          maxLength={300}
                          className={inputClass}
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addItem(dayIndex)}
                      className="h-9 rounded-[6px] border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444] text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={14} />
                      Agregar ejercicio
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setDays((prev) => [...prev, emptyDay()])}
                className="h-9 rounded-[6px] border border-[#222222] text-white hover:border-[#444444] text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={15} />
                Agregar día
              </button>
            </div>

            {error && <p className="text-sm text-[#ff4444]">{error}</p>}

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 h-9 rounded-[6px] bg-transparent border border-[#222222] text-white hover:border-[#444444] text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting || noCatalog}
                className="flex-1 h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Guardando...
                  </span>
                ) : isEdit ? 'Guardar cambios' : 'Crear rutina'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RoutineFormDialog;
