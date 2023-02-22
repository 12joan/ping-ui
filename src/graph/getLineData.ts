import {
  PingData,
  PingDataSuccess,
} from '../types'
import { Graph, Point } from './types'
import { getVisiblePings } from './getVisiblePings'
import { interpolatePoints } from './interpolatePoints'

type SVGPathMoveCommand = {
  type: 'M'
  point: Point
}

type SVGPathLineCommand = {
  type: 'L'
  point: Point
}

type SVGPathCommand = SVGPathMoveCommand | SVGPathLineCommand

type SVGPath = SVGPathCommand[]

const pathToString = (path: SVGPath) => path.map(({ type, point }) => (
  `${type} ${point.x} ${point.y}`
)).join(' ')

export type GetLineDataOptions = {
  pingData: PingData[],
  time: number,
}

export const getLineData = (graph: Graph, { pingData, time }: GetLineDataOptions) => {
  const visiblePings = getVisiblePings(graph, pingData)

  const lineCommands: SVGPathCommand[] = []
  const areaCommands: SVGPathCommand[] = []
  let newLine = true
  let previousPoint: Point | null = null

  const finishArea = () => {
    if (areaCommands.length > 0) {
      const lastPoint = areaCommands[areaCommands.length - 1].point

      areaCommands.push({
        type: 'L',
        point: {
          x: lastPoint.x,
          y: 0,
        },
      })
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
      lineCommands.push({
        type: 'M',
        point,
      } as SVGPathMoveCommand)

      areaCommands.push({
        type: 'M',
        point: {...point, y: 0 },
      } as SVGPathMoveCommand)

      areaCommands.push({
        type: 'L',
        point,
      } as SVGPathLineCommand)

      newLine = false
      previousPoint = point

      return
    }

    const isLast = i === visiblePings.length - 1
    const progress = (time - ping.arrivedAt) / 1000

    const interpolatedPoint = isLast
      ? interpolatePoints(previousPoint!, point, progress)
      : point

    lineCommands.push({
      type: 'L',
      point: interpolatedPoint,
    } as SVGPathLineCommand)

    areaCommands.push({
      type: 'L',
      point: interpolatedPoint,
    } as SVGPathLineCommand)

    previousPoint = point
  })

  finishArea()

  return [
    pathToString(lineCommands),
    pathToString(areaCommands),
  ]
}
