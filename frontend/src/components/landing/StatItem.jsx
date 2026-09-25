export function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-mono text-3xl font-bold text-ink-900 sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-ink-600">{label}</p>
    </div>
  );
}