import { useMemo } from 'preact/hooks'
import { PingData } from '../types'
import { analyzePingData } from '../utils'

const formatMilliseconds = (milliseconds: number) => {
  return `${milliseconds.toFixed(0)} ms`
}

const formatPercentage = (percentage: number) => {
  return `${(percentage * 100).toFixed(0)}%`
}

export interface SummaryProps {
  pingData: PingData[]
}

export const Summary = ({ pingData }: SummaryProps) => {
  const {
    overallMean,
    last60Mean,
    overallSuccessRate,
    last60SuccessRate,
  } = useMemo(() => analyzePingData(pingData), [pingData])

  const sections = [
    {
      section: 'Overall',
      data: [
        { label: 'Mean', value: formatMilliseconds(overallMean) },
        { label: 'Success', value: formatPercentage(overallSuccessRate) },
      ],
    },
    {
      section: 'Last 60',
      data: [
        { label: 'Mean', value: formatMilliseconds(last60Mean) },
        { label: 'Success', value: formatPercentage(last60SuccessRate) },
      ],
    },
  ]

  return (
    <div class="flex gap-3 text-center">
      {sections.map(({ section, data }) => (
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

                <div class="font-bold text-2xl text-center">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
