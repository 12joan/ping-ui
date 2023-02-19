import { Point } from './types'
import { interpolate } from './interpolate'

export const interpolatePoints = (a: Point, b: Point, progress: number): Point => ({
  x: interpolate(a.x, b.x, progress),
  y: interpolate(a.y, b.y, progress),
})
