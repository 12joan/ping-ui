import { PingData } from '../types'
import { Graph } from './types'

export const getSetPingData = ({ state }: Graph) => (pingData: PingData[]) => {
  state.pingData = pingData
}
