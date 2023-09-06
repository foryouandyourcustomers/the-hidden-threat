<script lang="ts">
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import type { Coordinate } from '$lib/game/types'
  import isEqual from 'lodash/isEqual'

  const squareSize = 54
  const width = squareSize * 9
  const height = squareSize * 8

  /** A bit of a hack to override when the line of a stage should exit
   * horizontally instead of vertically (which is the default).
   * This makes the logic for `getShortestPath` a lot easier.
   */
  const exitHorizontally: Coordinate[] = [
    [4, 5],
    [5, 7],
    [7, 4],
  ]

  const getShortestPath = (points: Coordinate[]) => {
    const path: Coordinate[] = []

    let prevPoint: Coordinate | undefined = undefined
    for (const point of points) {
      if (prevPoint) {
        if (exitHorizontally.filter((coordinate) => isEqual(coordinate, prevPoint)).length > 0) {
          path.push([point[0], prevPoint[1]])
        } else {
          path.push([prevPoint[0], point[1]])
        }
      }
      path.push(point)
      prevPoint = point
    }

    return path
  }

  const getPosition = (coordinate: Coordinate) => {
    const [x, y] = coordinate
    const xPosition = x * squareSize + squareSize / 2
    const yPosition = y * squareSize + squareSize / 2
    return [xPosition, yPosition]
  }

  const toSvgPath = (points: Coordinate[]) => {
    const path = getShortestPath(points).map((coordinate, index) => {
      const [x, y] = getPosition(coordinate)

      if (index === 0) {
        return `M ${x} ${y}`
      }
      return `L ${x} ${y}`
    })
    return path.join(' ')
  }
</script>

<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  {#each BOARD_SUPPLY_CHAINS as chain}
    <path d={toSvgPath(chain.map((stage) => stage.coordinate))} />
  {/each}
</svg>

<style lang="postcss">
  svg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  path {
    stroke: #000;
    stroke-width: 1;
    fill: none;
    stroke-dasharray: 8 2;
  }
</style>
