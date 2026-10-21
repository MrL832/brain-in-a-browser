import { CreateMLCEngine, type InitProgressReport, type MLCEngine } from '@mlc-ai/web-llm'
import { useCallback, useEffect, useState } from 'react'

import { MODEL_ID } from '../lib/modelConfig'
import { normalizeProgress } from '../lib/normalizeProgress'
import { clearModelCaches } from '../lib/storage'
import type { CapabilityState, ClearCacheResult, ModelState } from '../types/chat'

const INITIAL_MODEL_STATE: ModelState = {
  status: 'idle',
  progress: 0,
  phaseLabel: 'Waiting for capability check',
  cacheStatus: 'unknown',
}

let engineSingleton: MLCEngine | null = null
let enginePromise: Promise<MLCEngine> | null = null

async function unloadSingleton() {
  if (!engineSingleton) {
    return
  }

  await engineSingleton.unload().catch(() => undefined)
  engineSingleton = null
}

export function useModelEngine(capability: CapabilityState) {
  const [engine, setEngine] = useState<MLCEngine | null>(null)
  const [modelState, setModelState] = useState<ModelState>(INITIAL_MODEL_STATE)

  const initialize = useCallback(
    async (forceReload = false) => {
      if (capability.checking) {
        return null
      }

      if (!capability.webgpuSupported) {
        setEngine(null)
        setModelState({
          status: 'error',
          progress: 0,
          phaseLabel: 'WebGPU unavailable',
          cacheStatus: 'unknown',
          error: capability.reason,
        })
        return null
      }

      if (forceReload) {
        enginePromise = null
        await unloadSingleton()
      }

      let sawDownload = false

      setModelState((current) => ({
        ...current,
        status: 'checking',
        progress: 0,
        phaseLabel: 'Preparing the on-device model',
        cacheStatus: current.cacheStatus === 'unknown' ? 'warming' : current.cacheStatus,
        error: undefined,
      }))

      const handleProgress = (rawProgress: InitProgressReport) => {
        const progress = normalizeProgress(rawProgress)
        sawDownload ||= progress.isDownloading

        setModelState((current) => ({
          ...current,
          status: progress.percentage >= 100 ? 'checking' : 'downloading',
          progress: progress.percentage,
          phaseLabel: progress.phaseLabel,
          cacheStatus: sawDownload ? 'cold' : 'warming',
          receivedBytes: progress.receivedBytes,
          totalBytes: progress.totalBytes,
          timeElapsedMs: progress.timeElapsedMs,
          error: undefined,
        }))
      }

      try {
        if (engineSingleton) {
          engineSingleton.setInitProgressCallback(handleProgress)
          setEngine(engineSingleton)
          setModelState((current) => ({
            ...current,
            status: 'ready',
            progress: 100,
            phaseLabel: 'Model ready on this device',
            cacheStatus: 'hot',
            error: undefined,
          }))
          return engineSingleton
        }

        enginePromise ??= CreateMLCEngine(MODEL_ID, {
          initProgressCallback: handleProgress,
        })

        const nextEngine = await enginePromise
        engineSingleton = nextEngine
        enginePromise = null

        const runtimeStats = await nextEngine.runtimeStatsText().catch(() => undefined)

        setEngine(nextEngine)
        setModelState({
          status: 'ready',
          progress: 100,
          phaseLabel: 'Ready on this device',
          cacheStatus: sawDownload ? 'cold' : 'hot',
          runtimeStats,
        })

        return nextEngine
      } catch (error) {
        enginePromise = null
        setEngine(null)
        setModelState({
          status: 'error',
          progress: 0,
          phaseLabel: 'Model failed to initialize',
          cacheStatus: 'unknown',
          error:
            error instanceof Error
              ? error.message
              : 'The browser could not initialize the local model.',
        })
        return null
      }
    },
    [capability],
  )

  const clearCache = useCallback(async (): Promise<ClearCacheResult> => {
    enginePromise = null
    await unloadSingleton()
    setEngine(null)
    setModelState({
      status: 'idle',
      progress: 0,
      phaseLabel: 'Local cache cleared',
      cacheStatus: 'unknown',
    })

    return clearModelCaches()
  }, [])

  useEffect(() => {
    let timeoutId: number | undefined

    if (!capability.checking) {
      timeoutId = window.setTimeout(() => {
        void initialize(false)
      }, 0)
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [capability.checking, initialize])

  return {
    engine,
    modelState,
    initialize,
    clearCache,
  }
}
