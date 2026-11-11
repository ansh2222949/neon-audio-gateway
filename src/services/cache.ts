/**
 * Memory and Edge Cache Manager
 * Provides 24-hour HTTP cache headers and lightweight in-memory LRU caching.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryStore = new Map<string, CacheEntry<any>>();
const MAX_ENTRIES = 1000;

export const EDGE_CACHE_HEADERS: Record<string, string> = {
  'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
  'CDN-Cache-Control': 'max-age=86400',
  'Cloudflare-CDN-Cache-Control': 'max-age=86400',
};

/**
 * Executes a producer function with transparent in-memory and edge caching.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  producer: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = memoryStore.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  const fresh = await producer();

  if (fresh !== null && fresh !== undefined) {
    if (memoryStore.size >= MAX_ENTRIES) {
      // Remove oldest 20%
      const keysToDelete = Array.from(memoryStore.keys()).slice(0, 200);
      for (const k of keysToDelete) {
        memoryStore.delete(k);
      }
    }

    memoryStore.set(key, {
      value: fresh,
      expiresAt: now + ttlSeconds * 1000,
    });
  }

  return fresh;
}
