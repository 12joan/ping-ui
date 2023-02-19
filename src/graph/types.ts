import { PingData } from '../types'
import { CacheProvider } from '../cache'

export type GraphSVG = {
  element: SVGSVGElement
  line: SVGPathElement
}

export type GraphOptions = {
  container: HTMLElement
}

export type GraphState = {
  pingData: PingData[]
  offsetCache: CacheProvider<number, number>
  maxTimeCache: CacheProvider<number, number>
}

export type Graph = GraphOptions & {
  svg: GraphSVG
  state: GraphState
  setPingData: (pingData: PingData[]) => void
  update: () => void
  destroy: () => void
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
