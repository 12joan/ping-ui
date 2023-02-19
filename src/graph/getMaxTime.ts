import { PingData, PingDataSuccess } from '../types'
import { CacheProvider, withCache } from '../cache'
import { WINDOW, MIN_MAX_TIME } from './constants'
import { interpolate } from './interpolate'

export type GetMaxTimeOptions = {
  pingData: PingData[],
  time: number,
  cache?: CacheProvider<number, number>,
}

export const getMaxTime = ({ pingData, time, cache }: GetMaxTimeOptions): number => {
  const pingsAtTime = pingData.filter(({ arrivedAt }) => arrivedAt <= time)

  if (pingsAtTime.length === 0) {
    return MIN_MAX_TIME
  }

  const lastPing = pingsAtTime[pingsAtTime.length - 1]
  const successPingsAtTime = pingsAtTime.filter(({ isSuccess }) => isSuccess) as PingDataSuccess[]
  const successPingsInWindow = successPingsAtTime.slice(-WINDOW)

  const getMaxTimeWithCache = cache
    ? withCache(getMaxTime, { cache, key: ({ time }) => time })
    : getMaxTime

  const maxTimeWhenLastPingArrived = getMaxTimeWithCache({
    pingData: pingsAtTime.slice(0, -1),
    time: lastPing.arrivedAt,
  })

  const targetMaxTime = Math.max(
    MIN_MAX_TIME,
    ...successPingsInWindow.map(({ time }) => time)
  )

  const progress = (time - lastPing.arrivedAt) / 1000

  return interpolate(maxTimeWhenLastPingArrived, targetMaxTime, progress)
}
