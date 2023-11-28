<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import AssigningSides from '$lib/components/game/lobby/AssigningSides.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import AssigningRoles from './AssigningRoles.svelte'

  const { machine } = getGameContext()

  type Section = 'Assigning sides' | 'Assigning roles' | 'Waiting for other side' | undefined

  const section = useSelector(machine.service, (snapshot) => {
    let section: Section = undefined
    if (snapshot.matches('Lobby.Assigning sides')) {
      section = 'Assigning sides'
    } else if (snapshot.matches('Lobby.Assigning roles')) {
      section = 'Assigning roles'
    } else if (snapshot.matches('Lobby.Waiting for other side')) {
      section = 'Waiting for other side'
    }
    return section
  })
</script>

{#if $section === 'Assigning sides'}
  <AssigningSides />
{:else if $section === 'Assigning roles'}
  <AssigningRoles />
{:else if $section === 'Waiting for other side'}
  <div class="waiting">
    <Heading>Sobald die andere Seite fertig ist, geht es weiter.</Heading>
  </div>
{:else}
  Unknown lobby state
{/if}

<style lang="postcss">
  .waiting {
    display: grid;
    place-content: center;
    width: 100%;
    height: 100%;
  }
</style>
