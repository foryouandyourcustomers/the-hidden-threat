<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Jokers from '$lib/components/game/header/Jokers.svelte'
  import SwitchSidesButton from '$lib/components/game/header/expandable/SwitchSidesButton.svelte'
  import { enabled } from '$lib/sound'
  import HelpIcon from '~icons/lucide/file-text'
  import SettingsIcon from '~icons/lucide/settings'
  import AudioIcon from '~icons/lucide/volume-2'
  import AudioOffIcon from '~icons/lucide/volume-x'
  import Score from '../Score.svelte'
  import PreGameDecoration from './PreGameDecoration.svelte'
  import Expandable from './expandable/Expandable.svelte'
  import OpenButton from './expandable/OpenButton.svelte'
  import RollbackButton from './expandable/RollbackButton.svelte'

  const { machine } = getGameContext()

  const playing = useSelector(machine.service, (state) => state.matches('Playing'))

  const close = () => {
    if (window.confirm('Möchtest du wirklich das Spiel verlassen?')) window.location.href = '/'
  }
</script>

{#if $playing}
  <Score />
  <Jokers />

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
      <p class="label">Optionen</p>
      <SwitchSidesButton />
      <RollbackButton />
    </Expandable>
  </div>
{:else}
  <PreGameDecoration />
{/if}

<style lang="postcss">
  .actions {
    display: flex;
    grid-area: options;
    gap: 1rem;
  }

  .label {
    align-self: flex-start;
    padding-top: 0.25rem;
    padding-bottom: 0.75rem;
    padding-left: 0.75rem;
    font-weight: 700;
    font-size: var(--scale-00);
  }
</style>
