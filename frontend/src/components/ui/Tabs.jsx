export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border-subtle">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition
            ${active === tab
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-ink-600 hover:text-ink-900'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}