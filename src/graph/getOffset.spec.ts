import { PingData } from '../types'
import { makePingDataTimeout } from '../utils'
import { getOffset } from './getOffset'
import { makeGraph } from './makeGraph'
import { WINDOW, PING_INTERVAL } from './constants'
import { interpolate } from './interpolate'

const makeNPings = (n: number) => Array.from({ length: n }, (_, seq) => (
  makePingDataTimeout({ seq, arrivedAt: seq * PING_INTERVAL })
))

const getLastArrivedAt = (pingData: PingData[]) => (
  pingData[pingData.length - 1].arrivedAt
)

describe('getOffset', () => {
  describe('when pings arrive every PING_INTERVAL exactly', () => {
    describe('when there are WINDOW pings', () => {
      const pingData = makeNPings(WINDOW)

      it('should return 0', () => {
        const graph = makeGraph()
        const time = getLastArrivedAt(pingData)
        expect(getOffset(graph, { pingData, time })).toBe(0)
      })
    })

    describe('when there are WINDOW + 1 pings', () => {
      const pingData = makeNPings(WINDOW + 1)

      describe('when the last ping arrived 0ms ago', () => {
        const time = getLastArrivedAt(pingData)

        it('should return 0', () => {
          const graph = makeGraph()
          expect(getOffset(graph, { pingData, time })).toBe(0)
        })
      })

      describe('when the last ping arrived 1/5 PING_INTERVAL ago', () => {
        const time = getLastArrivedAt(pingData) + (PING_INTERVAL / 5)

        it('should return 0.2', () => {
          const graph = makeGraph()
          expect(getOffset(graph, { pingData, time })).toBe(0.2)
        })
      })

      describe('when the last ping arrived PING_INTERVAL ago', () => {
        const time = getLastArrivedAt(pingData) + PING_INTERVAL

        it('should return 1', () => {
          const graph = makeGraph()
          expect(getOffset(graph, { pingData, time })).toBe(1)
        })
      })

      describe('when the last ping arrived PING_INTERVAL + 1ms ago', () => {
        const time = getLastArrivedAt(pingData) + PING_INTERVAL + 1

        it('should return 1', () => {
          const graph = makeGraph()
          expect(getOffset(graph, { pingData, time })).toBe(1)
        })
      })
    })

    describe('when there are WINDOW + 2 pings', () => {
      const pingData = makeNPings(WINDOW + 2)

      describe('when the last ping arrived 0ms ago', () => {
        const time = getLastArrivedAt(pingData)

        it('should return 1', () => {
          const graph = makeGraph()
          expect(getOffset(graph, { pingData, time })).toBe(1)
        })
      })

      describe('when the last ping arrived 1/5 PING_INTERVAL ago', () => {
        const time = getLastArrivedAt(pingData) + (PING_INTERVAL / 5)

        it('should return 1.2', () => {
          const graph = makeGraph()
          expect(getOffset(graph, { pingData, time })).toBe(1.2)
        })
      })

      describe('when the last ping arrived PING_INTERVAL ago', () => {
        const time = getLastArrivedAt(pingData) + PING_INTERVAL

        it('should return 2', () => {
          const graph = makeGraph()
          expect(getOffset(graph, { pingData, time })).toBe(2)
        })
      })
    })
  })

  describe('when the ping with seq WINDOW + 1 arrived 1/5 PING_INTERVAL after the ping with seq WINDOW', () => {
    const initialPingData = makeNPings(WINDOW)

    const pingWindow = makePingDataTimeout({
      seq: WINDOW,
      arrivedAt: getLastArrivedAt(initialPingData) + PING_INTERVAL,
    })

    const pingWindowPlusOne = makePingDataTimeout({
      seq: WINDOW + 1,
      arrivedAt: pingWindow.arrivedAt + (PING_INTERVAL / 5),
    })

    const pingData = [...initialPingData, pingWindow, pingWindowPlusOne]

    describe('when the last ping arrived 0ms ago', () => {
      const time = pingWindowPlusOne.arrivedAt

      it('should return 0.2', () => {
        const graph = makeGraph()
        expect(getOffset(graph, { pingData, time })).toBe(0.2)
      })
    })

    describe('when the last ping arrived 50ms ago', () => {
      const time = pingWindowPlusOne.arrivedAt + 50

      it('should interpolate between 0.2 and 2', () => {
        const graph = makeGraph()
        expect(getOffset(graph, { pingData, time })).toBe(interpolate(0.2, 2, 50 / PING_INTERVAL))
      })
    })

    describe('when the last ping arrived PING_INTERVAL ago', () => {
      const time = pingWindowPlusOne.arrivedAt + PING_INTERVAL

      it('should return 2', () => {
        const graph = makeGraph()
        expect(getOffset(graph, { pingData, time })).toBe(2)
      })
    })
  })
})
