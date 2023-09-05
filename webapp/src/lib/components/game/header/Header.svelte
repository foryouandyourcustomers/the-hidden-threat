<script>
  import EmojiPicker from './EmojiPicker.svelte'
  import ExpandableButton from './expandable/ExpandableButton.svelte'
  import RollbackButton from './expandable/RollbackButton.svelte'
  import SettingsIcon from '~icons/lucide/settings'
  import AudioIcon from '~icons/lucide/volume-2'
  import HelpIcon from '~icons/lucide/shield-question'
</script>

<div class="header">
  <div class="title">The hidden threat</div>

  <EmojiPicker />

  <div class="actions">
    <ExpandableButton>
      <HelpIcon slot="icon" />
    </ExpandableButton>
    <ExpandableButton>
      <AudioIcon slot="icon" />
    </ExpandableButton>
    <ExpandableButton>
      <SettingsIcon slot="icon" />
      <RollbackButton />
    </ExpandableButton>
  </div>
</div>

<style lang="postcss">
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, #2b344800, #2b3448a9);
    padding-inline: 3rem 1rem;
    height: 3rem;
    overflow: hidden;
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
