import { useEffect } from 'preact/hooks'

export const useEventListener = (
  element: EventTarget,
  eventName: string,
  handler: EventListener,
  dependencies?: any[],
) => {
  useEffect(() => {
    element.addEventListener(eventName, handler)
    return () => element.removeEventListener(eventName, handler)
  }, dependencies && [element, eventName, ...dependencies])
}
