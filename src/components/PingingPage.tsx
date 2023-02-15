import { useMemo } from 'preact/hooks'
import { PingData } from '../types'

export interface PingingPageProps {
  stopPing: () => void
  pingData: PingData[]
}

export const PingingPage = ({ stopPing, pingData }: PingingPageProps) => {
  const average = useMemo(() => (
    pingData.reduce((acc, data) => (
      data.isSuccess ? acc + data.time : acc
    ), 0) / pingData.length
  ), [pingData])

  return (
    <>
      <p>Count: {pingData.length}</p>
      <p>Average: {Math.round(average)} ms</p>
      <button onClick={stopPing}>Stop</button>
    </>
  )
}
