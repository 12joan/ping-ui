import { useRef, useLayoutEffect, useState } from 'preact/hooks'
import { PingData } from '../types'
import {
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

  const pathRef = useRef<SVGPathElement>(null)
  const transformGroupRef = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    let mounted = true

    const update = () => {
      if (!mounted) return
      const pingData = pingDataRef.current
      const time = performance.now()

      const transforms = getTransforms(graph, { pingData, time })
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
        <g ref={transformGroupRef}>
          <path
            ref={pathRef}
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            style={{ vectorEffect: 'non-scaling-stroke' }}
          />
        </g>
      </svg>
    </div>
  )
}
