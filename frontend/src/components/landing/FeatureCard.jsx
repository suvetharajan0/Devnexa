export function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-card border border-border-subtle bg-surface-card p-6 transition hover:border-brand-300 hover:shadow-sm">
      <div className="flex size-11 items-center justify-center rounded-xl bg-brand-100">
        <Icon className="size-5 text-brand-600" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
    </div>
  );
}
