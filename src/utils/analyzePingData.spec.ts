import {
  makePingDataSuccess,
  makePingDataTimeout,
} from './pingData';

import { analyzePingData } from './analyzePingData'

describe('analyzePingData', () => {
  describe('when there are no timeouts', () => {
    const pingData = Array.from({ length: 120 }, (_, i) => (
      makePingDataSuccess({ seq: i, time: 10 * (i + 1) })
    ))

    const analysis = analyzePingData(pingData)

    it('computes the overall mean', () => {
      expect(analysis.overallMean).toEqual(605)
    })

    it('computes the last 60 mean', () => {
      expect(analysis.last60Mean).toEqual(905)
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

    it('returns 0 for the last 60 mean', () => {
      expect(analysis.last60Mean).toEqual(0)
    })
  })

  describe('when there are both successes and timeouts', () => {
    const pingData = [
      ...Array.from({ length: 60 }, (_, i) => (
        makePingDataSuccess({ seq: i, time: 10 * (i + 1) })
      )),
      ...Array.from({ length: 60 }, (_, i) => (
        makePingDataTimeout({ seq: i + 10 })
      )),
    ]

    const analysis = analyzePingData(pingData)

    it('ignores timeouts when computing the overall mean', () => {
      expect(analysis.overallMean).toEqual(305)
    })

    it('ignores timeouts when computing the last 60 mean', () => {
      expect(analysis.last60Mean).toEqual(305)
    })

    it('computes the overall success rate', () => {
      expect(analysis.overallSuccessRate).toEqual(0.5)
    })

    it('computes the last 60 success rate', () => {
      expect(analysis.last60SuccessRate).toEqual(0)
    })
  })
})
