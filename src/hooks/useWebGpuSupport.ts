import { useEffect, useState } from 'react'

import type { CapabilityState } from '../types/chat'

const INITIAL_STATE: CapabilityState = {
  checking: true,
  webgpuSupported: false,
}

type GPUAdapterWithInfo = GPUAdapter & {
  info?: {
    vendor?: string
    architecture?: string
    device?: string
    description?: string
  }
}

function formatAdapterName(adapter: GPUAdapterWithInfo): string | undefined {
  const parts = [
    adapter.info?.vendor,
    adapter.info?.architecture,
    adapter.info?.device,
    adapter.info?.description,
  ].filter(Boolean)

  if (parts.length === 0) {
    return undefined
  }

  return parts.join(' • ')
}

export function useWebGpuSupport() {
  const [capability, setCapability] = useState<CapabilityState>(INITIAL_STATE)

  useEffect(() => {
    let cancelled = false

    async function detect() {
      if (!('gpu' in navigator)) {
        if (!cancelled) {
          setCapability({
            checking: false,
            webgpuSupported: false,
            reason:
              'WebGPU is not available in this browser. Try the latest Chrome or Edge with hardware acceleration enabled.',
          })
        }

        return
      }

      try {
        const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapterWithInfo | null

        if (!adapter) {
          throw new Error(
            'A compatible GPU adapter was not found. Check browser version, drivers, and hardware acceleration.',
          )
        }

        const device = await adapter.requestDevice()
        device.destroy()

        if (!cancelled) {
          setCapability({
            checking: false,
            webgpuSupported: true,
            adapterName: formatAdapterName(adapter),
          })
        }
      } catch (error) {
        if (!cancelled) {
          setCapability({
            checking: false,
            webgpuSupported: false,
            reason:
              error instanceof Error
                ? error.message
                : 'WebGPU detection failed on this device. Try a Chromium-based browser with hardware acceleration enabled.',
          })
        }
      }
    }

    void detect()

    return () => {
      cancelled = true
    }
  }, [])

  return capability
}
