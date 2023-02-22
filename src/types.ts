export type PingDataSuccess = {
  isSuccess: true
  isTimeout: false
  seq: number
  arrivedAt: number
  time: number
}

export type PingDataTimeout = {
  isSuccess: false
  isTimeout: true
  seq: number
  arrivedAt: number
}

export type PingData = PingDataSuccess | PingDataTimeout

export type PingDataAnalysis = {
  overallMean: number
  last60Mean: number
  overallSuccessRate: number
  last60SuccessRate: number
}
