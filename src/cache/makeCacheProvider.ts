import { CacheProvider } from './types'

export const makeCacheProvider = <K, V>(): CacheProvider<K, V> => {
  const cache = new Map<K, V>()

  const get = (key: K): V | undefined => cache.get(key)
  const set = (key: K, value: V) => cache.set(key, value)

  return { get, set }
}
