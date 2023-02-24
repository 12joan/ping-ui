import { useEffect, useReducer, useState } from 'preact/hooks'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { StyleTransition } from 'preact-transitioning'
import { useEventListener } from '../hooks'
import { PingingPage } from './PingingPage'
import { StartPage } from './StartPage'
import { ErrorBanner } from './ErrorBanner'
import { PingData, ErrorMessage } from '../types'
import {
  makeErrorMessage,
  parsePingData,
  pingDataReducer,
} from '../utils'

const NO_ROUTE_TO_HOST_REGEX = /no route to host/i

const rawStopPing = () => invoke('stop_ping')

export const App = () => {
  // Make sure the app isn't pining when it first loads
  useEffect(() => {
    rawStopPing()
  }, [])

  const [host, setHost] = useState('')
  const [isPinging, setIsPinging] = useState(false)
  const [pingData, dispatchPingData] = useReducer(pingDataReducer, [])
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null)

  const clearErrorMessage = () => setErrorMessage((errorMessage) => errorMessage && {
    ...errorMessage,
    visible: false,
  })

  useEffect(() => {
    if (errorMessage?.visible) {
      const { raisedAt, duration } = errorMessage
      const timeoutDuration = raisedAt + duration - performance.now()
      const timeout = setTimeout(clearErrorMessage, timeoutDuration)
      return () => clearTimeout(timeout)
    }
  }, [errorMessage?.raisedAt])

  const startPing = () => {
    // TODO: Handle empty host, handle error
    invoke('start_ping', {
      host,
      window: appWindow,
    })
  }

  const stopPing = () => {
    setIsPinging(false)

    // TODO: Handle error
    rawStopPing()
  }

  useEventListener(window, 'ping-stdout', ((event: CustomEvent) => {
    const data = parsePingData(event.detail)

    if (data) {
      if (!isPinging) {
        setIsPinging(true)
        dispatchPingData({ type: 'clear' })
      }

      dispatchPingData({ type: 'insert', data })

      if (data.isSuccess) {
        clearErrorMessage()
      }
    }
  }) as EventListener, [isPinging])

  useEventListener(window, 'ping-stderr', (({ detail }: CustomEvent) => {
    console.error(detail)

    const parts = detail.split(':')
    const message = parts[parts.length - 1].trim()
    const duration = NO_ROUTE_TO_HOST_REGEX.test(message) ? 1500 : undefined
    setErrorMessage(makeErrorMessage(message, duration))
  }) as EventListener, [])

  useEventListener(window, 'ping-exit', ((event) => {
    setIsPinging(false)
  }) as EventListener, [])

  const page = isPinging
    ? <PingingPage
      host={host}
      stopPing={stopPing}
      pingData={pingData}
    />
    : <StartPage
      host={host}
      setHost={(host) => {
        setHost(host)
        clearErrorMessage()
      }}
      startPing={startPing}
    />

  return (
    <>
      {page}

      <StyleTransition
        in={errorMessage?.visible}
        styles={{
          enter: { opacity: 0 },
          enterActive: { opacity: 0 },
          enterDone: { opacity: 1 },
          exitActive: { opacity: 0 },
        }}
        duration={200}
      >
        <div class="transition-opacity duration-200">
          {errorMessage && (
            <ErrorBanner errorMessage={errorMessage} />
          )}
        </div>
      </StyleTransition>
    </>
  )
}
