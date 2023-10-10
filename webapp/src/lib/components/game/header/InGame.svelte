<script>
  import Jokers from '$lib/components/game/header/Jokers.svelte'
  import SwitchSidesButton from '$lib/components/game/header/expandable/SwitchSidesButton.svelte'
  import SettingsIcon from '~icons/lucide/settings'
  import HelpIcon from '~icons/lucide/shield-question'
  import AudioIcon from '~icons/lucide/volume-2'
  import EmojiPicker from './EmojiPicker.svelte'
  import Expandable from './expandable/Expandable.svelte'
  import RollbackButton from './expandable/RollbackButton.svelte'
</script>

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

<style lang="postcss">
  .actions {
    display: flex;
    gap: 1rem;
  }
</style>
