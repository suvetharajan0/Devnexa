export function ConversationListItem({ conversation, currentUserId, active, onClick }) {
  const other = conversation.participants.find((p) => p._id !== currentUserId);


  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left transition
        ${active ? 'bg-brand-100' : 'hover:bg-surface-muted'}`}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
        {other?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-900">{other?.name || 'Unknown'}</p>
        <p className="truncate text-xs text-ink-400">
          {conversation.lastMessage?.body || 'No messages yet'}
        </p>
      </div>
    </button>
  );
}
