import { PingData } from '../types'
import { CacheProvider, withCache } from '../cache'
import { Graph } from './types'
import { WINDOW } from './constants'
import { interpolate } from './interpolate'

export type GetOffsetOptions = {
  pingData: PingData[],
  time: number,
}

export const getOffset = (graph: Graph, { pingData, time }: GetOffsetOptions): number => {
  const pingsAtTime = pingData.filter(({ arrivedAt }) => arrivedAt <= time)

  if (pingsAtTime.length === 0) {
    return 0
  }

  const lastPing = pingsAtTime[pingsAtTime.length - 1]
 
  if (lastPing.seq < WINDOW){
    return 0
  }

  const getOffsetWithCache = withCache(getOffset, {
    cache: graph.offsetCache,
    key: (_graph, { time }) => time,
  })

  const offsetWhenLastPingArrived = getOffsetWithCache(graph, {
    pingData: pingsAtTime.slice(0, -1),
    time: lastPing.arrivedAt,
  })

  const targetOffsetAfterTimePeriod = lastPing.seq - WINDOW + 1
  const progress = (time - lastPing.arrivedAt) / 1000
  return interpolate(offsetWhenLastPingArrived, targetOffsetAfterTimePeriod, progress)
}
