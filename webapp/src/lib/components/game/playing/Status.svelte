<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { TOTAL_ROUNDS } from '$lib/game/constants'
  import { GameState } from '$lib/game/game-state'

  const { machine } = getGameContext()

  const currentRound = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).currentRound,
  )
</script>

<div class="rounds">
  {#each new Array(TOTAL_ROUNDS) as _, i}
    <div class="round" style:--round={i} class:current={$currentRound === i}>
      <span>{i + 1}</span>
    </div>
  {/each}
</div>

<style lang="postcss">
  .rounds {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 0.5rem;
    width: 100%;
    .round {
      --_min-percent: 10%;
      --_max-percent: 65%;
      --_percent: calc(
        var(--_min-percent) + (var(--_max-percent) - var(--_min-percent)) * var(--round) / 12
      );
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-color: #dadcdf;
      background: color-mix(in oklab, var(--color-blue-spielbrett) var(--_percent), #fff);
      padding: 0.3125rem 0;
      width: 3.125rem;
      height: 2.125rem;
      color: var(--color-blue-transp-10);
      font-weight: 500;
      font-size: 0.875rem;
      & span {
        width: 3.125rem;
        text-align: center;
      }
      &.current {
        width: 4.5rem;
        font-weight: 700;
        font-size: 1rem;
      }
    }
  }
</style>
