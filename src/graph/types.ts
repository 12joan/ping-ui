import { CacheProvider } from '../cache'

export type Graph = {
  offsetCache: CacheProvider<number, number>
  maxTimeCache: CacheProvider<number, number>
}
