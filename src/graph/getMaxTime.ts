import { PingData, PingDataSuccess } from '../types'
import { CacheProvider, withCache } from '../cache'
import { Graph } from './types'
import { WINDOW, MIN_MAX_TIME, PING_INTERVAL } from './constants'
import { getVisiblePings } from './getVisiblePings'
import { interpolate } from './interpolate'

export type GetMaxTimeOptions = {
  pingData: PingData[],
  time: number,
}

export const getMaxTime = (graph: Graph, { pingData, time }: GetMaxTimeOptions): number => {
  const pingsAtTime = pingData.filter(({ arrivedAt }) => arrivedAt <= time)

  if (pingsAtTime.length === 0) {
    return MIN_MAX_TIME
  }

  const lastPing = pingsAtTime[pingsAtTime.length - 1]

  const visiblePings = getVisiblePings(graph, pingsAtTime, false)
  const successPings = visiblePings.filter(({ isSuccess }) => isSuccess) as PingDataSuccess[]

  const getMaxTimeWithCache = withCache(getMaxTime, {
    cache: graph.maxTimeCache,
    key: (_graph, { time }) => time,
  })

  const maxTimeWhenLastPingArrived = getMaxTimeWithCache(graph, {
    pingData: pingsAtTime.slice(0, -1),
    time: lastPing.arrivedAt,
  })

  const targetMaxTime = Math.max(
    MIN_MAX_TIME,
    ...successPings.map(({ time }) => time)
  )

  const progress = (time - lastPing.arrivedAt) / PING_INTERVAL

  return interpolate(maxTimeWhenLastPingArrived, targetMaxTime, progress)
}
