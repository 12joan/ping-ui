import { makeCacheProvider } from '../cache'
import { Graph } from './types'

export const makeGraph = (): Graph => ({
  offsetCache: makeCacheProvider(),
  maxTimeCache: makeCacheProvider(),
})
