import { ChatMessageBubble } from './ChatMessageBubble'
import type { ChatMessage } from '../types/chat'

type ChatTranscriptProps = {
  messages: ChatMessage[]
  inlineError: string | null
}

export function ChatTranscript({ messages, inlineError }: ChatTranscriptProps) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {inlineError && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {inlineError}
        </div>
      )}

      <div className="flex min-h-[18rem] flex-col gap-4">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
      </div>
    </section>
  )
}
