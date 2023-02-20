import { Graph } from './types'
import { VIEWBOX_WIDTH, VIEWBOX_HEIGHT } from './constants'

export const getViewport = (_graph: Graph) => (
  `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`
)
