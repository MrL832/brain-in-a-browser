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

  async function handleStop() {
    await chat.stopGeneration()
  }

  const showProgress = modelState.status === 'checking' || modelState.status === 'downloading'
  const unsupportedReason = !capability.checking && !capability.webgpuSupported ? capability.reason : null

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(180deg,_#0f172a,_#020617_65%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <TopStatusBar capability={capability} modelState={modelState} />
        <PrivacyBanner />

        {showProgress && (
          <ProgressBar
            phaseLabel={modelState.phaseLabel}
            progress={modelState.progress}
            receivedBytes={modelState.receivedBytes}
            totalBytes={modelState.totalBytes}
          />
        )}

        {unsupportedReason && (
          <section className="rounded-[24px] border border-rose-300/20 bg-rose-500/10 p-5 text-rose-100">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">
              Unsupported environment
            </p>
            <p className="mt-2 text-base">{unsupportedReason}</p>
          </section>
        )}

        {modelState.error && capability.webgpuSupported && (
          <section className="rounded-[24px] border border-rose-300/20 bg-rose-500/10 p-5 text-rose-100">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">
              Local model error
            </p>
            <p className="mt-2 text-base">{modelState.error}</p>
          </section>
        )}

        <main className="grid flex-1 gap-6">
          <ChatTranscript inlineError={chat.inlineError} messages={chat.messages} />

          <Composer
            disabled={composerDisabled}
            isGenerating={chat.isGenerating}
            value={chat.input}
            onChange={chat.setInput}
            onStop={handleStop}
            onSubmit={handleSubmit}
          />
        </main>

        <UtilityFooter
          busy={utilityBusy}
          helperText={utilityText ?? modelState.runtimeStats ?? null}
          onClearCache={handleClearCache}
          onResetChat={handleResetChat}
          onRetryModel={handleRetryModel}
        />
      </div>
    </div>
  )
}
