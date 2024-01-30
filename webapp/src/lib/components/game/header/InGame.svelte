<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Jokers from '$lib/components/game/header/Jokers.svelte'
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
  import { DOCS_URL } from '$lib/constants'
  import { enabled } from '$lib/sound'
  import HelpIcon from '~icons/lucide/file-text'
  import SettingsIcon from '~icons/lucide/settings'
  import AudioIcon from '~icons/lucide/volume-2'
  import AudioOffIcon from '~icons/lucide/volume-x'
  import Score from '../Score.svelte'
  import PreGameDecoration from './PreGameDecoration.svelte'
  import OptionButton from './options/OptionButton.svelte'
  import Options from './options/Options.svelte'

  const { machine } = getGameContext()

  const playing = useSelector(machine.service, (state) => state.matches('Playing'))
</script>

{#if $playing}
  <Score />
  <Jokers />

  <div class="actions">
    <OptionButton href="{DOCS_URL}Spielregeln.pdf" target="_blank">
      <HelpIcon />
    </OptionButton>
    <OptionButton on:click={() => ($enabled = !$enabled)}>
      {#if $enabled}
        <AudioIcon />
      {:else}
        <AudioOffIcon />
      {/if}
    </OptionButton>
    <OptionButton>
      <SettingsIcon />
      <Tooltip noPadding click position="bottom-left">
        <Options />
      </Tooltip>
    </OptionButton>
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
</style>
