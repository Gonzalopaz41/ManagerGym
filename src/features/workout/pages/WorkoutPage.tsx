import { useEffect, useMemo, useState } from 'react';
import { FolderPlus, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { fetchCategoriesThunk, fetchExercisesThunk } from '../slice/workout.thunk';
import ExercisesTable from '../components/ExercisesTable';
import ExerciseFormDialog from '../components/ExerciseFormDialog';
import DeleteExerciseDialog from '../components/DeleteExerciseDialog';
import CategoryFormDialog from '../components/CategoryFormDialog';
import type { Category, Exercise } from '../types/workout.types';

const SkeletonRow = () => (
  <tr className="border-t border-[#111111]">
    {[130, 70, 180, 40].map((w, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-[#1a1a1a] rounded animate-pulse" style={{ width: w }} />
      </td>
    ))}
  </tr>
);

const WorkoutPage = () => {
  const dispatch = useAppDispatch();
  const { categories, exercises, loading, error } = useAppSelector((state) => state.workout);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Exercise | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryEditTarget, setCategoryEditTarget] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    dispatch(fetchExercisesThunk());
  }, [dispatch]);

  const visibleExercises = useMemo(
    () =>
      categoryFilter === 'all'
        ? exercises
        : exercises.filter((e) => e.categoryId === categoryFilter),
    [exercises, categoryFilter]
  );

  const handleEdit = (exercise: Exercise) => {
    setEditTarget(exercise);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  const selectedCategory = categories.find((c) => c.id === categoryFilter) ?? null;

  const openCategoryForm = (category: Category | null) => {
    setCategoryEditTarget(category);
    setCategoryFormOpen(true);
  };

  const closeCategoryForm = () => {
    setCategoryFormOpen(false);
    setCategoryEditTarget(null);
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1200px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Ejercicios</h1>
          <p className="text-sm text-[#888888] mt-0.5">
            Catálogo de ejercicios por grupo muscular
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 shrink-0">
          <Button
            onClick={() => openCategoryForm(null)}
            className="h-9 rounded-[6px] bg-transparent border border-[#222222] text-white hover:border-[#444444] text-sm flex items-center gap-2"
          >
            <FolderPlus size={15} />
            Nueva categoría
          </Button>
          <Button
            onClick={handleCreate}
            className="h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0 flex items-center gap-2"
          >
            <Plus size={15} />
            Nuevo ejercicio
          </Button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 w-full sm:w-56 rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white text-sm px-3 outline-none transition-colors cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {selectedCategory && (
            <button
              onClick={() => openCategoryForm(selectedCategory)}
              aria-label={`Editar categoría ${selectedCategory.name}`}
              className="h-9 px-3 rounded-[6px] border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444] text-sm flex items-center gap-2 shrink-0 transition-colors"
            >
              <Pencil size={14} />
              Editar
            </button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-[#ff4444]">{error}</p>}

      {loading ? (
        <div className="border border-[#222222] rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-[#0a0a0a]">
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Ejercicio</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Categoría</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium hidden md:table-cell">Descripción</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      ) : visibleExercises.length === 0 ? (
        <div className="border border-[#222222] rounded-[8px] py-12 text-center">
          <p className="text-[#888888] text-sm">
            {exercises.length === 0
              ? 'No hay ejercicios cargados.'
              : 'No hay ejercicios en esta categoría.'}
          </p>
        </div>
      ) : (
        <ExercisesTable
          exercises={visibleExercises}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <ExerciseFormDialog
        open={formOpen}
        onClose={closeForm}
        exercise={editTarget}
      />

      <DeleteExerciseDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        exercise={deleteTarget}
      />

      <CategoryFormDialog
        open={categoryFormOpen}
        onClose={closeCategoryForm}
        category={categoryEditTarget}
      />
    </div>
  );
};

export default WorkoutPage;
