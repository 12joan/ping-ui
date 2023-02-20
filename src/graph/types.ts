import { CacheProvider } from '../cache'

export type Graph = {
  offsetCache: CacheProvider<number, number>
  maxTimeCache: CacheProvider<number, number>
}

export type Point = {
  x: number
  y: number
}

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
