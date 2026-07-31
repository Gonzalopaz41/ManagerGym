import { Pencil, Trash2 } from 'lucide-react';
import type { Exercise } from '../types/workout.types';

interface Props {
  exercises: Exercise[];
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}

const ExercisesTable = ({ exercises, onEdit, onDelete }: Props) => (
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
          {exercises.map((exercise) => (
            <tr
              key={exercise.id}
              className="border-t border-[#111111] hover:bg-[#0f0f0f] transition-colors"
            >
              <td className="px-4 py-3 text-white">{exercise.name}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium bg-[#222222] text-white">
                  {exercise.category.name}
                </span>
              </td>
              <td className="px-4 py-3 text-[#888888] hidden md:table-cell max-w-[280px] truncate">
                {exercise.description || '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(exercise)}
                    aria-label={`Editar ${exercise.name}`}
                    className="p-1.5 rounded-[4px] text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(exercise)}
                    aria-label={`Eliminar ${exercise.name}`}
                    className="p-1.5 rounded-[4px] text-[#888888] hover:text-[#ff4444] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ExercisesTable;
