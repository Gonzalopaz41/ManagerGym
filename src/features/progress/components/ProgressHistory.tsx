import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { fetchProgressThunk } from '../slice/progress.thunk';
import ProgressFormDialog from './ProgressFormDialog';

interface Props {
  clientId: string;
  clientName: string;
}

/** Evita el corrimiento de día que produce new Date() con fechas sin hora. */
const formatDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};

const SkeletonRows = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <tr key={i} className="border-t border-[#111111]">
        {[70, 110, 50, 60].map((w, j) => (
          <td key={j} className="px-4 py-3">
            <div className="h-4 bg-[#1a1a1a] rounded animate-pulse" style={{ width: w }} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const ProgressHistory = ({ clientId, clientName }: Props) => {
  const dispatch = useAppDispatch();
  const { records, loading, error } = useAppSelector((state) => state.progress);

  const [formOpen, setFormOpen] = useState(false);
  const [exerciseFilter, setExerciseFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchProgressThunk(clientId));
  }, [dispatch, clientId]);

  const options = useMemo(() => {
    const unique = new Map<string, string>();
    records.forEach((r) => unique.set(r.exercise.id, r.exercise.name));
    return [...unique].map(([id, name]) => ({ id, name }));
  }, [records]);

  // El filtro es en memoria: el historial completo ya está cargado y, a
  // diferencia de GET /progress/{exerciseId}, acá cada registro trae su
  // categoría embebida.
  const sorted = useMemo(() => {
    const visible =
      exerciseFilter === 'all'
        ? records
        : records.filter((r) => r.exercise.id === exerciseFilter);

    return [...visible].sort(
      (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
  }, [records, exerciseFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-[15px] font-semibold text-white">
          Historial de progreso
          {!loading && (
            <span className="ml-2 text-xs font-normal text-[#888888]">({sorted.length})</span>
          )}
        </h2>

        <div className="flex items-center gap-3">
          {options.length > 0 && (
            <select
              value={exerciseFilter}
              onChange={(e) => setExerciseFilter(e.target.value)}
              className="h-9 rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white text-sm px-3 outline-none transition-colors cursor-pointer"
            >
              <option value="all">Todos los ejercicios</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          )}

          <Button
            onClick={() => setFormOpen(true)}
            className="h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0 flex items-center gap-2 shrink-0"
          >
            <Plus size={15} />
            Nuevo registro
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-[#ff4444] mb-3">{error}</p>}

      {!loading && !error && sorted.length === 0 ? (
        <div className="border border-[#222222] rounded-[8px] py-12 flex items-center justify-center">
          <p className="text-sm text-[#888888]">
            {exerciseFilter === 'all'
              ? 'Sin registros de progreso'
              : 'Sin registros para este ejercicio'}
          </p>
        </div>
      ) : (
        <div className="border border-[#222222] rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-[#0a0a0a]">
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Ejercicio</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium hidden sm:table-cell">Categoría</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Series × Reps</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Peso</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium hidden md:table-cell">Notas</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows />
                ) : (
                  sorted.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-[#111111] hover:bg-[#0f0f0f] transition-colors"
                    >
                      <td className="px-4 py-3 text-white whitespace-nowrap">
                        {formatDate(record.recordedAt)}
                      </td>
                      <td className="px-4 py-3 text-white">{record.exercise.name}</td>
                      <td className="px-4 py-3 text-[#888888] hidden sm:table-cell">
                        {record.exercise.category.name}
                      </td>
                      <td className="px-4 py-3 text-white whitespace-nowrap">
                        {record.sets} × {record.reps}
                      </td>
                      <td className="px-4 py-3 text-[#888888] whitespace-nowrap">
                        {record.weight != null ? `${record.weight} kg` : '—'}
                      </td>
                      <td className="px-4 py-3 text-[#888888] hidden md:table-cell max-w-[220px] truncate">
                        {record.notes || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProgressFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        clientId={clientId}
        clientName={clientName}
        onSuccess={() => {
          // El slice ya sumó el registro al store. Solo se limpia el filtro,
          // porque el nuevo puede ser de un ejercicio distinto al filtrado.
          setExerciseFilter('all');
        }}
      />
    </div>
  );
};

export default ProgressHistory;
