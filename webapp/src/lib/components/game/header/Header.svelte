<script>
  import SettingsIcon from '~icons/lucide/settings'
  import HelpIcon from '~icons/lucide/shield-question'
  import AudioIcon from '~icons/lucide/volume-2'
  import EmojiPicker from './EmojiPicker.svelte'
  import Expandable from './expandable/Expandable.svelte'
  import RollbackButton from './expandable/RollbackButton.svelte'
  import SwitchSidesButton from '$lib/components/game/header/expandable/SwitchSidesButton.svelte'
  import Jokers from '$lib/components/game/header/Jokers.svelte'
</script>

<div class="header">
  <div class="title">The hidden threat</div>

  <EmojiPicker />
  <Jokers />

  <div class="actions">
    <Expandable>
      <HelpIcon slot="icon" />
    </Expandable>
    <Expandable>
      <AudioIcon slot="icon" />
    </Expandable>
    <Expandable>
      <SettingsIcon slot="icon" />
      <SwitchSidesButton />
      <RollbackButton />
    </Expandable>
  </div>
</div>

<style lang="postcss">
  .header {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, #2b344800, #2b3448a9);
    padding-inline: 3rem 1rem;
    height: var(--size-header-height);
  }
  .title {
    font: var(--display-h2);
    font-size: var(--scale-4);
    text-transform: uppercase;
  }
  .actions {
    display: flex;
    gap: 1rem;
  }
</style>
