import {
  PingData,
  PingDataSuccess,
} from '../types'
import { Graph, Point } from './types'
import { getVisiblePings } from './getVisiblePings'
import { interpolatePoints } from './interpolatePoints'

export type SVGPathMoveCommand = {
  type: 'M'
  point: Point
}

export type SVGPathLineCommand = {
  type: 'L'
  point: Point
}

export type SVGPathCommand = SVGPathMoveCommand | SVGPathLineCommand

export type SVGPath = SVGPathCommand[]

export type GetPathDataOptions = {
  pingData: PingData[],
  time: number,
}

export const getPathData = (graph: Graph, { pingData, time }: GetPathDataOptions) => {
  const visiblePings = getVisiblePings(graph, pingData)

  const commands: SVGPathCommand[] = []
  let newLine = true
  let previousPoint: Point | null = null

  visiblePings.forEach((ping, i) => {
    if (ping.isTimeout) {
      newLine = true
      return
    }

    const point: Point = { x: ping.seq, y: ping.time }

    if (newLine) {
      commands.push({
        type: 'M',
        point,
      } as SVGPathMoveCommand)

      newLine = false
      previousPoint = point

      return
    }

    const isLast = i === visiblePings.length - 1
    const progress = (time - ping.arrivedAt) / 1000

    const interpolatedPoint = isLast
      ? interpolatePoints(previousPoint!, point, progress)
      : point

    commands.push({
      type: 'L',
      point: interpolatedPoint,
    } as SVGPathLineCommand)

    previousPoint = point
  })

  return commands.map(({ type, point }) => `${type}${point.x},${point.y}`).join('')
}
