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
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <p className="truncate text-slate-600">{phaseLabel}</p>
          <div className="text-sm font-medium text-slate-500">{progress}%</div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-[width] duration-300"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </div>

        {(formattedReceived || formattedTotal) && (
          <p className="mt-2 text-xs text-slate-400">
            {formattedReceived ?? '0 B'}
            {' / '}
            {formattedTotal ?? 'unknown'}
          </p>
        )}
      </div>
    </section>
  )
}
