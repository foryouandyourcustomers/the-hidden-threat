<script>
  import Actions from '$lib/components/game/playing/actions/Actions.svelte'
  import ReactionResult from '$lib/components/game/playing/reaction/ReactionResult.svelte'
  import Grid from './Grid.svelte'
  import ToastMessages from './ToastMessages.svelte'
  import Status from './game-status/Status.svelte'
  import GlobalActions from './global-actions/GlobalActions.svelte'
  import InfoPanel from './player-status/InfoPanel.svelte'
  import Players from './player-status/Players.svelte'
  import AwaitingReaction from './reaction/AwaitingReaction.svelte'
  import Reaction from './reaction/Reaction.svelte'
</script>

<GlobalActions />
<ToastMessages />

<div class="playing">
  <div class="player-status">
    <Players />
    <InfoPanel />
  </div>
  <div class="grid">
    <Grid />
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
    grid-template-columns: 30rem auto 1fr;
    gap: 1rem;
  }

  .grid {
    --grid-height: 45rem;
    --grid-width: calc(var(--grid-height) * var(--column-count) / var(--row-count));
    --grid-square-size: calc(var(--grid-height) / var(--row-count));
    position: relative;
  }

  .player-status {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
