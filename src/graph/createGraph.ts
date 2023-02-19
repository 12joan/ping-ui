import { PingData } from '../types'
import { makeCacheProvider } from '../cache'
import { Graph, GraphOptions, GraphSVG, GraphState } from './types'
import { createSVG } from './createSVG'
import { getDestroy } from './getDestroy'
import { getSetPingData } from './getSetPingData'
import { getUpdate } from './getUpdate'

class GraphClass implements Graph {
  container: HTMLElement
  svg: GraphSVG
  state: GraphState
  setPingData: (pingData: PingData[]) => void
  update: () => void
  destroy: () => void

  constructor({ container }: GraphOptions) {
    this.container = container
    this.svg = createSVG(container)
    this.state = {
      pingData: [],
      offsetCache: makeCacheProvider(),
      maxTimeCache: makeCacheProvider(),
    }
    this.setPingData = getSetPingData(this)
    this.update = getUpdate(this)
    this.destroy = getDestroy(this)

    const updateLoop = () => {
      this.update()
      requestAnimationFrame(updateLoop)
    }

    updateLoop()
  }
}

export const createGraph = (options: GraphOptions): Graph => new GraphClass(options)
