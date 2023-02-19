import {
  PingDataSuccess,
  PingDataTimeout,
} from '../types'

export type PingDataSuccessOptions = Partial<PingDataSuccess> & {
  seq: number
  time: number
}

export type PingDataTimeoutOptions = Partial<PingDataTimeout> & {
  seq: number
}

export const makePingDataSuccess = (
  options: PingDataSuccessOptions,
): PingDataSuccess => ({
  isSuccess: true,
  isTimeout: false,
  arrivedAt: performance.now(),
  ...options,
})

export const makePingDataTimeout = (
  options: PingDataTimeoutOptions,
): PingDataTimeout => ({
  isSuccess: false,
  isTimeout: true,
  arrivedAt: performance.now(),
  ...options,
})

