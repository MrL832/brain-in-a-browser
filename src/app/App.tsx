import { useMemo, useState } from 'react'

import { ChatTranscript } from '../components/ChatTranscript'
import { Composer } from '../components/Composer'
import { PrivacyBanner } from '../components/PrivacyBanner'
import { ProgressBar } from '../components/ProgressBar'
import { TopStatusBar } from '../components/TopStatusBar'
import { UtilityFooter } from '../components/UtilityFooter'
import { useChatSession } from '../hooks/useChatSession'
import { useModelEngine } from '../hooks/useModelEngine'
import { useWebGpuSupport } from '../hooks/useWebGpuSupport'
import type { ClearCacheResult } from '../types/chat'

const SUGGESTED_PROMPTS = [
  'Explain this topic simply',
  'Give me a quick quiz',
  'Summarise my notes',
  'Help me start homework',
]

export default function App() {
  const capability = useWebGpuSupport()
  const { engine, modelState, initialize, clearCache } = useModelEngine(capability)
  const chat = useChatSession({
    engine,
    modelReady: modelState.status === 'ready' || modelState.status === 'generating',
  })
  const [utilityText, setUtilityText] = useState<string | null>(null)
  const [utilityBusy, setUtilityBusy] = useState(false)

  const composerDisabled = useMemo(
    () =>
      capability.checking ||
      !capability.webgpuSupported ||
      (modelState.status !== 'ready' && modelState.status !== 'generating'),
    [capability.checking, capability.webgpuSupported, modelState.status],
  )
  const hasStarted = chat.messages.some((message) => message.role === 'user')

  async function handleClearCache() {
    setUtilityBusy(true)
    setUtilityText('Clearing local browser caches and WebLLM artifacts...')

    try {
      const result: ClearCacheResult = await clearCache()
      setUtilityText(
        `Cleared ${result.deletedCacheBuckets} cache bucket(s) and ${result.deletedDatabases} IndexedDB database(s). The model will download again on the next warmup.`,
      )
      await initialize(true)
    } finally {
      setUtilityBusy(false)
    }
  }

  async function handleRetryModel() {
    setUtilityBusy(true)
    setUtilityText('Retrying local model initialization...')

    try {
      await initialize(true)
      setUtilityText('Model initialization retried. Watch the status and progress surfaces for updates.')
    } finally {
      setUtilityBusy(false)
    }
  }

  async function handleResetChat() {
    setUtilityBusy(true)
    setUtilityText('Resetting the in-memory conversation...')

    try {
      await chat.resetChat()
      setUtilityText('Conversation reset. No multi-thread history is stored in this MVP.')
    } finally {
      setUtilityBusy(false)
    }
  }

  async function handleSubmit() {
    if (modelState.status === 'ready') {
      await chat.submitMessage()
    }
  }

  async function handleSuggestedPrompt(prompt: string) {
    if (modelState.status === 'ready') {
      chat.setInput(prompt)
      await chat.submitMessage(prompt)
    }
  }

  async function handleStop() {
    await chat.stopGeneration()
  }

  const showProgress = modelState.status === 'checking' || modelState.status === 'downloading'
  const unsupportedReason = !capability.checking && !capability.webgpuSupported ? capability.reason : null

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <TopStatusBar capability={capability} compact={hasStarted} modelState={modelState} />
        <PrivacyBanner />

        <main
          className={`flex flex-1 flex-col gap-6 ${hasStarted ? 'justify-start' : 'justify-center pb-12 sm:pb-20'}`}
        >
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            {showProgress && (
              <ProgressBar
                phaseLabel={modelState.phaseLabel}
                progress={modelState.progress}
                receivedBytes={modelState.receivedBytes}
                totalBytes={modelState.totalBytes}
              />
            )}

            {unsupportedReason && (
              <section className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-rose-700">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
                  Unsupported environment
                </p>
                <p className="mt-2 text-base">{unsupportedReason}</p>
              </section>
            )}

            {modelState.error && capability.webgpuSupported && (
              <section className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-rose-700">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
                  Model problem
                </p>
                <p className="mt-2 text-base">{modelState.error}</p>
              </section>
            )}

            {!hasStarted && !unsupportedReason && !modelState.error && (
              <div className="mx-auto w-full max-w-3xl">
                <Composer
                  disabled={composerDisabled}
                  isGenerating={chat.isGenerating}
                  value={chat.input}
                  onChange={chat.setInput}
                  onStop={handleStop}
                  onSubmit={handleSubmit}
                />

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={composerDisabled || chat.isGenerating}
                      onClick={() => void handleSuggestedPrompt(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasStarted && (
              <>
                <ChatTranscript inlineError={chat.inlineError} messages={chat.messages} />
                <Composer
                  compact
                  disabled={composerDisabled}
                  isGenerating={chat.isGenerating}
                  value={chat.input}
                  onChange={chat.setInput}
                  onStop={handleStop}
                  onSubmit={handleSubmit}
                />
              </>
            )}
          </div>
        </main>

        <UtilityFooter
          busy={utilityBusy}
          helperText={utilityText}
          onClearCache={handleClearCache}
          onResetChat={handleResetChat}
          onRetryModel={handleRetryModel}
        />
      </div>
    </div>
  )
}
