import { useRef, useLayoutEffect, MutableRef } from 'preact/hooks'

export const useMutable = <T>(value: T): MutableRef<T> => {
  const ref = useRef(value)

  useLayoutEffect(() => {
    ref.current = value
  }, [value])

  return ref
}
