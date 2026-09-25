export function StatCard({ label, value, delta, icon: Icon }) {
  const isPositive = delta?.startsWith('+');

  return (
    <div className="rounded-card bg-surface-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-600">{label}</span>
        {Icon && <Icon className="size-4 text-brand-500" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-ink-900">{value}</span>
        {delta && (
          <span
            className={`text-xs font-semibold ${isPositive ? 'text-success-text' : 'text-danger-500'}`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}