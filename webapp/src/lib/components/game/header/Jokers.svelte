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
      Jokerkarten ({$jokers})
    </button>
    <Tooltip position="bottom" click>
      <Heading size="sm" spacing="none">Joker</Heading>
      <Paragraph size="sm" spacing="none">
        Kann während des Spielzugablaufs gegen einen Gegenstand eurer Wahl, der für einen gezielten
        Angriff benötigt wird, eingetauscht werden.
      </Paragraph>
      <strong>oder</strong>
      <Paragraph size="sm" spacing="none">
        Ermöglicht es, die Antwort auf eine Frage von der Verteidigung zu verweigern.
      </Paragraph>
    </Tooltip>
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
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      font-size: var(--scale-00);
    }
  }
</style>
