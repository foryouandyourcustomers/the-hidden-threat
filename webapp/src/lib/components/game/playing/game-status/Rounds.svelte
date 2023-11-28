<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Polygon from '$lib/components/icons/Polygon.svelte'
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
  import {
    ATTACKER_REVEAL_ROUNDS,
    NEW_GLOBAL_ATTACK_ROUNDS,
    TOTAL_ROUNDS,
  } from '$lib/game/constants/general'
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
      {#if NEW_GLOBAL_ATTACK_ROUNDS.includes(i) && i !== 0}
        <div class="global-attack">
          <Tooltip click position="left">
            <div class="tooltip-content">
              <Polygon color="orange" />
              Der allgemeine Angriff wird ausgeführt, sofern er nicht verhindert wurde, und ein neues
              allgemeines Angriffsszenario wird aufgedeckt.
            </div>
          </Tooltip>
          <Polygon color="orange" />
        </div>
      {/if}
      {#if ATTACKER_REVEAL_ROUNDS.includes(i)}
        <div class="attacker-reveal">
          <Tooltip click position="left">
            <div class="tooltip-content">
              <Polygon color="red-angriff" />
              Die Position vom Angreifer wird offenbart.
            </div>
          </Tooltip>
          <Polygon color="red-angriff" />
          <svg class="eye" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 21">
            <g clip-path="url(#a2)">
              <path
                d="M25.5 12.9c.4 0 .7 0 1-.2.3-.3.6-.8.1-1.3-.8-.9-7.9-7.4-16.3-5.1-8.5 2.2-9.8 6-9.8 6s1.7 4.2 10.3 5.4A17.5 17.5 0 0 0 24.9 13s.3-.3.6-.2Z"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13 7.3s-2.6.6-3 2.3c-.4 1.7-.7 5.3 2.5 6.4 3.2 1.2 6-3.1 4.8-6.4-1-3.3-4.2-2.3-4.2-2.3Z"
                fill="#fff"
              />
              <path
                d="M1.5 5S4 7 5 8.3M13.9.5l-.2 5.3M22 8l3.2-2.5M6.7 1.8 9 6.6m9.7-.2L20.5 2m5.1 12.4s0 2.4-3.3 4m-2.4 1.2s-1 .5-2.4.8"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.5 8.6s-2.4.4-2.3 2.8"
                stroke="#1F2134"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.5 10s-1 .3-1.2.9c-.1.6-.3 2 1 2.4 1.2.5 2.2-1.2 1.8-2.4-.4-1.3-1.6-.9-1.6-.9Z"
                fill="#1F2134"
              />
            </g>
            <defs>
              <clipPath id="a2">
                <path fill="#fff" d="M0 0h27.4v20.9H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>
      {/if}
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
      --_base-width: 3.125rem;
      --_min-percent: 10%;
      --_max-percent: 65%;
      --_percent: calc(
        var(--_min-percent) + (var(--_max-percent) - var(--_min-percent)) * var(--round) / 12
      );
      display: flex;
      position: relative;
      justify-content: flex-end;
      align-items: center;
      background-color: #dadcdf;
      background: color-mix(in oklab, var(--color-blue-spielbrett2) var(--_percent), #fff);
      padding: 0.3125rem 0;
      width: var(--_base-width);
      height: 2.125rem;
      color: var(--color-blue-transp-10);
      font-weight: 500;
      font-size: 0.875rem;
      & span {
        width: var(--_base-width);
        text-align: center;
      }
      &.current {
        width: calc(var(--_base-width) + 0.5rem);
        font-weight: 700;
        font-size: 1rem;
      }

      .global-attack {
        position: absolute;
        top: 1.5rem;
        right: -0.75rem;
        cursor: pointer;
        width: 2rem;
      }
      .attacker-reveal {
        position: absolute;
        top: 1.5rem;
        left: -1.25rem;
        cursor: pointer;
        width: 2rem;
        .eye {
          position: absolute;
          top: 0.25rem;
          left: -0.75rem;
        }
      }
      .tooltip-content {
        :global(svg) {
          display: block;
          width: 3rem;
        }
      }
    }
  }
</style>
