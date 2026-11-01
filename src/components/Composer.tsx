type ComposerProps = {
  value: string
  disabled: boolean
  isGenerating: boolean
  compact?: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
}

export function Composer({
  value,
  disabled,
  isGenerating,
  compact = false,
  onChange,
  onSubmit,
  onStop,
}: ComposerProps) {
  const placeholder = disabled
    ? 'Please wait while the model gets ready.'
    : 'Ask anything...'

  return (
    <section
      className={`z-10 rounded-[30px] border border-slate-200 bg-white px-3 py-3 shadow-sm ${
        compact ? 'sticky bottom-4' : ''
      }`}
    >
      <div className="grid gap-3">
        <textarea
          id="brain-input"
          className={`w-full rounded-[24px] bg-transparent px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${
            compact ? 'min-h-[72px] py-3' : 'min-h-[88px] py-4'
          }`}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isGenerating}
              onClick={onStop}
            >
              Stop
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              disabled={disabled || !value.trim() || isGenerating}
              onClick={onSubmit}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
