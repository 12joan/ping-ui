import {
  makePingDataSuccess,
  makePingDataTimeout,
  parsePingData,
  pingDataReducer,
  PingDataReducerInsertAction,
  PingDataReducerClearAction,
} from './pingData'

describe('parsePingData', () => {
  it('returns null for boilerplate lines', () => {
    [
      'PING 1.1.1.1 (1.1.1.1): 56 data bytes',
      '',
      '--- 1.1.1.1 ping statistics ---',
      '3 packets transmitted, 3 packets received, 0.0% packet loss',
      'round-trip min/avg/max/stddev = 18.643/26.401/32.371/5.745 ms',
    ].forEach((line) => {
      expect(parsePingData(line)).toBeNull()
    })
  })

  it('parses successful ping lines', () => {
    const line = '64 bytes from 1.1.1.1: icmp_seq=18 ttl=55 time=28.190 ms'
    expect(parsePingData(line)).toEqual(makePingDataSuccess({ seq: 18, time: 28.19 }))
  })

  it('parses timeout ping lines', () => {
    const line = 'Request timeout for icmp_seq 192'
    expect(parsePingData(line)).toEqual(makePingDataTimeout({ seq: 192 }))
  })
})

describe('pingDataReducer', () => {
  const initialState = [
    makePingDataSuccess({ seq: 0, time: 28.19 }),
    makePingDataSuccess({ seq: 1, time: 26.4 }),
    makePingDataSuccess({ seq: 3, time: 32.37 }),
  ]

  describe('insert', () => {
    it('inserts data and sorts by seq', () => {
      const action: PingDataReducerInsertAction = {
        type: 'insert',
        data: makePingDataSuccess({ seq: 2, time: 18.64 }),
      }

      expect(pingDataReducer(initialState, action)).toEqual([
        initialState[0],
        initialState[1],
        action.data,
        initialState[2],
      ])
    })

    it('replaces existing data if seq matches', () => {
      const action: PingDataReducerInsertAction = {
        type: 'insert',
        data: makePingDataSuccess({ seq: 1, time: 18.64 }),
      }

      expect(pingDataReducer(initialState, action)).toEqual([
        initialState[0],
        action.data,
        initialState[2],
      ])
    })
  })

  describe('clear', () => {
    it('clears data', () => {
      const action: PingDataReducerClearAction = {
        type: 'clear',
      }

      expect(pingDataReducer(initialState, action)).toEqual([])
    })
  })
})
