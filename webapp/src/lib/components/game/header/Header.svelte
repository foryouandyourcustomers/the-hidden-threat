<script>
  import EmojiPicker from './EmojiPicker.svelte'
</script>

<div class="header">
  <div class="title">The hidden threat</div>

  <EmojiPicker />
</div>

<style lang="postcss">
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, #2b344800, #2b3448a9);
    padding-inline: 3rem;
    height: 3.5rem;
    overflow: hidden;
  }
  .title {
    font: var(--display-h2);
    font-size: var(--scale-4);
    text-transform: uppercase;
  }
</style>
