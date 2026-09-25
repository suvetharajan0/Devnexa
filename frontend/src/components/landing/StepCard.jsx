export function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-500 font-mono text-lg font-bold text-white">
        {number}
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
    </div>
  );
}