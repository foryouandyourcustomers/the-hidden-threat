<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { FACES, type FaceId } from '$lib/game/constants'
  import { isDefenderId, type DefenderId, type PlayerId, type Side } from '$lib/game/types'

  export let playerId: PlayerId

  const side = (isDefenderId(playerId) ? 'defender' : 'attacker') as Side

  const { machine } = getGameContext()

  const player = useSelector(machine.service, ({ context }) => {
    return side === 'attacker'
      ? context.attack.attacker
      : context.defense.defenders[playerId as DefenderId]
  })

  const usersOnThisSide = useSelector(machine.service, ({ context }) =>
    context.users.filter((user) => user.side === side),
  )
  const canUpdate = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'assign role', role, playerId, playingUserId: userId, face }),
  )

  $: userId = $player.userId
  $: face = $player.face
  $: role = $player.role

  const sendUpdate = () => {
    machine.send({
      type: 'assign role',
      role,
      playerId,
      playingUserId: userId,
      face,
    })
  }

  const setFace = (newFace: string) => {
    face = newFace as FaceId
    sendUpdate()
  }
  const setUser = (newUserId: string) => {
    if (!newUserId) return
    userId = newUserId
    sendUpdate()
  }
</script>

<div class="configurator">
  <select disabled={!$canUpdate} on:input={(e) => setUser(e.currentTarget.value)} value={userId}>
    <option value="">--PLEASE SELECT--</option>
    {#each $usersOnThisSide as user}
      <option value={user.id}>{user.name}</option>
    {/each}
  </select>

  <div class="faces">
    {#each Object.entries(FACES) as [thisFaceId, thisFace]}
      <button
        disabled={!$canUpdate}
        class:active={thisFaceId === face}
        class="face"
        on:click={() => setFace(thisFaceId)}>{thisFace}</button
      >
    {/each}
  </div>

  <button
    disabled={!$canUpdate}
    on:click={() => machine.send({ type: 'stop editing player', side })}>Close</button
  >
</div>

<style lang="postcss">
  .configurator {
    display: grid;
    position: fixed;
    place-content: center;
    gap: 1rem;
    z-index: 100000;
    inset: 0;
    background: #000e;
  }

  .faces {
    display: flex;
    gap: 1rem;
    button {
      border: 1px solid black;

      &.active {
        border-color: orange;
      }
    }
  }
</style>
