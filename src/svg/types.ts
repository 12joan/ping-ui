import { Point } from '../types'

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
