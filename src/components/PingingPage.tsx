import { useMemo } from 'preact/hooks'
import { PingData } from '../types'
import { analyzePingData } from '../utils'

export interface PingingPageProps {
  host: string,
  stopPing: () => void
  pingData: PingData[]
}

const formatMilliseconds = (milliseconds: number) => {
  return `${milliseconds.toFixed(0)} ms`
}

const formatPercentage = (percentage: number) => {
  return `${(percentage * 100).toFixed(0)}%`
}

export const PingingPage = ({ host, stopPing, pingData }: PingingPageProps) => {
  const {
    overallMean,
    last10Mean,
    overallSuccessRate,
    last10SuccessRate,
  } = useMemo(() => analyzePingData(pingData), [pingData])

  const summary = [
    {
      section: 'Overall',
      data: [
        { label: 'Mean', value: formatMilliseconds(overallMean) },
        { label: 'Rate', value: formatPercentage(overallSuccessRate) },
      ],
    },
    {
      section: 'Last 10',
      data: [
        { label: 'Mean', value: formatMilliseconds(last10Mean) },
        { label: 'Rate', value: formatPercentage(last10SuccessRate) },
      ],
    },
  ]


  return (
    <div class="p-5 space-y-3">
      <div class="flex gap-2 items-center justify-between">
        <button
          type="button"
          class="rounded-lg bg-button p-2 hover:bg-button-hover transition-colors cursor-default flex gap-2 items-center"
          aria-label={`Stop pinging ${host}`}
          onClick={stopPing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          </svg>

          <span>{host}</span>
        </button>

        <span class="bg-white/5 rounded-lg p-2">{pingData.length}</span>
      </div>

      <div class="flex gap-3 text-center">
        {summary.map(({ section, data }) => (
          <div class="flex-1 space-y-2 bg-white/5 rounded-lg p-2">
            <div class="opacity-80 font-medium tracking-widest uppercase text-sm">
              {section}
            </div>

            <div class="flex gap-2">
              {data.map(({ label, value }) => (
                <div class="flex-1">
                  <div class="opacity-80 font-medium tracking-wider uppercase text-xs">
                    {label}
                  </div>

                  <div class="font-bold text-2xl text-center select-auto cursor-text">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        class="w-full mt-5 rounded-lg p-2 bg-button hover:bg-button-hover transition-colors"
        onClick={stopPing}
      >
        Stop
      </button>
    </div>
  )
}
