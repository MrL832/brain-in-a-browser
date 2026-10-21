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
    <footer className="rounded-[24px] border border-white/10 bg-slate-950/50 px-4 py-4 text-sm text-slate-300">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            onClick={onRetryModel}
          >
            Retry model
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            onClick={onResetChat}
          >
            Reset chat
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            onClick={onClearCache}
          >
            Clear cache
          </button>
          <a
            className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5"
            href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API"
            rel="noreferrer"
            target="_blank"
          >
            WebGPU help
          </a>
        </div>

        <p className="max-w-2xl text-slate-400">
          {helperText ??
            'Model weights are cached in browser storage for faster warm starts. Clear cache only when you want a clean re-download.'}
        </p>
      </div>
    </footer>
  )
}
