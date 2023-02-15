import {
  PingData,
  PingDataSuccess,
  PingDataTimeout,
} from '../types'

export type PingDataSuccessOptions = {
  seq: number
  time: number
}

export type PingDataTimeoutOptions = {
  seq: number
}

export const makePingDataSuccess = (
  options: PingDataSuccessOptions,
): PingDataSuccess => ({
  isSuccess: true,
  isTimeout: false,
  ...options,
})

export const makePingDataTimeout = (
  options: PingDataTimeoutOptions,
): PingDataTimeout => ({
  isSuccess: false,
  isTimeout: true,
  ...options,
})

export const parsePingData = (data: string): PingData | null => {
  const isSuccess = data.includes('bytes from')
  const isTimeout = data.includes('Request timeout')

  if (!isSuccess && !isTimeout) {
    return null
  }

  const seqMatch = data.match(/icmp_seq[= ](\d+)/)

  if (!seqMatch) {
    throw new Error(`Could not parse seq from ping data: ${data}`)
  }

  const seq = parseInt(seqMatch[1], 10)

  if (isSuccess) {
    const timeMatch = data.match(/time=(\d+\.\d+)/)

    if (!timeMatch) {
      throw new Error(`Could not parse time from ping data: ${data}`)
    }

    return makePingDataSuccess({
      seq,
      time: parseFloat(timeMatch[1]),
    })
  }

  return makePingDataTimeout({ seq })
}

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
