<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import { FACES, type FaceId } from '$lib/game/constants'
  import { isDefenderId, type DefenderId, type PlayerId, type Side } from '$lib/game/types'
  import Face from '../Face.svelte'

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
    snapshot.can({ type: 'assign role', role, playerId, playingUserId: userId, faceId: faceId }),
  )

  $: userId = $player.userId
  $: faceId = $player.faceId
  $: role = $player.role

  const sendUpdate = () => {
    machine.send({
      type: 'assign role',
      role,
      playerId,
      playingUserId: userId,
      faceId,
    })
  }

  const setFace = (newFace: number) => {
    faceId = newFace as FaceId
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
    {#each FACES as face}
      <button
        disabled={!$canUpdate}
        class:active={face.id === faceId}
        class="face"
        on:click={() => setFace(face.id)}
      >
        <Face faceId={face.id} />
      </button>
    {/each}
  </div>

  <Actions>
    <Button
      primary
      disabled={!$canUpdate}
      on:click={() => machine.send({ type: 'stop editing player', side })}
    >
      Bestätigen und weiter
    </Button>
  </Actions>
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
      cursor: pointer;
      border: 1px solid black;
      background: black;
      color: white;

      &.active {
        border-color: orange;
      }
    }
  }
</style>
