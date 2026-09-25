import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, error, icon: Icon, rightElement, ...props },
  ref
) {
  return (
    <label className="block text-left">
      <span className="mb-1 block text-sm font-medium text-ink-900">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        )}
        <input
          ref={ref}
          className={`w-full rounded-control border py-2.5 text-sm outline-none transition
            ${Icon ? 'pl-10' : 'pl-3'}
            ${rightElement ? 'pr-10' : 'pr-3'}
            ${error ? 'border-danger-500' : 'border-border-muted focus:border-brand-500'}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-danger-500">{error}</span>}
    </label>
  );
});