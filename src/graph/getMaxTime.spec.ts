import { PingData } from '../types'
import { makePingDataSuccess } from '../utils'
import { getMaxTime } from './getMaxTime'
import { WINDOW, MIN_MAX_TIME } from './constants'
import { interpolate } from './interpolate'

const makeNPings = (n: number, timeForSeq: (seq: number) => number) => (
  Array.from({ length: n }, (_, seq) => (
    makePingDataSuccess({
      seq,
      time: timeForSeq(seq),
      arrivedAt: seq * 1000,
    })
  ))
)

const getLastArrivedAt = (pingData: PingData[]) => (
  pingData[pingData.length - 1].arrivedAt
)

const halfWindow = Math.floor(WINDOW / 2)
const halfMinMaxTime = MIN_MAX_TIME / 2
const doubleMinMaxTime = MIN_MAX_TIME * 2
const quadrupleMinMaxTime = MIN_MAX_TIME * 4

describe('getMaxTime', () => {
  describe('when there are WINDOW pings', () => {
    describe('when the greatest time is less than MIN_MAX_TIME', () => {
      const pingData = makeNPings(
        WINDOW,
        (seq) => seq === halfWindow ? halfMinMaxTime : 0
      )

      const time = getLastArrivedAt(pingData)

      it('returns MIN_MAX_TIME', () => {
        expect(getMaxTime({ pingData, time })).toBe(MIN_MAX_TIME)
      })
    })

    describe('when the greatest time is greater than MIN_MAX_TIME', () => {
      const pingData = makeNPings(
        WINDOW,
        (seq) => seq === halfWindow ? doubleMinMaxTime : halfMinMaxTime
      )

      const time = getLastArrivedAt(pingData)

      it('returns the greatest time', () => {
        expect(getMaxTime({ pingData, time })).toBe(doubleMinMaxTime)
      })
    })
  })

  describe('when there are WINDOW + 1 pings', () => {
    describe('when the time at seq 0 is greater than MIN_MAX_TIME', () => {
      const timeAtSeq0 = doubleMinMaxTime

      describe('when subseqent times are less than MIN_MAX_TIME', () => {
        const pingData = makeNPings(
          WINDOW + 1,
          (seq) => seq === 0 ? timeAtSeq0 : halfMinMaxTime
        )

        describe('when the last ping arrived 0ms ago', () => {
          const time = getLastArrivedAt(pingData)

          it('returns the time at seq 0', () => {
            expect(getMaxTime({ pingData, time })).toBe(timeAtSeq0)
          })
        })

        describe('when the last ping arrived 500ms ago', () => {
          const time = getLastArrivedAt(pingData) + 500

          it('interpolates between the time at seq 0 and MIN_MAX_TIME', () => {
            expect(getMaxTime({ pingData, time })).toBe(
              interpolate(timeAtSeq0, MIN_MAX_TIME, 500 / 1000)
            )
          })
        })

        describe('when the last ping arrived 1000ms ago', () => {
          const time = getLastArrivedAt(pingData) + 1000

          it('returns MIN_MAX_TIME', () => {
            expect(getMaxTime({ pingData, time })).toBe(MIN_MAX_TIME)
          })
        })
      })

      describe('when the time at seq WINDOW is greater than MIN_MAX_TIME', () => {
        const timeAtSeqWindow = quadrupleMinMaxTime

        const pingData = makeNPings(
          WINDOW + 1,
          (seq) => seq === 0
            ? timeAtSeq0
            : seq === WINDOW ? timeAtSeqWindow : halfMinMaxTime
        )

        describe('when the last ping arrived 0ms ago', () => {
          const time = getLastArrivedAt(pingData)

          it('returns the time at seq 0', () => {
            expect(getMaxTime({ pingData, time })).toBe(timeAtSeq0)
          })
        })

        describe('when the last ping arrived 500ms ago', () => {
          const time = getLastArrivedAt(pingData) + 500

          it('interpolates between the time at seq 0 and the time at seq WINDOW', () => {
            expect(getMaxTime({ pingData, time })).toBe(
              interpolate(timeAtSeq0, timeAtSeqWindow, 500 / 1000)
            )
          })
        })

        describe('when the last ping arrived 1000ms ago', () => {
          const time = getLastArrivedAt(pingData) + 1000

          it('returns the time at seq WINDOW', () => {
            expect(getMaxTime({ pingData, time })).toBe(timeAtSeqWindow)
          })
        })
      })
    })
  })
})
