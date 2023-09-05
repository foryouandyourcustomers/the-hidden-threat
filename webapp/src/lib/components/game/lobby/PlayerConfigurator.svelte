<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Face from '$lib/components/icons/Face.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Dialog from '$lib/components/ui/Dialog.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import { FACES, type FaceId } from '$lib/game/constants/faces'
  import { isDefenderId, type PlayerId, type Side } from '$lib/game/types'
  import { getPlayer } from '$lib/game/utils'
  import Select from 'svelte-select'
  import PlayerConfiguratorCharacter from './PlayerConfiguratorCharacter.svelte'

  export let playerId: PlayerId

  const side = (isDefenderId(playerId) ? 'defense' : 'attack') as Side

  const { machine } = getGameContext()

  const player = useSelector(machine.service, ({ context }) => getPlayer(playerId, context))

  const usersOnThisSide = useSelector(machine.service, ({ context }) =>
    context.users.filter((user) => user.side === side),
  )
  const canUpdate = useSelector(machine.service, (snapshot) =>
    snapshot.can({
      type: 'assign role',
      character,
      playerId,
      playingUserId: userId,
      faceId: faceId,
    }),
  )

  $: userId = $player.userId
  $: faceId = $player.faceId
  $: character = $player.character

  const sendUpdate = () => {
    machine.send({
      type: 'assign role',
      character,
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

  $: userItems = $usersOnThisSide.map((user) => ({ value: user.id, label: user.name }))
</script>

<Dialog
  title="Rolle bestimmen"
  open
  on:close={() => machine.send({ type: 'stop editing player', side })}
>
  <div class="configurator">
    <Heading size="md" spacing="none">1. Bestimme eine:n Spieler:in</Heading>
    <div class="user-select">
      <Select
        items={userItems}
        value={userId}
        on:input={(e) => setUser(e.detail?.value)}
        required
      />
    </div>

    <div class="spacer" />

    <Heading size="md" spacing="none">2. Wähle einen Charakter aus</Heading>

    <PlayerConfiguratorCharacter player={$player} />

    <div class="spacer" />

    <Heading size="md" spacing="none">3. Wähle einen Avatar für deinen Charakter</Heading>

    <div class="faces">
      {#each FACES.slice(0, 3) as face}
        <button
          disabled={!$canUpdate}
          class:active={face.id === faceId}
          class="unstyled face"
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
</Dialog>

<style lang="postcss">
  .configurator {
    display: grid;
    place-content: center;
    gap: 1rem;
  }

  .user-select {
    width: 36rem;
  }
  .faces {
    display: flex;
    gap: 1rem;
    .face {
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      background: var(--color-blue-spielbrett);
      padding: 0.25rem;
      width: 5rem;
      height: 5rem;
      :global(svg) {
        width: 100%;
        height: 100%;
      }

      &.active {
        background: var(--color-bg-strong);
        color: var(--color-text-onstrong);
      }
    }
  }
</style>
