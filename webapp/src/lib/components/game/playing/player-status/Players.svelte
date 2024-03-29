<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { FaceId } from '$lib/game/constants/faces'
  import { GameState } from '$lib/game/game-state'
  import type { Attacker, Defender, Player, PlayerId, User } from '$lib/game/types'
  import { getCharacter } from '$lib/game/utils'
  import isEqual from 'lodash/isEqual'
  import PlayersList from './PlayersList.svelte'
  import { getCurrentUser } from '$lib/client/game-machine/utils'

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
    return user ?? { id: 'unknown', name: 'Unbekannt', isConnected: false }
  }

  const activePlayerId = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).activePlayer.id,
  )

  const ownUserId = useSelector(machine.service, ({ context }) => getCurrentUser(context)?.id)

  const mapPlayer = (player: Player, activePlayerId: PlayerId, ownUserId: string) => {
    const user = getUserForPlayer(player, $users)
    const character = getCharacter(player.character)

    return {
      isSelf: ownUserId === user.id,
      faceId: player.faceId,
      name: user.name,
      character: character.name,
      characterAbility: character.description,
      isConnected: user.isConnected,
      isPlaying: activePlayerId === player.id,
    }
  }

  $: defensePlayerDescriptions = $defensePlayers.map((player) =>
    mapPlayer(player, $activePlayerId, $ownUserId),
  )
  $: attackPlayerDescriptions = $attackPlayers.map((player) =>
    mapPlayer(player, $activePlayerId, $ownUserId),
  )
  $: adminPlayerDescriptions = [...$defenseAdmins, ...$attackAdmins].map((admin) => ({
    isSelf: admin.id === $ownUserId,
    faceId: 0 as FaceId,
    name: admin.name,
    character: admin.side === 'attack' ? 'Angriff' : 'Verteidigung',
    isConnected: admin.isConnected,
    isPlaying: false,
  }))
</script>

<div class="players-container">
  <PlayersList side="defense" players={defensePlayerDescriptions} />
  <PlayersList side="attack" players={attackPlayerDescriptions} />
  <PlayersList side="admin" players={adminPlayerDescriptions} />
</div>

<style lang="postcss">
  .players-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-content: flex-start;
    gap: 1rem;
  }
</style>
