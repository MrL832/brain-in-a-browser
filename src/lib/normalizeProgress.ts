import type { InitProgressReport } from '@mlc-ai/web-llm'

import type { NormalizedProgress } from '../types/chat'

const DOWNLOAD_HINT = /(download|fetch|cache miss|transferring|loading model|artifact)/i
const BYTE_PAIR_PATTERN =
  /(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|KiB|MiB|GiB)\s*\/\s*(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|KiB|MiB|GiB)/i

const BYTE_MULTIPLIERS: Record<string, number> = {
  b: 1,
  kb: 1_000,
  mb: 1_000_000,
  gb: 1_000_000_000,
  kib: 1_024,
  mib: 1_048_576,
  gib: 1_073_741_824,
}

function toBytes(value: string, unit: string): number | undefined {
  const multiplier = BYTE_MULTIPLIERS[unit.toLowerCase()]

  if (!multiplier) {
    return undefined
  }

  return Math.round(Number(value) * multiplier)
}

export function formatBytes(bytes?: number): string | null {
  if (!bytes || Number.isNaN(bytes)) {
    return null
  }

  if (bytes >= 1_000_000_000) {
    return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  }

  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(1)} MB`
  }

  if (bytes >= 1_000) {
    return `${(bytes / 1_000).toFixed(1)} KB`
  }

  return `${bytes} B`
}

export function normalizeProgress(report: InitProgressReport): NormalizedProgress {
  const rawText = report.text?.trim() || 'Preparing model'
  const match = rawText.match(BYTE_PAIR_PATTERN)

  const receivedBytes = match ? toBytes(match[1], match[2]) : undefined
  const totalBytes = match ? toBytes(match[3], match[4]) : undefined

  return {
    percentage: Math.max(0, Math.min(100, Math.round((report.progress || 0) * 100))),
    phaseLabel: rawText,
    rawText,
    receivedBytes,
    totalBytes,
    timeElapsedMs: Math.round((report.timeElapsed || 0) * 1_000),
    isDownloading: DOWNLOAD_HINT.test(rawText),
  }
}
