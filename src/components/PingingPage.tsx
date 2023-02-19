import { PingData } from '../types'
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
          class="rounded-lg bg-white/5 p-2 hover:bg-white/10 transition-colors cursor-default flex gap-2 items-center"
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

      <Summary pingData={pingData} />

      <Graph pingData={pingData} />
    </div>
  )
}
