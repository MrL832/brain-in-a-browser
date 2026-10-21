import { ChatMessageBubble } from './ChatMessageBubble'
import type { ChatMessage } from '../types/chat'

type ChatTranscriptProps = {
  messages: ChatMessage[]
  inlineError: string | null
}

export function ChatTranscript({ messages, inlineError }: ChatTranscriptProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/50 p-4 shadow-2xl shadow-slate-950/30">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Transcript</p>
          <p className="mt-1 text-sm text-slate-400">
            One active conversation, streamed locally on this device.
          </p>
        </div>
      </div>

      {inlineError && (
        <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {inlineError}
        </div>
      )}

      <div className="flex min-h-[22rem] flex-col gap-4">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
      </div>
    </section>
  )
}
