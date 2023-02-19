import { CacheProvider } from './types'

export type WithCacheOptions<K, V, A extends any[]> = {
  cache: CacheProvider<K, V>
  key: (...args: A) => K
}

export const withCache = <K, V, A extends any[]>(
  fn: (...args: A) => V,
  options: WithCacheOptions<K, V, A>
) => (...args: A): V => {
  const {
    cache: { get, set },
    key,
  } = options

  const cacheKey = key(...args)
  const cachedValue = get(cacheKey)

  if (cachedValue !== undefined) {
    return cachedValue
  }

  const value = fn(...args)
  set(cacheKey, value)

  return value
}
