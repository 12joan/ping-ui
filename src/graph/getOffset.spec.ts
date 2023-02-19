import { PingData } from '../types'
import { makePingDataTimeout } from '../utils'
import { getOffset } from './getOffset'
import { WINDOW } from './constants'
import { interpolate } from './interpolate'

const makeNPings = (n: number) => Array.from({ length: n }, (_, seq) => (
  makePingDataTimeout({ seq, arrivedAt: seq * 1000 })
))

const getLastArrivedAt = (pingData: PingData[]) => (
  pingData[pingData.length - 1].arrivedAt
)

describe('getOffset', () => {
  describe('when pings arrive every 1000ms exactly', () => {
    describe('when there are WINDOW pings', () => {
      const pingData = makeNPings(WINDOW)

      it('should return 0', () => {
        const time = getLastArrivedAt(pingData)
        expect(getOffset({ pingData, time })).toBe(0)
      })
    })

    describe('when there are WINDOW + 1 pings', () => {
      const pingData = makeNPings(WINDOW + 1)

      describe('when the last ping arrived 0ms ago', () => {
        const time = getLastArrivedAt(pingData)

        it('should return 0', () => {
          expect(getOffset({ pingData, time })).toBe(0)
        })
      })

      describe('when the last ping arrived 200ms ago', () => {
        const time = getLastArrivedAt(pingData) + 200

        it('should return 0.2', () => {
          expect(getOffset({ pingData, time })).toBe(0.2)
        })
      })

      describe('when the last ping arrived 1000ms ago', () => {
        const time = getLastArrivedAt(pingData) + 1000

        it('should return 1', () => {
          expect(getOffset({ pingData, time })).toBe(1)
        })
      })

      describe('when the last ping arrived 1001ms ago', () => {
        const time = getLastArrivedAt(pingData) + 1001

        it('should return 1', () => {
          expect(getOffset({ pingData, time })).toBe(1)
        })
      })
    })

    describe('when there are WINDOW + 2 pings', () => {
      const pingData = makeNPings(WINDOW + 2)

      describe('when the last ping arrived 0ms ago', () => {
        const time = getLastArrivedAt(pingData)

        it('should return 1', () => {
          expect(getOffset({ pingData, time })).toBe(1)
        })
      })

      describe('when the last ping arrived 200ms ago', () => {
        const time = getLastArrivedAt(pingData) + 200

        it('should return 1.2', () => {
          expect(getOffset({ pingData, time })).toBe(1.2)
        })
      })

      describe('when the last ping arrived 1000ms ago', () => {
        const time = getLastArrivedAt(pingData) + 1000

        it('should return 2', () => {
          expect(getOffset({ pingData, time })).toBe(2)
        })
      })
    })
  })

  describe('when the ping with seq WINDOW + 1 arrived 200ms after the ping with seq WINDOW', () => {
    const initialPingData = makeNPings(WINDOW)

    const pingWindow = makePingDataTimeout({
      seq: WINDOW,
      arrivedAt: getLastArrivedAt(initialPingData) + 1000,
    })

    const pingWindowPlusOne = makePingDataTimeout({
      seq: WINDOW + 1,
      arrivedAt: pingWindow.arrivedAt + 200,
    })

    const pingData = [...initialPingData, pingWindow, pingWindowPlusOne]

    describe('when the last ping arrived 0ms ago', () => {
      const time = pingWindowPlusOne.arrivedAt

      it('should return 0.2', () => {
        expect(getOffset({ pingData, time })).toBe(0.2)
      })
    })

    describe('when the last ping arrived 50ms ago', () => {
      const time = pingWindowPlusOne.arrivedAt + 50

      it('should interpolate between 0.2 and 2', () => {
        expect(getOffset({ pingData, time })).toBe(interpolate(0.2, 2, 50 / 1000))
      })
    })

    describe('when the last ping arrived 1000ms ago', () => {
      const time = pingWindowPlusOne.arrivedAt + 1000

      it('should return 2', () => {
        expect(getOffset({ pingData, time })).toBe(2)
      })
    })
  })
})
