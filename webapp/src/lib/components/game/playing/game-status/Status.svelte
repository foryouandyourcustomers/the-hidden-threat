<script lang="ts">
  import EmojiPicker from './EmojiPicker.svelte'
  import Rounds from './Rounds.svelte'
</script>

<div class="status">
  <div class="rounds">
    <Rounds />
  </div>
  <div class="emojis">
    <EmojiPicker />
  </div>
</div>

<style lang="postcss">
  .status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    height: 100%;
  }
  .rounds {
    display: grid;
    flex: 1;
    justify-content: end;
    align-items: center;
  }
  .emojis {
    margin-right: 1rem;
  }
</style>
