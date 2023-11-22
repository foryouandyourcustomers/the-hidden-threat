<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import StageStatus from '$lib/components/icons/StageStatus.svelte'
  import { GameState } from '$lib/game/game-state'
  import { isEqual } from 'lodash'

  const { machine } = getGameContext()

  const score = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).score,
    isEqual,
  )
</script>

<div class="score-board">
  <h2>Spielstand</h2>

  <div class="score attack">
    <div class="label">
      <h3>Schaden</h3>
      <div class="icon"><StageStatus status="attacked" /></div>
    </div>

    <div class="number">{$score.attack}</div>
  </div>

  <div class="separator">:</div>

  <div class="score defense">
    <div class="label">
      <h3>Resilienz</h3>
      <div class="icon"><StageStatus status="defended" /></div>
    </div>

    <div class="number">{$score.defense}</div>
  </div>
</div>

<style lang="postcss">
  .score-board {
    display: grid;
    grid-template-areas: 'title attack separator defense';
    grid-area: score;
    align-items: center;
    align-self: start;
    border-radius: var(--radius-md);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    background-color: var(--color-blue-spielbrett);
    padding: 0.25rem 1rem;

    h2 {
      grid-area: title;
      margin-right: 1.5rem;
      font-weight: 400;
      font-size: 0.875rem;
      text-align: center;
    }
    .separator {
      grid-area: separator;
      align-self: center;
      font-size: var(--scale-3);
      text-align: center;
    }
  }

  .score.attack {
    grid-area: attack;
  }
  .score.defense {
    grid-area: defense;
  }

  .score {
    display: flex;
    justify-content: center;
    gap: 1rem;

    &.defense {
      flex-direction: row-reverse;
      .label {
        flex-direction: row-reverse;
      }
    }

    .label {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.25rem;
    }

    h3 {
      font-weight: 400;
      font-size: var(--scale-0000);
    }
    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }

    .number {
      font-size: var(--scale-3);
    }
  }
</style>
