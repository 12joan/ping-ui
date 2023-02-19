import { useRef, useLayoutEffect, useCallback, useMemo, useState } from 'preact/hooks'
import { PingData } from '../types'
import { useEasedValue, EaseConfig } from '../hooks/useEasedValue'
import { createGraph, Graph as GraphType } from '../graph'

const BUFFER_SIZE = 20
const MIN_MAX_TIME = 128
const VIEWBOX_WIDTH = 360
const VIEWBOX_HEIGHT = 120

const EASE_X: EaseConfig = {
  duration: 1000,
}

const EASE_Y: EaseConfig = {
  duration: 200,
}

export interface GraphProps {
  pingData: PingData[]
}

export const Graph = ({ pingData }: GraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [graph, setGraph] = useState<GraphType | null>(null)

  useLayoutEffect(() => {
    const graph = createGraph({ container: containerRef.current! })
    setGraph(graph)
    return graph.destroy
  }, [])

  useLayoutEffect(() => {
    if (graph) {
      graph.setPingData(pingData)
    }
  }, [pingData, graph])

  return (
    <div ref={containerRef} class="bg-white/5 rounded-lg p-2" />
  )

  // const maxSeq = useEasedValue(useMemo(() => (
  //   Math.max(BUFFER_SIZE, pingData[pingData.length - 1]?.seq ?? 0)
  // ), [pingData]), EASE_X)

  // const minSeq = useEasedValue(maxSeq - BUFFER_SIZE, EASE_X)

  // const maxTime = useEasedValue(useMemo(() => (
  //   Math.max(MIN_MAX_TIME, ...pingData.map(({ time }) => time))
  // ), [pingData]), EASE_Y)

  // const normalizePoint = useCallback(([seq, time]: [number, number]) => {
  //   const x = (seq - minSeq) / BUFFER_SIZE * VIEWBOX_WIDTH
  //   const y = VIEWBOX_HEIGHT - (time / maxTime) * VIEWBOX_HEIGHT
  //   return [x, y]
  // }, [maxSeq, minSeq, maxTime])

  // const pathCommands = useMemo(() => {
  //   const points = pingData
  //     .filter(({ seq }) => seq >= minSeq - 1)
  //     .map(({ seq, time }) => normalizePoint([seq, time]))

  //   if (points.length === 0) return ''

  //   const [firstPoint, ...restPoints] = points

  //   return [
  //     `M${firstPoint.join(',')}`,
  //     ...restPoints.map(([x, y]) => `L${x},${y}`),
  //   ].join(' ')
  // }, [pingData, normalizePoint])

  // console.log(pathCommands)

  // return (
  //   <div class="bg-white/5 rounded-lg p-2 text-white/75">
  //     <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
  //       <path d={pathCommands} stroke="currentColor" fill="none" stroke-width={2} />
  //     </svg>
  //   </div>
  // )
}
