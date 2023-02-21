import { render } from 'preact'
import { appWindow } from '@tauri-apps/api/window'
import { App } from './components/App'

// Make window draggable by any HTML element except the following
const NON_DRAGGABLE_ELEMENTS = ['INPUT', 'BUTTON']

const makeDraggable = (element: Node) => {
  if (element instanceof HTMLElement && !NON_DRAGGABLE_ELEMENTS.includes(element.tagName)) {
    element.setAttribute('data-tauri-drag-region', 'true')
    Array.from(element.children).forEach((child) => makeDraggable(child))
  }
}

makeDraggable(document.body)

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => makeDraggable(node))
    }
  })
})

mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
})

// Fix issue with focus caused by above
document.addEventListener('mousedown', (event) => {
  const { target } = event

  if (target instanceof HTMLElement && target.hasAttribute('data-tauri-drag-region')) {
    const { activeElement } = document

    if (activeElement instanceof HTMLElement) {
      activeElement.blur()
    }
  }
})

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
