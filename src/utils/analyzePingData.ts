import {
  PingData,
  PingDataAnalysis,
  PingDataSuccess,
} from '../types'

const subsetSuccesses = (subset: PingData[]): PingDataSuccess[] => (
  subset.filter(({ isSuccess }) => isSuccess) as PingDataSuccess[]
)

const subsetMean = (subset: PingDataSuccess[]) => {
  if (subset.length === 0) {
    return 0
  }

  const sum = subset.reduce((acc, { time }) => acc + time, 0)
  return sum / subset.length
}

const getSuccesRate = (successCount: number, totalCount: number) => {
  if (totalCount === 0) {
    return 0
  }

  return successCount / totalCount
}

export const analyzePingData = (pingData: PingData[]): PingDataAnalysis => {
  const overallSuccesses = subsetSuccesses(pingData)
  const last10Successes = overallSuccesses.slice(-10)
  const successesInLast10 = subsetSuccesses(pingData.slice(-10))

  const overallMean = subsetMean(overallSuccesses)
  const last10Mean = subsetMean(last10Successes)

  const overallSuccessRate = getSuccesRate(overallSuccesses.length, pingData.length)
  const last10SuccessRate = getSuccesRate(successesInLast10.length, Math.min(pingData.length, 10))

  return {
    overallMean,
    last10Mean,
    overallSuccessRate,
    last10SuccessRate,
  }
}
