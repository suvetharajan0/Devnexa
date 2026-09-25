export function ActivityFeedItem({ message, timestamp }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
      <div>
        <p className="text-sm text-ink-900">{message}</p>
        <p className="mt-0.5 text-xs text-ink-400">{timestamp}</p>
      </div>
    </div>
  );
}