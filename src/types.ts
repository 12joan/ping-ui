export type PingDataSuccess = {
  isSuccess: true
  isTimeout: false
  seq: number
  time: number
}

export type PingDataTimeout = {
  isSuccess: false
  isTimeout: true
  seq: number
}

export type PingData = PingDataSuccess | PingDataTimeout

export type PingDataAnalysis = {
  overallMean: number
  last10Mean: number
  overallSuccessRate: number
  last10SuccessRate: number
}
