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
  const last60Successes = overallSuccesses.slice(-60)
  const successesInLast60 = subsetSuccesses(pingData.slice(-60))

  const overallMean = subsetMean(overallSuccesses)
  const last60Mean = subsetMean(last60Successes)

  const overallSuccessRate = getSuccesRate(overallSuccesses.length, pingData.length)
  const last60SuccessRate = getSuccesRate(successesInLast60.length, Math.min(pingData.length, 60))

  return {
    overallMean,
    last60Mean,
    overallSuccessRate,
    last60SuccessRate,
  }
}
