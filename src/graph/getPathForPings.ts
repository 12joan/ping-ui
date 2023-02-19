import { PingData, PingDataSuccess } from '../types'
import {
  Point,
  SVGPathMoveCommand,
  SVGPathLineCommand,
  SVGPathCommand,
  SVGPath,
} from './types'
import { interpolatePoints } from './interpolatePoints'

export type GetPathForPingsOptions = {
  pingData: PingData[],
  time: number,
  pointForPing: (ping: PingDataSuccess) => Point
}

export const getPathForPings = ({ pingData, time, pointForPing }: GetPathForPingsOptions): SVGPath => {
  const commands: SVGPathCommand[] = []
  let newLine = true
  let previousPoint: Point | null = null

  pingData.forEach((ping, i) => {
    if (ping.isTimeout) {
      newLine = true
      return
    }

    const point = pointForPing(ping as PingDataSuccess)

    if (newLine) {
      commands.push({
        type: 'M',
        point,
      } as SVGPathMoveCommand)

      newLine = false
      previousPoint = point

      return
    }

    const isLast = i === pingData.length - 1
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

  return commands
}
