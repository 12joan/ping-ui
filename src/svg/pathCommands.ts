import { Point } from '../types'
import {
  SVGPathMoveCommand,
  SVGPathLineCommand,
} from './types'

export const move = (point: Point): SVGPathMoveCommand => ({
  type: 'M',
  point,
})

export const line = (point: Point): SVGPathLineCommand => ({
  type: 'L',
  point,
})
