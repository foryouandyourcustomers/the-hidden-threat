<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { COLUMN_COUNT, ROW_COUNT } from '$lib/game/constants/general'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate } from '$lib/game/types'
  import isEqual from 'lodash/isEqual'

  const { machine } = getGameContext()

  const dim = useSelector(machine.service, (state) => {
    if (
      state.matches('Playing.Gameloop.Playing.Moving') ||
      state.matches('Playing.Gameloop.Playing.Placing')
    ) {
      return 'full'
    }

    const { context } = state
    const gameState = GameState.fromContext(context)
    if (gameState.activeSide !== getCurrentUser(context).side) return 'semi'

    return 'none'
  })

  const mask = useSelector(machine.service, (state) => {
    const moving = state.matches('Playing.Gameloop.Playing.Moving')
    const placing = state.matches('Playing.Gameloop.Playing.Placing')
    if (!moving && !placing) {
      return undefined
    }

    const undimmedSquares: Coordinate[] = []

    const gameState = GameState.fromContext(state.context)

    for (let x = 0; x < COLUMN_COUNT; x++) {
      for (let y = 0; y < ROW_COUNT; y++) {
        if (
          (moving &&
            (gameState.isValidMove([x, y]) ||
              isEqual(GameState.fromContext(state.context).activePlayerPosition, [x, y]))) ||
          (placing && gameState.isValidPlacement([x, y]))
        ) {
          undimmedSquares.push([x, y])
        }
      }
    }

    return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 8">${undimmedSquares
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1" />`)
      .join('')}</svg>')`
  })
</script>

<div class="dimming dim-{$dim}" class:has-mask={$dim === 'full'} style:--mask={$mask} />

<style lang="postcss">
  .dimming {
    position: absolute;
    z-index: var(--layer-grid-dimming);
    transition: opacity 500ms ease-out;
    inset: 0;
    background: var(--color-bg);
    pointer-events: none;

    &.has-mask {
      mask: var(--mask) center / contain no-repeat exclude,
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 8"><rect width="9" height="8" /></svg>')
          center / contain no-repeat;
    }
    &.dim-full {
      opacity: 0.8;
    }
    &.dim-semi {
      opacity: 0.3;
    }
    &.dim-none {
      opacity: 0;
    }
  }
</style>
