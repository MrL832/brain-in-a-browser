import type { MLCEngine } from '@mlc-ai/web-llm'
import { useMemo, useRef, useState } from 'react'

import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  SYSTEM_PROMPT,
  WELCOME_MESSAGE,
} from '../lib/modelConfig'
import type { ChatMessage, ChatStore } from '../types/chat'

type UseChatSessionOptions = {
  engine: MLCEngine | null
  modelReady: boolean
}

function createMessage(
  role: ChatMessage['role'],
  content: string,
  overrides?: Partial<ChatMessage>,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: Date.now(),
    ...overrides,
  }
}

const INITIAL_MESSAGES: ChatMessage[] = [createMessage('assistant', WELCOME_MESSAGE)]

export function useChatSession({ engine, modelReady }: UseChatSessionOptions) {
  const [store, setStore] = useState<ChatStore>({
    messages: INITIAL_MESSAGES,
    input: '',
  })
  const [inlineError, setInlineError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(null)
  const stopRequestedRef = useRef(false)

  const canSubmit = modelReady && !isGenerating && store.input.trim().length > 0

  const visibleMessages = useMemo(
    () => store.messages.filter((message) => message.role !== 'system'),
    [store.messages],
  )

  async function submitMessage(nextInput?: string) {
    if (!engine || !modelReady || isGenerating) {
      return
    }

    const trimmedInput = (nextInput ?? store.input).trim()

    if (!trimmedInput) {
      return
    }

    const userMessage = createMessage('user', trimmedInput)
    const assistantMessage = createMessage('assistant', '', { streaming: true })
    const requestMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...store.messages
        .filter((message) => message.role !== 'system')
        .map(({ role, content }) => ({ role, content })),
      { role: 'user' as const, content: trimmedInput },
    ]

    stopRequestedRef.current = false
    setInlineError(null)
    setActiveAssistantId(assistantMessage.id)
    setIsGenerating(true)
    setStore((current) => ({
      input: '',
      messages: [...current.messages, userMessage, assistantMessage],
    }))

    let accumulated = ''

    try {
      const stream = await engine.chat.completions.create({
        messages: requestMessages,
        stream: true,
        temperature: DEFAULT_TEMPERATURE,
        max_tokens: DEFAULT_MAX_TOKENS,
      })

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content ?? ''

        if (!delta) {
          continue
        }

        accumulated += delta

        setStore((current) => ({
          ...current,
          messages: current.messages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: accumulated, streaming: true }
              : message,
          ),
        }))
      }

      setStore((current) => ({
        ...current,
        messages: current.messages.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content:
                  accumulated || (stopRequestedRef.current ? 'Generation stopped before any text appeared.' : ''),
                streaming: false,
                partial: stopRequestedRef.current,
              }
            : message,
        ),
      }))

      if (stopRequestedRef.current) {
        setInlineError('Generation stopped early. You can continue the same conversation or try again.')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'The browser hit an unexpected local inference error.'

      setStore((current) => ({
        ...current,
        messages: current.messages.map((entry) =>
          entry.id === assistantMessage.id
            ? {
                ...entry,
                content: accumulated || 'The response ended before text was returned.',
                streaming: false,
                partial: stopRequestedRef.current || accumulated.length > 0,
              }
            : entry,
        ),
      }))

      if (stopRequestedRef.current) {
        setInlineError('Generation stopped early. You can continue the same conversation or try again.')
      } else {
        setInlineError(message)
      }
    } finally {
      setIsGenerating(false)
      setActiveAssistantId(null)
      stopRequestedRef.current = false
    }
  }

  async function stopGeneration() {
    if (!engine || !isGenerating) {
      return
    }

    stopRequestedRef.current = true
    await engine.interruptGenerate().catch(() => undefined)
  }

  async function resetChat() {
    if (isGenerating) {
      await stopGeneration()
    }

    setInlineError(null)
    setActiveAssistantId(null)
    setStore({
      input: '',
      messages: [createMessage('assistant', WELCOME_MESSAGE)],
    })

    await engine?.resetChat(true).catch(() => undefined)
  }

  return {
    activeAssistantId,
    canSubmit,
    inlineError,
    input: store.input,
    isGenerating,
    messages: visibleMessages,
    resetChat,
    setInlineError,
    setInput: (input: string) =>
      setStore((current) => ({
        ...current,
        input,
      })),
    stopGeneration,
    submitMessage,
  }
}
