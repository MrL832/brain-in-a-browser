import { APP_NAME, MODEL_LABEL } from '../lib/modelConfig'
import type { CapabilityState, ModelState } from '../types/chat'

type TopStatusBarProps = {
  capability: CapabilityState
  modelState: ModelState
  compact?: boolean
}

function statusTone(status: ModelState['status']) {
  switch (status) {
    case 'ready':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'error':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    case 'downloading':
    case 'checking':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'generating':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    default:
      return 'border-slate-200 bg-white text-slate-600'
  }
}

function capabilityText(capability: CapabilityState) {
  if (capability.checking) {
    return 'Checking device'
  }

  if (!capability.webgpuSupported) {
    return 'Device not ready'
  }

  return capability.adapterName ? `Ready on this device` : 'Ready on this device'
}

export function TopStatusBar({ capability, modelState, compact = false }: TopStatusBarProps) {
  return (
    <header
      className={`flex flex-col items-center gap-4 px-4 text-center ${compact ? 'pt-4 sm:pt-6' : 'pt-8 sm:pt-14'}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          <span>Brain in a Browser</span>
        </div>

        <div>
          <h1
            className={`font-medium tracking-tight text-slate-900 ${
              compact ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-6xl'
            }`}
          >
            {APP_NAME}
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">{MODEL_LABEL}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm">
          Runs on this device
        </span>
        <span
          className={`rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm ${statusTone(modelState.status)}`}
        >
          {modelState.status === 'downloading' || modelState.status === 'checking'
            ? 'Loading model'
            : modelState.status === 'generating'
              ? 'Thinking'
              : capabilityText(capability)}
        </span>
      </div>
    </header>
  )
}
