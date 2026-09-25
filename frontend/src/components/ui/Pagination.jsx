import { ChevronLeft, ChevronRight } from 'lucide-react';


export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;


  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-control p-2 text-ink-600 hover:bg-surface-muted disabled:opacity-30"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="text-sm text-ink-600">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-control p-2 text-ink-600 hover:bg-surface-muted disabled:opacity-30"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}