import { Graph } from './types'
import {
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  WINDOW,
} from './constants'
import { getOffset } from './getOffset'
import { getMaxTime } from './getMaxTime'
import { getPathForPings } from './getPathForPings'

export const getUpdate = (graph: Graph) => () => {
  const { svg, state } = graph
  const { line } = svg
  const { pingData, offsetCache, maxTimeCache } = state

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

  const pathString = path.map(({ type, point }) => `${type}${point.x},${point.y}`).join('')
  line.setAttribute('d', pathString)
}
