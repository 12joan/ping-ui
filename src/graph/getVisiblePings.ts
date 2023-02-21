import { PingData } from '../types'
import { Graph } from './types'
import { WINDOW } from './constants'

export const getVisiblePings = (
  _graph: Graph,
  pingData: PingData[],
) => pingData.slice(-WINDOW - 1)
