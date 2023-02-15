import { PingData } from '../types'
import {
  makePingDataSuccess,
  makePingDataTimeout,
} from './pingData'

export const parsePingData = (data: string): PingData | null => {
  const isSuccess = data.includes('bytes from')
  const isTimeout = data.includes('Request timeout')

  if (!isSuccess && !isTimeout) {
    return null
  }

  const seqMatch = data.match(/icmp_seq[= ](\d+)/)

  if (!seqMatch) {
    throw new Error(`Could not parse seq from ping data: ${data}`)
  }

  const seq = parseInt(seqMatch[1], 10)

  if (isSuccess) {
    const timeMatch = data.match(/time=(\d+\.\d+)/)

    if (!timeMatch) {
      throw new Error(`Could not parse time from ping data: ${data}`)
    }

    return makePingDataSuccess({
      seq,
      time: parseFloat(timeMatch[1]),
    })
  }

  return makePingDataTimeout({ seq })
}
