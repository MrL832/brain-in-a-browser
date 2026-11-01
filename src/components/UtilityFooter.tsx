type UtilityFooterProps = {
  busy: boolean
  helperText: string | null
  onClearCache: () => void
  onResetChat: () => void
  onRetryModel: () => void
}

export function UtilityFooter({
  busy,
  helperText,
  onClearCache,
  onResetChat,
  onRetryModel,
}: UtilityFooterProps) {
  return (
    <footer className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            onClick={onRetryModel}
          >
            Retry model
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            onClick={onResetChat}
          >
            Reset chat
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            onClick={onClearCache}
          >
            Clear cache
          </button>
          <a
            className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-50"
            href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API"
            rel="noreferrer"
            target="_blank"
          >
            WebGPU help
          </a>
        </div>

        <p className="max-w-2xl text-slate-400">{helperText ?? 'Clear and simple controls for class use.'}</p>
      </div>
    </footer>
  )
}
