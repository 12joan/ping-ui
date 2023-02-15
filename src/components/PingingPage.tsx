import { useMemo } from 'preact/hooks'
import { PingData } from '../types'
import { analyzePingData } from '../utils'

export interface PingingPageProps {
  stopPing: () => void
  pingData: PingData[]
}

const formatMilliseconds = (milliseconds: number) => {
  return `${milliseconds.toFixed(2)} ms`
}

const formatPercentage = (percentage: number) => {
  return `${(percentage * 100).toFixed(2)}%`
}

export const PingingPage = ({ stopPing, pingData }: PingingPageProps) => {
  const {
    overallMean,
    last10Mean,
    overallSuccessRate,
    last10SuccessRate,
  } = useMemo(() => analyzePingData(pingData), [pingData])

  return (
    <>
      <p>Count: {pingData.length}</p>
      <p>Overall mean: {formatMilliseconds(overallMean)}</p>
      <p>Last 10 mean: {formatMilliseconds(last10Mean)}</p>
      <p>Overall success rate: {formatPercentage(overallSuccessRate)}</p>
      <p>Last 10 success rate: {formatPercentage(last10SuccessRate)}</p>
      <button onClick={stopPing}>Stop</button>
    </>
  )
}
