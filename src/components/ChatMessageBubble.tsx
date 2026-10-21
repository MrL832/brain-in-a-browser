import type { ChatMessage } from '../types/chat'

type ChatMessageBubbleProps = {
  message: ChatMessage
}

function formatTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp)
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <article className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-[24px] px-4 py-3 shadow-lg ring-1 ring-inset ${
          isUser
            ? 'bg-cyan-400 text-slate-950 ring-cyan-200/60'
            : 'bg-white/6 text-slate-100 ring-white/10'
        }`}
      >
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
          <span className={isUser ? 'text-slate-900/70' : 'text-slate-400'}>
            {isUser ? 'You' : 'Local model'}
          </span>
          {message.partial && (
            <span className="rounded-full bg-amber-400/15 px-2 py-1 text-[10px] font-semibold text-amber-200 ring-1 ring-inset ring-amber-300/20">
              Partial
            </span>
          )}
          {message.streaming && (
            <span className="rounded-full bg-sky-400/15 px-2 py-1 text-[10px] font-semibold text-sky-100 ring-1 ring-inset ring-sky-300/20">
              Streaming
            </span>
          )}
        </div>

        <p className="whitespace-pre-wrap break-words text-[15px] leading-7 sm:text-base">
          {message.content || '...'}
        </p>

        <p className={`mt-3 text-right text-xs ${isUser ? 'text-slate-900/70' : 'text-slate-400'}`}>
          {formatTimestamp(message.createdAt)}
        </p>
      </div>
    </article>
  )
}
