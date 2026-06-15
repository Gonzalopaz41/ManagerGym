import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  last_page: number;
  total: number;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (current: number, total: number): (number | '...')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4)       return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

const Pagination = ({ page, last_page, total, onPageChange }: Props) => {
  if (last_page <= 1) return null;

  const pages = getPageNumbers(page, last_page);

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-[#888888]">
        {total} resultado{total !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-1">
        {/* Anterior */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="h-8 w-8 flex items-center justify-center rounded-[6px] border border-[#222222] text-[#888888] hover:border-[#444444] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Números */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="h-8 w-8 flex items-center justify-center text-[#444444] text-sm select-none"
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`h-8 w-8 flex items-center justify-center rounded-[6px] text-sm transition-colors ${
                p === page
                  ? 'bg-white text-black font-medium'
                  : 'border border-[#222222] text-[#888888] hover:border-[#444444] hover:text-white'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Siguiente */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= last_page}
          aria-label="Página siguiente"
          className="h-8 w-8 flex items-center justify-center rounded-[6px] border border-[#222222] text-[#888888] hover:border-[#444444] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
