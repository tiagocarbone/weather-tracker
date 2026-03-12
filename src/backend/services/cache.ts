import { CacheEntry } from '../types';

const TTL = 1000 * 60 * 15; // 15 minutes

const cache = new Map<string, CacheEntry>();

export function getCached<T>(key: string): T | undefined {
  const e = cache.get(key);
  if (!e) return undefined;
  if (Date.now() - e.ts > TTL) {
    cache.delete(key);
    return undefined;
  }
  return e.data as T;
}

export async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = getCached<T>(key);
  if (existing !== undefined) return Promise.resolve(existing);
  const data = await fn();
  cache.set(key, { ts: Date.now(), data });
  return data;
}

export function findInSuggests(predicate: (item: unknown) => boolean): boolean {
  for (const [k, v] of cache.entries()) {
    if (!k.startsWith('suggest:')) continue;
    const items = v.data as unknown[];
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      if (predicate(it)) return true;
    }
  }
  return false;
}

export function clearCache() {
  cache.clear();
}
