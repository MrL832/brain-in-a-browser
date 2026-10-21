import { formatBytes } from '../lib/normalizeProgress'

type ProgressBarProps = {
  progress: number
  phaseLabel: string
  receivedBytes?: number
  totalBytes?: number
}

export function ProgressBar({
  progress,
  phaseLabel,
  receivedBytes,
  totalBytes,
}: ProgressBarProps) {
  const formattedReceived = formatBytes(receivedBytes)
  const formattedTotal = formatBytes(totalBytes)

  return (
    <section className="rounded-[24px] border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-amber-200">
            Preparing local model
          </p>
          <p className="mt-1 text-amber-50/90">{phaseLabel}</p>
        </div>
        <div className="text-right text-sm font-medium text-amber-100">{progress}%</div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 to-cyan-300 transition-[width] duration-300"
          style={{ width: `${Math.max(progress, 6)}%` }}
        />
      </div>

      {(formattedReceived || formattedTotal) && (
        <p className="mt-3 text-xs text-amber-100/80">
          {formattedReceived ?? '0 B'}
          {' / '}
          {formattedTotal ?? 'unknown'}
        </p>
      )}
    </section>
  )
}
