<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { GameState } from '$lib/game/game-state'
  import { getPlayer, getPlayerSide, getUser } from '$lib/game/utils'
  import { objectEntries } from '$lib/utils'
  import isEqual from 'lodash/isEqual'
  import Player from '../Player.svelte'
  import { receive, send } from '../transition'

  export let coordinate: [number, number]

  const { machine } = getGameContext()

  const players = useSelector(
    machine.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context)
      const currentUser = getCurrentUser(context)
      const { playerPositions } = gameState

      return objectEntries(playerPositions)
        .filter(([_, position]) => isEqual(position, coordinate))
        .map(([playerId]) => getPlayer(playerId, context))
        .filter(
          (player) =>
            currentUser.side === 'attack' || getPlayerSide(player.id) === currentUser.side,
        )
        .filter((player) => gameState.isPlaced(player.id))
        .map((player) => {
          const user = getUser(player.userId, context)
          return {
            ...player,
            user,
            side: getPlayerSide(player.id),
            isPlaying: gameState.activePlayer.id === player.id,
          }
        })
    },
    isEqual,
  )
</script>

{#each $players as player (`board-player-${player.id}`)}
  <div
    class="player {player.side}"
    in:receive={{ key: `board-player-${player.id}` }}
    out:send={{ key: `board-player-${player.id}` }}
  >
    <Player
      name={player.user.name}
      side={player.side}
      faceId={player.faceId}
      isPlaying={player.isPlaying}
    />
  </div>
{/each}

<style lang="postcss">
  .player {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    &.defense {
      z-index: var(--layer-1);
    }

    &.attack {
      z-index: var(--layer-2);
    }

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
