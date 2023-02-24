import { SVGPath } from './types'

export const pathToString = (path: SVGPath) => path.map(({ type, point }) => (
  `${type} ${point.x} ${point.y}`
)).join(' ')
