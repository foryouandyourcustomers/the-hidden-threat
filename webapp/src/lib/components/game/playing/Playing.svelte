<script>
  import TempActionButton from './TempActionButton.svelte'
  import Board from './Board.svelte'
  import Players from './Players.svelte'
</script>

<div class="playing">
  <div class="actions">
    <Players />
    <TempActionButton />
  </div>
  <div class="board">
    <Board />
  </div>
  <div class="status" />
</div>

<style lang="postcss">
  .playing {
    display: grid;
    position: relative;
    grid-template-columns: 1fr auto 20%;
    gap: 1rem;
  }
</style>
