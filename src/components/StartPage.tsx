import { Chevron } from './icons'

export interface StartPageProps {
  host: string
  readOnly?: boolean
  setHost: (host: string) => void
  startPing: () => void
}

export const StartPage = ({
  host,
  readOnly = false,
  setHost,
  startPing,
}: StartPageProps) => {
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    setHost(target.value)
  }

  const handleSubmit = (event: Event) => {
    event.preventDefault()
    startPing()
  }

  return (
    <form class="m-auto flex flex-col items-center p-5" onSubmit={handleSubmit}>
      <h1 class="text-4xl font-bold mb-8">Ping UI</h1>

      <label class="contents">
        <div class="text-xl font-extralight mb-4">Enter an address to ping</div>

        <div class="flex items-center gap-2">
          <div class="rounded-lg inset-border">
            <div class="rounded-lg bg-window">
              <input
                type="text"
                class="rounded-lg bg-white/5 shadow-inner text-center p-1 focus:bg-black/25"
                placeholder="0.0.0.0"
                autoFocus
                size={20}
                readOnly={readOnly}
                value={host}
                onInput={handleInput}
              />
            </div>
          </div>

          <button
            type="submit"
            class="rounded-lg bg-white/5 p-2 hover:bg-white/10 transition-colors cursor-default text-white/60 hover:text-white"
            disabled={readOnly}
            aria-label="Start"
          >
            <Chevron square />
          </button>
        </div>
      </label>
    </form>
  )
}
