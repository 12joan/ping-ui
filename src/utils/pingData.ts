import {
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

