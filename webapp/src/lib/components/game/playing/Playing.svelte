<script>
  import Actions from '$lib/components/game/playing/actions/Actions.svelte'
  import ReactionResult from '$lib/components/game/playing/reaction/ReactionResult.svelte'
  import Board from './Board.svelte'
  import Status from './game-status/Status.svelte'
  import InfoPanel from './player-status/InfoPanel.svelte'
  import Players from './player-status/Players.svelte'
  import AwaitingReaction from './reaction/AwaitingReaction.svelte'
  import Reaction from './reaction/Reaction.svelte'
</script>

<div class="playing">
  <div class="player-status">
    <Players />
    <InfoPanel />
  </div>
  <div class="board">
    <Board />
    <Actions />
    <Reaction />
    <AwaitingReaction />
    <ReactionResult />
  </div>
  <div class="game-status">
    <Status />
  </div>
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

  .player-status {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
