export type CapabilityState = {
  checking: boolean
  webgpuSupported: boolean
  adapterName?: string
  reason?: string
}

export type ModelStatus =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'ready'
  | 'generating'
  | 'error'

export type CacheStatus = 'unknown' | 'cold' | 'warming' | 'hot'

export type ModelState = {
  status: ModelStatus
  progress: number
  phaseLabel: string
  cacheStatus: CacheStatus
  error?: string
  receivedBytes?: number
  totalBytes?: number
  timeElapsedMs?: number
  runtimeStats?: string
}

export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: number
  streaming?: boolean
  partial?: boolean
}

export type ChatStore = {
  messages: ChatMessage[]
  input: string
}

export type NormalizedProgress = {
  percentage: number
  phaseLabel: string
  rawText: string
  receivedBytes?: number
  totalBytes?: number
  timeElapsedMs: number
  isDownloading: boolean
}

export type ClearCacheResult = {
  deletedCacheBuckets: number
  deletedDatabases: number
}
