type ComposerProps = {
  value: string
  disabled: boolean
  isGenerating: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
}

export function Composer({
  value,
  disabled,
  isGenerating,
  onChange,
  onSubmit,
  onStop,
}: ComposerProps) {
  const placeholder = disabled
    ? 'Wait for WebGPU and the local model to become ready.'
    : 'Ask something simple to test local streaming on this device.'

  return (
    <section className="sticky bottom-4 z-10 rounded-[28px] border border-white/10 bg-slate-950/85 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <div className="grid gap-3">
        <label className="text-sm font-medium text-slate-300" htmlFor="brain-input">
          Prompt
        </label>

        <textarea
          id="brain-input"
          className="min-h-[120px] rounded-[24px] border border-white/10 bg-slate-900/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Submit is disabled while the model is generating, but stop remains available.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-full border border-rose-300/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isGenerating}
              onClick={onStop}
            >
              Stop
            </button>
            <button
              type="button"
              className="rounded-full bg-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
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
