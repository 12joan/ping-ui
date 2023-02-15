import { makePingDataSuccess } from './pingData'

import {
  pingDataReducer,
  PingDataReducerInsertAction,
  PingDataReducerClearAction,
} from './pingDataReducer'

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
