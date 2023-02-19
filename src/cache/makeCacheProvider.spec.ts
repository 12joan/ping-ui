import { CacheProvider } from './types'
import { makeCacheProvider } from './makeCacheProvider'

describe('makeCacheProvider', () => {
  const cacheProvider: CacheProvider<string, number> = makeCacheProvider()
  cacheProvider.set('one', 1)
  cacheProvider.set('two', 2)
  cacheProvider.set('three', 3)

  describe('get', () => {
    it('should return undefined for a key that has not been set', () => {
      expect(cacheProvider.get('four')).toBeUndefined()
    })

    it('should return the value for a key that has been set', () => {
      expect(cacheProvider.get('one')).toBe(1)
    })
  })
})
