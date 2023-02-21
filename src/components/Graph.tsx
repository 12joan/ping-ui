import { useRef, useLayoutEffect, useState } from 'preact/hooks'
import { PingData } from '../types'
import {
  getMaxTime,
  getPathData,
  getTransforms,
  getViewport,
  makeGraph,
} from '../graph'
import { useMutable } from '../hooks'

export interface GraphProps {
  pingData: PingData[]
}

export const Graph = ({ pingData }: GraphProps) => {
  const pingDataRef = useMutable(pingData)
  const [graph] = useState(() => makeGraph())

  const transformGroupRef = useRef<SVGGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const timeoutGroupRef = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    let mounted = true

    const update = () => {
      if (!mounted) return
      const pingData = pingDataRef.current
      const time = performance.now()

      const maxTime = getMaxTime(graph, { pingData, time })
      timeoutGroupRef.current!.setAttribute('transform', `scale(1, ${maxTime})`)

      const transforms = getTransforms(graph, { pingData, time, maxTime })
      transformGroupRef.current!.setAttribute('transform', transforms)

      const pathData = getPathData(graph, { pingData, time })
      pathRef.current!.setAttribute('d', pathData)

      requestAnimationFrame(update)
    }

    update()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div class="bg-white/5 rounded-lg p-2">
      <svg viewBox={getViewport(graph)} class="pointer-events-none">
        <defs>
          <linearGradient id="timeout-gradient" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#660000" stop-opacity="1" />
            <stop offset="100%" stop-color="#660000" stop-opacity="0" />
          </linearGradient>
        </defs>

        <g ref={transformGroupRef}>
          <path
            ref={pathRef}
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            style={{ vectorEffect: 'non-scaling-stroke' }}
          />

          <g ref={timeoutGroupRef}>
            {pingData.filter(({ isTimeout }) => isTimeout).map(({ seq }) => (
              <rect
                key={seq}
                x={seq - 0.125}
                y={0}
                width={0.5}
                height={1}
                fill="url(#timeout-gradient)"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
