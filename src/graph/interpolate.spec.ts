import { interpolate } from './interpolate'

describe('interpolate', () => {
  const from = 0.2
  const to = 2

  it('should return from when progress is 0', () => {
    expect(interpolate(from, to, 0)).toBe(from)
  })

  it('should return to when progress is 1', () => {
    expect(interpolate(from, to, 1)).toBe(to)
  })

  it('should return the midpoint when progress is 0.5', () => {
    expect(interpolate(from, to, 0.5)).toBe((from + to) / 2)
  })

  it('should return from when progress < 0', () => {
    expect(interpolate(from, to, -1)).toBe(from)
  })

  it('should return to when progress > 1', () => {
    expect(interpolate(from, to, 2)).toBe(to)
  })
})
