import { Matrix } from 'ts-matrix'
import { PingData } from '../types'
import { Graph } from './types'
import { getVisiblePings } from './getVisiblePings'
import { VIEWBOX_WIDTH, VIEWBOX_HEIGHT, WINDOW } from './constants'
import { getOffset } from './getOffset'
import { getMaxTime } from './getMaxTime'

const foldMatrices = (matrices: Matrix[]): Matrix => matrices.reduceRight(
  (a, b) => a.multiply(b),
  Matrix.identity(3)
)

const translate = (x: number, y: number): Matrix => new Matrix(3, 3, [
  [1, 0, x],
  [0, 1, y],
  [0, 0, 1],
])

const scale = (x: number, y: number): Matrix => new Matrix(3, 3, [
  [x, 0, 0],
  [0, y, 0],
  [0, 0, 1],
])

const scaleAbout = (x: number, y: number, cx: number, cy: number): Matrix => foldMatrices([
  translate(-cx, -cy),
  scale(x, y),
  translate(cx, cy),
])

export type GetTransformsOptions = {
  pingData: PingData[],
  time: number,
  maxTime: number,
}

export const getTransforms = (
  graph: Graph,
  {
    pingData,
    time,
    maxTime,
  }: GetTransformsOptions,
): string => {
  const visiblePings = getVisiblePings(graph, pingData)

  // Co-ordinates start as (seq, time) where (0, 0) is the top-left corner
  const transforms: Matrix[] = []

  // Flip vertically so (0, 0) is the bottom-left corner
  transforms.push(scaleAbout(1, -1, 0, VIEWBOX_HEIGHT / 2))

  // Translate x-axis by offset
  const offset = getOffset(graph, {
    pingData: visiblePings,
    time,
  })

  transforms.push(translate(-offset, 0))

  // Scale x-axis so that WINDOW pings fit in the viewbox
  // Scale y-axis so that (0, maxTime) is the top of the graph
  transforms.push(scaleAbout(
    VIEWBOX_WIDTH / WINDOW,
    (VIEWBOX_HEIGHT - 10) / maxTime,
    0,
    VIEWBOX_HEIGHT,
  ))

  const finalTransform = foldMatrices(transforms)
  const [a, c, e, b, d, f] = finalTransform.values.flat()
  return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`
}
