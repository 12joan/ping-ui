import {
  makePingDataSuccess,
  makePingDataTimeout,
  parsePingData,
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
    const line = '64 bytes from 1.1.1.1: icmp_seq=0 ttl=55 time=28.190 ms'
    expect(parsePingData(line)).toEqual(makePingDataSuccess(28.19))
  })

  it('parses timeout ping lines', () => {
    const line = 'Request timeout for icmp_seq 0'
    expect(parsePingData(line)).toEqual(makePingDataTimeout())
  })
})
