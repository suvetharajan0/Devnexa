import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Trash2, ArrowLeft } from 'lucide-react';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  clearConversation,
} from '../api/conversations.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { ConversationListItem } from '../components/messages/ConversationListItem.jsx';
import { MessageBubble } from '../components/messages/MessageBubble.jsx';


export default function MessagesPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, unreadCount, clearUnread } = useSocket();


  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);


  useEffect(() => {
    fetchConversations().then((res) => setConversations(res.data));
  }, []);


  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    fetchMessages(conversationId).then((res) => setMessages(res.data));
  }, [conversationId]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  useEffect(() => {
    if (!socket) return;


    function handleNewMessage({ conversationId: incomingId, message }) {
      if (incomingId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }


      setConversations((prev) => {
        const exists = prev.some((c) => c._id === incomingId);
        if (!exists) return prev;
        return prev
          .map((c) => (c._id === incomingId ? { ...c, lastMessage: message } : c))
          .sort((a, b) => (a._id === incomingId ? -1 : b._id === incomingId ? 1 : 0));
      });
    }


    socket.on('message:new', handleNewMessage);
    return () => socket.off('message:new', handleNewMessage);
  }, [socket, conversationId]);


  useEffect(() => {
    if (unreadCount > 0) clearUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function handleSend(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    const text = draft;
    setDraft('');
    await sendMessage(conversationId, text);
  }


  async function handleClearConversation() {
    const confirmed = window.confirm(
      'Clear all messages in this conversation? This cannot be undone.'
    );
    if (!confirmed) return;


    await clearConversation(conversationId);
    setMessages([]);
    setConversations((prev) =>
      prev.map((c) => (c._id === conversationId ? { ...c, lastMessage: null } : c))
    );
  }


  const activeConversation = conversations.find((c) => c._id === conversationId);
  const otherParticipant = activeConversation?.participants.find((p) => p._id !== user.id);


  // On mobile: show ONLY the list, or ONLY the thread, never both.
  // On desktop (md+): show both side by side, as before.
  const showListOnMobile = !conversationId;
  const showThreadOnMobile = !!conversationId;


  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div
        className={`w-full shrink-0 overflow-y-auto border-r border-border-subtle p-3 md:block md:w-72
          ${showListOnMobile ? 'block' : 'hidden'}`}
      >
        <h2 className="px-2 py-1 text-xs font-semibold uppercase text-ink-400">Messages</h2>
        <div className="mt-2 space-y-1">
          {conversations.map((c) => (
            <ConversationListItem
              key={c._id}
              conversation={c}
              currentUserId={user.id}
              active={c._id === conversationId}
              onClick={() => navigate(`/messages/${c._id}`)}
            />
          ))}
          {conversations.length === 0 && (
            <p className="px-2 py-4 text-xs text-ink-400">
              No conversations yet — message a teammate from a Team Workspace.
            </p>
          )}
        </div>
      </div>


      <div className={`flex flex-1 flex-col md:flex ${showThreadOnMobile ? 'flex' : 'hidden'}`}>
        {!conversationId && (
          <div className="hidden flex-1 items-center justify-center text-sm text-ink-400 md:flex">
            Select a conversation to start chatting
          </div>
        )}


        {conversationId && (
          <>
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/messages')} className="text-ink-400 hover:text-ink-600 md:hidden">
                  <ArrowLeft className="size-5" />
                </button>
                <span className="text-sm font-semibold text-ink-900">
                  {otherParticipant?.name || 'Conversation'}
                </span>
              </div>
              <button
                onClick={handleClearConversation}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 rounded-control px-2.5 py-1.5 text-xs font-medium text-ink-400 hover:bg-surface-muted hover:text-danger-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-400"
              >
                <Trash2 className="size-3.5" />
                <span className="hidden sm:inline">Clear conversation</span>
              </button>
            </div>


            <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
              {messages.length === 0 && (
                <p className="pt-8 text-center text-xs text-ink-400">No messages yet</p>
              )}
              {messages.map((m) => (
                <MessageBubble key={m._id} message={m} isOwn={m.sender._id === user.id} />
              ))}
              <div ref={bottomRef} />
            </div>


            <form onSubmit={handleSend} className="flex gap-2 border-t border-border-subtle p-3 sm:p-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-control bg-brand-500 px-4 text-white hover:bg-brand-600"
              >
                <Send className="size-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
