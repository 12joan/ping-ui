export type PingDataSuccess = {
  isSuccess: true,
  isTimeout: false,
  time: number
}

export type PingDataTimeout = {
  isSuccess: false,
  isTimeout: true,
}

export type PingData = PingDataSuccess | PingDataTimeout
