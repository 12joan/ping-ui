import { useState, useLayoutEffect } from 'preact/hooks'
import { ErrorMessage } from '../types'
import { useEventListener } from '../hooks'

export type ErrorBannerProps = {
  errorMessage: ErrorMessage
}

export const ErrorBanner = ({ errorMessage }: ErrorBannerProps) => {
  const { message, raisedAt, duration } = errorMessage
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)
  const [flip, setFlip] = useState(false)

  useLayoutEffect(() => {
    if (containerEl) {
      setHeight(containerEl.clientHeight)
    }
  }, [containerEl, message])

  useEventListener(window, 'mousemove', ((event: MouseEvent) => {
    setFlip(event.clientY < height)
  }) as EventListener, [height])

  useEventListener(window, 'mouseout', () => {
    setFlip(false)
  }, [])

  return (
    <div
      ref={setContainerEl}
      role="alert"
      class="absolute left-1/2 -translate-x-1/2 inline-block transition-[top] duration-200 delay-100 p-5 pointer-events-none"
      style={{
        top: flip ? `calc(100% - ${height}px)` : '0',
      }}
    >
      <div
        class="inline-block bg-red-600 rounded-lg shadow-lg px-5 py-2"
        children={message}
      />
    </div>
  )
}
