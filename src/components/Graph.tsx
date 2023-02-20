import { useRef, useLayoutEffect, useState } from 'preact/hooks'
import { PingData } from '../types'
import { getPathData, getViewport, makeGraph } from '../graph'

export interface GraphProps {
  pingData: PingData[]
}

export const Graph = ({ pingData }: GraphProps) => {
  const [graph] = useState(() => makeGraph())
  const pathRef = useRef<SVGPathElement>(null)

  useLayoutEffect(() => {
    let mounted = true

    const update = () => {
      if (!mounted) return

      const pathData = getPathData(graph, pingData)
      pathRef.current!.setAttribute('d', pathData)

      requestAnimationFrame(update)
    }

    update()

    return () => {
      mounted = false
    }
  }, [pingData])

  return (
    <div class="bg-white/5 rounded-lg p-2">
      <svg viewBox={getViewport(graph)}>
        <path
          ref={pathRef}
          stroke="currentColor"
          fill="none"
          stroke-width="2"
        />
      </svg>
    </div>
  )
}
