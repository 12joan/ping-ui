import {
  line,
  move,
  pathToString,
} from '../svg'

type SvgProps = {
  contentWidth: number
  contentHeight: number
  strokePadding?: number
  square?: boolean
} & Record<string, unknown>

const Svg = ({
  contentWidth,
  contentHeight,
  strokePadding = 0,
  square = false,
  ...props
}: SvgProps) => {
  const horizontalPadding = square && (contentWidth < contentHeight)
    ? (contentHeight - contentWidth) / 2
    : 0

  const verticalPadding = square && (contentWidth > contentHeight)
    ? (contentWidth - contentHeight) / 2
    : 0

  const viewBox = [
    -horizontalPadding - strokePadding,
    -verticalPadding - strokePadding,
    contentWidth + (horizontalPadding + strokePadding) * 2,
    contentHeight + (verticalPadding + strokePadding) * 2,
  ].join(' ')

  return (
    <svg
      width={contentWidth + horizontalPadding * 2}
      height={contentHeight + verticalPadding * 2}
      viewBox={viewBox}
      aria-hidden
      {...props}
    />
  )
}

export type ChevronProps = {
  flip?: boolean
} & Partial<SvgProps>

export const Chevron = ({ flip = false, ...props }: ChevronProps) => {
  const x = (x: number) => flip
    ? 8 - x
    : x

  const pathData = pathToString([
    move({ x: x(0), y: 0 }),
    line({ x: x(8), y: 8 }),
    line({ x: x(0), y: 16 }),
  ])

  return (
    <Svg
      contentWidth={8}
      contentHeight={16}
      strokePadding={1}
      stroke="currentColor"
      {...props}
    >
      <path
        d={pathData}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </Svg>
  )
}
