<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { GameState } from '$lib/game/game-state'
  import type { Attacker, Defender, User } from '$lib/game/types'
  import isEqual from 'lodash/isEqual'
  import Player from '../Player.svelte'
  import { getCharacter } from '$lib/game/utils'

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
  <div class="defense">
    <h3>Verteidiger:innen</h3>

    <div class="players">
      {#each $defensePlayers as player}
        {@const user = getUserForPlayer(player, $users)}
        {@const character = getCharacter(player.character)}

        <div class="player">
          <div class="player-role">{character.name}</div>
          <Player
            faceId={player.faceId}
            name={user.name}
            isConnected={user.isConnected}
            isPlaying={$activePlayerId === player.id}
            side="defense"
          />
        </div>
      {/each}
    </div>
  </div>

  <div class="attack">
    <h3>Angreifer:innen</h3>

    <div class="players">
      {#each $attackPlayers as player}
        {@const user = getUserForPlayer(player, $users)}
        {@const character = getCharacter(player.character)}

        <div class="player">
          <div class="player-role">{character.name}</div>
          <Player
            faceId={player.faceId}
            name={user.name}
            isConnected={user.isConnected}
            isPlaying={$activePlayerId === player.id}
            side="attack"
          />
        </div>
      {/each}
    </div>
  </div>

  <div class="admin">
    <h3>Spielleitung</h3>

    <div class="players">
      {#each [...$defenseAdmins, ...$attackAdmins] as admin}
        <div class="player">
          <div class="player-role">{admin.side === 'attack' ? 'Angriff' : 'Verteidigung'}</div>
          <Player name={admin.name} side="admin" isConnected={admin.isConnected} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .players-container {
    display: grid;
    grid-template-areas:
      'defense defense'
      'attack admin';
    flex: 1;
    align-content: start;
    gap: 1rem;
    margin-inline: 1rem;
    .attack {
      grid-area: attack;
    }
    .defense {
      grid-area: defense;
    }
    .admin {
      grid-area: admin;
    }
  }
  h3 {
    margin-block: 0 0.25rem;
    font: var(--text-small);
  }

  .players {
    display: flex;
    column-gap: 1rem;
    flex-wrap: wrap;
    .player {
      width: 4.875rem;
    }
    .player-role {
      text-wrap: nowrap;
      margin-bottom: 0.25rem;
      width: 100%;
      height: 1.5em;
      overflow: hidden;
      font-size: 0.625rem;
      text-align: center;
      text-overflow: ellipsis;
    }
  }
</style>
