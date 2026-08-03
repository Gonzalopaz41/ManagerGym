import type { RoutineDetail } from '../types/routines.types';

interface Props {
  detail: RoutineDetail;
}

const SkeletonDetail = () => (
  <div className="flex flex-col gap-3 mt-4">
    {[1, 2].map((i) => (
      <div key={i} className="border border-[#222222] rounded-[6px] p-3">
        <div className="h-4 w-40 bg-[#1a1a1a] rounded animate-pulse mb-3" />
        <div className="h-3 w-full bg-[#1a1a1a] rounded animate-pulse mb-2" />
        <div className="h-3 w-3/4 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
    ))}
  </div>
);

const RoutineDetailView = ({ detail }: Props) => {
  if (detail.days.length === 0) {
    return (
      <p className="text-sm text-[#888888] mt-4">Esta rutina no tiene días cargados.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {detail.days.map((day) => (
        <div key={day.id} className="border border-[#222222] rounded-[6px] bg-[#0a0a0a]">
          <div className="px-3 py-2 border-b border-[#222222]">
            <span className="text-sm font-medium text-white">{day.name}</span>
            <span className="ml-2 text-xs text-[#888888]">
              ({day.items.length} {day.items.length === 1 ? 'ejercicio' : 'ejercicios'})
            </span>
          </div>

          {day.items.length === 0 ? (
            <p className="px-3 py-3 text-sm text-[#888888]">Sin ejercicios</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[420px]">
                <thead>
                  <tr>
                    <th className="text-left px-3 py-2 text-[#888888] font-medium text-xs">Ejercicio</th>
                    <th className="text-left px-3 py-2 text-[#888888] font-medium text-xs">Series × Reps</th>
                    <th className="text-left px-3 py-2 text-[#888888] font-medium text-xs">Peso</th>
                    <th className="text-left px-3 py-2 text-[#888888] font-medium text-xs hidden sm:table-cell">Indicaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {day.items.map((item) => (
                    <tr key={item.id} className="border-t border-[#111111]">
                      <td className="px-3 py-2 text-white">{item.exercise.name}</td>
                      <td className="px-3 py-2 text-white whitespace-nowrap">
                        {item.sets} × {item.reps}
                      </td>
                      <td className="px-3 py-2 text-[#888888] whitespace-nowrap">
                        {item.suggestedWeight != null ? `${item.suggestedWeight} kg` : '—'}
                      </td>
                      <td className="px-3 py-2 text-[#888888] hidden sm:table-cell max-w-[220px] truncate">
                        {item.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { SkeletonDetail };
export default RoutineDetailView;
