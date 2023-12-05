<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Jokers from '$lib/components/game/header/Jokers.svelte'
  import SwitchSidesButton from '$lib/components/game/header/expandable/SwitchSidesButton.svelte'
  import Face from '$lib/components/icons/Face.svelte'
  import { enabled } from '$lib/sound'
  import HelpIcon from '~icons/lucide/file-text'
  import SettingsIcon from '~icons/lucide/settings'
  import AudioIcon from '~icons/lucide/volume-2'
  import AudioOffIcon from '~icons/lucide/volume-x'
  import CloseIcon from '~icons/lucide/x'
  import Score from '../Score.svelte'
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
      <SwitchSidesButton />
      <RollbackButton />
    </Expandable>
  </div>
{:else}
  <div class="faces">
    <Face faceId={3} />
    <Face faceId={2} />
    <Face faceId={6} />
    <Face faceId={5} />
  </div>
  <a href="/" on:click|preventDefault={close} class="close unstyled">
    <CloseIcon />
  </a>
{/if}

<style lang="postcss">
  .actions {
    display: flex;
    grid-area: options;
    gap: 1rem;
  }
  .faces {
    display: flex;
    grid-area: jokers;
    gap: 0.5rem;
    :global(svg) {
      width: 2rem;
      height: 2rem;
    }
  }
  .close {
    position: relative;
    grid-area: options;
    :global(svg) {
      width: 2rem;
      height: 2rem;
    }
  }
</style>
