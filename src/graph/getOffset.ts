import { PingData } from '../types'
import { CacheProvider, withCache } from '../cache'
import { WINDOW } from './constants'
import { interpolate } from './interpolate'

export type GetOffsetOptions = {
  pingData: PingData[],
  time: number,
  cache?: CacheProvider<number, number>,
}

export const getOffset = ({ pingData, time, cache }: GetOffsetOptions): number => {
  const pingsAtTime = pingData.filter(({ arrivedAt }) => arrivedAt <= time)

  if (pingsAtTime.length === 0) {
    return 0
  }

  const lastPing = pingsAtTime[pingsAtTime.length - 1]
 
  if (lastPing.seq < WINDOW){
    return 0
  }

  const getOffsetWithCache = cache
    ? withCache(getOffset, { cache, key: ({ time }) => time })
    : getOffset

  const offsetWhenLastPingArrived = getOffsetWithCache({
    pingData: pingsAtTime.slice(0, -1),
    time: lastPing.arrivedAt,
    cache,
  })

  const targetOffsetAfterTimePeriod = lastPing.seq - WINDOW + 1
  const progress = (time - lastPing.arrivedAt) / 1000
  return interpolate(offsetWhenLastPingArrived, targetOffsetAfterTimePeriod, progress)
}
