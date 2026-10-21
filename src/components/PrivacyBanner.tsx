export function PrivacyBanner() {
  return (
    <section className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-50 shadow-lg shadow-cyan-950/10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-cyan-200">Local only</p>
          <p className="mt-1 max-w-3xl text-sm text-cyan-50/90">
            This chat runs locally in your browser. Prompts stay on device and the model runs in
            browser memory and WebGPU unless you explicitly copy or export the text yourself.
          </p>
        </div>

        <div className="rounded-full bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-cyan-100 ring-1 ring-inset ring-cyan-300/20">
          Privacy boundary visible at all times
        </div>
      </div>
    </section>
  )
}
