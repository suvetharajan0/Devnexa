const STATUS_STYLES = {
  planning: 'bg-surface-muted text-ink-600',
  active: 'bg-brand-100 text-brand-600',
  completed: 'bg-success-bg text-success-text',
  archived: 'bg-surface-muted text-ink-400',
};


export function Badge({ status, children }) {
  const style = STATUS_STYLES[status] || 'bg-surface-muted text-ink-600';
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}> 
      {children ?? status}
    </span>
  );
}

