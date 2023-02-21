import { PingData } from '../types'
import { Graph } from './types'
import { WINDOW } from './constants'

export const getVisiblePings = (
  _graph: Graph,
  pingData: PingData[],
  includePartiallyVisible: boolean = true
) => pingData.slice(-WINDOW - (includePartiallyVisible ? 1 : 0))
