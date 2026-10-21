import { APP_NAME, MODEL_LABEL } from '../lib/modelConfig'
import type { CapabilityState, ModelState } from '../types/chat'

type TopStatusBarProps = {
  capability: CapabilityState
  modelState: ModelState
}

function statusTone(status: ModelState['status']) {
  switch (status) {
    case 'ready':
      return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30'
    case 'error':
      return 'bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-400/30'
    case 'downloading':
    case 'checking':
      return 'bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-300/30'
    case 'generating':
      return 'bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30'
    default:
      return 'bg-white/10 text-slate-200 ring-1 ring-inset ring-white/15'
  }
}

function cacheTone(cacheStatus: ModelState['cacheStatus']) {
  switch (cacheStatus) {
    case 'hot':
      return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30'
    case 'cold':
      return 'bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-300/30'
    case 'warming':
      return 'bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30'
    default:
      return 'bg-white/10 text-slate-200 ring-1 ring-inset ring-white/15'
  }
}

function capabilityText(capability: CapabilityState) {
  if (capability.checking) {
    return 'Checking WebGPU'
  }

  if (!capability.webgpuSupported) {
    return 'WebGPU unavailable'
  }

  return capability.adapterName ? `WebGPU ready: ${capability.adapterName}` : 'WebGPU ready'
}

export function TopStatusBar({ capability, modelState }: TopStatusBarProps) {
  return (
    <header className="rounded-[28px] border border-white/10 bg-slate-950/70 px-5 py-5 shadow-2xl shadow-slate-950/30 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200/75">
            Privacy-first AI chat
          </p>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {APP_NAME}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-300 sm:text-lg">
              Single-page, classroom-safe local inference with visible readiness, download, and
              streaming states.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
          <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-inset ring-white/10">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Model</p>
            <p className="mt-1 text-sm font-medium text-white">{MODEL_LABEL}</p>
          </div>

          <div className={`rounded-2xl px-3 py-3 text-sm font-medium ${statusTone(modelState.status)}`}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-current/70">Status</p>
            <p className="mt-1">{modelState.phaseLabel}</p>
          </div>

          <div className={`rounded-2xl px-3 py-3 text-sm font-medium ${cacheTone(modelState.cacheStatus)}`}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-current/70">Cache</p>
            <p className="mt-1 capitalize">{modelState.cacheStatus}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
        <p>{capabilityText(capability)}</p>
        <p className="text-slate-400">No backend, no auth, no server-side prompt storage.</p>
      </div>
    </header>
  )
}
