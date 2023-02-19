import { GraphSVG } from './types'
import { VIEWBOX_WIDTH, VIEWBOX_HEIGHT } from './constants'

export const createSVG = (container: HTMLElement): GraphSVG => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  element.setAttribute('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`)
  container.appendChild(element)

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  line.setAttribute('stroke', 'currentColor')
  line.setAttribute('fill', 'none')
  line.setAttribute('stroke-width', '2')
  element.appendChild(line)

  return {
    element,
    line,
  }
}
