import { PingData } from '../types'
import { Graph } from './types'
import { WINDOW } from './constants'

export const getVisiblePings = (
  _graph: Graph,
  pingData: PingData[],
  careful: boolean = true,
) => pingData.slice(-WINDOW * (careful ? 2 : 1))
