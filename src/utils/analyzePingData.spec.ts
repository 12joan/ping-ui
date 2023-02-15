import {
  makePingDataSuccess,
  makePingDataTimeout,
} from './pingData';

import { analyzePingData } from './analyzePingData'

describe('analyzePingData', () => {
  describe('when there are no timeouts', () => {
    const pingData = Array.from({ length: 20 }, (_, i) => (
      makePingDataSuccess({ seq: i, time: 10 * (i + 1) })
    ))

    const analysis = analyzePingData(pingData)

    it('computes the overall mean', () => {
      expect(analysis.overallMean).toEqual(105)
    })

    it('computes the last 10 mean', () => {
      expect(analysis.last10Mean).toEqual(155)
    })
  })

  describe('when there are no successes', () => {
    const pingData = Array.from({ length: 20 }, (_, i) => (
      makePingDataTimeout({ seq: i })
    ))

    const analysis = analyzePingData(pingData)

    it('returns 0 for the overall mean', () => {
      expect(analysis.overallMean).toEqual(0)
    })

    it('returns 0 for the last 10 mean', () => {
      expect(analysis.last10Mean).toEqual(0)
    })
  })

  describe('when there are both successes and timeouts', () => {
    const pingData = [
      ...Array.from({ length: 10 }, (_, i) => (
        makePingDataSuccess({ seq: i, time: 10 * (i + 1) })
      )),
      ...Array.from({ length: 10 }, (_, i) => (
        makePingDataTimeout({ seq: i + 10 })
      )),
    ]

    const analysis = analyzePingData(pingData)

    it('ignores timeouts when computing the overall mean', () => {
      expect(analysis.overallMean).toEqual(55)
    })

    it('ignores timeouts when computing the last 10 mean', () => {
      expect(analysis.last10Mean).toEqual(55)
    })

    it('computes the overall success rate', () => {
      expect(analysis.overallSuccessRate).toEqual(0.5)
    })

    it('computes the last 10 success rate', () => {
      expect(analysis.last10SuccessRate).toEqual(0)
    })
  })
})
