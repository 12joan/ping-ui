import { Graph } from './types'

export const getDestroy = (graph: Graph) => () => {
  graph.svg.element.remove()
}
