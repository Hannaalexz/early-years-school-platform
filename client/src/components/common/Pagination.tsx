import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [8, 12, 24],
  itemLabel = 'items',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems <= 0) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 px-1 text-xs font-['Outfit'] select-none">
      {/* Items Counter Info */}
      <div className="flex items-center gap-2 text-ink-600">
        <span>
          Showing <strong className="text-[#3D3530] font-bold">{startItem}</strong> to{' '}
          <strong className="text-[#3D3530] font-bold">{endItem}</strong> of{' '}
          <strong className="text-[#3D3530] font-bold">{totalItems}</strong> {itemLabel}
        </span>

        {/* Page size dropdown */}
        {onPageSizeChange && pageSizeOptions && pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-[#EFE9DF] pl-3">
            <span className="text-[11px] text-ink-500">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
              className="px-2 py-0.5 rounded-lg bg-white border border-[#EFE9DF] text-xs text-ink-700 focus:outline-none focus:border-[#21B8AF] cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          title="First page"
          className="p-1.5 rounded-xl border border-[#EFE9DF] bg-white text-ink-500 hover:text-[#0B4E49] hover:bg-[#F0FBF9] disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          title="Previous page"
          className="p-1.5 rounded-xl border border-[#EFE9DF] bg-white text-ink-500 hover:text-[#0B4E49] hover:bg-[#F0FBF9] disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-ink-400 font-mono text-xs">
                  ...
                </span>
              );
            }
            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(Number(p))}
                className={`min-w-[28px] h-7 px-2 rounded-xl text-xs font-bold font-['Quicksand'] transition-all shadow-2xs ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs scale-105'
                    : 'bg-white border border-[#EFE9DF] text-ink-700 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          title="Next page"
          className="p-1.5 rounded-xl border border-[#EFE9DF] bg-white text-ink-500 hover:text-[#0B4E49] hover:bg-[#F0FBF9] disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          title="Last page"
          className="p-1.5 rounded-xl border border-[#EFE9DF] bg-white text-ink-500 hover:text-[#0B4E49] hover:bg-[#F0FBF9] disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
};
