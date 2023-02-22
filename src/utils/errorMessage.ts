import { ErrorMessage } from '../types'

export const makeErrorMessage = (message: string, duration: number = 5000): ErrorMessage => ({
  message,
  raisedAt: performance.now(),
  duration,
  visible: true,
})
