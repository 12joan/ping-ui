import { useRef, useEffect, useState } from 'preact/hooks'

export type EaseConfig = {
  duration?: number
}

export const useEasedValue = (value: number, config: EaseConfig) => {
  const {
    duration = 300,
  } = config

  const [easedValue, setEasedValue] = useState(value)

  const startValue = useRef(value)

  useEffect(() => {
    const startTime = performance.now()
    const animationFrame = requestAnimationFrame(function ease() {
      const time = performance.now() - startTime
      const easedTime = Math.min(time / duration, 1)
      const easedValue = startValue.current + (value - startValue.current) * easedTime
      setEasedValue(easedValue)
      if (easedTime < 1) {
        requestAnimationFrame(ease)
      } else {
        startValue.current = value
      }
    })
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return easedValue
}
