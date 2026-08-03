import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import {
  fetchRoutineDetailThunk,
  fetchRoutinesThunk,
  updateRoutineStatusThunk,
} from '../slice/routines.thunk';
import { closeRoutineDetail } from '../slice/routines.slice';
import RoutineDetailView, { SkeletonDetail } from './RoutineDetailView';
import RoutineFormDialog from './RoutineFormDialog';
import DeleteRoutineDialog from './DeleteRoutineDialog';
import type { Routine, RoutineDetail } from '../types/routines.types';

interface Props {
  clientId: string;
  clientName: string;
}

/** Evita el corrimiento de día que produce new Date() con fechas sin hora. */
const formatDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};

const SkeletonCard = () => (
  <div className="border border-[#222222] rounded-[8px] bg-[#111111] p-4">
    <div className="h-5 w-52 bg-[#1a1a1a] rounded animate-pulse mb-3" />
    <div className="h-3 w-72 max-w-full bg-[#1a1a1a] rounded animate-pulse mb-4" />
    <div className="h-8 w-full bg-[#1a1a1a] rounded animate-pulse" />
  </div>
);

const RoutinesTab = ({ clientId, clientName }: Props) => {
  const dispatch = useAppDispatch();
  const { routines, detail, loading, detailLoading, error } = useAppSelector(
    (state) => state.routines
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RoutineDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Routine | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchRoutinesThunk(clientId));
  }, [dispatch, clientId]);

  const toggleExpand = (routine: Routine) => {
    if (expandedId === routine.id) {
      setExpandedId(null);
      dispatch(closeRoutineDetail());
      return;
    }
    setExpandedId(routine.id);
    dispatch(fetchRoutineDetailThunk(routine.id));
  };

  const handleEdit = async (routine: Routine) => {
    // El listado no trae los días, así que hay que cargar el detalle
    // antes de poder precargar el formulario.
    setPendingId(routine.id);
    const action = await dispatch(fetchRoutineDetailThunk(routine.id));
    setPendingId(null);

    if (action.meta.requestStatus === 'fulfilled') {
      setEditTarget(action.payload as RoutineDetail);
      setFormOpen(true);
    }
  };

  const handleToggleStatus = async (routine: Routine) => {
    setPendingId(routine.id);
    await dispatch(
      updateRoutineStatusThunk({ routineId: routine.id, isActive: !routine.isActive })
    );
    setPendingId(null);
  };

  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-[15px] font-semibold text-white">
          Rutinas
          {!loading && (
            <span className="ml-2 text-xs font-normal text-[#888888]">({routines.length})</span>
          )}
        </h2>

        <Button
          onClick={handleCreate}
          className="h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0 flex items-center gap-2 shrink-0"
        >
          <Plus size={15} />
          Nueva rutina
        </Button>
      </div>

      {error && <p className="text-sm text-[#ff4444] mb-3">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : routines.length === 0 ? (
        <div className="border border-[#222222] rounded-[8px] py-12 flex items-center justify-center">
          <p className="text-sm text-[#888888]">Sin rutinas asignadas</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {routines.map((routine) => {
            const isExpanded = expandedId === routine.id;
            const isPending = pendingId === routine.id;

            return (
              <div
                key={routine.id}
                className="border border-[#222222] rounded-[8px] bg-[#111111] p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white break-words">{routine.name}</h3>
                    {routine.description && (
                      <p className="text-[13px] text-[#888888] mt-0.5 break-words">
                        {routine.description}
                      </p>
                    )}
                    <p className="text-xs text-[#444444] mt-1">
                      Creada el {formatDate(routine.createdAt)}
                    </p>
                  </div>

                  {routine.isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium bg-[#00cc8820] text-[#00cc88] border border-[#00cc8840] shrink-0">
                      Activa
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    onClick={() => toggleExpand(routine)}
                    className="h-8 px-3 rounded-[6px] border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444] text-[13px] flex items-center gap-1.5 transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? 'Ocultar' : 'Ver detalle'}
                  </button>

                  <button
                    onClick={() => handleToggleStatus(routine)}
                    disabled={isPending}
                    className={`h-8 px-3 rounded-[6px] border text-[13px] flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                      routine.isActive
                        ? 'border-[#222222] text-[#888888] hover:text-white hover:border-[#444444]'
                        : 'border-[#00cc8840] text-[#00cc88] hover:bg-[#00cc8815]'
                    }`}
                  >
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
                    {routine.isActive ? 'Desactivar' : 'Activar'}
                  </button>

                  <button
                    onClick={() => handleEdit(routine)}
                    disabled={isPending}
                    className="h-8 px-3 rounded-[6px] border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444] text-[13px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>

                  <button
                    onClick={() => setDeleteTarget(routine)}
                    className="h-8 px-3 rounded-[6px] border border-[#222222] text-[#888888] hover:text-[#ff4444] hover:border-[#ff444440] text-[13px] flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>

                {isExpanded &&
                  (detailLoading || detail?.id !== routine.id ? (
                    <SkeletonDetail />
                  ) : (
                    <RoutineDetailView detail={detail} />
                  ))}
              </div>
            );
          })}
        </div>
      )}

      <RoutineFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        clientId={clientId}
        clientName={clientName}
        routine={editTarget}
      />

      <DeleteRoutineDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        routine={deleteTarget}
      />
    </div>
  );
};

export default RoutinesTab;
