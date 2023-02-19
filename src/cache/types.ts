export type CacheProvider<K, V> = {
  get: (key: K) => V | undefined
  set: (key: K, value: V) => void
}
