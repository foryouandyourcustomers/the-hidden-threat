<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { GameState } from '$lib/game/game-state'
  import type { Attacker, Defender, User } from '$lib/game/types'
  import isEqual from 'lodash/isEqual'
  import Player from './Player.svelte'

  const { machine } = getGameContext()

  const attackPlayers = useSelector(
    machine.service,
    ({ context }) => [context.attack.attacker],
    isEqual,
  )
  const defensePlayers = useSelector(
    machine.service,
    ({ context }) => context.defense.defenders,
    isEqual,
  )

  const attackAdmins = useSelector(
    machine.service,
    ({ context }) => context.users.filter((user) => user.side === 'attack' && user.isAdmin),
    isEqual,
  )
  const defenseAdmins = useSelector(
    machine.service,
    ({ context }) => context.users.filter((user) => user.side === 'defense' && user.isAdmin),
    isEqual,
  )

  const users = useSelector(machine.service, ({ context }) => context.users, isEqual)

  const getUserForPlayer = (player: Defender | Attacker, users: User[]) => {
    const user = users.find((user) => user.id === player.userId)
    return user ?? { name: 'Unbekannt', isConnected: false }
  }

  const activePlayerId = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).activePlayer.id,
  )
</script>

<div class="players-container">
  <h3>Verteidiger:innen</h3>

  <div class="players">
    {#each $defensePlayers as player}
      {@const user = getUserForPlayer(player, $users)}
      <Player
        faceId={player.faceId}
        name={user.name}
        isConnected={user.isConnected}
        isPlaying={$activePlayerId === player.id}
        side="defense"
      />
    {/each}

    {#each $defenseAdmins as admin}
      <Player name={admin.name} side="admin" isConnected={admin.isConnected} />
    {/each}
  </div>

  <h3>Angreifer:innen</h3>

  <div class="players">
    {#each $attackPlayers as player}
      {@const user = getUserForPlayer(player, $users)}
      <Player
        faceId={player.faceId}
        name={user.name}
        isConnected={user.isConnected}
        isPlaying={$activePlayerId === player.id}
        side="attack"
      />
    {/each}

    {#each $attackAdmins as admin}
      <Player name={admin.name} side="admin" isConnected={admin.isConnected} />
    {/each}
  </div>
</div>

<style lang="postcss">
  .players-container {
    margin-inline: 1rem;
  }
  h3 {
    margin-block: 0 1rem;
  }
  .players {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
