import { Search } from 'lucide-react';


const STATUS_OPTIONS = ['', 'planning', 'active', 'completed', 'archived'];


export function FilterToolbar({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by title or description…"
          className="w-full rounded-control border border-border-muted bg-surface-card py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500"
        />
      </div>


      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-control border border-border-muted bg-surface-card px-3 py-2.5 text-sm outline-none focus:border-brand-500"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === '' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
