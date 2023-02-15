import {
  PingData,
  PingDataSuccess,
  PingDataTimeout,
} from '../types'

export const makePingDataSuccess = (time: number): PingDataSuccess => ({
  isSuccess: true,    
  isTimeout: false,
  time,
})

export const makePingDataTimeout = (): PingDataTimeout => ({
  isSuccess: false,
  isTimeout: true,
})

export const parsePingData = (data: string): PingData | null => {
  const match = data.match(/time=(\d+\.?\d*) ms/)

  if (match) {
    const time = parseFloat(match[1])
    return makePingDataSuccess(time)
  }

  if (data.includes('Request timeout')) {
    return makePingDataTimeout()
  }

  return null
}
