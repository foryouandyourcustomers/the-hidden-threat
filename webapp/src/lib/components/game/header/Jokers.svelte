<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Joker from '$lib/components/icons/Joker.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
  import { GameState } from '$lib/game/game-state'

  const { machine } = getGameContext()

  const jokers = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).jokers,
  )
  const side = useSelector(machine.service, (state) => getCurrentUser(state.context).side)
</script>

{#if $side === 'attack'}
  <div class="jokers">
    <button class="unstyled">
      <Joker />
      Jokerkarten <strong>({$jokers})</strong>
      <Tooltip position="bottom" click>
        <div class="tooltip">
          <h5 class="title">Joker</h5>
          <Paragraph size="sm" spacing="none">
            Kann während des Spielzugablaufs gegen einen Gegenstand eurer Wahl, der für einen
            gezielten Angriff benötigt wird, eingetauscht werden.
          </Paragraph>
          <strong class="separator">oder</strong>
          <Paragraph size="sm" spacing="none">
            Ermöglicht es, die Antwort auf eine Frage von der Verteidigung zu verweigern.
          </Paragraph>
        </div>
      </Tooltip>
    </button>
  </div>
{/if}

<style lang="postcss">
  .jokers {
    display: flex;
    position: relative;
    grid-area: jokers;
    justify-content: center;
    align-items: center;

    button {
      display: flex;
      position: relative;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--scale-00);
    }
  }
  .tooltip {
    width: 10rem;
    font-size: var(--scale-000);

    h5 {
      margin-bottom: 0.5rem;
      font-style: normal;
      font-weight: 700;
      font-size: 0.875rem;
      line-height: 120%;
      font-family: var(--font-text);
    }
    .separator {
      display: block;
      margin: 0.5rem 0;
    }
  }
</style>
