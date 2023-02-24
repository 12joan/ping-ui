import { useRef, useLayoutEffect, useState } from 'preact/hooks'
import { PingData } from '../types'
import {
  getMaxTime,
  getLineData,
  getTransforms,
  getViewport,
  makeGraph,
} from '../graph'
import { useMutable } from '../hooks'

const LINE_COLOR = '#00bfff'
const AREA_OPACITY = 0.2
const TIMEOUT_COLOR = '#aa0000'

export interface GraphProps {
  pingData: PingData[]
}

export const Graph = ({ pingData }: GraphProps) => {
  const pingDataRef = useMutable(pingData)
  const [graph] = useState(() => makeGraph())

  const transformGroupRef = useRef<SVGGElement>(null)
  const linePathRef = useRef<SVGPathElement>(null)
  const areaPathRef = useRef<SVGPathElement>(null)
  const timeoutGroupRef = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    let mounted = true

    const update = (dryRun = false) => {
      const pingData = pingDataRef.current
      const time = performance.now()

      const maxTime = getMaxTime(graph, { pingData, time })
      const transforms = getTransforms(graph, { pingData, time, maxTime })
      const [lineData, areaData] = getLineData(graph, { pingData, time })

      if (!dryRun) {
        timeoutGroupRef.current!.setAttribute('transform', `scale(1, ${maxTime})`)
        transformGroupRef.current!.setAttribute('transform', transforms)
        linePathRef.current!.setAttribute('d', lineData)
        areaPathRef.current!.setAttribute('d', areaData)
      }
    }

    const animationLoop = () => {
      if (mounted) {
        update()
        requestAnimationFrame(animationLoop)
      }
    }

    // Animate every frame when visible
    animationLoop()

    // Update caches once per second when not visible
    const interval = setInterval(() => update(true), 1000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div class="bg-black/50 rounded-lg overflow-hidden">
      <svg viewBox={getViewport(graph)} class="pointer-events-none">
        <defs>
          <linearGradient id="timeout-gradient" x2="0%" y2="100%">
            <stop offset="0%" stop-color={TIMEOUT_COLOR} stop-opacity="1" />
            <stop offset="100%" stop-color={TIMEOUT_COLOR} stop-opacity="0.1" />
          </linearGradient>
        </defs>

        <g ref={transformGroupRef}>
          <path
            ref={areaPathRef}
            stroke="none"
            fill={LINE_COLOR}
            fill-opacity={AREA_OPACITY}
          />

          <path
            ref={linePathRef}
            stroke={LINE_COLOR}
            fill="none"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
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
