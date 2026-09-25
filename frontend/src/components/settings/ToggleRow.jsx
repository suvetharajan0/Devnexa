
export function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-ink-900">{label}</p>
        {description && <p className="text-xs text-ink-400">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-brand-500' : 'bg-surface-muted'}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}