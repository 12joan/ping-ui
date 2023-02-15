import { render } from 'preact'
import { appWindow } from '@tauri-apps/api/window'
import { App } from './components/App'

render(<App />, document.getElementById('app') as HTMLElement)

const BACKEND_EVENTS = ['ping-stdout', 'ping-stderr', 'ping-exit']

BACKEND_EVENTS.forEach((eventName) => {
  appWindow.listen(eventName, ({ payload }) => {
    const event = new CustomEvent(eventName, {
      detail: payload,
    })

    window.dispatchEvent(event)
  })
})

appWindow.show()
