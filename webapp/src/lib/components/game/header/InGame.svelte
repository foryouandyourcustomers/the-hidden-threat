<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Jokers from '$lib/components/game/header/Jokers.svelte'
  import SwitchSidesButton from '$lib/components/game/header/expandable/SwitchSidesButton.svelte'
  import SettingsIcon from '~icons/lucide/settings'
  import HelpIcon from '~icons/lucide/shield-question'
  import AudioIcon from '~icons/lucide/volume-2'
  import AudioOffIcon from '~icons/lucide/volume-x'
  import Score from '../Score.svelte'
  import Expandable from './expandable/Expandable.svelte'
  import RollbackButton from './expandable/RollbackButton.svelte'
  import OpenButton from './expandable/OpenButton.svelte'
  import { enabled } from '$lib/sound'

  const { machine } = getGameContext()

  const playing = useSelector(machine.service, (state) => state.matches('Playing'))
</script>

{#if $playing}
  <Score />
  <Jokers />
{/if}

<div class="actions">
  <OpenButton href="/manual" target="_blank">
    <HelpIcon />
  </OpenButton>
  <OpenButton on:click={() => ($enabled = !$enabled)}>
    {#if $enabled}
      <AudioIcon />
    {:else}
      <AudioOffIcon />
    {/if}
  </OpenButton>
  <Expandable>
    <SettingsIcon slot="icon" />
    <SwitchSidesButton />
    <RollbackButton />
  </Expandable>
</div>

<style lang="postcss">
  .actions {
    display: flex;
    gap: 1rem;
  }
</style>
