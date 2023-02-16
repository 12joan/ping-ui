import { useEffect, useReducer, useState } from 'preact/hooks'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { useEventListener } from '../hooks'
import { PingingPage } from './PingingPage'
import { StartPage } from './StartPage'
import { PingData } from '../types'
import { parsePingData, pingDataReducer } from '../utils'

const rawStopPing = () => invoke('stop_ping')

export const App = () => {
  // Make sure the app isn't pining when it first loads
  useEffect(() => {
    rawStopPing()
  }, [])

  const [host, setHost] = useState('')
  const [isPinging, setIsPinging] = useState(false)
  const [pingData, dispatchPingData] = useReducer(pingDataReducer, [])

  const startPing = () => {
    // TODO: Validate host

    setIsPinging(true)
    dispatchPingData({ type: 'clear' })

    // TODO: Handle error
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
      dispatchPingData({ type: 'insert', data })
    }
  }) as EventListener, [])

  useEventListener(window, 'ping-stderr', ((event: CustomEvent) => {
    console.log('Error', event.detail)
  }) as EventListener, [])

  useEventListener(window, 'ping-exit', ((event) => {
    setIsPinging(false)
  }) as EventListener, [])

  return isPinging
    ? <PingingPage
      host={host}
      stopPing={stopPing}
      pingData={pingData}
    />
    : <StartPage
      host={host}
      setHost={setHost}
      startPing={startPing}
    />
}
