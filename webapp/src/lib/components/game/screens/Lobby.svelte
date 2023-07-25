<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import AssigningSides from '$lib/components/game/screens/AssigningSides.svelte'

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
  Assigning roles
{:else if $section === 'Waiting for other side'}
  Waiting for other side
{:else}
  Unknown state
{/if}
