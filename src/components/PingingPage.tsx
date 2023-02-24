import { PingData } from '../types'
import { Chevron } from './icons'
import { Graph } from './Graph'
import { Summary } from './Summary'

export interface PingingPageProps {
  host: string,
  stopPing: () => void
  pingData: PingData[]
}

export const PingingPage = ({ host, stopPing, pingData }: PingingPageProps) => {
  return (
    <div class="p-5 space-y-3">
      <div class="flex gap-2 items-center justify-between">
        <button
          type="button"
          class="w-fit rounded-lg bg-white/5 p-2 hover:bg-white/10 transition-colors cursor-default flex gap-2 items-center truncate"
          aria-label={`Stop pinging ${host}`}
          onClick={stopPing}
        >
          <Chevron flip />
          <span class="truncate">{host}</span>
        </button>

        <span class="bg-white/5 rounded-lg p-2">{pingData.length}</span>
      </div>

      <Summary pingData={pingData} />

      <Graph pingData={pingData} />
    </div>
  )
}
