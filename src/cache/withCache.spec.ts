import { CacheProvider } from './types'
import { withCache } from './withCache'
import { makeCacheProvider } from './makeCacheProvider'

describe('withCache', () => {
  const cache: CacheProvider<number, number> = makeCacheProvider()

  const myFunction = withCache(
    ({ seed }) => Math.random() + seed,
    {
      cache,
      key: ({ seed }) => seed,
    }
  )

  it('should return the same value for the same arguments', () => {
    const result1 = myFunction({ seed: 1 })
    const result2 = myFunction({ seed: 1 })
    expect(result1).toBe(result2)
  })

  it('should return different values for different arguments', () => {
    const result1 = myFunction({ seed: 1 })
    const result2 = myFunction({ seed: 2 })
    expect(result1).not.toBe(result2)
  })
})
