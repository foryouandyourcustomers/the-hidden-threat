<script>
  import Actions from '$lib/components/game/playing/actions/Actions.svelte'
  import Board from './Board.svelte'
  import Players from './Players.svelte'
  import TempActionButton from './TempActionButton.svelte'
</script>

<div class="playing">
  <div class="actions">
    <Players />
    <TempActionButton />
  </div>
  <div class="board">
    <Board />
    <Actions />
  </div>
  <div class="status" />
</div>

<style lang="postcss">
  .playing {
    display: grid;
    position: relative;
    grid-template-columns: 27.75rem auto 1fr;
    gap: 1rem;
  }

  .board {
    --board-height: 45rem;
    --board-width: calc(var(--board-height) * var(--column-count) / var(--row-count));
    --board-square-size: calc(var(--board-height) / var(--row-count));
    position: relative;
  }
</style>
