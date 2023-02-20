import { PingData } from '../types'
import { Graph } from './types'
import {
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  WINDOW,
} from './constants'
import { getOffset } from './getOffset'
import { getPathForPings } from './getPathForPings'
import { getMaxTime } from './getMaxTime'

export const getPathData = (graph: Graph, pingData: PingData[]) => {
  const { offsetCache, maxTimeCache } = graph

  const offset = getOffset({
    pingData,
    time: performance.now(),
    cache: offsetCache,
  })

  const maxTime = getMaxTime({
    pingData,
    time: performance.now(),
    cache: maxTimeCache,
  })

  const path = getPathForPings({
    pingData,
    time: performance.now(),
    pointForPing: ({ seq, time }) => {
      const x = (seq - offset) * (VIEWBOX_WIDTH / WINDOW)
      const y = VIEWBOX_HEIGHT - (time / maxTime) * VIEWBOX_HEIGHT
      return { x, y }
    },
  })

  return path.map(({ type, point }) => `${type}${point.x},${point.y}`).join('')
}
