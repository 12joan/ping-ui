import {
  PingData,
  PingDataSuccess,
  Point,
} from '../types'
import {
  line,
  move,
  pathToString,
  SVGPath,
} from '../svg'
import { PING_INTERVAL } from './constants'
import { Graph } from './types'
import { getVisiblePings } from './getVisiblePings'
import { interpolatePoints } from './interpolatePoints'

export type GetLineDataOptions = {
  pingData: PingData[],
  time: number,
}

export const getLineData = (graph: Graph, { pingData, time }: GetLineDataOptions) => {
  const visiblePings = getVisiblePings(graph, pingData)

  const linePath: SVGPath = []
  const areaPath: SVGPath = []
  let newLine = true
  let previousPoint: Point | null = null

  const finishArea = () => {
    if (areaPath.length > 0) {
      const lastPoint = areaPath[areaPath.length - 1].point
      areaPath.push(line({ ...lastPoint, y: 0 }))
    }
  }

  visiblePings.forEach((ping, i) => {
    if (ping.isTimeout) {
      finishArea()
      newLine = true
      return
    }

    const point: Point = { x: ping.seq, y: ping.time }

    if (newLine) {
      linePath.push(move(point))
      areaPath.push(move({ ...point, y: 0 }))
      areaPath.push(line(point))

      newLine = false
      previousPoint = point

      return
    }

    const isLast = i === visiblePings.length - 1
    const progress = (time - ping.arrivedAt) / PING_INTERVAL

    const interpolatedPoint = isLast
      ? interpolatePoints(previousPoint!, point, progress)
      : point

    linePath.push(line(interpolatedPoint))
    areaPath.push(line(interpolatedPoint))

    previousPoint = point
  })

  finishArea()

  return [
    pathToString(linePath),
    pathToString(areaPath),
  ]
}
