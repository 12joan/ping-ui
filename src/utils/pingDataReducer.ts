import { PingData } from '../types'

export type PingDataReducerInsertAction = {
  type: 'insert'
  data: PingData
}

export type PingDataReducerClearAction = {
  type: 'clear'
}

export type PingDataReducerAction =
  | PingDataReducerInsertAction
  | PingDataReducerClearAction

export const pingDataReducer = (
  state: PingData[],
  action: PingDataReducerAction,
): PingData[] => {
  switch (action.type) {
    case 'insert':
      const index = state.findIndex((data) => data.seq === action.data.seq)
      return index === -1
        ? [...state, action.data].sort((a, b) => a.seq - b.seq)
        : state.map((data, i) => (i === index ? action.data : data))

    case 'clear':
      return []

    default:
      throw new Error('Invalid action type')
  }
}
