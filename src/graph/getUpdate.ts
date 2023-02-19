import { Graph } from './types'
import {
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  WINDOW,
} from './constants'
import { getOffset } from './getOffset'
import { getMaxTime } from './getMaxTime'

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

  const points = pingData.filter(({ isSuccess }) => isSuccess).map(({ seq, time }) => {
    const x = (seq - offset) * (VIEWBOX_WIDTH / WINDOW)
    const y = VIEWBOX_HEIGHT - (time / maxTime) * VIEWBOX_HEIGHT
    return `${x},${y}`
  })

  if (points.length > 1) {
    line.setAttribute('d', `M${points.join('L')}`)
  }
}
