export interface StartPageProps {
  host: string
  setHost: (host: string) => void
  startPing: () => void
}

export const StartPage = ({ host, setHost, startPing }: StartPageProps) => {
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
            <input
              type="text"
              class="rounded-lg bg-input shadow-inner text-center p-1 focus:bg-input-focus"
              placeholder="0.0.0.0"
              autoFocus
              size={20}
              value={host}
              onInput={handleInput}
            />
          </div>

          <button
            type="submit"
            class="aspect-square rounded-full bg-button p-2 hover:bg-button-hover transition-colors cursor-default text-ui-text"
            aria-label="Start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>
      </label>
    </form>
  )
}
