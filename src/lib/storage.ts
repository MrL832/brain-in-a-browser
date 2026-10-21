import type { ClearCacheResult } from '../types/chat'

function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve) => {
    const request = window.indexedDB.deleteDatabase(name)

    request.onsuccess = () => resolve()
    request.onerror = () => resolve()
    request.onblocked = () => resolve()
  })
}

export async function clearModelCaches(): Promise<ClearCacheResult> {
  let deletedCacheBuckets = 0
  let deletedDatabases = 0

  if ('caches' in window) {
    const cacheKeys = await window.caches.keys()
    const deletions = await Promise.all(cacheKeys.map((key) => window.caches.delete(key)))
    deletedCacheBuckets = deletions.filter(Boolean).length
  }

  if ('indexedDB' in window && 'databases' in window.indexedDB) {
    const databases = await window.indexedDB.databases()
    const names = databases
      .map((database) => database.name)
      .filter((name): name is string => Boolean(name))

    await Promise.all(
      names.map(async (name) => {
        await deleteDatabase(name)
        deletedDatabases += 1
      }),
    )
  }

  return {
    deletedCacheBuckets,
    deletedDatabases,
  }
}
