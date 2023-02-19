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
