import { render } from 'preact'
import { appWindow } from '@tauri-apps/api/window'
import { App } from './app'

render(<App />, document.getElementById('app') as HTMLElement)

appWindow.show()
