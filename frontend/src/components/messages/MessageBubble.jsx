export function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm
          ${isOwn ? 'bg-brand-500 text-white' : 'bg-surface-muted text-ink-900'}`}
      >
        {message.body}
      </div>
    </div>
  );
}
